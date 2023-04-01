from __future__ import print_function


import io
import json
import os
import sys
import codecs
import pickle
import datetime
from collections import namedtuple
from googleapiclient.errors import HttpError
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
from google.auth.transport.requests import Request

from process_scraped import *
from operations.wx.reset_p import *

from settings.q.default_folder_and_filename_settings \
    import all_scraped_data_folder, all_log_files_folder, other_settings_data_folder, \
    filter_error_log_filename, filename_last_serviced_sitemap_folder_dict_as_json, ws_filename, \
    wx_upload_error_log_filename, wx_upload_tasks_status_log_file
import settings.q.other_settings as othersettings


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
        folder_id,
):
    """Search file in drive location

    Load pre-authorized user credentials from the environment.
    TODO(developer) - See https://developers.google.com/identity
    for guides on implementing OAuth2 for the application.
    """
    # creds, _ = google.auth.default()

    # create drive api client

    files = []

    def search():

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
                # pass

            files.extend(response.get('files', []))
            page_token = response.get('nextPageToken', None)
            if page_token is None:
                break

    try:
        search()

    except:

        # if there's an error, try searching again
        try:
            search()

        except HttpError as error:
            print(F'An error occurred: {error}')
            files = None


    return files



def detect_and_optional_download_and_process_files_within_returned_folders(
        folder_name,
        returned_folders,
        is_download_sitemaps_csv_file = False,
        is_process_scraped_site_csv = False,
        is_continue_from_previous_stop_csv=False,
        is_wx_upload=False,
):

    # keeping track of wx upload in progress and completion status to avoid upload from being started again when a
    # previous one has not been completed as well as to prevent 'p' track | register from starting again
    # (unintentionally) in wx db..

    wx_upload_tasks_status_dict = {
        'wx_upload_task_in_progress_datetime': 'datetime',
        'last_wx_upload_task_completion_datetime': 'datetime'
    }

    if is_wx_upload == True and is_continue_from_previous_stop_csv == False :
        with open(f'{all_log_files_folder}{wx_upload_tasks_status_log_file}', 'r') \
                as wx_upload_task_completion_log_file_:
            wx_upload_task_completion_log_json = wx_upload_task_completion_log_file_.read()
            wx_upload_task_completion_log_json_as_dict = json.loads(wx_upload_task_completion_log_json)

            last_completed_wx_upload_completion_date_str = \
                wx_upload_task_completion_log_json_as_dict['last_wx_upload_task_completion_datetime']

            last_completed_wx_upload_completion_date = datetime.datetime.strptime(
                last_completed_wx_upload_completion_date_str,
                '%Y-%m-%d %H:%M:%S.%f'
            )

            diff_last_completed_wx_upload_and_now = \
                (datetime.datetime.now() - last_completed_wx_upload_completion_date).seconds

            wx_upload_task_in_progress_datetime_str = \
                wx_upload_task_completion_log_json_as_dict['wx_upload_task_in_progress_datetime']

            wx_upload_task_in_progress_datetime = datetime.datetime.strptime(
                wx_upload_task_in_progress_datetime_str,
                '%Y-%m-%d %H:%M:%S.%f'
            )

            diff_last_wx_upload_task_in_progress_datetime_and_now = \
                (datetime.datetime.now() - wx_upload_task_in_progress_datetime).seconds


            # if the last wx upload time's lesser than 24 hours and there's been no subsequent unfinised wx upload
            # in that time, super confirm whether wx upload should start from scratch as this will erase 'p' & prev
            # wx upload errors (if any), and restart registration..
            if diff_last_completed_wx_upload_and_now < 86400 and \
                    last_completed_wx_upload_completion_date == wx_upload_task_in_progress_datetime:

                print()
                confirm_new_wx_upload = input("Looks like a wx upload task's been completed in less than a day.\n"
                              "Are you sure you want to erase previous wx upload errors (if any), \n "
                              "clear p, and start a new wx upload? \n "
                              "Also, keep in mind the process usually takes up to 1 hr..\n "
                                              "y/n: ")

                if confirm_new_wx_upload == 'y':

                    is_continue_from_previous_stop_csv = False

                    # update and log / save wx upload tasks status
                    with open(f'{all_log_files_folder}{wx_upload_tasks_status_log_file}', 'w') \
                            as wx_upload_task_completion_log_file_one:

                        wx_upload_tasks_status_dict['wx_upload_task_in_progress_datetime'] = str(
                            datetime.datetime.now())
                        wx_upload_task_completion_log_json_as_dict['wx_upload_task_in_progress_datetime'] = \
                            str(datetime.datetime.now())

                        wx_upload_task_completion_log_file_one.write(
                            json.dumps(wx_upload_task_completion_log_json_as_dict))

                        wx_upload_task_completion_log_file_one.close()

                    pass

                elif confirm_new_wx_upload == 'n':
                    is_continue_from_previous_stop_csv = True # JIC
                    sys.exit('CSV file processing and wx upload has been terminated')
                else:
                    is_continue_from_previous_stop_csv = True  # JIC
                    sys.exit('CSV file processing and wx upload has been terminated')

            # if there's been a wx upload task that was not completed in the last 24 hours, super confirm whether the
            # user wants to continue the last unfinished upload or start a new one
            elif last_completed_wx_upload_completion_date != wx_upload_task_in_progress_datetime:
                print()
                confirm_continue_previous_wx_upload = input(
                    f"Looks like there's an incomplete wx upload task that started on {wx_upload_task_in_progress_datetime}.\n"
                    f"Would you like to continue it? y/n: ")

                if confirm_continue_previous_wx_upload == 'y':
                    is_continue_from_previous_stop_csv = True

                    # update and log / save wx upload tasks status
                    with open(f'{all_log_files_folder}{wx_upload_tasks_status_log_file}', 'w') \
                            as wx_upload_task_completion_log_file_two:

                        wx_upload_tasks_status_dict['wx_upload_task_in_progress_datetime'] = str(datetime.datetime.now())
                        wx_upload_task_completion_log_json_as_dict['wx_upload_task_in_progress_datetime'] = \
                            str(datetime.datetime.now())

                        wx_upload_task_completion_log_file_two.write(json.dumps(wx_upload_task_completion_log_json_as_dict))

                        wx_upload_task_completion_log_file_two.close()

                elif confirm_continue_previous_wx_upload == 'n':
                    is_continue_from_previous_stop_csv = False
                else:
                    sys.exit('CSV file processing and wx upload have been terminated')

            else:
                confirm_new_wx_upload = input('There are no recent incomplete wx upload tasks and \n'
                      'the last wx upload operation is past 24 hrs. \n'
                      'Recommended only proceed with this operation if new scraped data is available\n'
                      'Are you sure you want to clear p, and start a new wx upload? y/n')

                if confirm_new_wx_upload == 'y':

                    is_continue_from_previous_stop_csv = False

                    # update and log / save wx upload tasks status
                    with open(f'{all_log_files_folder}{wx_upload_tasks_status_log_file}', 'w') \
                            as wx_upload_task_completion_log_file_one:

                        wx_upload_tasks_status_dict['wx_upload_task_in_progress_datetime'] = str(
                            datetime.datetime.now())
                        wx_upload_task_completion_log_json_as_dict['wx_upload_task_in_progress_datetime'] = \
                            str(datetime.datetime.now())

                        wx_upload_task_completion_log_file_one.write(
                            json.dumps(wx_upload_task_completion_log_json_as_dict))

                        wx_upload_task_completion_log_file_one.close()

                    pass

                elif confirm_new_wx_upload == 'n':
                    is_continue_from_previous_stop_csv = True # JIC
                    sys.exit('CSV file processing and wx upload has been terminated')
                else:
                    is_continue_from_previous_stop_csv = True  # JIC
                    sys.exit('CSV file processing and wx upload has been terminated')



            wx_upload_task_completion_log_file_.close()

    # If there's been an abrupt stoppage while previosly downloading, processing (& uploading csv files), continue from
    # previous folder if is_continue_from_previous_stop_csv has been set to true..
    if is_continue_from_previous_stop_csv == True:

        with open(f'{other_settings_data_folder}{filename_last_serviced_sitemap_folder_dict_as_json}.json', 'r') \
                as last_serviced_sitemap_folder_file:

            last_serviced_sitemap_folder_json = last_serviced_sitemap_folder_file.read()

            # if last_serviced_sitemap_folder_file is not empty, configure returned folders argument to start from the
            # last serviced sitemap folder json
            if len(last_serviced_sitemap_folder_json) != 0:
                last_serviced_sitemap_folder_json_as_dict = json.loads(last_serviced_sitemap_folder_json)

                last_serviced_sitemap_folder_info = last_serviced_sitemap_folder_json_as_dict['last_serviced_folder_info']

                print()
                print(f'last_serviced_sitemap_folder_info: {last_serviced_sitemap_folder_info}')

                index_of_last_serviced_sitemap_folder = returned_folders.index(last_serviced_sitemap_folder_info)
                print(f'calculated index_of_last_serviced_sitemap_folder: {index_of_last_serviced_sitemap_folder}')
                print(f'original returned_folders: {returned_folders}')


                returned_folders = returned_folders[index_of_last_serviced_sitemap_folder:]

            last_serviced_sitemap_folder_file.close()

    # if scraped csv files processing is starting fom scratch, reset wx upload error & p log since 'everything's' being
    # restarted afresh.. if scraped csv files processing's being forced to start afresh, there so be no previous
    # processing errors to make up for in the new processing operation
    elif is_continue_from_previous_stop_csv == False:

        with open(f'{all_log_files_folder}{wx_upload_error_log_filename}', 'w') \
                as wx_upload_error_log_file:

            wx_upload_error_log_file.write('{}')

            reset_p()

            wx_upload_error_log_file.close()


    print(f'original returned_folders: {returned_folders}')

    print()
    print(f'DETECTING FILES THAT EXIST WITHIN FOLDERS THAT EXIST WITHIN {folder_name} FOLDER')
    print('---------------------------------------------------------------------------------')
    files_within_each_folder = {}

    filter_operation_error_count = 0
    csv_file_count = 1

    all_scraped_csv_files_data_points_count = 0
    empty_csv_files_after_filtering_count = 0

    for folder_info in returned_folders:


        current_folder_filetype = folder_info['mimeType']
        if current_folder_filetype == 'application/vnd.google-apps.folder':

            current_folder_id = folder_info['id']
            current_folder_name = folder_info['name']

            # Registering the current folder as last serviced sitemap folder in case there's an abrupt stoppage

            with open(f'{other_settings_data_folder}{filename_last_serviced_sitemap_folder_dict_as_json}.json', 'w') \
                    as last_serviced_sitemap_folder_file:

                last_serviced_sitemap_folder_info_dict = {
                    'last_serviced_folder_info': folder_info
                }

                last_serviced_sitemap_folder_info_dict_as_json = json.dumps(last_serviced_sitemap_folder_info_dict)

                last_serviced_sitemap_folder_file.write(last_serviced_sitemap_folder_info_dict_as_json)

                last_serviced_sitemap_folder_file.close()


            # print(f'current_folder_name: {current_folder_name}')

            print()
            print()
            print(f'FILES WITHIN {current_folder_name}')
            print('-------------------------------')

            files_within_current_sitemap_folder = search_file(
                current_folder_id,
            )


            # DOWNLOAD AND PROCESS SITEMAPS' CSV FILES IF OPTION BELOW HAS BEEN SET TO TRUE

            try:

                if is_download_sitemaps_csv_file == True:

                    for file_info in files_within_current_sitemap_folder:

                        supposed_csv_files_filetype = file_info['mimeType']

                        if supposed_csv_files_filetype == 'text/csv':

                            print(f'csv_file_count: {csv_file_count}')
                            csv_file_count += 1

                            csv_file_id = file_info['id']
                            csv_filename = file_info['name']

                            for char in csv_filename:
                                if char in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ':
                                    index_of_first_letter_in_folder_name = csv_filename.index(char)
                                    csv_filename = csv_filename[index_of_first_letter_in_folder_name:]
                                    break

                            # print(f'csv_filename: {csv_filename}')
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
                            csv_file_write_path = f"{all_scraped_data_folder}{csv_filename}"
                            print(csv_content, file=open(csv_file_write_path, 'w', errors='replace'))

                            # data = fp.read().decode("utf-8-sig").encode("utf-8")

                            # with open(csv_file_write_path, 'r') as infile:
                            #     reader = csv.reader(codecs.EncodedFile(infile, 'utf-8', 'utf-8-sig'), delimiter=";")
                            #     print(reader)

                if is_process_scraped_site_csv == True:

                    for file_info in files_within_current_sitemap_folder:

                        csv_file_id = file_info['id']
                        csv_filename = file_info['name']

                        for char in csv_filename:
                            if char in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ':
                                index_of_first_letter_in_folder_name = csv_filename.index(char)
                                csv_filename = csv_filename[index_of_first_letter_in_folder_name:]
                                break


                        csv_file_write_path = f"{all_scraped_data_folder}{csv_filename}"


                        # PERFORM FILTER OPERATION ON CURRENT SITEMAP'S (SCRAPED SITE'S) CSV FILE
                        try:
                            filter_csv_file = process_scraped_site(
                                scraped_sitemap_csv_file_name=csv_filename,
                                scraped_sitemap_csv_file_address=csv_file_write_path,
                                is_wx_upload=is_wx_upload,
                                is_continue_from_previous_stop_csv = is_continue_from_previous_stop_csv
                            )

                            current_csv_file_data_points_count = filter_csv_file[0]
                            all_scraped_csv_files_data_points_count += current_csv_file_data_points_count

                            is_file_empty_after_filtering = filter_csv_file[1]
                            if is_file_empty_after_filtering == True:
                                empty_csv_files_after_filtering_count += 1

                            print(f'-> Number of data point: {current_csv_file_data_points_count} <-')
                            print()

                        except:

                            filter_error_log_file_path = f"{all_log_files_folder}{filter_error_log_filename}"
                            filter_error_log_file = open(filter_error_log_file_path, 'a')

                            # clear filter error log file if errors are being re-written
                            if filter_operation_error_count == 0:
                                with open(filter_error_log_file_path, 'w') as filter_error_log_file_:
                                    filter_error_log_file_.truncate(0)

                                    filter_error_log_file_.write(
                                        f'FILTER OR WX UPLOAD ERRORS\n'
                                        f'--------------\n'
                                    )

                                    filter_operation_error_count = 1
                                    filter_error_log_file_.close()

                            # append each error
                            filter_error_log_file.write(
                                f'{filter_operation_error_count}, '
                                f'file_name: {csv_filename}, '
                                f'file_id: {csv_file_id}\n\n')

                            # filter_error_log_file.write(
                            #     f'{Error}\n\n')

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

    print()
    print(f'-> Total number of data point: {all_scraped_csv_files_data_points_count} <-')
    print(f'-> Total number of empty csv files: {empty_csv_files_after_filtering_count} <-')
    print()

    # log filtered CSVs stats..
    with open(f'{all_filtered_data_folder}filter_operation_stats.txt', 'w') as filtered_CSVs_stats:
        filtered_CSVs_stats.write(f'FILTERED CSVs stats\n')
        filtered_CSVs_stats.write(f'---------------------\n')
        filtered_CSVs_stats.write(f'Number of csv files that were either not filtered or had a wx upload error: '
                                  f'{filter_operation_error_count}\n\n')

        filtered_CSVs_stats.write(f'FILTERED CSVs stats\n')
        filtered_CSVs_stats.write(f'---------------------\n')
        filtered_CSVs_stats.write(
            f'Total number of data points after filter operation: {all_scraped_csv_files_data_points_count}\n'
        )
        filtered_CSVs_stats.write(
            f'Total number of filtered but empty csv files: {empty_csv_files_after_filtering_count}'
        )
        filtered_CSVs_stats.close()

    # log wx task upload completion
    if is_wx_upload == True:
        with open(f'{all_filtered_data_folder}{wx_upload_tasks_status_log_file}', 'w') as wx_upload_tasks_status_log_file_:
            wx_upload_completion_datetime = datetime.datetime.now()
            wx_upload_tasks_status_dict['last_wx_upload_task_completion_datetime'] = str(wx_upload_completion_datetime)
            wx_upload_tasks_status_dict['wx_upload_task_in_progress_datetime'] = str(wx_upload_completion_datetime)
            wx_upload_tasks_status_dict_as_json = json.dumps(wx_upload_tasks_status_dict)

            wx_upload_tasks_status_log_file_.write(wx_upload_tasks_status_dict_as_json)







    return files_within_each_folder


