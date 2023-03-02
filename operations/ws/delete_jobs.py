import json
import requests

from settings import other_settings as os

import time

def get_all_scrapping_jobs():

    get_all_scrapping_jobs_url = f'https://api.webscraper.io/api/v1/scraping-jobs?api_token={os.api_key_ws}'

    all_scrapping_jobs = requests.get(get_all_scrapping_jobs_url)
    all_scrapping_jobs_byte_data = all_scrapping_jobs.content

    all_scrapping_jobs_dict = json.loads(all_scrapping_jobs_byte_data)

    print('Getting all scraping jobs')
    print(all_scrapping_jobs.headers['X-RateLimit-Remaining'])

    return all_scrapping_jobs_dict


def delete_scraping_job_single(
    scraping_job_id
):

    print('DELETING SCRAPING JOB')
    delete_scraping_job_url= f'https://api.webscraper.io/api/v1/scraping-job/{scraping_job_id}?api_token={os.api_key_ws}'
    delete_scraping_job = requests.delete(delete_scraping_job_url)

    delete_scraping_job_data = json.loads(delete_scraping_job.content)

    # delete_scraping_job_message = delete_scraping_job_data['message']
    # print(delete_scraping_job_message)

    print(delete_scraping_job_data)


def delete_scraping_job_batch(
        all_scraping_jobs_dict,
        list_of_items_to_only_service=None,
        list_of_countries_category_or_gender_to_exclude=None
):
    all_scraping_jobs = all_scraping_jobs_dict['data']

    operation_count = 1  # One because the first updated item has to be identified as 1

    for scraping_job in all_scraping_jobs:

        current_sitemap_name = scraping_job['sitemap_name']
        scraping_job_id = scraping_job['id']

        # length_of_dic_containing_all_sitemap_id = len(dict_containing_all_sitemaps_id)
        is_country_category_or_gender_to_exclude_in_country_category_or_gender_to_exclude_tracker = 0

        # if the list of items to exclude is not empty and the current sitemap contain an item within the list,
        # increase the counter above by one to ensure that it is tracked
        if list_of_countries_category_or_gender_to_exclude != None and type(
                list_of_countries_category_or_gender_to_exclude) == list:

            for item_to_exclude in list_of_countries_category_or_gender_to_exclude:

                if item_to_exclude in current_sitemap_name:
                    is_country_category_or_gender_to_exclude_in_country_category_or_gender_to_exclude_tracker += 1

        # if the tracker above signals that the current sitemap contains an item that's meant to be excluded, skip the
        # current sitemap. Otherwise, disable the schedule for it.
        if list_of_countries_category_or_gender_to_exclude != None \
                and type(list_of_countries_category_or_gender_to_exclude) == list:

            if is_country_category_or_gender_to_exclude_in_country_category_or_gender_to_exclude_tracker > 0:
                pass

            else:
                print()
                print(f'operation count: {operation_count}')
                print()
                print(f'scraping job id: {scraping_job_id}')
                delete_scraping_job_single(
                    scraping_job_id
                )

                time.sleep(5)

                operation_count += 1

        elif list_of_items_to_only_service != None:  # remember, there's an error handler above to ensure that only one of the list arguments can exist

            if type(list_of_items_to_only_service) != list:
                raise Exception('list of items to only service is not a list!!')

            else:

                for item in list_of_items_to_only_service:

                    if type(item) != str:
                        raise Exception('An item within the list of items to only service is not a string')

                    elif item in current_sitemap_name:

                        print()
                        print(f'operation count: {operation_count}')
                        print()
                        delete_scraping_job_single(
                            scraping_job_id
                        )

                        time.sleep(5)
                        operation_count += 1

        else:

            print()
            print(f'operation count: {operation_count}')
            print()
            delete_scraping_job_single(
                scraping_job_id
            )

            time.sleep(5)

            operation_count += 1

            time.sleep(5)

            operation_count += 1



# Get all scraping jobs dictionary
all_scraping_jobs_dict = get_all_scrapping_jobs()
print(all_scraping_jobs_dict)

# DELETE SCRAPING JOBS
delete_scraping_job_batch(
    all_scraping_jobs_dict,
    # list_of_countries_category_or_gender_to_exclude = ['FWRD']
)