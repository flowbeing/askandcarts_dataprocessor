import time
import traceback

import pandas as pd
import json
import requests

from settings.q.other_settings import api_key_wx
from settings.productCategory import productCategories
from settings.site_names import site_names

from settings.q.default_folder_and_filename_settings import all_scraped_data_folder
from settings.q.default_folder_and_filename_settings import all_filtered_data_folder
from settings.q.default_folder_and_filename_settings import all_log_files_folder

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

    list_of_countries = ['_UAE_', '_SINGAPORE_', '_USA_', '_US_']
    list_of_genders = ['_MEN', '_WOMEN']

    for index in range(num_of_rows_in_dataframe):

        print()
        print(f'current index: {index}')

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
        # print(f'current_row_gender_list: {current_row_gender_list}')

        current_row_gender = \
            'UNISEX' if len(current_row_gender_list) > 1 else current_row_gender_list[0].replace('_', '')

        # current row's price
        current_row_price = current_row_data['Price']

        # current row's product link
        current_row_product_link = current_row_data['productLink']

        # current row's image link
        current_row_image_link = current_row_data['Image Src']

        # current row's site name
        current_row_site_name = [site_name for site_name in site_names if site_name in file_name][0]

        # obtaining collection name that's associated with the current row's data
        # current row's country name
        current_row_country_name = \
            [country for country in list_of_countries if country in file_name]

        current_row_country_name = \
            'USA' if '_US_' in file_name or '_USA_' in file_name else current_row_country_name[0].replace('_', '')

        current_rows_relevant_collection = f'{current_row_country_name.lower()}Products'




        print(f'current_row_title: {current_row_title}')
        print(f'current_row_brandname: {current_row_brandname}')
        print(f'current_row_product_category: {current_row_product_category}')
        print(f'current_row_gender_list: {current_row_gender}')
        print(f'current_row_price: {current_row_price}')
        print(f'current_row_product_link: {current_row_product_link}')
        print(f'current_row_image_link: {current_row_image_link}')
        print(f'current_row_site_name: {current_row_site_name}')
        print(f'current_row_country_name: {current_row_country_name}')
        print(f'current_rows_relevant_collection: {current_rows_relevant_collection}')


        try:

            populate_site_db(
                collection_name=current_row_country_name,
                title=current_row_title,
                brand_name=current_row_brandname,
                product_category=current_row_product_category,
                gender=current_row_gender,
                price=current_row_price,
                product_link=current_row_product_link,
                image_src=current_row_image_link,
                site_name=current_row_site_name
            )

        except:
            traceback.print_exc()


        time.sleep(3.33) # accounting for api limit of 200 request per minute



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

wx_upload_error_dict = {}
wx_upload_error_dict_to_json = json.dumps(wx_upload_error_dict)


# traceback.print_exc()

with open(f'{all_log_files_folder}data_to_wx_upload_error.txt', 'w') as wx_upload_error:
    wx_upload_error.write(wx_upload_error_dict_to_json)