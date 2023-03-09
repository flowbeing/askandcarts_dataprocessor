import requests
from settings import m as os
import ii_convert_locally_saved_sitemaps_to_dictionary as clsstd

import time


""" schedule, get, create sitemap jobs """

def enable_sitemap_schedule_single(
        sitemap_id,
        cron_minute = "*", # */5
        cron_hour = "*",
        cron_day = "*",
        cron_month = "*",
        cron_weekday = "*",
        request_interval = 2000,
        page_load_delay = 2000,
        proxy = 1

):
    json_data = {
        "cron_minute": cron_minute,
        "cron_hour": cron_hour,
        "cron_day": cron_day,
        "cron_month": cron_month,
        "cron_weekday": cron_weekday,
        "request_interval": request_interval,
        "page_load_delay": page_load_delay,
        "cron_timezone": "Europe/London",  # Europe/Riga
        "driver": "fulljs",
        "proxy": proxy
    }

    cron_keys = \
        [cron_period for cron_period in json_data.keys()
         if cron_period.startswith('cron') and cron_period != 'cron_timezone'
         ]

    cron_minute = json_data['cron_minute']
    cron_hour = json_data['cron_hour']
    cron_day = json_data['cron_day']
    cron_month = json_data['cron_month']
    cron_weekday = json_data['cron_weekday']

    # Error handling - ensure that a value is set
    if len(cron_minute) < 3 and \
        len(cron_hour) < 3 and \
        len(cron_day) < 3 and \
        len(cron_month) < 3 and \
        len(cron_weekday) < 3:
        raise Exception('Please set a cron period. \n'
                        "i.e set the time interval within which you'd like the sitemap to be run"
                        )
    else:
        for cron_period in cron_keys:
            cron_periods_value = json_data[cron_period]
            if len(cron_periods_value) > 2:  # i.e: if cron_period has been defined e.g '*/5'
                for other_cron_period in cron_keys:
                    other_cron_periods_value = json_data[other_cron_period]
                    if other_cron_period != cron_period and len(other_cron_periods_value) > 2: # i.e and another cron_period's value has been defined
                        raise Exception("Please define only one cron period's value")


    enable_schedule_url = f'https://api.webscraper.io/api/v1/sitemap/{sitemap_id}/enable-scheduler?api_token={os.api_key_ws}'
    enable_sitemap_schedule = requests.post(enable_schedule_url, data=json_data)

    # print()
    print('ENABLE SITEMAP SCHEDULER')
    print(F'SITEMAP ID: {sitemap_id}')
    print(f'X-RateLimit-Remaining: {enable_sitemap_schedule.headers["X-RateLimit-Remaining"]}')
    print(f'scheduler details: {enable_sitemap_schedule.content}')



def disable_sitemap_schedule_single(
        sitemap_id
):

    disable_schedule_url = f'https://api.webscraper.io/api/v1/sitemap/{sitemap_id}/disable-scheduler?api_token={os.api_key_ws}'
    disable_sitemap_schedule = requests.post(disable_schedule_url)

    print()
    print('DISABLE SITEMAP SCHEDULER')
    print(f'X-RateLimit-Remaining: {disable_sitemap_schedule.headers["X-RateLimit-Remaining"]}')
    print(disable_sitemap_schedule.content)




def enable_sitemap_schedule_batch(
        dict_containing_all_sitemaps_id,
        list_of_items_to_only_service = None,
        list_of_countries_category_or_gender_to_exclude = None
):
    if list_of_items_to_only_service != None and list_of_countries_category_or_gender_to_exclude != None:
        raise Exception('Please specify only one option:'
                        'a. list of items to only service'
                        'b. list of countries category or gender to exclude')


    operation_count = 1  # One because the first updated item has to be identified as 1

    for sitemap_name in dict_containing_all_sitemaps_id:
        # length_of_dic_containing_all_sitemap_id = len(dict_containing_all_sitemaps_id)
        is_country_category_or_gender_to_exclude_in_country_category_or_gender_to_exclude_tracker = 0

        # if the list of items to exclude is not empty and the current sitemap contain an item within the list,
        # increase the counter above by one to ensure that it is tracked
        if list_of_countries_category_or_gender_to_exclude != None and type(list_of_countries_category_or_gender_to_exclude) == list:

            for item_to_exclude in list_of_countries_category_or_gender_to_exclude:

                current_sitemap_name = sitemap_name

                if item_to_exclude in current_sitemap_name:
                    is_country_category_or_gender_to_exclude_in_country_category_or_gender_to_exclude_tracker += 1


        # if the tracker above signals that the current sitemap contains an item that's meant to be excluded, skip the
        # current sitemap. Otherwise, enable a schedule for it.
        if list_of_countries_category_or_gender_to_exclude != None \
                and type(list_of_countries_category_or_gender_to_exclude) == list:

            if is_country_category_or_gender_to_exclude_in_country_category_or_gender_to_exclude_tracker > 0:
                pass

            else:
                sitemap_id = dict_containing_all_sitemaps_id[sitemap_name]['id']
                print()
                print(f'operation count: {operation_count}')
                enable_sitemap_schedule_single(
                    sitemap_id=sitemap_id,
                    cron_day = '*/1'
                )

                time.sleep(5)

                operation_count += 1

        elif list_of_items_to_only_service != None: # remember, there's an error handler above to ensure that only one of the list arguments can exist

            if type(list_of_items_to_only_service) != list:
                raise Exception('list of items to only service is not a list!!')

            else:

                for item in list_of_items_to_only_service:

                    if type(item) != str:
                        raise Exception('An item within the list of items to only service is not a string')

                    elif item in sitemap_name:

                            sitemap_id = dict_containing_all_sitemaps_id[sitemap_name]['id']
                            print()
                            print(f'operation count: {operation_count}')

                            enable_sitemap_schedule_single(
                                sitemap_id=sitemap_id,
                                cron_day='*/1'
                            )

                            time.sleep(5)

                            operation_count += 1

        else:

            sitemap_id = dict_containing_all_sitemaps_id[sitemap_name]['id']
            print()
            print(f'operation count: {operation_count}')

            enable_sitemap_schedule_single(
                sitemap_id=sitemap_id,
                cron_day='*/1'
            )

            time.sleep(5)

            operation_count += 1


