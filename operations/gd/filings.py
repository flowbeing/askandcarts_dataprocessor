from __future__ import print_function


import io
import os
import csv
import codecs
import sys
import re
import pickle
import datetime
from collections import namedtuple
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import Flow, InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload, MediaIoBaseDownload
from google.auth.transport.requests import Request

from process_scraped import *

import settings.default_folder_and_filename_settings as dffns
import settings.other_settings as othersettings


def Create_Service(client_secret_file, api_name, api_version, *scopes, prefix=''):
    CLIENT_SECRET_FILE = client_secret_file
    API_SERVICE_NAME = api_name
    API_VERSION = api_version
    SCOPES = [scope for scope in scopes[0]]

    cred = None
    working_dir = os.getcwd()
    token_dir = '../token files'
    pickle_file = f'token_{API_SERVICE_NAME}_{API_VERSION}{prefix}.pickle'

    ### Check if token dir exists first, if not, create the folder
    if not os.path.exists(os.path.join(working_dir, token_dir)):
        os.mkdir(os.path.join(working_dir, token_dir))

    if os.path.exists(os.path.join(working_dir, token_dir, pickle_file)):
        with open(os.path.join(working_dir, token_dir, pickle_file), 'rb') as token:
            cred = pickle.load(token)

    if not cred or not cred.valid:
        if cred and cred.expired and cred.refresh_token:
            cred.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRET_FILE, SCOPES)
            cred = flow.run_local_server()

        with open(os.path.join(working_dir, token_dir, pickle_file), 'wb') as token:
            pickle.dump(cred, token)

    try:
        service = build(API_SERVICE_NAME, API_VERSION, credentials=cred)
        print(API_SERVICE_NAME, API_VERSION, 'service created successfully')
        return service
    except Exception as e:
        print(e)
        print(f'Failed to create service instance for {API_SERVICE_NAME}')
        os.remove(os.path.join(working_dir, token_dir, pickle_file))
        return None


def convert_to_RFC_datetime(year=1900, month=1, day=1, hour=0, minute=0):
    dt = datetime.datetime(year, month, day, hour, minute, 0).isoformat() + 'Z'
    return dt


class GoogleSheetsHelper:
    # -: spreadsheets().batchUpdate()
    Paste_Type = namedtuple('_Paste_Type',
                            ('normal', 'value', 'format', 'without_borders',
                             'formula', 'date_validation', 'conditional_formatting')
                            )('PASTE_NORMAL', 'PASTE_VALUES', 'PASTE_FORMAT', 'PASTE_NO_BORDERS',
                              'PASTE_FORMULA', 'PASTE_DATA_VALIDATION', 'PASTE_CONDITIONAL_FORMATTING')

    Paste_Orientation = namedtuple('_Paste_Orientation', ('normal', 'transpose'))('NORMAL', 'TRANSPOSE')

    Merge_Type = namedtuple('_Merge_Type', ('merge_all', 'merge_columns', 'merge_rows')
                            )('MERGE_ALL', 'MERGE_COLUMNS', 'MERGE_ROWS')

    Delimiter_Type = namedtuple('_Delimiter_Type', ('comma', 'semicolon', 'period', 'space', 'custom', 'auto_detect')
                                )('COMMA', 'SEMICOLON', 'PERIOD', 'SPACE', 'CUSTOM', 'AUTODETECT')

    # -: Types
    Dimension = namedtuple('_Dimension', ('rows', 'columns'))('ROWS', 'COLUMNS')

    Value_Input_Option = namedtuple('_Value_Input_Option', ('raw', 'user_entered'))('RAW', 'USER_ENTERED')

    Value_Render_Option = namedtuple('_Value_Render_Option', ["formatted", "unformatted", "formula"]
                                     )("FORMATTED_VALUE", "UNFORMATTED_VALUE", "FORMULA")

    @staticmethod
    def define_cell_range(
            sheet_id,
            start_row_number=1, end_row_number=0,
            start_column_number=None, end_column_number=0):
        """GridRange object"""
        json_body = {
            'sheetId': sheet_id,
            'startRowIndex': start_row_number - 1,
            'endRowIndex': end_row_number,
            'startColumnIndex': start_column_number - 1,
            'endColumnIndex': end_column_number
        }
        return json_body

    @staticmethod
    def define_dimension_range(sheet_id, dimension, start_index, end_index):
        json_body = {
            'sheetId': sheet_id,
            'dimension': dimension,
            'startIndex': start_index,
            'endIndex': end_index
        }
        return json_body


