import requests

import json

from settings.q.other_settings import api_key_wx


dblist = [
    'singaporeProducts', 'singaporeProductsPopularity',
    'uaeProducts', 'uaeProductsPopularity',
    'usaProducts', 'usaProductsPopularity']

url = 'https://flowbeing.wixsite.com/my-site-1/_functions-dev/clearDataBase'

for dbName in dblist:

    body = {
        'collectionName': dbName
    }

    bodyAsJSONString = json.dumps(body)

    req = requests.get(url, headers={
        'auth': api_key_wx,
        'wix-site-id': '9cf6f443-4ee4-4c04-bf19-38759205c05d',
        'body': bodyAsJSONString
    })

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

    # return req.status_code