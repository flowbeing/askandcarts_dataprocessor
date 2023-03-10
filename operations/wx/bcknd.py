import time
import traceback

import pandas as pd
import json
import requests

from settings.q.other_settings import api_key_wx
from settings.productCategory import productCategories
from settings.site_names import site_names

from settings.q.default_folder_and_filename_settings \
    import all_scraped_data_folder, all_filtered_data_folder,all_log_files_folder, wx_upload_error_log_filename

def extract_elements_per_row_from_dataframe(
        file_name,
        dataframe,
        # useful for when upload stops at an index within a file; when there's no more internet connection for instance
        index_number_to_start_from=0
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

    for index in range(index_number_to_start_from, num_of_rows_in_dataframe):

        print()
        print(f"current row's index: {index}")

        current_row_data = dataframe.loc[index]

        # current row's title
        current_row_title =  current_row_data['Title']

        # current row's brandname if brand name's has been included in the data set
        current_row_brandname = current_row_data['brandName'] if 'brandName' in list_of_columns else ''

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
        current_row_product_category = current_row_product_category_list[0].replace('_', ' ')

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




        print(f'current_row_title: {current_row_title}, {type(current_row_title)}')
        print(f'current_row_brandname: {current_row_brandname}, {type(current_row_brandname)}')
        print(f'current_row_product_category: {current_row_product_category}, {type(current_row_product_category)}')
        print(f'current_row_gender_list: {current_row_gender}, {type(current_row_gender)}')
        print(f'current_row_price: {current_row_price}, {type(current_row_price)}')
        print(f'current_row_product_link: {current_row_product_link}, {type(current_row_product_link)}')
        print(f'current_row_image_link: {current_row_image_link}, {type(current_row_image_link)}')
        print(f'current_row_site_name: {current_row_site_name}, {type(current_row_site_name)}')
        print(f'current_row_country_name: {current_row_country_name}, {type(current_row_country_name)}')
        print(f'current_rows_relevant_collection: {current_rows_relevant_collection}, {type(current_rows_relevant_collection)}')


        # UPLOAD ROW DATA TO IT'S RELEVANT WIX DATABASE..
        try:

            upload_data_operation_status_code = populate_site_db(
                collection_name=current_rows_relevant_collection,
                title=current_row_title,
                brand_name=current_row_brandname,
                product_category=current_row_product_category,
                gender=current_row_gender,
                price=current_row_price,
                product_link=current_row_product_link,
                image_src=current_row_image_link,
                site_name=current_row_site_name,
                country=current_row_country_name
            )

            if upload_data_operation_status_code != 200:
                with open(f'{all_log_files_folder}{wx_upload_error_log_filename}', 'r+') as wx_upload_error_log_file_i:
                    wix_upload_errors_dict_as_json = wx_upload_error_log_file_i.read()
                    print(f"wix_upload_errors_dict_as_json: {wix_upload_errors_dict_as_json}")

                    wix_upload_errors_dict = json.loads(wix_upload_errors_dict_as_json)
                    print(f'wix_upload_errors_dict: {wix_upload_errors_dict}, {type(wix_upload_errors_dict)}')

                    # add the current row's number to its relevant file within the error log file..
                    if file_name not in wix_upload_errors_dict:
                        wix_upload_errors_dict[file_name] = [index]
                    else:
                        current_files_list_of_upload_error_row_numbers = wix_upload_errors_dict[file_name]
                        if index not in current_files_list_of_upload_error_row_numbers:
                            wix_upload_errors_dict[file_name].append(index)

                    with open(f'{all_log_files_folder}{wx_upload_error_log_filename}', 'w') as wx_upload_error_log_file_ii:
                        wix_upload_errors_dict_to_json = json.dumps(wix_upload_errors_dict)
                        wx_upload_error_log_file_ii.write(wix_upload_errors_dict_to_json)
                        wx_upload_error_log_file_ii.close()

                    wx_upload_error_log_file_i.close()

        except:
            traceback.print_exc()


        time.sleep(0.4) # accounting for api limit of 200 request per minute



# upload rows that were not previously uploaded to wx after scraped csv(s) had been filtered
def upload_skipped_csv_rows(

):


    skipped_csv_rows_dict = {}

    with open(f'{all_log_files_folder}{wx_upload_error_log_filename}', 'r') as skipped_csv_rows_during_wx_upload_file:
        skipped_csv_rows_json = skipped_csv_rows_during_wx_upload_file.read()
        skipped_csv_rows_json_as_dict = json.loads(skipped_csv_rows_json)
        skipped_csv_rows_dict = skipped_csv_rows_json_as_dict

        skipped_csv_rows_during_wx_upload_file.close()

    list_of_countries = ['_UAE_', '_SINGAPORE_', '_USA_', '_US_']
    list_of_genders = ['_MEN', '_WOMEN']


    for file_name in skipped_csv_rows_dict:


        current_csv_file_path = f'{all_filtered_data_folder}{file_name}_FILTERED.csv'
        current_CSVs_ignored_rows_during_wx_upload_list = skipped_csv_rows_dict[file_name]

        current_csv_as_dataframe = pd.read_csv(current_csv_file_path)
        list_of_columns = current_csv_as_dataframe.columns

        current_csv_files_list_of_successfully_reuploaded_rows = []

        for index in current_CSVs_ignored_rows_during_wx_upload_list:

            print()
            print(f"current row's index: {index}")

            current_row_data = current_csv_as_dataframe.loc[index]

            # current row's title
            current_row_title = current_row_data['Title']

            # current row's brandname if brand name's has been included in the data set
            current_row_brandname = current_row_data['brandName'] if 'brandName' in list_of_columns else ''

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
            current_row_product_category = current_row_product_category_list[0].replace('_', ' ')

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

            print(f'current_row_title: {current_row_title}, {type(current_row_title)}')
            print(f'current_row_brandname: {current_row_brandname}, {type(current_row_brandname)}')
            print(f'current_row_product_category: {current_row_product_category}, {type(current_row_product_category)}')
            print(f'current_row_gender_list: {current_row_gender}, {type(current_row_gender)}')
            print(f'current_row_price: {current_row_price}, {type(current_row_price)}')
            print(f'current_row_product_link: {current_row_product_link}, {type(current_row_product_link)}')
            print(f'current_row_image_link: {current_row_image_link}, {type(current_row_image_link)}')
            print(f'current_row_site_name: {current_row_site_name}, {type(current_row_site_name)}')
            print(f'current_row_country_name: {current_row_country_name}, {type(current_row_country_name)}')
            print(
                f'current_rows_relevant_collection: {current_rows_relevant_collection}, {type(current_rows_relevant_collection)}')

            # UPLOAD ROW DATA TO IT'S RELEVANT WIX DATABASE..
            try:

                upload_data_operation_status_code = populate_site_db(
                    collection_name=current_rows_relevant_collection,
                    title=current_row_title,
                    brand_name=current_row_brandname,
                    product_category=current_row_product_category,
                    gender=current_row_gender,
                    price=current_row_price,
                    product_link=current_row_product_link,
                    image_src=current_row_image_link,
                    site_name=current_row_site_name,
                    country=current_row_country_name
                )

                # with open(f'{all_log_files_folder}{wx_upload_error_log_filename}',
                #           'r+') as wx_upload_error_log_file_i:
                #     wix_upload_errors_dict_as_json = wx_upload_error_log_file_i.read()
                #     print(f"wix_upload_errors_dict_as_json: {wix_upload_errors_dict_as_json}")
# 
                #     wix_upload_errors_dict = json.loads(wix_upload_errors_dict_as_json)
                #     print(f'wix_upload_errors_dict: {wix_upload_errors_dict}, {type(wix_upload_errors_dict)}')
            

                if upload_data_operation_status_code == 200:

                    current_csv_files_list_of_successfully_reuploaded_rows.append(index)

                    
            except:
                traceback.print_exc()

            time.sleep(3.33)  # accounting for api limit of 200 request per minute


        # remove all successfully uploaded rows from skipped csv rows dict
        for index in current_csv_files_list_of_successfully_reuploaded_rows:

            current_CSVs_ignored_rows_during_wx_upload_list.remove(index)


    # update wx_upload_error_log_file
    with open(f'{all_log_files_folder}{wx_upload_error_log_filename}', 'w') as wx_upload_error_log_file:
        wix_upload_errors_dict_to_json = json.dumps(skipped_csv_rows_dict)
        wx_upload_error_log_file.write(wix_upload_errors_dict_to_json)
        wx_upload_error_log_file.close()





def populate_site_db(
        collection_name,
        title,
        brand_name,
        product_category,
        gender,
        price,
        product_link,
        image_src,
        site_name,
        country
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
            'siteName': site_name, #
            'country': country
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


# populate_site_db(
#     collection_name='singaporeProducts',
#     title='tTitle',
#     brand_name='tBrand',
#     product_category='tCategory',
#     gender='tGender',
#     price='tPrice',
#     product_link='tProductLink',
#     image_src='tImageSrc',
#     site_name='tSiteName'
# )


# upload_skipped_csv_rows()









# error_details = return_header['x-wix-code-user-error-details']
# error_details = json.loads(error_details)
# error_details = error_details['code']
#
# print(f'error: {error_details}')


# CREATE BASE WIX UPLOAD ERROR LOG FILE
# wx_upload_error_dict = {}
# wx_upload_error_dict_to_json = json.dumps(wx_upload_error_dict)
#
#
# # traceback.print_exc()
#
# with open(f'{all_log_files_folder}data_to_wx_upload_error_log.txt', 'w') as wx_upload_error:
#     wx_upload_error.write(wx_upload_error_dict_to_json)