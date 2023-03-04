import time

import requests
import json
import ii_convert_locally_saved_sitemaps_to_dictionary as clsstd
from settings import other_settings as os, default_folder_and_filename_settings as dffns


# BATCH UPDATE SITEMAPS
def update_sitemap(url_for_update, new_sitemap_config):

    return requests.put(url_for_update, new_sitemap_config)


# CONVERT UPDATE JSON TO DICTIONARY AND BACK..
def convert_update_json_to_dict_and_back(
        filename,
        current_update_jsons_sitemap_title = None,
        current_update_jsons_starturl=None,
        is_join_content=True
):

    update_json_file_address = dffns.update_sitemaps_folder + filename

    update_json_dict = clsstd.convert_sitemap_json_to_dictionary(
        update_json_file_address, is_join_content
    )

    if current_update_jsons_starturl != None:
        update_json_dict['startUrl'] = current_update_jsons_starturl
        update_json_dict['_id'] = current_update_jsons_sitemap_title

    update_json_dict_back_to_json = json.dumps(update_json_dict)

    return update_json_dict_back_to_json

# ALL SITEMAPS ORIGIN

all_sitemaps_origin_dict_in_focus = clsstd.origin_sitemaps_as_dict


# SPECIFY JSON (SITEMAP UPDATE) DATA TO USE FOR THE UPDATE AND (FILTER) SITEMAPS TO CONFIGURE
def update_sitemaps(
    update_files_filename = None,
    target_site_name_uppercase = None
): # !!!

    if update_files_filename == None or target_site_name_uppercase == None:
        raise Exception('One or more of the following parameters is missing: \n'
                        '1. update_file_filename'
                        '2. target_site_name_uppercase')

    count = 1  # One because the first updated item has to be identified as 1

    for sitemap_name in all_sitemaps_origin_dict_in_focus:

        if target_site_name_uppercase in sitemap_name:
            sitemap_to_update_id = all_sitemaps_origin_dict_in_focus[sitemap_name]['id']
            sitemap_to_update_title = all_sitemaps_origin_dict_in_focus[sitemap_name]['name']
            sitemap_to_update_start_url = all_sitemaps_origin_dict_in_focus[sitemap_name]['sitemap']['startUrl']

            # convert update json data to dictionary and update current sitemap to update's name and starturl
            json_update_data = convert_update_json_to_dict_and_back(
                update_files_filename,
                current_update_jsons_sitemap_title=sitemap_to_update_title,
                current_update_jsons_starturl=sitemap_to_update_start_url
            )



            update_url = f'https://api.webscraper.io/api/v1/sitemap/{sitemap_to_update_id}?' \
                         f'api_token={os.api_key_ws}'

            # json_update_data = json_update_data

            print()
            print()
            print(count)
            print(f"origin sitemap's name: {sitemap_name}, url: {update_url}")
            print(f'sitemap_to_update_id: {sitemap_to_update_id}')
            print(f"sitemap being updated's title: {sitemap_to_update_title}")
            print(f"sitemap being updated's startUrl: {sitemap_to_update_start_url}")
            print()
            print(f'json_update_data: {json_update_data}')
            print()

            print(f"update_status : {update_sitemap(update_url, json_update_data).content}")

            time.sleep(10)

            count += 1

    # print(amazon_product_minimized_dict)

    # check(amazon_product_minimized_dict)

update_sitemaps(
    update_files_filename= dffns.update_sitemaps_fnp_ae_filename,
    target_site_name_uppercase = 'FNP_AE'
)

# print(len(most_recent_all_sitemap_as_dict))