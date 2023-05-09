import requests
import json

from settings.q.other_settings import api_key_wx
from settings.q.d.listed import listed


def reset_p_all(collectionName):

    site_url = 'https://flowbeing.wixsite.com/my-site-1/_functions-dev/resetP'

    resource = {
        'collection_name': collectionName
    }

    resource = json.dumps(resource)

    req = requests.get(
        site_url,
        headers={
            'auth': api_key_wx,
            'wix-site-id': '9cf6f443-4ee4-4c04-bf19-38759205c05d',
            'body': resource
        },

    )

    print('RESETTING P')
    print('-----------')
    print(f'req.status_code: {req.status_code}, {type(req.status_code)}')
    # print(f'req.content: {req.content}')
    print(f'req.text: {req.text}')
    print(req.reason)

    return_header = req.headers
    print()
    print('RESPONSE HEADERS')
    print('----------------')
    for i in return_header:
        print(f'{i}: {return_header[i]}')

    print('---------------------------------------------------------------------------------')

    if req.status_code != 200:
        raise Exception('There was an error while resetting p')

    return req.status_code


# OBSOLETE
# resetting p only when daily upload is about to start..
# clear all p values to ensure that product upload for the day remains..
def reset_p(
    is_continue_from_previous_stop_csv
):
    print('---------------------------------------------------------------------------------')

    if is_continue_from_previous_stop_csv == False:

        site_url = 'https://flowbeing.wixsite.com/my-site-1/_functions-dev/resetP'

        # body = {}

        # body = json.dumps(body)

        req = requests.get(
            site_url,
            headers={
                'auth': api_key_wx,
                'wix-site-id': '9cf6f443-4ee4-4c04-bf19-38759205c05d',
                # 'body': body,
                # 'is_reset_p': is_reset_p,
            },

        )

        print(f'req.status_code: {req.status_code}, {type(req.status_code)}')
        # print(f'req.content: {req.content}')
        print(f'req.text: {req.text}')
        print(req.reason)

        return_header = req.headers
        print()
        print('RESPONSE HEADERS')
        print('----------------')
        for i in return_header:
            print(f'{i}: {return_header[i]}')

        print('---------------------------------------------------------------------------------')

        return req.status_code