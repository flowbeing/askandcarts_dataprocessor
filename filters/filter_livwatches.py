from settings.q.pd_settings import *

from operations.wx.bcknd.bcknd import extract_elements_per_row_from_dataframe

from settings.q.default_folder_and_filename_settings import all_filtered_data_folder

'''productLink, image, name, brandname, description, currentprice'''

def filter_livwatches_scraped_data(
        file_name,
        file_address,
        minimum_profit_target,
        commission_per_sale,
        is_continue_from_previous_stop_csv,
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
    livwatches_scrapped_data = pd.read_csv(file_address)

    livwatches_scrapped_data_columns = livwatches_scrapped_data.columns
    print(f'livwatches_scrapped_data_columns: {livwatches_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        livwatches_scrapped_data = livwatches_scrapped_data[
            ['productLink', 'productImage-src', 'productName', 'currentPriceOriginalPrice']
        ] # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')

    # DROPPING ALL EMPTY DATA
    livwatches_scrapped_data.dropna(inplace=True)
    livwatches_scrapped_data.reset_index(drop=True, inplace=True)

    len_after_initial_drop_na = len(livwatches_scrapped_data.index)


    # print(livwatches_scrapped_data.head(70))

    len_before_filtering = len(livwatches_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    # livwatches_scrapped_data = livwatches_scrapped_data.dropna()
    # livwatches_scrapped_data.reset_index(drop=True, inplace=True)

    # accounting for starting points especially after initial na drop (if any)
    livwatches_scrapped_data = livwatches_scrapped_data[starting_index:]

    # CLEANING UP
    print()
    product_link = livwatches_scrapped_data['productLink']
    image_link = livwatches_scrapped_data['productImage-src']
    product_name = livwatches_scrapped_data['productName']
    current_price = livwatches_scrapped_data['currentPriceOriginalPrice']
    # print(product_link)


    # 1. FILTER OUT A PRODUCT IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR IF THE NUMBER OF PEOPLE WHO
    #    HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.

    countLinkNumber = starting_index

    # print(livwatches_scrapped_data.head())


    for productLink, imageLink in zip(product_link, image_link):


        # 1.
        try:
            # defining current price and converting it to float
            product_in_focus_current_price = current_price[countLinkNumber]


            product_in_focus_current_price = product_in_focus_current_price.split(' ')

            # if the last character in the supposed position (and length) of product's price currency symbol as defined
            # below is right, set it as thus and vice versa... The current configuration fits the settings as at
            # Feb 20,2023
            supposed_product_in_focus_currency = product_in_focus_current_price[-1][-1]
            product_in_focus_currency = ''


            if supposed_product_in_focus_currency not in '0123456789' and len(supposed_product_in_focus_currency) <= 3:
                product_in_focus_currency = product_in_focus_current_price[-1]
                product_in_focus_current_price = product_in_focus_current_price[0][1:] # !! could change if website code changes

            if 'EUR' in product_in_focus_currency:
                product_in_focus_current_price = product_in_focus_current_price.replace(',', '.')
            else:
                product_in_focus_current_price = product_in_focus_current_price.replace(',', '')


            product_in_focus_current_price_float = float(product_in_focus_current_price)

            # defining product's name
            product_in_focus_product_name = product_name[countLinkNumber]

        except:
            raise Exception('There was an error while: \n '
                            'a. converting current price string to float, \n'
                            )


        if product_in_focus_current_price_float < least_product_price_to_display:
            product_link.pop(countLinkNumber)
            image_link.pop(countLinkNumber)
            product_name.pop(countLinkNumber)
            current_price.pop(countLinkNumber)

            # print(f'length of each column: {len(product_link)}, {len(image_link)}, {len(product_name)}, {len(brand_name)}, {len(original_price)}, {len(discount_price)}, {len(current_price)}')

        # 2.a
        elif type(productLink) != str:
            raise Exception(f'PRODUCT LINK IN ROW {countLinkNumber} IS NOT A STRING')
            # remove_row = livwatches_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
            # print(remove_row)

        # 2.b
        elif type(imageLink) != str:
            raise Exception(f"PRODUCT'S IMAGE LINK IN ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_in_focus_product_name) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        else:
            # defining and setting product's link
            product_in_focus_product_link = product_link[countLinkNumber] + ref_link
            product_link[countLinkNumber] = product_in_focus_product_link

            # defining and setting product's image link
            product_in_focus_image_link = 'https:' + imageLink
            image_link[countLinkNumber] = product_in_focus_image_link
            # print(f'product_link[countLinkNumber]: {image_link[countLinkNumber]}')

            # defining and setting product name
            # product_in_focus_product_name = product_in_focus_product_name.replace('\n', ' ')  # !!
            # product_name[countLinkNumber] = product_in_focus_product_name

            print(f'product_in_focus_currency: {product_in_focus_currency}')

            # define currency symbol and current price
            if (product_in_focus_currency == 'SGD'):
                product_in_focus_currency = 'S$'
            elif (product_in_focus_currency == 'AED'):
                product_in_focus_currency = 'AED'
            elif (product_in_focus_currency == 'USD'):
                product_in_focus_currency = '$'
            elif (product_in_focus_currency == 'GBP'):
                product_in_focus_currency = '£'
            elif (product_in_focus_currency == 'EUR'):
                product_in_focus_currency = '€'
            else:
                raise Exception("There was an error while parsing product's currency")

            # current_price[countLinkNumber] = product_in_focus_currency + f'{product_in_focus_current_price:.2f}'

            # defining and setting current product's price
            product_in_focus_price = product_in_focus_currency + f'{product_in_focus_current_price_float:,.2f}'  # !!
            current_price[countLinkNumber] = product_in_focus_price

        countLinkNumber += 1

    # livwatches_scrapped_data['currentPrice'] = current_price

    livwatches_scrapped_data = livwatches_scrapped_data[
        ['productLink', 'productImage-src', 'productName', 'currentPriceOriginalPrice']
    ]

    livwatches_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'Price']

    livwatches_scrapped_data['productLink'] = product_link
    livwatches_scrapped_data['Image Src'] = image_link
    livwatches_scrapped_data['Title'] = product_name
    livwatches_scrapped_data['Price'] = current_price

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    livwatches_scrapped_data.dropna(inplace=True)
    livwatches_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_livwatches = livwatches_scrapped_data

    print(cleaned_up_scraped_data_livwatches)

    # cleaned_up_scraped_data_livwatches['currentPrice'] = [float(i.split(" ")[-1][1:].replace(",", "")) for i in
    #                                        cleaned_up_scraped_data_livwatches['currentPrice']]
#
    # print()

    # GROUPING CLEANUP_UP livwatches DATA WITH BRAND NAME AND CURRENTPRICE
    # grouped_data = cleaned_up_scraped_data_livwatches[['productName', 'brandName', 'currentPrice']]. \
    #     groupby(['brandName'], as_index=False).agg(lambda x: len(x))
    # grouped_data = grouped_data.sort_values('productName', ascending=False)
    # print('NUMBER OF PRODUCTs PER BRAND AFTER CLEAN UP')
    # print(grouped_data)


    # print(grouped_data)

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_livwatches.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of items before clean up : {len_before_filtering}")
    print(f'num of items after_initial_drop_na: {len_after_initial_drop_na}')
    print(f"num of items removed from livwatches's scrapped data: {num_items_removed_from_list}")

    cleaned_up_scraped_data_livwatches.to_csv(f'{all_filtered_data_folder}{file_name[:-4]}_FILTERED.csv', index=False)

    # wx upload if cleaned dataframe is not empty and wx upload parameter has been set to true
    if len_after_filtering > 0 and is_wx_upload == True:

        extract_elements_per_row_from_dataframe(
            file_name=file_name[:-4], # to remove '.csv'
            dataframe=cleaned_up_scraped_data_livwatches,
            is_continue_daily_upload_if_any= is_continue_from_previous_stop_csv
        )

    return len(cleaned_up_scraped_data_livwatches.index)

# try:
#     filter_livwatches_scraped_data(
#         file_address=f'{all_scraped_data_folder}two_SINGAPORE_WATCHES_LIVWATCHES_REBEL_AR_SEBRING_MEN_ONLY.csv',
#         minimum_profit_target=100,
#         commission_per_sale=.2,
#         ref_link=''
#     )
# except:
#     raise Exception('There was an error while trying to filters livwatches scrapped data')