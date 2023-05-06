import json

import pandas as pd
import requests
import datetime

from settings.q.pd_settings import *
from settings.q.other_settings import short

from settings.q.default_folder_and_filename_settings import all_filtered_data_folder_cj, all_log_files_folder, \
    shorts_progress_log, retrieved_links_log

def reconcile_shorts(
        # KEY to short's metadata (includes id, short and original links)
        site_or_file_name,

):
    # list of links for the current site and their shortened form
    link_shortening_progress = {}

    # GET (LINK SHORTENING) PROGRESS.. LOCAL
    with open(f'{all_log_files_folder}{shorts_progress_log}', 'r+') as retrieved_links_log_file:
        retrieved_links_log_json = retrieved_links_log_file.read()
        retrieved_links_log_json_as_dict = json.loads(retrieved_links_log_json)

        last_link_shortening_progress_index_ = retrieved_links_log_json_as_dict.get(site_or_file_name, None)

        if last_link_shortening_progress_index_ != None:
            link_shortening_progress = last_link_shortening_progress_index_

        retrieved_links_log_file.close()


    # dict containing shorts (key) and their originals (value)
    links_data_local = {
        link_shortening_progress[data]['short_link']: link_shortening_progress[data]['original_link'] for data in link_shortening_progress
    }

    # links_data_local = [link_shortening_progress[id].keys() for id in link_shortening_progress]

    print(links_data_local)
    links_data_web = {}

def retrieve_links_web():

    url = "https://api.short.io/api/links?domain_id=715488&limit=150&dateSortOrder=desc"

    # body_jsonified = json.dumps(body)

    url = "https://api.short.io/api/links"

    querystring = {"domain_id": "715488",  "offset": "0"} # limit: 150

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

    print('---------------------------------------------------------------------------------')

    retrieved_links = ''

    if req.status_code == 200:


        retrieved_links_dict = {
            'createdAt': [],
            'updatedAt': [],
            'isLinkUpdated': [],
            'shortURL': [],
            'originalURL': []
        }

        retrieved_links = json.loads(req.text)
        retrieved_links = retrieved_links['links']
        print(f"len retrieved links: {len(retrieved_links)}")

        # Sort - oldest first, lastest last, oldest to latest
        retrieved_links.sort(key=lambda item: item['createdAt'])

        # ------------------------------------------------------------------------------------------------------------------------------------------------------------------
        # SAVE RETRIEVED LINKS
        
        with open(f'{all_log_files_folder}{retrieved_links_log}', 'r+') as retrieved_links_log_file_one:
            retrieved_links_log_json = retrieved_links_log_file_one.read()
            retrieved_links_log_json_as_dict = json.loads(retrieved_links_log_json)

            retrieved_links_index = 0
            
            for retrieved_link in retrieved_links:

                short_link = retrieved_link['shortURL']
                original_link = retrieved_link['originalURL']
                link_creation_date = retrieved_link['createdAt']
                link_update_date = retrieved_link['updatedAt']
                is_link_updated = link_creation_date != link_update_date

                retrieved_link['createdAt'] = datetime.datetime.strptime(
                    link_creation_date,
                    '%Y-%m-%dT%H:%M:%S.%fZ'
                )

                retrieved_link['updatedAt'] = datetime.datetime.strptime(
                    link_update_date,
                    '%Y-%m-%dT%H:%M:%S.%fZ'
                )

                retrieved_links_dict['createdAt'].append(link_creation_date)
                retrieved_links_dict['updatedAt'].append(link_update_date)
                retrieved_links_dict['isLinkUpdated'].append(is_link_updated)
                retrieved_links_dict['shortURL'].append(retrieved_link['shortURL'])
                retrieved_links_dict['originalURL'].append(retrieved_link['originalURL'])

                # if the links have been successfully been retrieved, add it to the list of retrieved
                # urls..
                print(f'short_link : {short_link}')
                print(f'original_link : {original_link}')
                print('---------------------------------------------')
                print()
                print()

                if retrieved_links_log_json_as_dict.get(retrieved_links_index, None) == None:

                    retrieved_links_log_json_as_dict[retrieved_links_index] = {}

                    retrieved_links_log_json_as_dict[retrieved_links_index]['short_link'] = short_link
                    retrieved_links_log_json_as_dict[retrieved_links_index]['original_link'] = original_link
                    retrieved_links_log_json_as_dict[retrieved_links_index]['is_link_updated'] = is_link_updated
                    retrieved_links_log_json_as_dict[retrieved_links_index]['created_at'] = link_creation_date
                    retrieved_links_log_json_as_dict[retrieved_links_index]['updated_at'] = link_update_date

                retrieved_links_index += 1



            retrieved_links_df = pd.DataFrame.from_dict(retrieved_links_dict)
            print(retrieved_links_df.head(10000))
            retrieved_links_log_dict_as_json = json.dumps(retrieved_links_log_json_as_dict)

            with open(f'{all_log_files_folder}{retrieved_links_log}', 'w+') as retrieved_links_log_file_two:
                retrieved_links_log_file_two.write(retrieved_links_log_dict_as_json)

                retrieved_links_log_file_two.close()

            retrieved_links_log_file_one.close()

            # ------------------------------------------------------------------------------------------------------------------------------------------------------------------



    else:
        retrieved_links = 'failed_to_load_links'

    return retrieved_links  # req.text


retrieve_links_web()
# reconcile_shorts('SAMSUNG_UAE_CJ')

