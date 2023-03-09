import requests
import json
import os
from datetime import datetime
from settings import m as os
from settings.q import default_folder_and_filename_settings as dffns

url = f"https://api.webscraper.io/api/v1/sitemaps?api_token={os.api_key_ws}"

url2 = f"https://api.webscraper.io/api/v1/sitemap/{881164}?api_token={os.api_key_ws}"

# GET ALL SITEMAPS

get_request = requests.get(url)

# returned data is a byte typed data
data_returned = get_request.content

# convert returned byte data to dictionary
response = json.loads(data_returned.decode("utf-8").replace("'", '"'))

all_sitemaps = response['data']


# AUTOMATICALLY EXTRACT SITEMAP DETAILS FROM RESPONSE DATA DICTIONARY (AS A DICTIONARY)
def extract_sitemap_details_automatically_from_url(url):

    get_request = requests.get(url)

    # print response header -> view rate limit
    print(f"X-RateLimit-Remaining: {get_request.headers['X-RateLimit-Remaining']}")

    # returned data is a byte typed data
    data_returned = (get_request.content).decode('ascii')
    sitemaps_detail = {}

    # convert returned byte data to dictionary
    try:
        response = json.loads(data_returned) # json.loads(data_returned.decode("utf-8").replace("'", '"'))
        sitemaps_detail = response['data']
    except:
        print('EEEEEEEEERRRRRRRRROOOOOOOOOOORRRRRRRR!!!')
        # extract_sitemap_details_manually_from_url(data_returned)
    # print('here')

    return sitemaps_detail

def convert_all_sitemaps_string_to_dict(all_sitemaps_string):

    all_sitemaps = json.loads(all_sitemaps_string)

    return all_sitemaps




def batch_sitemap_request(
        dir_to_save_file_in = dffns.all_sitemaps_save_folder_location,
        file_name = dffns.all_sitemaps_save_filename
):

    response_count = 0

    all_sitemaps_dict = {}

    # RESOLVE WHERE TO SAVE FILE
    current_date = datetime.now()

    all_sitemaps_save_location = dir_to_save_file_in + file_name + " " + str(current_date) + '.json'

    try:

        with open(all_sitemaps_save_location, 'w') as f:


            for sitemap_info in all_sitemaps:
                print(response_count)

                sitemap_id = sitemap_info['id']

                print(f"sitemap's id: {sitemap_id}")

                # EACH SITEMAP'S URL
                each_sitemaps_url = f"https://api.webscraper.io/api/v1/sitemap/{sitemap_id}?api_token={os.api_key_ws}"

                each_sitemaps_data = extract_sitemap_details_automatically_from_url(each_sitemaps_url)
                each_sitemaps_sitemap_config = each_sitemaps_data['sitemap']

                # CONVERT SITEMAP CONFIGURATION STRING TO DICTIONARY
                each_sitemaps_sitemap_config = json.loads(each_sitemaps_sitemap_config)

                #UPDATE EACH SITEMAP'S CONFIGURATION
                each_sitemaps_data['sitemap'] = each_sitemaps_sitemap_config

                print(each_sitemaps_data)
                # check_whether_or_not_sitemap_config_dict_has_been_fully_configured_as_a_dictionary(each_sitemaps_sitemap_config)

                response_count += 1

                all_sitemaps_dict[each_sitemaps_data["name"]] = each_sitemaps_data

                print()
                print()

            all_sitemaps_json = json.dumps(all_sitemaps_dict)
            f.write(all_sitemaps_json)

    except:

        os.mkdir(dir_to_save_file_in, mode=0o777, dir_fd=None)
        batch_sitemap_request(dir_to_save_file_in, file_name)



# OBTAIN AND SAVE ALL SITEMAPS AS PER TIME
batch_sitemap_request()