class GoogleCalendarHelper:
    ...


class GoogleDriverHelper:
    ...


if __name__ == '__main__':
    g = GoogleSheetsHelper()
    print(g.Delimiter_Type)


def search_file(
        service,
        folder_id,
):
    """Search file in drive location

    Load pre-authorized user credentials from the environment.
    TODO(developer) - See https://developers.google.com/identity
    for guides on implementing OAuth2 for the application.
    """
    # creds, _ = google.auth.default()

    try:
        # create drive api client

        files = []
        page_token = None
        while True:
            # pylint: disable=maybe-no-member
            response = service.files().list(q=f"'{folder_id}' in parents",
                                            spaces='drive',
                                            fields='nextPageToken, '
                                                   'files(id,name,createdTime,modifiedTime,size,mimeType)',
                                            pageToken=page_token).execute()

            # q="mimeType='application/vnd.google-apps.folder'"

            # print(response)
            for file in response.get('files', []):
                # Process change
                print(f''
                      f'Found file: '
                      f'{file.get("name")}, {file.get("id")}, {file.get("createdTime")}, '
                      f'size: {file.get("size")}, mimeType: {file.get("mimeType")}'
                      )

            files.extend(response.get('files', []))
            page_token = response.get('nextPageToken', None)
            if page_token is None:
                break



    except HttpError as error:
        print(F'An error occurred: {error}')
        files = None



    return files



def detect_files_within_returned_folders(
        folder_name,
        returned_folder,
        download_and_process_sitemaps_csv = False
):
    print()
    print(f'DETECTING FILES THAT EXIST WITHIN FOLDERS THAT EXIST WITHIN {folder_name} FOLDER')
    print('---------------------------------------------------------------------------------')
    files_within_each_folder = {}

    filter_operation_error_count = 1
    csv_file_count = 1

    for folder_info in returned_folder:
        current_folder_filetype = folder_info['mimeType']
        if current_folder_filetype == 'application/vnd.google-apps.folder':

            current_folder_id = folder_info['id']
            current_folder_name = folder_info['name']

            print()
            print()
            print(f'FILES WITHIN {current_folder_name}')
            print('-------------------------------')

            files_within_current_sitemap_folder = search_file(
                service,
                current_folder_id,
            )


            # DOWNLOAD AND PROCESS SITEMAPS' CSV FILES IF OPTION BELOW HAS BEEN SET TO TRUE

            try:

                if download_and_process_sitemaps_csv == True:

                    for file_info in files_within_current_sitemap_folder:

                        supposed_csv_files_filetype = file_info['mimeType']

                        if supposed_csv_files_filetype == 'text/csv':

                            print(f'csv_file_count: {csv_file_count}')
                            csv_file_count += 1

                            csv_file_id = file_info['id']
                            csv_filename = file_info['name'][23:]

                            request = service.files().get_media(fileId=csv_file_id)
                            file = io.BytesIO()
                            downloader = MediaIoBaseDownload(file, request)

                            done = False
                            while done is False:
                                status, done = downloader.next_chunk()
                                print(F'Download {int(status.progress() * 100)}.')


                            print(f'downloaded file: {file}')
                            byte_content = file.getvalue()

                            csv_content = codecs.decode(byte_content, encoding='utf-8', errors='replace')
                            # print(type(csv_content))

                            # csv = byte_content.decode('utf-8').splitlines()
                            # csv = ''.join(i for i in csv)

                            # CONVERT DOWNLOADED CSV FILE'S BYTE TO CSV
                            # 1. convert byte to string
                            # csv_content = str(byte_content)[2:-1]
                            # 2. convert string to csv
                            # csv_content = csv_content.replace('\\t', ',').replace('\\n', '\n').replace('\\r', '\r')
                            # 3. write csv to file
                            csv_file_write_path = f"{dffns.all_scraped_data_folder}{csv_filename}"
                            print(csv_content, file=open(csv_file_write_path, 'w', errors='replace'))

                            # data = fp.read().decode("utf-8-sig").encode("utf-8")

                            # with open(csv_file_write_path, 'r') as infile:
                            #     reader = csv.reader(codecs.EncodedFile(infile, 'utf-8', 'utf-8-sig'), delimiter=";")
                            #     print(reader)

                            # PERFORM FILTER OPERATION ON CURRENT SITEMAP'S (SCRAPED SITE'S) CSV FILE
                            try:
                                process_scraped_site(
                                    scraped_sitemap_csv_file_name=csv_filename,
                                    scraped_sitemap_csv_file_address=csv_file_write_path
                                )
                            except:
                                filter_error_log_file_path = f"{dffns.all_scraped_data_folder}filter_errors_log.txt"
                                filter_error_log_file = open(filter_error_log_file_path, 'a')

                                # clear filter error log file if errors are being re-written
                                if filter_operation_error_count == 1:
                                    with open(filter_error_log_file_path, 'w') as filter_error_log_file_:

                                        filter_error_log_file_.truncate(0)

                                        filter_error_log_file_.write(
                                            f'FILTER ERRORS\n'
                                            f'--------------\n'
                                        )

                                        filter_error_log_file_.close()

                                # append each error
                                filter_error_log_file.write(
                                    f'{filter_operation_error_count}, '
                                    f'file_name: {csv_filename}, '
                                    f'file_id: {csv_file_id}\n\n')

                                filter_error_log_file.close()

                                filter_operation_error_count += 1

                                pass




            except HttpError as error:
                print(F'An error occurred: {error}')
                file = None



            files_within_each_folder[current_folder_name] = files_within_current_sitemap_folder
        else:
            raise Exception(f'A file within {folder_name} is not a folder: \n'
                            f'{folder_info["name"]}')

    return files_within_each_folder


