import json

import pandas as pd
import requests
import datetime

from settings.q.pd_settings import *
from settings.q.other_settings import short

from settings.q.default_folder_and_filename_settings import all_filtered_data_folder_cj, all_log_files_folder, \
    shorts_progress_log, retrieved_links_log, links_reconciliation_folder

def reconcile_shorts(
        # KEY to short's metadata (includes id, short and original links)
        site_or_file_name,

):
    # list of links for the current site and their shortened form
    link_shortening_progress = {}

    # RETRIEVING LINKS DATA FROM (LOCAL) DRIVE -> PERSONAL RECORDS OF LINKS
    with open(f'{all_log_files_folder}{shorts_progress_log}', 'r+') as retrieved_links_log_file:
        retrieved_links_log_json = retrieved_links_log_file.read()
        retrieved_links_log_json_as_dict = json.loads(retrieved_links_log_json)

        last_link_shortening_progress_index_ = retrieved_links_log_json_as_dict.get(site_or_file_name, None)

        if last_link_shortening_progress_index_ != None:
            link_shortening_progress = last_link_shortening_progress_index_
        else:
            raise Exception('No personal links data records were found for the the specified site or file name\n'
                            f'{site_or_file_name}')

        retrieved_links_log_file.close()

    # dict containing personal records of short links

    # 'short_link', 'original_link', 'original_link_less_cj_trigger', 'link_number', 'id_string', 'domain_id', 'owner_id', 'short_link_creation_time'
    personal_records_of_short_links = {}
    
    # reconciliation data dictonary
    reconciliation_dict = {
        'shortURL': [],

        'ownerId-PersonalRecords': [],
        'ownerId-ShortsRecords': [],
        'OwnerId Changed? (Personal - Short.io)': [],

        'domainId-PersonalRecords': [],
        'domainId-ShortsRecords': [],
        'DomainId Changed? (Personal - Short.io)': [],

        'idString-PersonalRecords': [],
        'idString-ShortsRecords': [],
        'IdString Changed? (Personal - Short.io)': [],

        'CreationDate-PersonalRecords': [],
        'CreationDate-ShortsRecords': [],
        'CreationDate Changed? (Personal - Short.io)': [],
        'UpdatedAt-ShortsRecords': [],
        'Was Link Data Ever Updated? (Personal - Short.io)': [],
        'Was Link Data Ever Updated? (Short.io - Short.io)': [],

        'originalURL-PersonalRecords': [],
        'originalURL-ShortsRecords': [],
        'OriginalURL Changed? (Personal - Short.io)': [],

    }
    
    # retrieving links data from short.io
    retrieved_links_data_short_io = retrieve_links_web()    

    for product_or_image_id in link_shortening_progress:



        link_data = link_shortening_progress[product_or_image_id]

        owner_id_personal_records = link_data['owner_id']
        domain_id_personal_records = link_data['domain_id']
        id_string_personal_records = link_data['id_string']
        short_link_personal_records = link_data['short_link']
        original_link_personal_records = link_data['original_link']
        link_creation_date_personal_records = link_data['short_link_creation_time']

        if short_link_personal_records != "":

            # populating 'personal_records_of_short_links' dictionary where the current short_link is not empty
            # (i.e if current link is product url - expected).. excluding non-shortened (by code) image id
            if personal_records_of_short_links.get(short_link_personal_records, None) == None:
                personal_records_of_short_links[short_link_personal_records] = {}

            personal_records_of_short_links[short_link_personal_records]['ownerId-PersonalRecords'] = owner_id_personal_records
            personal_records_of_short_links[short_link_personal_records]['domainId-PersonalRecords'] = domain_id_personal_records
            personal_records_of_short_links[short_link_personal_records]['idString-PersonalRecords'] = id_string_personal_records
            personal_records_of_short_links[short_link_personal_records]['createdAt-PersonalRecords'] = link_creation_date_personal_records
            personal_records_of_short_links[short_link_personal_records]['originalURL-PersonalRecords'] = original_link_personal_records


            # reconciling data - (retrieved_links_data_short_io == personal_records_of_short_links).. if data is not of
            # non-shortened image src..
            if len(retrieved_links_data_short_io) != 0:

                owner_id_shorts_records = retrieved_links_data_short_io[short_link_personal_records]['owner_id_shorts_records']
                domain_id_shorts_records = retrieved_links_data_short_io[short_link_personal_records]['domain_id_shorts_records']
                id_string_shorts_records = retrieved_links_data_short_io[short_link_personal_records]['id_string_shorts_records']
                original_link_shorts_records = retrieved_links_data_short_io[short_link_personal_records]['original_link_shorts_records']
                is_link_updated_shorts_records = retrieved_links_data_short_io[short_link_personal_records]['is_link_updated_shorts_records'] #
                link_creation_date_shorts_records = retrieved_links_data_short_io[short_link_personal_records]['link_creation_date_shorts_records']
                link_update_date_shorts_records = retrieved_links_data_short_io[short_link_personal_records]['link_update_date_shorts_records']

                # reconciliation_dict = {
                #     'shortURL': [],
                #     'OwnerId Changed? (Personal - Short.io)': [],
                #     'DomainId Changed? (Personal - Short.io)?': [],
                #     'IdString Changed? (Personal - Short.io)?': [],
                #     'CreationDate Changed? (Personal - Short.io)?': [],
                #     'OriginalURL Changed? (Personal - Short.io)?': [],
                #     'Was Link Data Ever Updated? (Personal - Short.io)?': [],
                #     'Was Link Data Ever Updated? (Short.io - Short.io)?': []
                # }

                reconciliation_dict['shortURL'].append(short_link_personal_records)

                reconciliation_dict['ownerId-PersonalRecords'].append(owner_id_personal_records)
                reconciliation_dict['ownerId-ShortsRecords'].append(owner_id_shorts_records)
                reconciliation_dict['OwnerId Changed? (Personal - Short.io)'].append(owner_id_personal_records != owner_id_shorts_records)

                reconciliation_dict['domainId-PersonalRecords'].append(domain_id_personal_records)
                reconciliation_dict['domainId-ShortsRecords'].append(domain_id_shorts_records)
                reconciliation_dict['DomainId Changed? (Personal - Short.io)'].append(domain_id_personal_records != domain_id_shorts_records)

                reconciliation_dict['idString-PersonalRecords'].append(id_string_personal_records)
                reconciliation_dict['idString-ShortsRecords'].append(id_string_shorts_records)
                reconciliation_dict['IdString Changed? (Personal - Short.io)'].append(id_string_personal_records != id_string_shorts_records)

                reconciliation_dict['CreationDate-PersonalRecords'].append(link_creation_date_personal_records)
                reconciliation_dict['CreationDate-ShortsRecords'].append(link_creation_date_shorts_records)
                reconciliation_dict['CreationDate Changed? (Personal - Short.io)'].append(link_creation_date_personal_records != link_creation_date_shorts_records)
                reconciliation_dict['UpdatedAt-ShortsRecords'].append(link_update_date_shorts_records)
                reconciliation_dict['Was Link Data Ever Updated? (Personal - Short.io)'].append(link_creation_date_personal_records != link_update_date_shorts_records)

                reconciliation_dict['originalURL-PersonalRecords'].append(original_link_personal_records)
                reconciliation_dict['originalURL-ShortsRecords'].append(original_link_shorts_records)
                reconciliation_dict['OriginalURL Changed? (Personal - Short.io)'].append(original_link_personal_records != original_link_shorts_records)

                reconciliation_dict['Was Link Data Ever Updated? (Short.io - Short.io)'].append(is_link_updated_shorts_records)


    #
    # personal_records_of_short_links_df = pd.DataFrame.from_dict(personal_records_of_short_links)
    # print(personal_records_of_short_links_df.head(10000))

    reconciliation_df = pd.DataFrame.from_dict(reconciliation_dict)
    print(reconciliation_df.head(10000))

    print()
    print(f"OwnerId Changed? (Personal - Short.io): {reconciliation_dict['OwnerId Changed? (Personal - Short.io)'].count(True) > 0}")
    print(f"DomainId Changed? (Personal - Short.io): {reconciliation_dict['DomainId Changed? (Personal - Short.io)'].count(True) > 0}")
    print(f"IdString Changed? (Personal - Short.io): {reconciliation_dict['IdString Changed? (Personal - Short.io)'].count(True) > 0}")
    print(f"CreationDate Changed? (Personal - Short.io): {reconciliation_dict['CreationDate Changed? (Personal - Short.io)'].count(True) > 0}")
    print(f"OriginalURL Changed? (Personal - Short.io): {reconciliation_dict['OriginalURL Changed? (Personal - Short.io)'].count(True) > 0}")
    print(f"Was Link Data Ever Updated? (Personal - Short.io): {reconciliation_dict['Was Link Data Ever Updated? (Personal - Short.io)'].count(True) > 0}")
    print(f"Was Link Data Ever Updated? (Short.io - Short.io): {reconciliation_dict['Was Link Data Ever Updated? (Short.io - Short.io)'].count(True) > 0}")

    file = f'{links_reconciliation_folder}links_reconciliation-{site_or_file_name}-{datetime.datetime.now()}.csv'
    reconciliation_df.to_csv(file)
    print()
    print()
    print(f'Saved Reconciliation File: {file}')


    # links_data_local = [link_shortening_progress[id].keys() for id in link_shortening_progress]

    links_data_web = {}

