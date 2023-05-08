import datetime
import json

import requests
from settings.q.default_folder_and_filename_settings import other_settings_data_folder
from settings.q.other_settings import api_key_fxr


def convert_minimum_profit(
        is_usd_to_sgd = False,
        is_usd_to_aed = False,
        minimum_commission_target_usd = 200,
        is_get_eur_to_sgd_exchange_rate = False
):

    if is_usd_to_sgd == False and is_usd_to_aed == False:
        raise Exception('Please set one of the following options to True:\n'
                        '1. is_usd_to_sgd\n'
                        '2. is_usd_to_aed')
    elif is_usd_to_sgd == True and is_usd_to_aed == True:
        raise Exception('Please set only one of the following options to True:\n'
                        '1. is_usd_to_sgd\n'
                        '2. is_usd_to_aed')


    minimum_commission_target_usd = minimum_commission_target_usd

    # minimum_profit_target_conversion_dict = {
    #     'minimum_profit_target_usd_to_sgd': 0,
    #     'minimum_profit_target_usd_to_aed': 0,
    #     'last_update_time': str(datetime.datetime.now())
    # }

    # minimum_profit_target_conversion_dict_as_json = json.dumps(minimum_profit_target_conversion_dict)

    # with open(f'{other_settings_data_folder}minimum_profit_target_conversion.json', 'w') as minimum_profit_target_usd_file:
    #    minimum_profit_target_usd_file.write(
    #        minimum_profit_target_conversion_dict_as_json
    #    )

    #     minimum_profit_target_usd_file.close()

    file = open(f'{other_settings_data_folder}minimum_profit_target_conversion.json', 'r+')
    minimum_profit_target_conversion_json = file.readlines()[0]

    minimum_profit_target_conversion_dict = json.loads(minimum_profit_target_conversion_json)

    #* print()
    #* print(minimum_profit_target_conversion_dict)

    time_last_update = datetime.datetime.strptime(
        minimum_profit_target_conversion_dict['last_update_time'],
        '%Y-%m-%d %H:%M:%S.%f'
    )

    # time from last currency update
    time_from_last_update = (datetime.datetime.now() - time_last_update)

    # 24 hrs
    twenty_four_hours_minus_a_micro_second = datetime.datetime.strptime(
        '23:59:59.999999',
        '%H:%M:%S.%f'
    )  # (datetime.time(hour=23, minute=59, second=59))
    unecessary_extra_year = datetime.datetime.strptime(
        '1900-01-01',
        '%Y-%m-%d'
    )

    twenty_four_hours_minus_a_micro_second = twenty_four_hours_minus_a_micro_second - unecessary_extra_year

    #* print(f'time_diff_last_update: {time_from_last_update}')
    #* print(f'twenty_four_hours: {twenty_four_hours_minus_a_micro_second}')
    #* print()

    # print(twenty_four_hours_as_seconds  - time_from_last_update_as_seconds)

    def convert_currency(
            amount,
            from_currency,
            to_currency
    ):
        url = f"https://api.apilayer.com/fixer/convert?to={to_currency}&from={from_currency}&amount={amount}"
        # url = "https://api.apilayer.com/currency_data/change?start_date=2023-05-08&end_date=2023-05-08"

        payload = {}
        headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36",
            'referer': 'https://www.google.com/',
            "apikey": api_key_fxr,
        }

        response = requests.request("GET", url, headers=headers, data=payload)

        status_code = response.status_code
        result = response.text

        # print(f'CONVERTING: {from_currency}{amount} to {to_currency}')
        # print()
        # print(f'req.status_code: {response.status_code}, {type(response.status_code)}')
        # print()
        # # print(f'req.content: {req.content}')
        # print(f'req.text: {response.text}')
        # print()
        # print(response.reason)
#
        # return_header = response.headers
        # print()
        # print('RESPONSE HEADERS')
        # print('----------------')
        # for i in return_header:
        #     print(f'{i}: {return_header[i]}')