# find duplicates among returned folders or files
def find_duplicates_among_return_folders_or_files(
        folder_name,
        list_of_files, # should contain fileId and fileName
        isDeleteNonCSV = False
):

    list_of_filenames = [file['name'][23:] for file in list_of_files ]
    file_count_list = [list_of_filenames.count(file) for file in list_of_filenames]

    list_of_duplicates = []

    file_index = 0
    most_recent_files_creation_date = datetime

    for file in zip(list_of_filenames, file_count_list):

        file_id = list_of_files[file_index]['id']
        file_type = list_of_files[file_index]['mimeType']
        file_name = file[0]
        file_count = file[1]
        file_creation_date = datetime

        # if file within each sitemap's folder is not a csv file, delete it
        if isDeleteNonCSV == True and file_type != 'text/csv':
            try:
                delete_non_csv_file = service.files().delete(fileId=file_id).execute()
                print(f'non csv file deletion: {delete_non_csv_file}')
            except:
                raise Exception(f'There was an error while trying to delete a non csv:\n'
                                f'{file_name}')


        # get the file creation time if file is a 'scraped csv' file within a sitemap's folder..
        elif file_type == 'text/csv':

            file_creation_date_str = list_of_files[file_index]['createdTime']

            file_creation_date = datetime.datetime.strptime(
                file_creation_date_str,
                '%Y-%m-%dT%H:%M:%S.%fZ'
            )

            # determining the creation time most recent scraped data within a sitemap's folder
            if most_recent_files_creation_date == datetime:
                most_recent_files_creation_date = file_creation_date
                # print(f'most_recent_files_creation_date_test: {most_recent_files_creation_date}')
            elif file_creation_date > most_recent_files_creation_date:
                most_recent_files_creation_date = file_creation_date
                # print(f'most_recent_files_creation_date_magnitude: {most_recent_files_creation_date}')


            if file_count > 1:
                list_of_duplicates.append({
                    'file_id': file_id,
                    'file_name': file_name,
                    'file_count': file_count,
                    'file_creation_date': file_creation_date,
                    'file_type': file_type
                })

        # if file is a sitemap folder and has a duplicate, just add it to the list of duplicates
        elif file_type == 'application/vnd.google-apps.folder':

            if file_count > 1:
                list_of_duplicates.append({
                    'file_id': file_id,
                    'file_name': file_name,
                    'file_count': file_count,
                    'file_creation_date': file_creation_date,
                    'file_type': file_type
                })

        # print()
            # print(
            #     f"'file_id': {file_id}, file_name': {file_name}, file_count': {file_count}"
            # )



        file_index += 1

    # if len(list_of_duplicates) > 0:
    #     print('-------------------------------------------')
    #     print(f'There are duplicates within {folder_name}')
    #     print('-------------------------------------------')

    # print(f'most_recent_files_creation_date_test: {most_recent_files_creation_date}')

    return [list_of_duplicates, most_recent_files_creation_date]


