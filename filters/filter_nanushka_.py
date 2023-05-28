from settings.q.pd_settings import *

from operations.wx.bcknd.bcknd import extract_elements_per_row_from_dataframe

from settings.q.default_folder_and_filename_settings import all_filtered_data_folder


'''productLink, image, name, brandname, description, currentprice'''

def filter_nanushka_scraped_data(
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
    nanushka_scrapped_data = pd.read_csv(file_address)

    nanushka_scrapped_data_columns = nanushka_scrapped_data.columns
    print(f'nanushka_scrapped_data_columns: {nanushka_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        nanushka_scrapped_data = nanushka_scrapped_data[
            ['productLink', 'productImage', 'productName', 'brandName', 'currentPriceOriginalPrice']
        ] # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')

    # DROPPING ALL EMPTY DATA
    nanushka_scrapped_data.dropna(inplace=True)
    nanushka_scrapped_data.reset_index(drop=True, inplace=True)

    len_after_initial_drop_na = len(nanushka_scrapped_data.index)

    # print(nanushka_scrapped_data.head(70))

    len_before_filtering = len(nanushka_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    # nanushka_scrapped_data = nanushka_scrapped_data.dropna()
    # nanushka_scrapped_data.reset_index(drop=True, inplace=True)

    # accounting for starting points especially after initial na drop (if any)
    nanushka_scrapped_data = nanushka_scrapped_data[starting_index:]

    # CLEANING UP
    print()
    product_link = nanushka_scrapped_data['productLink']
    image_link = nanushka_scrapped_data['productImage']
    product_name = nanushka_scrapped_data['productName']
    brand_name = nanushka_scrapped_data['brandName']
    current_price = nanushka_scrapped_data['currentPriceOriginalPrice']
    # print(product_link)


    # 1. FILTER OUT A PRODUCT IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR IF THE NUMBER OF PEOPLE WHO
    #    HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.

    countLinkNumber = starting_index


    for productLink, imageLink in zip(product_link, image_link):


        # 1.
        try:
            # defining current price and converting it to float
            product_in_focus_current_price = current_price[countLinkNumber]


            product_in_focus_current_price = product_in_focus_current_price.split(' ')

            print(f'product_in_focus_current_price: {product_in_focus_current_price}')



            # if supposed position of product's price currency symbol as defined below is right,
            # set it as thus or vice versa..
            supposed_product_in_focus_currency = product_in_focus_current_price[-1]
            product_in_focus_current_price_update_str = ''

            if supposed_product_in_focus_currency not in '0123456789':
                product_in_focus_currency = product_in_focus_current_price[-1]

                if len(product_in_focus_current_price) > 2:
                    product_in_focus_current_price_update_str = ','.join(product_in_focus_current_price[0:2])

                product_in_focus_current_price = ''.join(product_in_focus_current_price[:-1]) # !!
            else:
                raise Exception('There was an error while locating currency')


            product_in_focus_current_price_float = float(product_in_focus_current_price)

            product_in_focus_current_price = product_in_focus_current_price.replace(' ', ',')


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
            # remove_row = nanushka_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
            # print(remove_row)

        # 2.b
        elif type(imageLink) != str:
            raise Exception(f"PRODUCT'S IMAGE LINK IN ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_in_focus_product_name) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        else:
            # defining and setting product's price & currency

            # define currency symbol
            # if (product_in_focus_currency == 'SGD'):
            #     product_in_focus_currency = 'S$'
            # elif (product_in_focus_currency == 'AED'):
            #     product_in_focus_currency = 'AED'
            if (product_in_focus_currency == 'USD'):
                product_in_focus_currency = '$'
            elif (product_in_focus_currency == 'EUR'):
                product_in_focus_currency = '€'
            elif (product_in_focus_currency == 'HUF'):
                product_in_focus_currency = 'Ft'
            else:
                raise Exception("There was an error while parsing product's currency")

            current_price[countLinkNumber] = product_in_focus_currency + product_in_focus_current_price_update_str

            # defining and setting product's link
            product_in_focus_product_link = product_link[countLinkNumber] + ref_link
            product_link[countLinkNumber] = product_in_focus_product_link

            # defining and setting product's image link
            # product_in_focus_image_link = imageLink
            # index_of_upload_slash = product_in_focus_image_link.index('upload/')
            # index_of_slash_rowprod = product_in_focus_image_link.index('/ROWPROD')
            # product_in_focus_image_link = imageLink[:index_of_upload_slash + 6] + imageLink[index_of_slash_rowprod:]
            # image_link[countLinkNumber] = product_in_focus_image_link
            # print(f'product_link[countLinkNumber]: {image_link[countLinkNumber]}')

            # defining and setting product name
            product_in_focus_product_name = product_in_focus_product_name.replace('\n', ' ')  # !!
            product_name[countLinkNumber] = product_in_focus_product_name

        countLinkNumber += 1

    nanushka_scrapped_data['currentPrice'] = current_price

    nanushka_scrapped_data = nanushka_scrapped_data[
        ['productLink', 'productImage', 'productName', 'brandName', 'currentPriceOriginalPrice']
    ]

    nanushka_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'brandName', 'Price']

    nanushka_scrapped_data['productLink'] = product_link
    nanushka_scrapped_data['Image Src'] = image_link
    nanushka_scrapped_data['Title'] = product_name
    nanushka_scrapped_data['brandName'] = brand_name
    nanushka_scrapped_data['Price'] = current_price

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    nanushka_scrapped_data.dropna(inplace=True)
    nanushka_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_nanushka = nanushka_scrapped_data

    print(cleaned_up_scraped_data_nanushka)

    # cleaned_up_scraped_data_nanushka['currentPrice'] = [float(i.split(" ")[-1][1:].replace(",", "")) for i in
    #                                        cleaned_up_scraped_data_nanushka['currentPrice']]
#
    # print()

    # GROUPING CLEANUP_UP nanushka DATA WITH BRAND NAME AND CURRENTPRICE
    # grouped_data = cleaned_up_scraped_data_nanushka[['productName', 'brandName', 'currentPrice']]. \
    #     groupby(['brandName'], as_index=False).agg(lambda x: len(x))
    # grouped_data = grouped_data.sort_values('productName', ascending=False)
    # print('NUMBER OF PRODUCTs PER BRAND AFTER CLEAN UP')
    # print(grouped_data)


    # print(grouped_data)

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_nanushka.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of items before clean up : {len_before_filtering}")
    print(f'num of items after_initial_drop_na: {len_after_initial_drop_na}')
    print(f"num of items removed from nanushka's scrapped data: {num_items_removed_from_list}")

    cleaned_up_scraped_data_nanushka.to_csv(f'{all_filtered_data_folder}{file_name[:-4]}_FILTERED.csv', index=False)

    # wx upload if cleaned dataframe is not empty and wx upload parameter has been set to true
    if len_after_filtering > 0 and is_wx_upload == True:

        extract_elements_per_row_from_dataframe(
            file_name=file_name[:-4], # to remove '.csv'
            dataframe=cleaned_up_scraped_data_nanushka,
            is_continue_daily_upload_if_any= is_continue_from_previous_stop_csv
        )

    return len(cleaned_up_scraped_data_nanushka.index)

# try:
#     filter_nanushka_scraped_data(
#         file_address='/Users/admin/Downloads/nanushka_product.xlsx',
#         minimum_profit_target=100,
#         commission_per_sale=.08,
#         ref_link=''
#     )
# except:
#     raise Exception('There was an error while trying to filters nanushka scrapped data')