#
        # print('---------------------------------------------------------------------------------')

        return {
            'status_code': status_code,
            'result': result
        }


    # if the last exchange rate info retrieval was performed a day ago, update it..
    if time_from_last_update > twenty_four_hours_minus_a_micro_second:
        minimum_profit_target_usd_to_sgd = convert_currency(
            amount=minimum_commission_target_usd,
            from_currency='USD',
            to_currency='SGD'
        )

        minimum_profit_target_usd_to_aed = convert_currency(
            amount=minimum_commission_target_usd,
            from_currency='USD',
            to_currency='AED'
        )

        eur_to_sgd_exchange_rate = convert_currency(
            amount=1,
            from_currency='EUR',
            to_currency='SGD'
        )


        # converting minimum_profit_target_usd_to_sgd and minimum_profit_target_usd_to_aed to string, dict and
        # obtaining the conversion rate(s)
        minimum_profit_target_usd_to_sgd_result_str = minimum_profit_target_usd_to_sgd['result']
        minimum_profit_target_usd_to_aed_result_str = minimum_profit_target_usd_to_aed['result']
        sgd_exchange_rate_result_str = eur_to_sgd_exchange_rate['result']

        minimum_profit_target_usd_to_sgd_result_str = minimum_profit_target_usd_to_sgd_result_str. \
            replace('\\t', ',').replace('\\n', '\n').replace('\\r', '\r')
        minimum_profit_target_usd_to_aed_result_str = minimum_profit_target_usd_to_aed_result_str. \
            replace('\\t', ',').replace('\\n', '\n').replace('\\r', '\r')
        sgd_exchange_rate_result_str = sgd_exchange_rate_result_str.\
            replace('\\t', ',').replace('\\n', '\n').replace('\\r', '\r')

        minimum_profit_target_usd_to_sgd_result_dict = json.loads(minimum_profit_target_usd_to_sgd_result_str)
        minimum_profit_target_usd_to_sgd = minimum_profit_target_usd_to_sgd_result_dict['result']

        minimum_profit_target_usd_to_aed_result_dict = json.loads(minimum_profit_target_usd_to_aed_result_str)
        minimum_profit_target_usd_to_aed = minimum_profit_target_usd_to_aed_result_dict['result']

        sgd_exchange_rate_result_dict = json.loads(sgd_exchange_rate_result_str)
        eur_to_sgd_exchange_rate = sgd_exchange_rate_result_dict['info']['rate']

        minimum_profit_target_conversion_dict['minimum_profit_target_usd_to_sgd'] = minimum_profit_target_usd_to_sgd
        minimum_profit_target_conversion_dict['minimum_profit_target_usd_to_aed'] = minimum_profit_target_usd_to_aed
        minimum_profit_target_conversion_dict['eur_to_sgd_exchange_rate'] = eur_to_sgd_exchange_rate
        minimum_profit_target_conversion_dict['last_update_time'] = str(datetime.datetime.now())

        minimum_profit_target_conversion_dict_as_json = json.dumps(minimum_profit_target_conversion_dict)

         # print()
        # print(minimum_profit_target_usd_to_sgd_result_dict)
        # print(minimum_profit_target_usd_to_aed_result_dict)

        # write update to file
        with open(f'{other_settings_data_folder}minimum_profit_target_conversion.json',
                  'w') as minimum_profit_target_usd_file:
            minimum_profit_target_usd_file.write(
                minimum_profit_target_conversion_dict_as_json
            )

            minimum_profit_target_usd_file.close()

        # time.sleep(5) # time allowance for retrieval and updating of exchange amounts and rate.


    # print(minimum_profit_target_conversion_dict)

    return_value = {}

    if is_usd_to_sgd and is_get_eur_to_sgd_exchange_rate:
        return_value['minimum_profit_target_usd_to_sgd'] = \
            minimum_profit_target_conversion_dict['minimum_profit_target_usd_to_sgd']
        return_value['eur_to_sgd_exchange_rate'] = \
            minimum_profit_target_conversion_dict['eur_to_sgd_exchange_rate']
    elif is_usd_to_sgd:
        return_value['minimum_profit_target_usd_to_sgd'] = \
            minimum_profit_target_conversion_dict['minimum_profit_target_usd_to_sgd']
    elif is_usd_to_aed:
        return_value['minimum_profit_target_usd_to_aed'] = \
            minimum_profit_target_conversion_dict['minimum_profit_target_usd_to_aed']

    return return_value