# batch disable schedulers
def disable_sitemap_schedule_batch(
        dict_containing_all_sitemaps_id,
        list_of_items_to_only_service = None,
        list_of_countries_category_or_gender_to_exclude = None
):
    if list_of_items_to_only_service != None and list_of_countries_category_or_gender_to_exclude != None:
        raise Exception('Please specify only one option:'
                        'a. list of items to only service'
                        'b. list of countries category or gender to exclude')


    operation_count = 1  # One because the first updated item has to be identified as 1

    for sitemap_name in dict_containing_all_sitemaps_id:
        # length_of_dic_containing_all_sitemap_id = len(dict_containing_all_sitemaps_id)
        is_country_category_or_gender_to_exclude_in_country_category_or_gender_to_exclude_tracker = 0

        # if the list of items to exclude is not empty and the current sitemap contain an item within the list,
        # increase the counter above by one to ensure that it is tracked
        if list_of_countries_category_or_gender_to_exclude != None and type(list_of_countries_category_or_gender_to_exclude) == list:

            for item_to_exclude in list_of_countries_category_or_gender_to_exclude:

                current_sitemap_name = sitemap_name

                if item_to_exclude in current_sitemap_name:
                    is_country_category_or_gender_to_exclude_in_country_category_or_gender_to_exclude_tracker += 1


        # if the tracker above signals that the current sitemap contains an item that's meant to be excluded, skip the
        # current sitemap. Otherwise, disable the schedule for it.
        if list_of_countries_category_or_gender_to_exclude != None \
                and type(list_of_countries_category_or_gender_to_exclude) == list:

            if is_country_category_or_gender_to_exclude_in_country_category_or_gender_to_exclude_tracker > 0:
                pass

            else:
                sitemap_id = dict_containing_all_sitemaps_id[sitemap_name]['id']
                print()
                print(f'operation count: {operation_count}')
                disable_sitemap_schedule_single(
                    sitemap_id=sitemap_id,
                )

                time.sleep(5)

                operation_count += 1

        elif list_of_items_to_only_service != None: # remember, there's an error handler above to ensure that only one of the list arguments can exist

            if type(list_of_items_to_only_service) != list:
                raise Exception('list of items to only service is not a list!!')

            else:

                for item in list_of_items_to_only_service:

                    if type(item) != str:
                        raise Exception('An item within the list of items to only service is not a string')

                    elif item in sitemap_name:

                            sitemap_id = dict_containing_all_sitemaps_id[sitemap_name]['id']
                            print()
                            print(f'operation count: {operation_count}')

                            disable_sitemap_schedule_single(
                                sitemap_id=sitemap_id,
                            )

                            time.sleep(5)

                            operation_count += 1

        else:

            sitemap_id = dict_containing_all_sitemaps_id[sitemap_name]['id']
            print()
            print(f'operation count: {operation_count}')

            disable_sitemap_schedule_single(
                sitemap_id=sitemap_id,
            )

            time.sleep(5)

            operation_count += 1



# enable_sitemap_schedule_batch(
#     dict_containing_all_sitemaps_id = clsstd.origin_sitemaps_as_dict,
#     # list_of_countries_category_or_gender_to_exclude = ['HUNGARY']
#     list_of_items_to_only_service = ['FWRD']
# )

disable_sitemap_schedule_batch(
    dict_containing_all_sitemaps_id = clsstd.origin_sitemaps_as_dict,
    # list_of_countries_category_or_gender_to_exclude = ['HUNGARY']
    list_of_items_to_only_service = ['FWRD']
)
