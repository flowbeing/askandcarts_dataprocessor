import pandas as pd
import json
import requests

from settings.q.other_settings import api_key_wx
from settings.productCategory import productCategories


def extract_elements_per_row_from_dataframe(
        file_name,
        dataframe
):
    print()
    print(f'file_name: {file_name}')

    num_of_rows_in_dataframe = len(dataframe.index)
    print(f'num_of_rows_in_dataframe: {num_of_rows_in_dataframe}')
    list_of_columns = dataframe.columns
    print()
    print(list_of_columns)

    list_of_countries = ['_UAE_', '_SINGAPORE_', '_US_', '_USA_']
    list_of_genders = ['_MEN_', '_WOMEN_']

    for index in range(num_of_rows_in_dataframe):

        current_row_data = dataframe.loc[index]

        # current row's title
        current_row_title =  current_row_data['Title']

        # current row's brandname if brand name's has been included in the data set
        current_row_brandname = current_row_data['brandName'] if 'brandName' in list_of_columns else pd.isnull

        # obtaining product category and if product category contains 'BAG', remove the category that irrelevant as per
        # the file name..
        current_row_product_category_list = [
            productCategory for productCategory in productCategories if productCategory in file_name
        ]
        [
            current_row_product_category_list.remove(i)
            for i in current_row_product_category_list
            for ii in current_row_product_category_list
            if i in ii and ii != i
         ]
        current_row_product_category = current_row_product_category_list[0]

        # current row's applicable gender
        current_row_gender_list = [gender for gender in list_of_genders if gender in file_name]
        current_row_gender_list = 'UNISEX' if len(current_row_gender_list) > 1 else current_row_gender_list[0]

        # current row's price
        current_row_price = current_row_data['Price']

        # current row's product link
        current_row_product_link = current_row_data['productLink']

        # current row's product link





        print()
        print(f'current_row_title: {current_row_title}')
        print(f'current_row_brandname: {current_row_brandname}')
        print(f'current_row_product_category: {current_row_product_category}')
        print(f'current_row_gender_list: {current_row_gender_list}')
        print(f'current_row_price: {current_row_price}')
        print(f'current_row_product_link: {current_row_product_link}')






def populate_site_db(
        collection_name,
        title,
        brand_name,
        product_category,
        gender,
        price,
        product_link,
        image_src,
        site_name
):
    print('---------------------------------------------------------------------------------')

    site_url = 'https://flowbeing.wixsite.com/my-site-1/_functions-dev/addRowToCollection'

    body = {
        'collectionName': collection_name,
        'rowData': {
            'title': title,
            'brandName': brand_name,
            'productCategory': product_category,  #
            'gender': gender, #
            'price': price,
            'productLink': product_link,
            'imageSrc': image_src,
            'siteName': site_name #
        }
    }

    body = json.dumps(body)
    # print(f'insertRow type: {type(body)}')

    req = requests.get(
        site_url,
        headers={
            'auth': api_key_wx,
            'wix-site-id': '9cf6f443-4ee4-4c04-bf19-38759205c05d',
            'body': body
        },

    )

    print(f'req.status_code: {req.status_code}')
    print(f'req.content: {req.content}')
    print(f'req.text: {req.text}')
    print(req.reason)

    return_header = req.headers
    print()
    print('RESPONSE HEADERS')
    print('----------------')
    for i in return_header:
        print(f'{i}: {return_header[i]}')

    print('---------------------------------------------------------------------------------')

# error_details = return_header['x-wix-code-user-error-details']
# error_details = json.loads(error_details)
# error_details = error_details['code']
#
# print(f'error: {error_details}')
