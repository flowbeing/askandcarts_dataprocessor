from settings.q.pd_settings import *

from operations.wx.bcknd import extract_elements_per_row_from_dataframe

from settings.q.default_folder_and_filename_settings import all_filtered_data_folder

'''productLink, image, name, brandname, description, currentprice'''

def filter_anthropologie_scraped_data(
        file_name,
        file_address,
        minimum_profit_target,
        commission_per_sale,
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
    anthropologie_scrapped_data = pd.read_csv(file_address)

    anthropologie_scrapped_data_columns = anthropologie_scrapped_data.columns
    #print(f'anthropologie_scrapped_data_columns: {anthropologie_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        anthropologie_scrapped_data = anthropologie_scrapped_data[
            ['productLink-href', 'productImage-src', 'productName', 'originalPrice']
        ] # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')


    # print(anthropologie_scrapped_data.head(70))

    len_before_filtering = len(anthropologie_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    anthropologie_scrapped_data = anthropologie_scrapped_data.dropna()
    anthropologie_scrapped_data.reset_index(drop=True, inplace=True)

    len_after_initial_drop_na = len(anthropologie_scrapped_data.index)

    # CLEANING UP
    print()
    product_link = anthropologie_scrapped_data['productLink-href']
    image_link = anthropologie_scrapped_data['productImage-src']
    product_name = anthropologie_scrapped_data['productName']
    current_price = anthropologie_scrapped_data['originalPrice'].copy()
    # print(product_link)

    # 1. FILTER OUT A PRODUCT IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR IF THE NUMBER OF PEOPLE WHO
    #    HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.

    countLinkNumber = 0


    for productLink, imageLink in zip(product_link, image_link):

        # 1.
        try:
            # converting and setting current price string to float
            product_in_focus_current_price = current_price[countLinkNumber]
            product_in_focus_current_price = product_in_focus_current_price.split(' ')
            product_in_focus_current_price = product_in_focus_current_price[0]

            current_price[countLinkNumber] = product_in_focus_current_price

            product_in_focus_current_price = product_in_focus_current_price[1:]
            product_in_focus_current_price = product_in_focus_current_price.replace(',','')  # extract the price without currency symbol !!
            product_in_focus_current_price = float(product_in_focus_current_price)

            # current product's name
            product_in_focus_productName = product_name[countLinkNumber]

            # print(f'product_in_focus_current_price" {product_in_focus_current_price}')
        except:
            raise Exception('There was an error while: \n '
                            'a. converting current price string to float, \n'
                            )


        if product_in_focus_current_price < least_product_price_to_display:
            product_link.pop(countLinkNumber)
            image_link.pop(countLinkNumber)
            product_name.pop(countLinkNumber)
            current_price.pop(countLinkNumber)

        # 2.a
        elif type(productLink) != str:
            raise Exception(f'PRODUCT LINK AT ROW {countLinkNumber} IS NOT A STRING')
            # remove_row = anthropologie_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
            # print(remove_row)

        # 2.b
        elif type(imageLink) != str:
            raise Exception(f"PRODUCT'S IMAGE LINK AT ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_in_focus_productName) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        else:
            product_in_focus_product_link = product_link[countLinkNumber] + ref_link
            product_link[countLinkNumber] = product_in_focus_product_link


        countLinkNumber += 1

    anthropologie_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'Price']

    anthropologie_scrapped_data['productLink'] = product_link
    anthropologie_scrapped_data['Image Src'] = image_link
    anthropologie_scrapped_data['Title'] = product_name
    anthropologie_scrapped_data['Price'] = current_price

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    anthropologie_scrapped_data.dropna(inplace=True)
    anthropologie_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_anthropologie = anthropologie_scrapped_data

    print(f'{cleaned_up_scraped_data_anthropologie}')

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_anthropologie.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print()
    print(f"num of items before clean up : {len_before_filtering}")
    print(f'num of items after_initial_drop_na: {len_after_initial_drop_na}')
    print(f"num of items removed from anthropologie's scrapped data: {num_items_removed_from_list}")

    cleaned_up_scraped_data_anthropologie.to_csv(f'{all_filtered_data_folder}{file_name[:-4]}_FILTERED.csv', index=False)

    # wx upload if cleaned dataframe is not empty and wx upload parameter has been set to true
    if len_after_filtering > 0 and is_wx_upload == True:
        extract_elements_per_row_from_dataframe(
            file_name=file_name[:-4],  # to remove '.csv'
            dataframe=cleaned_up_scraped_data_anthropologie
        )

    return len(cleaned_up_scraped_data_anthropologie.index)

# try:
#     filter_anthropologie_scraped_data(
#         file_address='/Users/admin/Downloads/anthropologie_product_corrected.xlsx',
#         minimum_profit_target=200,
#         commission_per_sale=.1,
#         ref_link=''
#     )
# except:
#     raise Exception('There was an error while trying to filters anthropologie scrapped data')