def delete_duplicate_csv_files_in_sitemap_folders(
        folders_and_their_files_list_dict
):

    duplicates_within_folders = {}
    most_recent_files_creation_date = 0

    # detecting duplicates and the most recent file within each sitemap's folder
    for folder in folders_and_their_files_list_dict:

        list_of_files_within_current_folder = folders_and_their_files_list_dict[folder]
        current_folders_name = folder

        # if thee the number of files within th current sitemap folder is not one, find duplicates ad the most
        # file's creation date
        if len(list_of_files_within_current_folder) > 1:

            duplicates_within_current_folder = find_duplicates_among_return_folders_or_files(
                folder_name=current_folders_name,
                list_of_files=list_of_files_within_current_folder
            )

            if len(duplicates_within_current_folder) != 0:
                duplicates_within_folders[current_folders_name] = {}
                duplicates_within_folders[current_folders_name]['duplicates'] = duplicates_within_current_folder[0]
                duplicates_within_folders[current_folders_name]['most_recent_files_creation_date'] = duplicates_within_current_folder[1]

            print()
            print()

    print(duplicates_within_folders)

    print(f'DUPLICATES WITHIN SITEMAP FOLDERS')

    for folder in duplicates_within_folders:

        duplicates_within_current_folder = duplicates_within_folders[folder]['duplicates']
        most_recent_files_within_current_folders_creation_date = duplicates_within_folders[folder]['most_recent_files_creation_date']

        print()
        print(f'DUPLICATES WITHIN {folder}')
        print('------------------------------')
        for duplicate in duplicates_within_current_folder:
            print(f'duplicate -> {duplicate}')

            duplicate_files_creation_date = duplicate['file_creation_date']
            duplicate_files_file_id = duplicate['file_id']
            duplicate_files_file_type = duplicate['file_type']

            # ensure that only duplicate csv files within sitemap folders can be deleted..
            if duplicate_files_file_type == 'text/csv':
                # if duplicate_files_creation_date != most_recent_files_within_current_folders_creation_date:
                if duplicate != duplicates_within_current_folder[0]:
                    print('This file is not the most_recent_file')
                    # delete_duplicate = service.files().delete(fileId=duplicate_files_file_id).execute()

        print()
        # print(f'most_recent_files_creation_date: {most_recent_files_creation_date}')





client_secret_file =  othersettings.cred_file_address
api_name = 'drive'
api_version = 'v3'
scopes = ['https://www.googleapis.com/auth/drive'] # 'https://www.googleapis.com/auth/drive'

service = Create_Service(client_secret_file, api_name, api_version, scopes)

files_in_webscraper_folder = search_file(
    service= service,
    folder_id= othersettings.ws_folder_id
)


# DETECT FILES WITHIN EACH SITEMAP FOLDERS
files_within_each_sitemap = detect_files_within_returned_folders(
    folder_name = 'WEBSCRAPER',
    returned_folder = files_in_webscraper_folder,
    download_and_process_sitemaps_csv= True
)



# DELETE DUPLICATE CSVs WITHIN SITEMAP FOLDERS
# print(files_within_each_sitemap)

# delete_duplicate_csv_files_in_sitemap_folders(
#     files_within_each_sitemap
# )




















# file_response = service.files().list().execute()
# files_dict = file_response['files']
#
# for file in files_dict:
#     print(file['name'])


