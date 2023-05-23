import time
import traceback

import pandas as pd
import json
import requests

from settings.q.other_settings import api_key_wx
from settings.productCategory import productCategories
from settings.site_names import site_names

from settings.q.default_folder_and_filename_settings \
    import all_scraped_data_folder, all_filtered_data_folder, all_filtered_data_folder_cj, \
    all_log_files_folder, wx_upload_error_log_filename, row_in_progress_last_extraction_operation_log

from operations.wx.reset_p import reset_p_all

def extract_elements_per_row_from_dataframe(
        file_name,
        dataframe,
        # boolean -> to determine whether p should be reset..
        # if true already existing product rows in db will keep their p values i.e useful when a daily upload stopped
        # abruptly..
        # if false -> all existing product rows will lose their p values i.e useful when starting a daily upload only
        is_continue_daily_upload_if_any,
        # useful to state that the dataframe should be processed from scratch even if there exists a previous extraction
        # operation on a current dataframe..
        is_override_previous_extraction_progress_if_any_and_start_from_scratch = False,
):
    # value to check whether p values has been set where is_continue_daily_upload_if_any is False
    is_p_values_reset = {
        'Uaeproducts': False,
        'Usaproducts': False,
        'Singaporeproducts': False
    }
    
    print()
    print(f'file_name: {file_name}')

    num_of_rows_in_dataframe = len(dataframe.index)
    print(f'num_of_rows_in_dataframe: {num_of_rows_in_dataframe}')
    list_of_columns = dataframe.columns
    print()
    print(list_of_columns)

    list_of_countries = ['_UAE_', '_SINGAPORE_', '_USA_', '_US_']
    list_of_genders = ['_MEN', '_WOMEN']

    #
    # GETTING PREVIOUS EXTRACTION AND WX UPLOAD PROGRESS OF THE CURRENT DATAFRAME
    row_in_progress_last_operation = 0

    # GET ROW IN PROGRESS IN THE LAST EXTRACTION OPERATION (IF ANY) OF THE CURRENT DATAFRAME
    with open(f'{all_log_files_folder}{row_in_progress_last_extraction_operation_log}', 'r+') as row_in_progress_last_operation_file:
        row_in_progress_last_operation_log_json = row_in_progress_last_operation_file.read()
        row_in_progress_last_operation_json_as_dict = json.loads(row_in_progress_last_operation_log_json)

        row_in_progress_last_operation_index_ = row_in_progress_last_operation_json_as_dict.get(file_name, None)

        if row_in_progress_last_operation_index_ != None:
            row_in_progress_last_operation = row_in_progress_last_operation_index_

        row_in_progress_last_operation_file.close()

    # if the row that was being extracted previously (if any previous operation exists) is not 0 or the last index in
    # the dataframe, make the extraction (& upload (if true)) operation start from row_in_progress_last_operation
    index_number_to_start_from = 0

    if row_in_progress_last_operation != 0 and \
            is_override_previous_extraction_progress_if_any_and_start_from_scratch == False:
        index_number_to_start_from = row_in_progress_last_operation



    for index in range(index_number_to_start_from, num_of_rows_in_dataframe):

        # --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

        # UPDATING PREVIOUS EXTRATION AND WX UPLOAD PROGRESS OF THE CURRENT DATAFRAME
        with open(f'{all_log_files_folder}{row_in_progress_last_extraction_operation_log}', 'r+') as row_in_progress_last_operation_file_one:
            row_in_progress_last_operation_log_json = row_in_progress_last_operation_file_one.read()
            row_in_progress_last_operation_json_as_dict = json.loads(row_in_progress_last_operation_log_json)

            row_in_progress_last_operation_json_as_dict[file_name] = index

            row_in_progress_last_operation_dict_as_json = json.dumps(row_in_progress_last_operation_json_as_dict)

            with open(f'{all_log_files_folder}{row_in_progress_last_extraction_operation_log}','w') as row_in_progress_last_operation_file_two:
                row_in_progress_last_operation_file_two.write(row_in_progress_last_operation_dict_as_json)

                row_in_progress_last_operation_file_two.close()

            row_in_progress_last_operation_file_one.close()

        # --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


        print()
        print(f"current row's index: {index}")

        current_row_data = dataframe.loc[index]

        # current row's title
        current_row_title = ''

        if 'Title' in list_of_columns:
            current_row_title =  current_row_data['Title']
        elif 'title' in list_of_columns: # to account for 'title' in CJ's products feed data
            current_row_title = current_row_data['title']


        # current row's brandname if brand name's has been included in the data set
        current_row_brandname = current_row_data['brandName'] if 'brandName' in list_of_columns else ''

        # obtaining product category and if product category contains 'BAG', remove the category that irrelevant as per
        # the file name..
        current_row_product_category = ''

        if '_CJ' in file_name:
            current_row_product_category = current_row_data['productCategory']
        else:
            current_row_product_category_list = [
                productCategory for productCategory in productCategories if productCategory in file_name
            ]
            [
                current_row_product_category_list.remove(i)
                for i in current_row_product_category_list
                for ii in current_row_product_category_list
                if i in ii and ii != i
                # this line eliminates 'BAG' where 'TRAVEL BAG' is the current product category..
            ]
            current_row_product_category = current_row_product_category_list[0].replace('_', ' ')


        # current row's applicable gender
        current_row_gender = ''

        if '_CJ' in file_name:
            current_row_gender = current_row_data['gender']
        else:
            current_row_gender_list = [gender for gender in list_of_genders if gender in file_name]
            # print(f'current_row_gender_list: {current_row_gender_list}')

            current_row_gender = \
                'UNISEX' if len(current_row_gender_list) > 1 else current_row_gender_list[0].replace('_', '')

        # current row's price
        current_row_price = ''

        if '_CJ' in file_name:
            current_row_price = current_row_data['price']
        else:
            current_row_price = current_row_data['Price']

        # current row's product link
        current_row_product_link = current_row_data['productLink'] # works for CJ product feed data as well

        # current row's image link
        current_row_image_link = ''

        if '_CJ' in file_name:
            current_row_image_link = current_row_data['imageSrc']
        else:
            current_row_image_link = current_row_data['Image Src']

        # current row's site name
        current_row_site_name = ''

        if '_CJ' in file_name:
            current_row_site_name = current_row_data['siteName']
        else:
            current_row_site_name = [site_name for site_name in site_names if site_name in file_name][0]

        # obtaining collection name that's associated with the current row's data
        # current row's country name
        current_row_country_name = ''

        if 'SHOPWORN' in file_name:  # accounts for 'SHOPWORN' being in the USA
            current_row_country_name = 'USA'
        elif '_CJ' in file_name: # accounts for 'THE LUXURY CLOSET' and 'SAMSUNG UAE's primary country being UAE
            current_row_country_name = 'UAE'
        else:
            current_row_country_name = \
                [country for country in list_of_countries if country in file_name]

            current_row_country_name = \
                'USA' if '_US_' in file_name or '_USA_' in file_name else current_row_country_name[0].replace('_', '')

        current_rows_relevant_collection = f'{current_row_country_name[0] + current_row_country_name[1:].lower()}products'

        # update check variables
        current_rows_isProductLinkUpdated = ''
        current_rows_baseProductLinksId = ''
        current_rows_isImageSrcUpdated = ''
        current_rows_baseImageSrcsId = ''

        if 'isProductLinkUpdated' in list_of_columns:
            current_rows_isProductLinkUpdated = current_row_data['isProductLinkUpdated']

        if 'baseProductLinksId' in list_of_columns:
            current_rows_baseProductLinksId = current_row_data['baseProductLinksId']

        if 'isImageSrcUpdated' in list_of_columns:
            current_rows_isImageSrcUpdated = current_row_data['isImageSrcUpdated']

        if 'baseImageSrcsId' in list_of_columns:
            current_rows_baseImageSrcsId = current_row_data['baseImageSrcsId']




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

        print(f'current_rows_isProductLinkUpdated: {current_rows_isProductLinkUpdated}, {type(current_rows_isProductLinkUpdated)}')
        print(f'current_rows_baseProductLinksId: {current_rows_baseProductLinksId}, {type(current_rows_baseProductLinksId)}')
        print(f'current_rows_isImageSrcUpdated: {current_rows_isImageSrcUpdated}, {type(current_rows_isImageSrcUpdated)}')
        print(f'current_rows_baseImageSrcsId: {current_rows_baseImageSrcsId}, {type(current_rows_baseImageSrcsId)}')



        # UPLOAD ROW DATA TO IT'S RELEVANT WIX DATABASE..
        try:

            watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_collections_name = ['Uaeproducts',
                                                                                           'Usaproducts',
                                                                                           'Singaporeproducts',
                                                                                           'Ukproducts',
                                                                                           'Euproducts']

            watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_countries_name = ['UAE', 'USA', 'SINGAPORE',
                                                                                         'UK', 'EU']

            number_of_times_to_upload_products_to_databases = 0

            # accounting for the fact that the following websites tend to 3 countries of which only one country's data
            # has been collected
            if 'WATCHES_COM' in file_name:
                number_of_times_to_upload_products_to_databases = 2

            elif 'FWRD' in file_name or 'JIMMY_CHOO' in file_name:
                number_of_times_to_upload_products_to_databases = 3

            elif 'THE_LUXURY_CLOSET' in file_name:
                number_of_times_to_upload_products_to_databases = 5


            else:
                number_of_times_to_upload_products_to_databases = 1


            for i in range(number_of_times_to_upload_products_to_databases):

                if current_row_gender == 'UNISEX':

                    gender_to_apply = ['MEN', 'WOMEN']

                    for index in range(2):

                        # reset all p values if operation is being performed on a 'the start of daily upload' dataframe (False)
                        if is_continue_daily_upload_if_any == False:

                            collection_name_reset_p_all = watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_collections_name[i]
                            # if the p values of the current relevant collection name has not been reset, reset it and
                            # update that it has been reset
                            if is_p_values_reset[collection_name_reset_p_all] == False:
                                reset_p_all(collectionName=current_rows_relevant_collection)
                                is_p_values_reset[collection_name_reset_p_all] = True

                        upload_data_operation_status_code = populate_site_db(
                            collection_name= watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_collections_name[i]
                            if 'THE_LUXURY_CLOSET' in file_name or 'WATCHES_COM' in file_name or 'FWRD' in file_name or 'JIMMY_CHOO' in file_name
                            else current_rows_relevant_collection, #

                            title=current_row_title,
                            brand_name=current_row_brandname,
                            product_category=current_row_product_category,
                            gender=gender_to_apply[index],
                            price=current_row_price,
                            product_link=current_row_product_link,
                            image_src=current_row_image_link,
                            site_name=current_row_site_name,

                            country= watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_countries_name[i]
                            if 'THE_LUXURY_CLOSET' in file_name or 'WATCHES_COM' in file_name or 'FWRD' in file_name or 'JIMMY_CHOO' in file_name
                            else current_row_country_name, #

                            isProductLinkUpdated=current_rows_isProductLinkUpdated,
                            baseProductLinksId= current_rows_baseProductLinksId,
                            isImageSrcUpdated= current_rows_isImageSrcUpdated,
                            baseImageSrcsId= current_rows_baseImageSrcsId,

                            is_continue_from_previous_stop_csv = is_continue_daily_upload_if_any
                        )

                        # register row if wx upload was unsuccessful
                        if upload_data_operation_status_code != 200:
                            with open(f'{all_log_files_folder}{wx_upload_error_log_filename}',
                                      'r+') as wx_upload_error_log_file_i:
                                wix_upload_errors_dict_as_json = wx_upload_error_log_file_i.read()
                                print(f"wix_upload_errors_dict_as_json: {wix_upload_errors_dict_as_json}")

                                wix_upload_errors_dict = json.loads(wix_upload_errors_dict_as_json)
                                print(
                                    f'wix_upload_errors_dict: {wix_upload_errors_dict}, {type(wix_upload_errors_dict)}')

                                # identifier prevents unsuccessfully uploaded rows from being added to this
                                # wx upload error log file twice..
                                current_unsuccessfully_uploaded_row_identifier = current_row_title + current_row_gender

                                # add the current row's number to its relevant file within the error log file..
                                if file_name not in wix_upload_errors_dict:
                                    wix_upload_errors_dict[file_name] = {
                                        current_unsuccessfully_uploaded_row_identifier: index
                                    }
                                else:
                                    current_files_list_of_upload_error_row_numbers = wix_upload_errors_dict[file_name]

                                    if current_unsuccessfully_uploaded_row_identifier not in current_files_list_of_upload_error_row_numbers:
                                        wix_upload_errors_dict[file_name][current_unsuccessfully_uploaded_row_identifier] = index

                                with open(f'{all_log_files_folder}{wx_upload_error_log_filename}',
                                          'w') as wx_upload_error_log_file_ii:
                                    wix_upload_errors_dict_to_json = json.dumps(wix_upload_errors_dict)
                                    wx_upload_error_log_file_ii.write(wix_upload_errors_dict_to_json)
                                    wx_upload_error_log_file_ii.close()

                                wx_upload_error_log_file_i.close()

                        # if wx upload was successful and the current row is the last row in the dataframe,
                        # reset the index to start from in the future for the current file..
                        elif upload_data_operation_status_code == 200:

                            with open(f'{all_log_files_folder}{row_in_progress_last_extraction_operation_log}',
                                      'r+') as row_in_progress_last_operation_file_one:
                                row_in_progress_last_operation_log_json = row_in_progress_last_operation_file_one.read()
                                row_in_progress_last_operation_json_as_dict = json.loads(
                                    row_in_progress_last_operation_log_json)

                                row_in_progress_last_operation_json_as_dict[file_name] = 0

                                row_in_progress_last_operation_dict_as_json = json.dumps(
                                    row_in_progress_last_operation_json_as_dict)

                                with open(f'{all_log_files_folder}{row_in_progress_last_extraction_operation_log}',
                                          'w') as row_in_progress_last_operation_file_two:
                                    row_in_progress_last_operation_file_two.write(
                                        row_in_progress_last_operation_dict_as_json)

                                    row_in_progress_last_operation_file_two.close()

                                row_in_progress_last_operation_file_one.close()

                        # accounting for api limit of 200 request per minute
                        time.sleep(0.4)


                else:

                    # reset all p values if operation is being performed on a 'the start of daily upload' dataframe (False)
                    if is_continue_daily_upload_if_any == False:

                        collection_name_reset_p_all = \
                        watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_collections_name[i]
                        # if the p values of the current relevant collection name has not been reset, reset it and
                        # update that it has been reset
                        if is_p_values_reset[collection_name_reset_p_all] == False:
                            reset_p_all(collectionName=current_rows_relevant_collection)
                            is_p_values_reset[collection_name_reset_p_all] = True

                    upload_data_operation_status_code = populate_site_db(
                        collection_name=watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_collections_name[i]
                        if 'THE_LUXURY_CLOSET' in file_name or 'WATCHES_COM' in file_name or 'FWRD' in file_name or 'JIMMY_CHOO' in file_name
                        else current_rows_relevant_collection,  #

                        title=current_row_title,
                        brand_name=current_row_brandname,
                        product_category=current_row_product_category,
                        gender= current_row_gender,
                        price=current_row_price,
                        product_link=current_row_product_link,
                        image_src=current_row_image_link,
                        site_name=current_row_site_name,

                        country=watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_countries_name[i]
                        if 'THE_LUXURY_CLOSET' in file_name or 'WATCHES_COM' in file_name or 'FWRD' in file_name or 'JIMMY_CHOO' in file_name
                        else current_row_country_name, #

                        isProductLinkUpdated=current_rows_isProductLinkUpdated,
                        baseProductLinksId=current_rows_baseProductLinksId,
                        isImageSrcUpdated=current_rows_isImageSrcUpdated,
                        baseImageSrcsId=current_rows_baseImageSrcsId,

                        is_continue_from_previous_stop_csv=is_continue_daily_upload_if_any
                    )

                    if upload_data_operation_status_code != 200:
                        with open(f'{all_log_files_folder}{wx_upload_error_log_filename}',
                                  'r+') as wx_upload_error_log_file_i:
                            wix_upload_errors_dict_as_json = wx_upload_error_log_file_i.read()
                            print(f"wix_upload_errors_dict_as_json: {wix_upload_errors_dict_as_json}")

                            wix_upload_errors_dict = json.loads(wix_upload_errors_dict_as_json)
                            print(
                                f'wix_upload_errors_dict: {wix_upload_errors_dict}, {type(wix_upload_errors_dict)}')

                            # identifier prevents unsuccessfully uploaded rows from being added to this
                            # wx upload error log file twice..
                            current_unsuccessfully_uploaded_row_identifier = current_row_title + current_row_gender

                            # add the current row's number to its relevant file within the error log file..
                            if file_name not in wix_upload_errors_dict:
                                wix_upload_errors_dict[file_name] = {
                                    current_unsuccessfully_uploaded_row_identifier: index
                                }
                            else:
                                current_files_list_of_upload_error_row_numbers = wix_upload_errors_dict[file_name]

                                if current_unsuccessfully_uploaded_row_identifier not in current_files_list_of_upload_error_row_numbers:
                                    wix_upload_errors_dict[file_name][
                                        current_unsuccessfully_uploaded_row_identifier] = index

                            with open(f'{all_log_files_folder}{wx_upload_error_log_filename}',
                                      'w') as wx_upload_error_log_file_ii:
                                wix_upload_errors_dict_to_json = json.dumps(wix_upload_errors_dict)
                                wx_upload_error_log_file_ii.write(wix_upload_errors_dict_to_json)
                                wx_upload_error_log_file_ii.close()

                            wx_upload_error_log_file_i.close()

                    # if wx upload was successful and the current row is the last row in the dataframe,
                    # reset the index to start from in the future for the current file..
                    elif upload_data_operation_status_code == 200:

                        with open(f'{all_log_files_folder}{row_in_progress_last_extraction_operation_log}', 'r+') as row_in_progress_last_operation_file_one:

                            row_in_progress_last_operation_log_json = row_in_progress_last_operation_file_one.read()
                            row_in_progress_last_operation_json_as_dict = json.loads(
                                row_in_progress_last_operation_log_json)

                            row_in_progress_last_operation_json_as_dict[file_name] = 0

                            row_in_progress_last_operation_dict_as_json = json.dumps(
                                row_in_progress_last_operation_json_as_dict)

                            with open(f'{all_log_files_folder}{row_in_progress_last_extraction_operation_log}',
                                      'w') as row_in_progress_last_operation_file_two:
                                row_in_progress_last_operation_file_two.write(
                                    row_in_progress_last_operation_dict_as_json)

                                row_in_progress_last_operation_file_two.close()

                            row_in_progress_last_operation_file_one.close()

                    # accounting for api limit of 200 request per minute
                    time.sleep(0.4)


        except:
            traceback.print_exc()

            # add failed wx upload row to list of unsuccessful uploads
            with open(f'{all_log_files_folder}{wx_upload_error_log_filename}',
                      'r+') as wx_upload_error_log_file_i:
                wix_upload_errors_dict_as_json = wx_upload_error_log_file_i.read()
                print(f"wix_upload_errors_dict_as_json: {wix_upload_errors_dict_as_json}")

                wix_upload_errors_dict = json.loads(wix_upload_errors_dict_as_json)
                print(
                    f'wix_upload_errors_dict: {wix_upload_errors_dict}, {type(wix_upload_errors_dict)}')

                # identifier prevents unsuccessfully uploaded rows from being added to this
                # wx upload error log file twice..
                current_unsuccessfully_uploaded_row_identifier = current_row_title + current_row_gender

                # add the current row's number to its relevant file within the error log file..
                if file_name not in wix_upload_errors_dict:
                    wix_upload_errors_dict[file_name] = {
                        current_unsuccessfully_uploaded_row_identifier: index
                    }
                else:
                    current_files_list_of_upload_error_row_numbers = wix_upload_errors_dict[file_name]

                    if current_unsuccessfully_uploaded_row_identifier not in current_files_list_of_upload_error_row_numbers:
                        wix_upload_errors_dict[file_name][current_unsuccessfully_uploaded_row_identifier] = index

                with open(f'{all_log_files_folder}{wx_upload_error_log_filename}',
                          'w') as wx_upload_error_log_file_ii:
                    wix_upload_errors_dict_to_json = json.dumps(wix_upload_errors_dict)
                    wx_upload_error_log_file_ii.write(wix_upload_errors_dict_to_json)
                    wx_upload_error_log_file_ii.close()

                wx_upload_error_log_file_i.close()


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

        current_csv_file_path = ''
        current_CSVs_ignored_rows_during_wx_upload_list = skipped_csv_rows_dict[file_name]

        if '_CJ' in file_name:
            current_csv_file_path = f'{all_filtered_data_folder_cj}{file_name}.csv'
        else:
            current_csv_file_path = f'{all_filtered_data_folder}{file_name}_FILTERED.csv'

        current_csv_as_dataframe = pd.read_csv(current_csv_file_path)
        list_of_columns = current_csv_as_dataframe.columns

        current_csv_files_list_of_successfully_reuploaded_rows = []

        for unsuccessfully_uploaded_row_identifier in current_CSVs_ignored_rows_during_wx_upload_list:

            index = current_CSVs_ignored_rows_during_wx_upload_list[unsuccessfully_uploaded_row_identifier]

            print()
            print(f"current row's index: {index}")

            current_row_data = current_csv_as_dataframe.loc[index]

            # current row's title
            current_row_title = ''

            if 'Title' in list_of_columns:
                current_row_title = current_row_data['Title']
            elif 'title' in list_of_columns:  # to account for 'title' in CJ's products feed data
                current_row_title = current_row_data['title']

            # current row's brandname if brand name's has been included in the data set
            # work for CJ products feed data as well
            current_row_brandname = current_row_data['brandName'] if 'brandName' in list_of_columns  else ''
            if pd.isna(current_row_brandname) == True:
                current_row_brandname = ''

            # obtaining product category and if product category contains 'BAG', remove the category that irrelevant as per
            # the file name..
            current_row_product_category = ''

            if '_CJ' in file_name:
                current_row_product_category = current_row_data['productCategory']
            else:
                current_row_product_category_list = [
                    productCategory for productCategory in productCategories if productCategory in file_name
                ]
                [
                    current_row_product_category_list.remove(i)
                    for i in current_row_product_category_list
                    for ii in current_row_product_category_list
                    if i in ii and ii != i
                    # this line eliminates 'BAG' where 'TRAVEL BAG' is the current product category..
                ]
                current_row_product_category = current_row_product_category_list[0].replace('_', ' ')

            # current row's applicable gender
            current_row_gender = ''

            if '_CJ' in file_name:
                current_row_gender = current_row_data['gender']
            else:
                current_row_gender_list = [gender for gender in list_of_genders if gender in file_name]
                # print(f'current_row_gender_list: {current_row_gender_list}')

                current_row_gender = \
                    'UNISEX' if len(current_row_gender_list) > 1 else current_row_gender_list[0].replace('_', '')

            # current row's price
            current_row_price = ''

            if '_CJ' in file_name:
                current_row_price = current_row_data['price']
            else:
                current_row_price = current_row_data['Price']

            # current row's product link
            current_row_product_link = current_row_data['productLink']  # works for CJ product feed data as well

            # current row's image link
            current_row_image_link = ''

            if '_CJ' in file_name:
                current_row_image_link = current_row_data['imageSrc']
            else:
                current_row_image_link = current_row_data['Image Src']

            # current row's site name
            current_row_site_name = ''

            if '_CJ' in file_name:
                current_row_site_name = current_row_data['siteName']
            else:
                current_row_site_name = [site_name for site_name in site_names if site_name in file_name][0]

            # obtaining collection name that's associated with the current row's data
            # current row's country name
            current_row_country_name = ''


            if 'SHOPWORN' in file_name: # accounts for 'SHOPWORN' being in the USA
                current_row_country_name = 'USA'
            elif '_CJ' in file_name:  # accounts for 'THE LUXURY CLOSET' and 'SAMSUNG UAE's primary country being UAE
                current_row_country_name = 'UAE'
            else:
                current_row_country_name = \
                    [country for country in list_of_countries if country in file_name]

                current_row_country_name = \
                    'USA' if '_US_' in file_name or '_USA_' in file_name else current_row_country_name[0].replace('_', '')

            current_rows_relevant_collection = f'{current_row_country_name.lower()}Products'

            # update check variables
            current_rows_isProductLinkUpdated = ''
            current_rows_baseProductLinksId = ''
            current_rows_isImageSrcUpdated = ''
            current_rows_baseImageSrcsId = ''

            if 'isProductLinkUpdated' in list_of_columns:
                current_rows_isProductLinkUpdated = current_row_data['isProductLinkUpdated']
                if current_rows_isProductLinkUpdated == False:
                    current_rows_isProductLinkUpdated = 'false'
                elif current_rows_isProductLinkUpdated == True:
                    current_rows_isProductLinkUpdated = 'true'

            if 'baseProductLinksId' in list_of_columns:
                current_rows_baseProductLinksId = current_row_data['baseProductLinksId']

            if 'isImageSrcUpdated' in list_of_columns:
                current_rows_isImageSrcUpdated = current_row_data['isImageSrcUpdated']
                if current_rows_isImageSrcUpdated == False:
                    current_rows_isImageSrcUpdated = 'false'
                elif current_rows_isImageSrcUpdated == True:
                    current_rows_isImageSrcUpdated = 'true'

            if 'baseImageSrcsId' in list_of_columns:
                current_rows_baseImageSrcsId = current_row_data['baseImageSrcsId']


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

            print(f'current_rows_isProductLinkUpdated: {current_rows_isProductLinkUpdated}, {type(current_rows_isProductLinkUpdated)}')
            print(f'current_rows_baseProductLinksId: {current_rows_baseProductLinksId}, {type(current_rows_baseProductLinksId)}')
            print(f'current_rows_isImageSrcUpdated: {current_rows_isImageSrcUpdated}, {type(current_rows_isImageSrcUpdated)}')
            print(f'current_rows_baseImageSrcsId: {current_rows_baseImageSrcsId}, {type(current_rows_baseImageSrcsId)}')



            # UPLOAD ROW DATA TO IT'S RELEVANT WIX DATABASE..
            try:

                watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_collections_name = ['Uaeproducts',
                                                                                               'Usaproducts',
                                                                                               'Singaporeproducts',
                                                                                               'Ukproducts',
                                                                                               'Euproducts']

                watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_countries_name = ['UAE', 'USA', 'SINGAPORE',
                                                                                             'UK', 'EU']

                number_of_times_to_upload_products_to_databases = 0

                # accounting for the fact that the following websites tend to 3 countries of which only one country's data
                # has been collected
                if 'WATCHES_COM' in file_name:
                    number_of_times_to_upload_products_to_databases = 2

                elif 'FWRD' in file_name or 'JIMMY_CHOO' in file_name:
                    number_of_times_to_upload_products_to_databases = 3

                elif 'THE_LUXURY_CLOSET' in file_name:
                    number_of_times_to_upload_products_to_databases = 5


                else:
                    number_of_times_to_upload_products_to_databases = 1



                for i in range(number_of_times_to_upload_products_to_databases):

                    if current_row_gender == 'UNISEX':

                        gender_to_apply = ['MEN', 'WOMEN']

                        for index in range(2):

                            upload_data_operation_status_code = populate_site_db(
                                collection_name=watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_collections_name[i]
                                if 'THE_LUXURY_CLOSET' in file_name or 'WATCHES_COM' in file_name or 'FWRD' in file_name or 'JIMMY_CHOO' in file_name
                                else current_rows_relevant_collection,  #

                                title=current_row_title,
                                brand_name=current_row_brandname,
                                product_category=current_row_product_category,
                                gender= current_row_gender,
                                price=current_row_price,
                                product_link=current_row_product_link,
                                image_src=current_row_image_link,
                                site_name=current_row_site_name,

                                country=watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_countries_name[i]
                                if 'THE_LUXURY_CLOSET' in file_name or 'WATCHES_COM' in file_name or 'FWRD' in file_name or 'JIMMY_CHOO' in file_name
                                else current_row_country_name, #

                                isProductLinkUpdated=current_rows_isProductLinkUpdated,
                                baseProductLinksId=current_rows_baseProductLinksId,
                                isImageSrcUpdated=current_rows_isImageSrcUpdated,
                                baseImageSrcsId=current_rows_baseImageSrcsId,

                                is_continue_from_previous_stop_csv=True
                            )

                            if upload_data_operation_status_code == 200:
                                current_csv_files_list_of_successfully_reuploaded_rows.append(unsuccessfully_uploaded_row_identifier)

                    else:

                        upload_data_operation_status_code = populate_site_db(
                            collection_name=watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_collections_name[i]
                            if 'THE_LUXURY_CLOSET' in file_name or 'WATCHES_COM' in file_name or 'FWRD' in file_name or 'JIMMY_CHOO' in file_name
                            else current_rows_relevant_collection,  #

                            title=current_row_title,
                            brand_name=current_row_brandname,
                            product_category=current_row_product_category,
                            gender= current_row_gender,
                            price=current_row_price,
                            product_link=current_row_product_link,
                            image_src=current_row_image_link,
                            site_name=current_row_site_name,

                            country=watches_com_theluxurycloset_fwrd_jimmy_choo_relative_extra_countries_name[i]
                            if 'THE_LUXURY_CLOSET' in file_name or 'WATCHES_COM' in file_name or 'FWRD' in file_name or 'JIMMY_CHOO' in file_name
                            else current_row_country_name, #

                            isProductLinkUpdated=current_rows_isProductLinkUpdated,
                            baseProductLinksId=current_rows_baseProductLinksId,
                            isImageSrcUpdated=current_rows_isImageSrcUpdated,
                            baseImageSrcsId=current_rows_baseImageSrcsId,

                            is_continue_from_previous_stop_csv=True
                        )

                        if upload_data_operation_status_code == 200:
                            current_csv_files_list_of_successfully_reuploaded_rows.append(unsuccessfully_uploaded_row_identifier)


            except:
                traceback.print_exc()

            time.sleep(0.4)  # accounting for api limit of 200 request per minute


        # remove all successfully uploaded rows from skipped csv rows dict
        for row_reuploaded_successfully in current_csv_files_list_of_successfully_reuploaded_rows:

            current_CSVs_ignored_rows_during_wx_upload_list.remove(row_reuploaded_successfully)

        # if all previous unsuccessfully uploaded rows within the current file have now been successfully uploaded,
        # delete the current file from skipped csv rows list, otherwise update it..
        if len(current_CSVs_ignored_rows_during_wx_upload_list) == 0:
            skipped_csv_rows_dict.remove(file_name)
        else:
            skipped_csv_rows_dict[file_name] = current_CSVs_ignored_rows_during_wx_upload_list


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
        country,

        isProductLinkUpdated,
        baseProductLinksId,
        isImageSrcUpdated,
        baseImageSrcsId,

        is_continue_from_previous_stop_csv
):
    print('---------------------------------------------------------------------------------')

    site_url = 'https://flowbeing.wixsite.com/my-site-1/_functions-dev/addRowToCollection'

    # title, brandname, productcategory, gender, price, productlink, imagesrc, sitename, country, baseproductlinksid, baseimagesrcsid

    body = {
        'collectionName': collection_name,
        'rowData': {
            'title': title,
            'brandname': brand_name,
            'productcategory': product_category,  #
            'gender': gender, #
            'price': price,
            'productlink': product_link,
            'imagesrc': image_src,
            'sitename': site_name, #
            'country': country,

            'baseproductlinksid': baseProductLinksId,
            'baseimagesrcsid': baseImageSrcsId,
        }
    }

    body = json.dumps(body)
    # print(f'insertRow type: {type(body)}')

    is_reset_p = 'false'

    if is_continue_from_previous_stop_csv == True:
        is_reset_p = 'false'

    else:
        is_reset_p = 'true'

    req = requests.get(
        site_url,
        headers={
            'auth': api_key_wx,
            'wix-site-id': '9cf6f443-4ee4-4c04-bf19-38759205c05d',
            'body': body,
            'is_reset_p': is_reset_p,
            'is_product_link_updated': isProductLinkUpdated,
            'is_image_src_updated': isImageSrcUpdated
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


# upload_skipped_csv_rows()

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