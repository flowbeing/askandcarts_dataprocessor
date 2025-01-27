import requests
import json

from settings.q.other_settings import api_key_wx
from settings.q.d.listed import listed


def remove_pless_all(collectionName):

    site_url = 'https://flowbeing.wixsite.com/my-site-1/_functions-dev/removePlessAll'

    resource = {
        'collection_name': collectionName
    }

    resource = json.dumps(resource)

    req = requests.get(
        site_url,

        headers = {
            'auth': api_key_wx,
            'wix-site-id': '9cf6f443-4ee4-4c04-bf19-38759205c05d',
            'body': resource
        }
    )

    print('REMOVE PLESS ALL')
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
        raise Exception('There was an error while removing pless')

    return req.status_code



def remove_pless():

    for i in listed:

        remove_pless_all(i)

remove_pless()