# find duplicates among returned folders or files
def find_duplicates_among_return_folders_or_files_and_delete_unnecesary_files(
        source_folders_name,
        returned_list_of_folders_or_files, # should contain fileId and fileName

        # make sure 'is_delete_non_csv' is set to True when 'is_focus_on_scraped_CSVs' is True to effect
        # deletion of non CSV files when csv files are being focused on
        is_focus_on_scraped_CSVs = False,
        is_delete_non_csv = False,

        # make sure 'is_delete_non_folder' is set to True when 'is_focus_on_folders' is True to effect deletion of
        # non folder files when folders are being focused on
        is_focus_on_folders=False,
        is_delete_non_folder = False
):
    # ensure that the list being focused on is a list of folders or a list of CSVs
    if is_focus_on_folders == False and is_focus_on_scraped_CSVs == False:
        raise Exception(
            'Please set one of the following to True\n'
            'a. is_focus_on_scraped_CSVs\n'
            'b. is_focus_on_folders'
        )

    # ensure that only filetype is being focused on
    if is_focus_on_folders == True and is_focus_on_scraped_CSVs == True:
        raise Exception(""
                        "You can only focus on one filetype at a time.\n"
                        "Please set only one of these options to True:\n'"
                        "a. 'is_focus_on_scraped_CSVs'\n"
                        "b. 'is_focus_on_folders'"
                        )

    # avoid deletion of CSVs when is_focus_on_scraped_CSVs is turned on
    if is_focus_on_scraped_CSVs == True and is_delete_non_csv == False:
        raise Exception(""
                        "''is_delete_non_csv' can't be False when is_focus_on_scraped_CSVs' True to"
                        "hypothetically avoid CSV file deletion"
                        )

    # avoid deletion of folders when is_delete_non_folder is turned off
    elif is_focus_on_folders == True and is_delete_non_folder == False:
        raise Exception(""
                        "'is_delete_non_folder' can't be False when 'is_focus_on_folders' True when  to "
                        "hypothetically avoid deletion of folders."
                        )

    list_of_filenames = []

    # obtaining filenames
    for file in returned_list_of_folders_or_files:
        file_name = file['name']

        for char in file_name:
            if char in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ':
                index_of_first_letter_in_filename = file_name.index(char)
                file_name = file_name[index_of_first_letter_in_filename:]
                list_of_filenames.append(file_name)
                break

    # print(list_of_filenames)

    file_count_list = [list_of_filenames.count(file) for file in list_of_filenames]

    list_of_duplicate_csv_files_within_current_folder = []
    dict_of_duplicated_sitemap_folders = {

    }

    file_index = 0
    most_recent_duplicates_creation_date = datetime

    for file in zip(list_of_filenames, file_count_list):

        current_file_or_folder_id = returned_list_of_folders_or_files[file_index]['id']
        current_file_or_folder_type = returned_list_of_folders_or_files[file_index]['mimeType']
        current_file_folder_name = file[0]
        current_file_or_folder_count = file[1]
        current_file_or_folder_creation_date = datetime

        # print()
        # print(f'current_file_folder_name: {current_file_folder_name}')
        # print(f'current_file_or_folder_id: {current_file_or_folder_id}')
        # print()


        # print(f'current_file_folder_name: {current_file_folder_name}')


        # IF THE CURRENT FILE IS A CSV FILE, ASSUME THAT IT IS A CSV THAT'S WITHIN A (SITEMAP) FOLDER AND GET:
        # A. DUPLICATES (INFO) OF THAT CSV FILE AND
        # B. THE CREATION TIME OF THE MOST RECENT DUPLICATE OF THAT CSV FILE
        # ** MAKE SURE THEN APPEND A & B ABOVE TO A LIST -> WHEN ALL IS SAID AND DONE
        if current_file_or_folder_type == 'text/csv':

            file_creation_date_str = returned_list_of_folders_or_files[file_index]['createdTime']

            current_file_or_folder_creation_date = datetime.datetime.strptime(
                file_creation_date_str,
                '%Y-%m-%dT%H:%M:%S.%fZ'
            )

            # determining the creation time most recent scraped data within a sitemap's folder
            if most_recent_duplicates_creation_date == datetime:
                most_recent_duplicates_creation_date = current_file_or_folder_creation_date
                # print(f'most_recent_files_creation_date_test: {most_recent_files_creation_date}')
            elif current_file_or_folder_creation_date > most_recent_duplicates_creation_date:
                most_recent_duplicates_creation_date = current_file_or_folder_creation_date
                # print(f'most_recent_files_creation_date_magnitude: {most_recent_files_creation_date}')


            if current_file_or_folder_count > 1:
                list_of_duplicate_csv_files_within_current_folder.append({
                    'file_id': current_file_or_folder_id,
                    'file_name': current_file_folder_name,
                    'file_count': current_file_or_folder_count,
                    'file_creation_date': current_file_or_folder_creation_date,
                    'file_type': current_file_or_folder_type
                })




            # print(f"list_of_duplicate_csv_files_within_current_folder: {list_of_duplicate_csv_files_within_current_folder}")

            file_index += 1


        # IF THE CURRENT FILE IS FOLDER, ASSUME THAT IT IS FOLDER THAT'S WITHIN 'WEB SCRAPER' FOLDER AND GET:
        # A. DUPLICATES (INFO) OF THAT FOLDER AND
        # B. THE CREATION TIME OF THE MOST RECENT DUPLICATE OF THAT CSV FILE
        # ** MAKE SURE THEN APPEND A & B ABOVE TO 'dict_of_duplicated_sitemap_folders' APPROPRIATELY
        elif current_file_or_folder_type == 'application/vnd.google-apps.folder':

            file_creation_date_str = returned_list_of_folders_or_files[file_index]['createdTime']

            current_file_or_folder_creation_date = datetime.datetime.strptime(
                file_creation_date_str,
                '%Y-%m-%dT%H:%M:%S.%fZ'
            )

            # if current folder has a duplicate, add it to the dictionary containing sitemap folder duplicates
            # accordingly
            if current_file_or_folder_count > 1:

                files_that_are_duplicates_of_current_folder = {}

                # adding current folder's name to dict_of_duplicate_sitemap_folders if it's not already been added
                current_file_or_folder_value = dict_of_duplicated_sitemap_folders.get(
                    current_file_folder_name,
                    None
                )

                # print(file_index)
                # print(f'{current_file_folder_name}: {current_file_or_folder_value}')

                if current_file_or_folder_value == None:
                    current_file_or_folder_value = dict_of_duplicated_sitemap_folders[current_file_folder_name] = {}
                else:
                    current_file_or_folder_value = dict_of_duplicated_sitemap_folders[current_file_folder_name]

                # print(f'{current_file_folder_name}: {current_file_or_folder_value}')


                # defining a list that'll contain current folder's duplicates to the dict_of_duplicate_sitemap_folders
                # if it's not already been defined
                list_of_duplicates_folders_within_current_folder = current_file_or_folder_value.get(
                    'list_of_duplicates_folders_within_current_folder',
                    None
                )

                if list_of_duplicates_folders_within_current_folder == None:

                    list_of_duplicates_folders_within_current_folder = \
                        dict_of_duplicated_sitemap_folders[current_file_folder_name]\
                            ['list_of_duplicates_folders_within_current_folder'] = []
                else:
                    list_of_duplicates_folders_within_current_folder = \
                        dict_of_duplicated_sitemap_folders[current_file_folder_name] \
                            ['list_of_duplicates_folders_within_current_folder']

                # print(f'{current_file_folder_name}: {current_file_or_folder_value}')



                # defining a variable that'll hold the creation time of the most recent instance of a folder
                # that's been duplicated, if it's not already been defined
                current_folders_most_recent_instance_creation_date = current_file_or_folder_value.get(
                    'most_recent_duplicates_creation_date',
                    None
                )

                if current_folders_most_recent_instance_creation_date == None:
                    current_folders_most_recent_instance_creation_date = \
                        dict_of_duplicated_sitemap_folders[current_file_folder_name]\
                        ['most_recent_duplicates_creation_date'] = current_file_or_folder_creation_date
                else:
                    current_folders_most_recent_instance_creation_date = \
                        dict_of_duplicated_sitemap_folders[current_file_folder_name]\
                        ['most_recent_duplicates_creation_date']

                # print(f'{current_file_folder_name}: {current_file_or_folder_value}')



                # determining the creation time of the most recent instance of the current duplicated folder
                if current_file_or_folder_creation_date > current_folders_most_recent_instance_creation_date:
                    current_folders_most_recent_instance_creation_date = current_file_or_folder_creation_date
                    # print(f'most_recent_files_creation_date_magnitude: {most_recent_files_creation_date}')


                list_of_duplicates_folders_within_current_folder.append({
                    'file_id': current_file_or_folder_id,
                    'file_name': current_file_folder_name,
                    'file_count': current_file_or_folder_count,
                    'file_creation_date': current_file_or_folder_creation_date,
                    'file_type': current_file_or_folder_type
                })

                # print(f'{current_file_folder_name}: {current_file_or_folder_value}')
                # print()



                # print(current_file_or_folder_value)
                # print(file_index)

            file_index += 1

        # if file within each (sitemap) folder is not a csv file, delete it
        if is_focus_on_scraped_CSVs == True and is_delete_non_csv == True and current_file_or_folder_type != 'text/csv':
            try:
                delete_non_csv_file = service.files().delete(fileId=current_file_or_folder_id).execute()
                # print(f'Delete Non CSV Files Report: {delete_non_csv_file}')
                # time.sleep(10)
            except:
                time.sleep(7)
                traceback.print_exc()
                print(f'There was an error while trying to delete a non csv:\n'
                      f'{current_file_folder_name}')

            file_index += 1

        # if file within web scraper folder is not a folder, delete it
        if is_focus_on_folders == True and is_delete_non_folder == True and \
                current_file_or_folder_type != 'application/vnd.google-apps.folder':
            try:
                delete_non_folder_files = service.files().delete(fileId=current_file_or_folder_id).execute()
               #  print(f'Delete Non Folder Files Report: {delete_non_folder_files}')
            except:
                time.sleep(7)
                traceback.print_exc()
                print(f'There was an error while trying to delete a non csv:\n'
                      f'{current_file_folder_name}')

            file_index += 1


        # print()
            # print(
            #     f"'file_id': {file_id}, file_name': {file_name}, file_count': {file_count}"
            # )






    # if len(list_of_duplicates) > 0:
    #     print('-------------------------------------------')
    #     print(f'There are duplicates within {folder_name}')
    #     print('-------------------------------------------')

    # print(f'most_recent_files_creation_date_test: {most_recent_files_creation_date}')

    duplicates = None

    # if assumably, files being focused on are scraped csv files, return a list that contains all duplicates of the
    # scraped csv file that's within each returned (sitemap) folder
    if is_focus_on_scraped_CSVs == True:
        duplicates = [list_of_duplicate_csv_files_within_current_folder, most_recent_duplicates_creation_date]

    # else if assumably, files being focused on are (sitemap) folders, return a dictionary that contains each (sitemap)
    # folder, it's duplicates' info and the creation time of its most recent duplicate
    elif is_focus_on_folders == True:
        duplicates = dict_of_duplicated_sitemap_folders


    # print(f'duplicates: {duplicates}')


    return duplicates


