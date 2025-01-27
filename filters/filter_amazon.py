from settings.q.pd_settings import *

from operations.wx.bcknd.bcknd import extract_elements_per_row_from_dataframe

from settings.q.default_folder_and_filename_settings import all_filtered_data_folder  #

'''productLink, image, name, brandname, description, currentprice'''

def filter_amazon_scraped_data(
        file_name,
        file_address,
        minimum_profit_target,
        commission_per_sale,
        is_continue_from_previous_stop_csv,
        minimum_ratedBy = 2,
        starting_index=0,
        ref_link = '',
        is_wx_upload=False
):

    if type(file_address) != str and \
            type(minimum_profit_target) != float and \
            type(commission_per_sale) != float:
        raise Exception("1. 'file_address' should be a string \n"
                        "2. 'minimum_profit_target' and 'commission_per_sale' should be numbers")

    least_product_price_to_display = (minimum_profit_target / (commission_per_sale * 100)) * 100

    # CLEAN UP AND FILTER SECTION
    amazon_scrapped_data = pd.read_csv(file_address)

    amazon_scrapped_data_columns = amazon_scrapped_data.columns
    #print(f'amazon_scrapped_data_columns: {amazon_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        amazon_scrapped_data = amazon_scrapped_data[
            ['productLink-href', 'productImage', 'productName', 'productRating', 'ratedBy', 'curentPriceDiscountPrice']
        ]  # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')

    # print(amazon_scrapped_data.head(70))

    len_before_filtering = len(amazon_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    amazon_scrapped_data = amazon_scrapped_data.dropna()
    amazon_scrapped_data.reset_index(drop=True, inplace=True)

    len_after_initial_drop_na = len(amazon_scrapped_data.index)

    # accounting for starting points especially after initial na drop (if any)
    amazon_scrapped_data = amazon_scrapped_data[starting_index:]

    # CLEANING UP 'productLink' and 'productImage' after removing products whose price have not been presented
    print()
    product_link = amazon_scrapped_data['productLink-href']
    image_link = amazon_scrapped_data['productImage']
    product_name = amazon_scrapped_data['productName']
    product_rating = amazon_scrapped_data['productRating']
    rated_by = amazon_scrapped_data['ratedBy']
    current_price = amazon_scrapped_data['curentPriceDiscountPrice']
    # print(product_link)

    # 1. FILTER OUT A PRODUCT AND MOVE TO THE NEXT ONE IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR
    #    IF THE NUMBER OF PEOPLE WHO HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION.
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.
    # 3. FILTER OUT UNNECESSARY STRING TO MAKE SPACE FOR THE RIGHT LINK STRING BY:
    #   a. REMOVING EVERY CHARACTER FROM '/ref' in the 'productLink-href' column
    #   b. MAKING ONLY ONE LINK AVAILABLE WITHIN THE 'productImage' column

    countLinkNumber = starting_index


    for productLink, imageLink in zip(product_link, image_link):

        try:

            # obtaining first number in currency value
            product_in_focus_current_price = current_price[countLinkNumber]
            index_first_number_in_currency_value = 0

            for i in product_in_focus_current_price:
                if i in '0123456789':
                    first_number_in_currency_value = i
                    index_first_number_in_currency_value = product_in_focus_current_price.index(first_number_in_currency_value)
                    break


            # converting current price string to float
            product_in_focus_current_price = \
                current_price[countLinkNumber][index_first_number_in_currency_value:].replace(',','')  # extract the price without currency symbol !!
            product_in_focus_current_price = float(product_in_focus_current_price)

            # setting product rating
            product_in_focus_product_rating = product_rating[countLinkNumber]
            product_in_focus_product_rating = product_in_focus_product_rating[0:3]
            product_rating[countLinkNumber] = product_in_focus_product_rating

            # cleaning up 'ratedBy'
            product_in_focus_rated_by = rated_by[countLinkNumber]
            product_in_focus_rated_by = product_in_focus_rated_by[1:-1].replace(',', '')
            product_in_focus_rated_by = int(product_in_focus_rated_by)
            rated_by[countLinkNumber] = product_in_focus_rated_by
            # print(product_in_focus_rated_by)

            # print(f'product_in_focus_current_price" {product_in_focus_current_price}')

        except:
            raise Exception('There was an error while: \n '
                            'a. converting current price string to float, \n'
                            'b. setting product rating and \n'
                            'c. cleaning up rated by data'
                            )

        # 1
        if product_in_focus_current_price < least_product_price_to_display or product_in_focus_rated_by < minimum_ratedBy:
            product_link.pop(countLinkNumber)
            image_link.pop(countLinkNumber)
            product_name.pop(countLinkNumber)
            product_rating.pop(countLinkNumber)
            rated_by.pop(countLinkNumber)
            current_price.pop(countLinkNumber)

        # 2.a
        elif type(productLink) != str:
            raise Exception(f'PRODUCT LINK AT ROW {countLinkNumber} IS NOT A STRING')
            # remove_row = amazon_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
            # print(remove_row)

        # 2.b
        elif type(imageLink) != str:
            raise Exception(f"PRODUCT'S IMAGE LINK AT ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_name[countLinkNumber]) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        # 3
        else:

            link_in_focus_productLink = product_link[countLinkNumber].replace(' ', '')
            link_in_focus_productImage = image_link[countLinkNumber]

            # 3.a
            # CLEANING UP 'productLink'
            try:
                index_of_slash_ref_productLink = link_in_focus_productLink.index(
                    '/ref')  # REMOVING EVERYTHING AFTER  '/ref' !!
                every_char_before_slash_ref = link_in_focus_productLink[:index_of_slash_ref_productLink]
                # print(every_char_before_slash_ref)
                link_in_focus_productLink = every_char_before_slash_ref
                product_link[countLinkNumber] = link_in_focus_productLink + ref_link
                # print(product_link)
            except:
                raise Exception("THERE WAS AN ERROR WHILE FILTERING 'productLink")

            # 3.b
            # CLEANING UP 'productImage'
            try:
                link_in_focus_productImage = link_in_focus_productImage.split(' ')  # SPLIT WITH EMPTY SPACE !!
                link_in_focus_productImage = \
                    [item for item in link_in_focus_productImage
                     if item.startswith('http') and len(item) > len('https://')]  # EVERY STRING THAT'S NOT A LINK !!
                # print(link_in_focus_productImage)

                index_of_product_image_to_use = -1  # !!

                if len(link_in_focus_productImage) > 0:
                    image_link[countLinkNumber] = link_in_focus_productImage[index_of_product_image_to_use]
            except:
                raise Exception("THERE WAS AN ERROR WHILE FILTERING 'productImage")

        countLinkNumber += 1

    amazon_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'productRating', 'ratedBy', 'Price']

    amazon_scrapped_data['productLink'] = product_link
    amazon_scrapped_data['Image Src'] = image_link
    amazon_scrapped_data['Title'] = product_name
    amazon_scrapped_data['productRating'] = product_rating
    amazon_scrapped_data['ratedBy'] = rated_by
    amazon_scrapped_data['Price'] = current_price

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    amazon_scrapped_data.dropna(inplace=True)
    amazon_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_amazon = amazon_scrapped_data

    print(cleaned_up_scraped_data_amazon)

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_amazon.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of items before clean up : {len_before_filtering}")
    print(f'num of items after_initial_drop_na: {len_after_initial_drop_na}')
    print(f"num of items removed from amazon's scrapped data: {num_items_removed_from_list}")

    cleaned_up_scraped_data_amazon.to_csv(f'{all_filtered_data_folder}{file_name[:-4]}_FILTERED.csv', index=False)

    # wx upload if cleaned dataframe is not empty and wx upload parameter has been set to true
    if len_after_filtering > 0 and is_wx_upload == True:

        extract_elements_per_row_from_dataframe(
            file_name=file_name[:-4], # to remove '.csv'
            dataframe=cleaned_up_scraped_data_amazon,
            is_continue_daily_upload_if_any= is_continue_from_previous_stop_csv
        )

    return len(cleaned_up_scraped_data_amazon.index)


# try:
#     file_name = 'eleven_SINGAPORE_WATCHES_AMAZON_WOMEN.csv'
#     print(
#         filter_amazon_scraped_data(
#             file_name=file_name,
#             file_address=f'{all_scraped_data_folder}{file_name}',
#             minimum_profit_target=120,
#             commission_per_sale=commission_per_site['AMAZON_SG']['WATCHES'],
#             minimum_ratedBy=3,
#             ref_link=''
#         )
#     )
#
# except:
#     raise Exception('There was an error while trying to filters amazon scrapped data')