# RETRIEVING LINKS FROM Short.io
def retrieve_links_web():


    def get_links_web(
        next_page_token = ''
    ):

        url = "https://api.short.io/api/links?domain_id=715488&limit=150&dateSortOrder=desc"

        # body_jsonified = json.dumps(body)

        url = "https://api.short.io/api/links"

        querystring = {"domain_id": "715488",  "offset": "0", 'pageToken': next_page_token} # limit: 150

        headers = {
            'accept': "application/json",
            'authorization': short
        }

        req = requests.request("GET", url, headers=headers, params=querystring)

        print('RETRIEVING LINKS - WEB')
        print('-----------------------')
        print()
        print(f'req.status_code: {req.status_code}, {type(req.status_code)}')
        print()
        # print(f'req.content: {req.content}')
        print(f'req.text: {req.text}')
        print()
        print(req.reason)

        return_header = req.headers
        print()
        print('RESPONSE HEADERS')
        print('----------------')
        for i in return_header:
            print(f'{i}: {return_header[i]}')

        return req

    print('---------------------------------------------------------------------------------')

    req = get_links_web()

    retrieved_links = {}

    if req.status_code == 200:


        retrieved_links_dict = {

            'ownerId-ShortsRecords': [],
            'domainId-ShortsRecords': [],
            'idString-ShortsRecords': [],
            'createdAt-ShortsRecords': [],
            'updatedAt-ShortsRecords': [],
            'isLinkUpdated-ShortsRecords': [],
            'shortURL-ShortsRecords': [],
            'originalURL-ShortsRecords': []
        }

        retrieved_links_data = json.loads(req.text)
        retrieved_links = retrieved_links_data['links']

        # retrieving links data for next page - web
        while retrieved_links_data.get('nextPageToken') != None:

            next_page_token = retrieved_links_data['nextPageToken']

            req = get_links_web(next_page_token)

            retrieved_links_data = json.loads(req.text)

            retrieved_links += retrieved_links_data['links']


        # sort retrieved_links (web) by creation date and save it
        print(f"len retrieved links: {len(retrieved_links)}")

        # Sort - oldest first, lastest last, oldest to latest
        retrieved_links.sort(key=lambda item: item['createdAt'])

        # ------------------------------------------------------------------------------------------------------------------------------------------------------------------
        # SAVE RETRIEVED LINKS
        
        with open(f'{all_log_files_folder}{retrieved_links_log}', 'r+') as retrieved_links_log_file_one:
            retrieved_links_log_json = retrieved_links_log_file_one.read()
            retrieved_links_log_json_as_dict = json.loads(retrieved_links_log_json)

            retrieved_links_index = 1
            
            for retrieved_link in retrieved_links:

                # populating retrieved_links_dict
                owner_id_shorts_records = retrieved_link['OwnerId']
                domain_id_shorts_records = retrieved_link['DomainId']
                id_string_shorts_records = retrieved_link['idString']

                short_link_shorts_records = retrieved_link['shortURL'] #

                original_link_shorts_records = retrieved_link['originalURL']
                link_creation_date_shorts_records = retrieved_link['createdAt']
                link_update_date_shorts_records = retrieved_link['updatedAt']
                is_link_updated_shorts_records = link_creation_date_shorts_records != link_update_date_shorts_records


                # retrieved_link['createdAt'] = datetime.datetime.strptime(
                #     link_creation_date,
                #     '%Y-%m-%dT%H:%M:%S.%fZ'
                # )
                #
                # retrieved_link['updatedAt'] = datetime.datetime.strptime(
                #     link_update_date,
                #     '%Y-%m-%dT%H:%M:%S.%fZ'
                # )

                retrieved_links_dict['ownerId-ShortsRecords'].append(owner_id_shorts_records)
                retrieved_links_dict['domainId-ShortsRecords'].append(domain_id_shorts_records)

                retrieved_links_dict['idString-ShortsRecords'].append(id_string_shorts_records)
                retrieved_links_dict['createdAt-ShortsRecords'].append(link_creation_date_shorts_records)
                retrieved_links_dict['updatedAt-ShortsRecords'].append(link_update_date_shorts_records)
                retrieved_links_dict['isLinkUpdated-ShortsRecords'].append(is_link_updated_shorts_records)
                retrieved_links_dict['shortURL-ShortsRecords'].append(short_link_shorts_records)
                retrieved_links_dict['originalURL-ShortsRecords'].append(original_link_shorts_records)

                # if the links have been successfully been retrieved, add it to the list of retrieved
                # urls..
                print(f'short_link_shorts_records : {short_link_shorts_records}')
                print(f'original_link_shorts_records : {original_link_shorts_records}')
                print('---------------------------------------------')
                print()
                print()

                if retrieved_links_log_json_as_dict.get(short_link_shorts_records, None) == None:

                    retrieved_links_log_json_as_dict[short_link_shorts_records] = {}

                retrieved_links_log_json_as_dict[short_link_shorts_records]['owner_id_shorts_records'] = owner_id_shorts_records
                retrieved_links_log_json_as_dict[short_link_shorts_records]['domain_id_shorts_records'] = domain_id_shorts_records
                retrieved_links_log_json_as_dict[short_link_shorts_records]['id_string_shorts_records'] = id_string_shorts_records
                retrieved_links_log_json_as_dict[short_link_shorts_records]['original_link_shorts_records'] = original_link_shorts_records
                retrieved_links_log_json_as_dict[short_link_shorts_records]['is_link_updated_shorts_records'] = is_link_updated_shorts_records
                retrieved_links_log_json_as_dict[short_link_shorts_records]['link_creation_date_shorts_records'] = link_creation_date_shorts_records
                retrieved_links_log_json_as_dict[short_link_shorts_records]['link_update_date_shorts_records'] = link_update_date_shorts_records

                retrieved_links_index += 1

            # display retrieved links data in tabular format
            retrieved_links_df = pd.DataFrame.from_dict(retrieved_links_dict)
            print(retrieved_links_df.head(10000))

            # return retrieved links dict
            retrieved_links = retrieved_links_log_json_as_dict

            retrieved_links_log_dict_as_json = json.dumps(retrieved_links_log_json_as_dict)

            with open(f'{all_log_files_folder}{retrieved_links_log}', 'w+') as retrieved_links_log_file_two:
                retrieved_links_log_file_two.write(retrieved_links_log_dict_as_json)

                retrieved_links_log_file_two.close()

            retrieved_links_log_file_one.close()


            # ------------------------------------------------------------------------------------------------------------------------------------------------------------------



    else:
        retrieved_links = {}

    return retrieved_links  # req.text


# retrieve_links_web()
# reconcile_shorts('SAMSUNG_UAE_CJ')
reconcile_shorts('THE_LUXURY_CLOSET_CJ')