def delete_duplicate_folders_or_csv_files_in_specified_dictionary_of_folders_and_their_returned_folders_or_csv_files(
        folders_and_their_files_list_dict,

        # make sure 'is_delete_non_csv' is set to True when 'is_focus_on_scraped_CSVs' is True to effect
        # deletion of non CSV files when csv files are being focused on
        is_focus_on_scraped_CSVs = False,
        is_delete_non_csv = False,

        # make sure 'is_delete_non_folder' is set to True when 'is_focus_on_folders' is True to effect deletion of
        # non folder files when folders are being focused on
        is_focus_on_folders=False,
        is_delete_non_folder = False
):
    # ensure that the list being focused on is a list of folders or a list of CSVs
    if is_focus_on_folders == False and is_focus_on_scraped_CSVs == False:
        raise Exception(
            'Please set one of the following to True\n'
            'a. is_focus_on_scraped_CSVs\n'
            'b. is_focus_on_folders'
        )

    # ensure that only filetype is being focused on
    if is_focus_on_folders == True and is_focus_on_scraped_CSVs == True:
        raise Exception(""
                        "You can only focus on one filetype at a time.\n"
                        "Please set only one of these options to True:\n'"
                        "a. 'is_focus_on_scraped_CSVs'\n"
                        "b. 'is_focus_on_folders'"
                        )

    # avoid deletion of CSVs when is_focus_on_scraped_CSVs is turned on
    if is_focus_on_scraped_CSVs == True and is_delete_non_csv == False:
        raise Exception(""
                        "''is_delete_non_csv' can't be False when is_focus_on_scraped_CSVs' True to"
                        "hypothetically avoid CSV file deletion"
                        )

    # avoid deletion of folders when is_delete_non_folder is turned off
    elif is_focus_on_folders == True and is_delete_non_folder == False:
        raise Exception(""
                        "'is_delete_non_folder' can't be False when 'is_focus_on_folders' True when  to "
                        "hypothetically avoid deletion of folders."
                        )

    duplicates_within_folders = {}
    # most_recent_files_creation_date = 0

    # detecting duplicates and the most recent file or folder within specified folder(s) in
    # folders_and_their_files_list_dict..
    for folder in folders_and_their_files_list_dict:

        list_of_files_within_current_folder = folders_and_their_files_list_dict[folder]
        current_folders_name = folder

        # if the number of files within th current folder in focus in the dictionary is not one,
        # find duplicates and the most recent file or folder's creation date
        if len(list_of_files_within_current_folder) > 1:

            duplicates_within_current_folder_and_most_recent_duplicates_creation_time = \
                find_duplicates_among_return_folders_or_files_and_delete_unnecesary_files(
                source_folders_name=current_folders_name,
                returned_list_of_folders_or_files=list_of_files_within_current_folder,

                is_focus_on_folders=is_focus_on_folders,
                is_delete_non_folder=is_delete_non_folder,

                is_focus_on_scraped_CSVs=is_focus_on_scraped_CSVs,
                is_delete_non_csv=is_delete_non_csv,

            )

            # print(duplicates_within_current_folder_and_most_recent_duplicates_creation_time)

            # i.e if scraped csv files was focused on, populate the 'duplicates_within_folders' dictionary with
            # (sitemap) folder's file name, info of duplicated (CSV) files within the (sitemap) folder, and the creation
            # time of the most recent duplicate (CSV)
            if type(duplicates_within_current_folder_and_most_recent_duplicates_creation_time) == list:
                if len(duplicates_within_current_folder_and_most_recent_duplicates_creation_time) != 0:

                    duplicates_within_folders[current_folders_name] = {}

                    duplicates_within_folders[current_folders_name]['list_of_duplicate_csv_files_within_current_folder'] = \
                        duplicates_within_current_folder_and_most_recent_duplicates_creation_time[0]

                    duplicates_within_folders[current_folders_name]['most_recent_duplicates_creation_date'] = \
                    duplicates_within_current_folder_and_most_recent_duplicates_creation_time[1]

            # i.e if 'web scraper' folder was focused on, and it's not empty, 'duplicates_within_folders' equals
            # dictionary that contains folders have been duplicated that's within 'web scraper' folder,
            # duplicate folders info and the creation time of the most recent duplicate (folder)
            elif type(duplicates_within_current_folder_and_most_recent_duplicates_creation_time) == dict:
                if len(duplicates_within_current_folder_and_most_recent_duplicates_creation_time) > 0:

                    duplicates_within_folders =  duplicates_within_current_folder_and_most_recent_duplicates_creation_time

            # print()
            # print()

    if len(duplicates_within_folders) == 0:
        print()
        print('NO DUPLICATES WERE DETECTED.')

    # print(duplicates_within_folders)

    print()
    print()

   #  print(f'duplicates_within_folders: {duplicates_within_folders}')

    # CHECK WHETHER THE FOLDER THAT HAS BEEN SERVICE IS 'WEBSCRAPER'


    for folder_name in duplicates_within_folders:

        list_of_duplicates_within_current_folder = []
        most_recent_duplicates_creation_date = \
            duplicates_within_folders[folder_name]['most_recent_duplicates_creation_date']


        if is_focus_on_folders == True:

            print(f'DUPLICATES FOLDERS WITHIN {ws_filename} FOLDER')

            print(f'-> most_recent_duplicates_creation_date: {most_recent_duplicates_creation_date} <-')
            print()

            list_of_duplicates_within_current_folder = \
                duplicates_within_folders[folder_name]['list_of_duplicates_folders_within_current_folder']


        elif is_focus_on_scraped_CSVs == True:


            print(f'DUPLICATES WITHIN {folder_name} FOLDER')

            print()
            print(f'-> most_recent_duplicates_creation_date: {most_recent_duplicates_creation_date} <-')
            print()

            list_of_duplicates_within_current_folder = \
                duplicates_within_folders[folder_name]['list_of_duplicate_csv_files_within_current_folder']



        for duplicate in list_of_duplicates_within_current_folder:
            print(f'duplicate -> {duplicate}')

            duplicate_files_creation_date = duplicate['file_creation_date']
            duplicate_files_file_id = duplicate['file_id']
            duplicate_files_file_type = duplicate['file_type']
            duplicate_files_name = duplicate['file_name']

            # print(f'duplicate_files_file_id: {duplicate_files_file_id}')


            # ensure that only duplicate csv files within sitemap folders can be deleted..
            if duplicate_files_file_type == 'text/csv' or 'application/vnd.google-apps.folder':
                # if duplicate_files_creation_date != most_recent_files_within_current_folders_creation_date:

                if duplicate != list_of_duplicates_within_current_folder[0]: # use this when there's been a large free copy
                #if duplicate_files_creation_date < most_recent_duplicates_creation_date: # use this when there's a normal order
                    try:

                        # print(f'most_recent_duplicates_creation_date: {most_recent_duplicates_creation_date}')
                        # print(f'duplicate_files_file_id: {duplicate_files_file_id}')
                        print('This file is not the most_recent_file')
                        delete_duplicate_file = service.files().delete(fileId=duplicate_files_file_id).execute()

                        # print(f'DELETED FILE INFO: {delete_duplicate_file}')

                    except:

                        traceback.print_exc()
                        print(f'There was an error while trying to delete {duplicate_files_name}')

        print()
        first_key_in_folders_and_their_files_list_dict = list(folders_and_their_files_list_dict.keys())[0]
        print(f'->len returned folders: {len(folders_and_their_files_list_dict[first_key_in_folders_and_their_files_list_dict])}')
        print(f'-> len(duplicates_within_folders): {len(duplicates_within_folders)} <-')
        print()
        # print(f'most_recent_files_creation_date: {most_recent_files_creation_date}')


