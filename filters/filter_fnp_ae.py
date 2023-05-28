import random
import urllib.parse

from operations.short.shorten_url import shorten_url_filters
from settings.q.pd_settings import *


from operations.wx.bcknd.bcknd import extract_elements_per_row_from_dataframe

from settings.q.default_folder_and_filename_settings import \
    all_filtered_data_folder, all_scraped_data_folder

'''productLink, image, name, brandname, description, currentprice'''

def filter_fnp_ae_scraped_data(
        file_name,
        file_address,
        minimum_profit_target,
        commission_per_sale,
        is_continue_from_previous_stop_csv = False,
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
    fnp_ae_scrapped_data = pd.read_csv(file_address)

    fnp_ae_scrapped_data_columns = fnp_ae_scrapped_data.columns
    # print(f'fnp_ae_scrapped_data_columns: {fnp_ae_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        fnp_ae_scrapped_data = fnp_ae_scrapped_data[
            ['productLink', 'productImage-src', 'productName', 'currency', 'currentPriceOriginalPrice']
        ] # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')


    # print(fnp_ae_scrapped_data.head(70))

    len_before_filtering = len(fnp_ae_scrapped_data.index)

    # print(fnp_ae_scrapped_data)


    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    fnp_ae_scrapped_data = fnp_ae_scrapped_data.dropna()
    fnp_ae_scrapped_data.reset_index(drop=True, inplace=True)

    len_after_initial_drop_na = len(fnp_ae_scrapped_data.index)


    # print(fnp_ae_scrapped_data)

    # accounting for starting points especially after initial na drop (if any)
    fnp_ae_scrapped_data = fnp_ae_scrapped_data[starting_index:]


    # CLEANING UP
    print()
    product_link = fnp_ae_scrapped_data['productLink'].copy()
    image_link = fnp_ae_scrapped_data['productImage-src']
    product_name = fnp_ae_scrapped_data['productName']
    product_currency = fnp_ae_scrapped_data['currency']
    current_price = fnp_ae_scrapped_data['currentPriceOriginalPrice'].copy()
    # print(product_link)

    # 1. FILTER OUT A PRODUCT IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR IF THE NUMBER OF PEOPLE WHO
    #    HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.

    countLinkNumber = starting_index


    for productLink, imageLink in zip(product_link, image_link):


        # 1.
        try:
            # converting current price string to float
            product_in_focus_current_price_str = current_price[countLinkNumber]
            # product_in_focus_current_price = product_in_focus_current_price[1:] # !!
            # product_in_focus_current_price = product_in_focus_current_price.replace(',','')  # extract the price without currency symbol !!
            product_in_focus_current_price_float = float(product_in_focus_current_price_str)

            # print(f'product_in_focus_current_price" {product_in_focus_current_price}')

            # defining product's name
            product_in_focus_name = product_name[countLinkNumber]

            # defining product's currency
            product_in_focus_currency = product_currency[countLinkNumber]

        except:
            raise Exception('There was an error while: \n '
                            'a. converting current price string to float, \n'
                            )


        if product_in_focus_current_price_float < least_product_price_to_display:
            product_link.pop(countLinkNumber)
            image_link.pop(countLinkNumber)
            product_name.pop(countLinkNumber)
            current_price.pop(countLinkNumber)

        # 2.a
        elif type(productLink) != str:
            raise Exception(f'PRODUCT LINK IN ROW {countLinkNumber} IS NOT A STRING')
            # remove_row = fnp_ae_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
            # print(remove_row)

        # 2.b
        elif type(imageLink) != str:
            raise Exception(f"PRODUCT'S IMAGE LINK IN ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_in_focus_name) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_in_focus_currency) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        # 3.
        else:

            try:

                try:
                    # defining and setting the current product's link
                    product_in_focus_product_link = product_link[countLinkNumber]
                    product_in_focus_product_link = 'https://fnp.ae' + product_in_focus_product_link + ref_link
                    product_link[countLinkNumber] = product_in_focus_product_link
                except:
                    raise Exception("There was an error while defining and setting the product's link")


                # define currency symbol
                if (product_in_focus_currency == 'SGD'):
                    product_in_focus_currency = 'S$'
                elif (product_in_focus_currency == 'AED'):
                    product_in_focus_currency = 'AED '
                elif (product_in_focus_currency == 'USD'):
                    product_in_focus_currency = '$'
                # elif (product_in_focus_currency == 'GBP'):
                #     product_in_focus_currency = '£'
                else:
                    raise Exception("There was an error while parsing product's currency")

                # defining and setting current product's price
                product_in_focus_price = product_in_focus_currency + f'{product_in_focus_current_price_float:,.2f}'  # !!


                current_price[countLinkNumber] = product_in_focus_price

            except:
                raise Exception("There was an error while cleaning up product's link and price")

        countLinkNumber += 1

    # adding new columns - (with existing columns values)
    fnp_ae_scrapped_data['productLinkScraped'] = product_link
    fnp_ae_scrapped_data['productLinkCJ'] = product_link

    fnp_ae_scrapped_data['Image Src Scraped'] = image_link
    fnp_ae_scrapped_data['image Src With Affiliate Link'] = image_link



    fnp_ae_scrapped_data.columns = \
        ['productLinkScraped', 'productLinkCJ', 'productLink', 'Image Src Scraped', 'image Src With Affiliate Link', 'Image Src', 'Title', 'currency', 'Price']

    # CJ prefix
    cj_deep_link_fnp = ['https://www.anrdoezrs.net/click-100782564-15115801?url=',
                        'https://www.kqzyfj.com/click-100782564-15115801?url=',
                        'https://www.jdoqocy.com/click-100782564-15115801?url=',
                        'https://www.dpbolvw.net/click-100782564-15115801?url=',
                        'https://www.tkqlhce.com/click-100782564-15115801?url='
                        ]

    fnp_ae_scrapped_data['productLinkScraped'] = product_link
    fnp_ae_scrapped_data['productLink With Affiliate Link'] = [f'{cj_deep_link_fnp[random.randint(0, 4)]}{urllib.parse.quote_plus(url)}' for url in product_link]
    fnp_ae_scrapped_data['Image Src Scraped'] = image_link
    fnp_ae_scrapped_data['image Src With Affiliate Link'] = [f'{cj_deep_link_fnp[random.randint(0, 4)]}{urllib.parse.quote_plus(url)}' for url in image_link]
    fnp_ae_scrapped_data['productLink'] = ['yet to be computed' for link in product_link]
    fnp_ae_scrapped_data['Image Src'] = ['yet to be computed' for link in image_link]
    fnp_ae_scrapped_data['Title'] = product_name
    fnp_ae_scrapped_data['currency'] = current_price
    fnp_ae_scrapped_data['Price'] = current_price

    # scraped data before link shortening

    fnp_ae_scrapped_data = fnp_ae_scrapped_data[
        ['productLinkScraped', 'Image Src Scraped',
         'productLink With Affiliate Link', 'productLink',
         'image Src With Affiliate Link', 'Image Src',
         'Title',
         'Price'
         ]
    ]

    print('SCRAPPED DATA - PRE LINKS SHORTENING')
    print(fnp_ae_scrapped_data)

    # SHORTEN LINKS?
    # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    print()
    is_shorten_link = input(f'Would you like shorten links for the following scraped file:\n'
                            f'{file_name}? y/n?\n\n')

    if is_shorten_link == 'y':

        shorten_url_filters(
            file_name= file_name,
            processed_dataframe_with_affiliate_product_and_image_links=fnp_ae_scrapped_data
        )

    elif is_shorten_link == 'n':

        pass

    # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    print()
    print()
    print('SCRAPPED DATA - POST LINKS SHORTENING QUERY')

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    fnp_ae_scrapped_data.dropna(inplace=True)
    fnp_ae_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_fnp_ae = fnp_ae_scrapped_data

    print(f'{cleaned_up_scraped_data_fnp_ae}')

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_fnp_ae.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of items before clean up : {len_before_filtering}")
    print(f'num of items after_initial_drop_na: {len_after_initial_drop_na}')
    print(f"num of items removed from fnp_ae's scrapped data: {num_items_removed_from_list}")

    cleaned_up_scraped_data_fnp_ae.to_csv(f'{all_filtered_data_folder}{file_name[:-4]}_FILTERED.csv', index=False)

    # EXTRACT ROWS AND UPLOAD?
    # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    # wx upload if cleaned dataframe is not empty and wx upload parameter has been set to true
    if is_shorten_link == 'y':

        print()
        is_extract_and_upload_rows = input(
            f'Would you like to extract and upload rows for the following scraped file:\n'
            f'{file_name}? y/n\n\n')

        if is_extract_and_upload_rows == 'y':

            if len_after_filtering > 0 and is_wx_upload == True:
                extract_elements_per_row_from_dataframe(
                    file_name=file_name[:-4],  # to remove '.csv'
                    dataframe=cleaned_up_scraped_data_fnp_ae,
                    is_continue_daily_upload_if_any=is_continue_from_previous_stop_csv
                )

        else:

            print()
            print(f"UPLOAD OPERATION FOR '{file_name}' WAS NOT ATTEMPTED FROM YOUR CHOICE!")

    else:

        print()
        print(f"UPLOAD OPERATION FOR '{file_name}' WAS NOT ATTEMPTED BECAUSE LINKS HAVE NOT BEEN SHORTENED!")

    # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    return len(cleaned_up_scraped_data_fnp_ae.index)

try:
    filter_fnp_ae_scraped_data(
        file_name= 'fourty_seven_UAE_FLOWER_FNP_AE_MEN_ONLY',
        file_address=f'{all_scraped_data_folder}fourty_seven_UAE_FLOWER_FNP_AE_MEN_ONLY.csv',
        minimum_profit_target=0,
        commission_per_sale=.0615,
        ref_link='?refs'
    )
except:
    raise Exception('There was an error while trying to filters fnp_ae scrapped data')