def delete_duplicate_sitemap_folders_other_unnecessary_files_within_webscraper_folders():
    # --------------------------------------------------
    # # DETECT FILES WITHIN WEBSCRAPER FOLDER AND DELETE DUPLICATES

    webscraper_folder_and_its_list_of_subfolders_dict = {
        ws_filename: folders_in_webscraper_folder
    }

    cleanup_folders_within_webscraper_folder = \
        delete_duplicate_folders_or_csv_files_in_specified_dictionary_of_folders_and_their_returned_folders_or_csv_files(
            folders_and_their_files_list_dict=webscraper_folder_and_its_list_of_subfolders_dict,
            is_focus_on_folders=True,
            is_delete_non_folder=True
        )

    # --------------------------------------------------



def delete_duplicate_csv_and_other_unnecessary_files_within_sitemap_folders(
        # folders_in_webscraper_folder
):
    # --------------------------------------------------
    # # DETECT FILES WITHIN EACH SITEMAP FOLDERS

    list_of_sitemap_folders = detect_and_optional_download_and_process_files_within_returned_folders(
        folder_name=ws_filename,
        returned_folders=folders_in_webscraper_folder,
    )
    # --------------------------------------------------

    # --------------------------------------------------
    # DELETE DUPLICATE CSVs WITHIN SITEMAP FOLDERS
    # print(list_of_sitemap_folders)

    delete_duplicate_folders_or_csv_files_in_specified_dictionary_of_folders_and_their_returned_folders_or_csv_files(
        folders_and_their_files_list_dict=list_of_sitemap_folders,
        is_focus_on_scraped_CSVs=True,
        is_delete_non_csv=True,
    )

    # --------------------------------------------------



def detect_and_optional_download_and_process_csv_files_within_sitemap_folders():

    detect_and_optional_download_and_process_files_within_returned_folders(
        folder_name=ws_filename,
        returned_folders=folders_in_webscraper_folder,
        is_download_sitemaps_csv_file=False,
        is_process_scraped_site_csv=True,
        is_wx_upload=True,
        is_continue_from_previous_stop_csv=False
    )



client_secret_file =  othersettings.cred_file_address
api_name = 'drive'
api_version = 'v3'
scopes = ['https://www.googleapis.com/auth/drive'] # 'https://www.googleapis.com/auth/drive'

service = Create_Service(client_secret_file, api_name, api_version, scopes)


folders_in_webscraper_folder = search_file(
    folder_id= othersettings.ws_folder_id
)

# 1
# delete_duplicate_sitemap_folders_other_unnecessary_files_within_webscraper_folders()

# 2
# delete_duplicate_csv_and_other_unnecessary_files_within_sitemap_folders()

# 3
detect_and_optional_download_and_process_csv_files_within_sitemap_folders()