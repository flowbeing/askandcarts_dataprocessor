import pandas as pd
from settings.pd_settings import *

'''productLink, image, name, brandname, description, currentprice'''

def filter_fwrd_scraped_data(
        file_address,
        minimum_profit_target,
        commission_per_sale,
        ref_link = ''
):

    if type(file_address) != str and \
            type(minimum_profit_target) != float and \
            type(commission_per_sale) != float:
        raise Exception("1. 'file_address' should be a string \n"
                        "2. 'minimum_profit_target' and 'commission_per_sale' should be numbers")

    least_product_price_to_display = (minimum_profit_target / (commission_per_sale * 100)) * 100

    # CLEAN UP AND FILTER SECTION
    fwrd_scrapped_data = pd.read_csv(file_address)

    fwrd_scrapped_data_columns = fwrd_scrapped_data.columns
    print(f'fwrd_scrapped_data_columns: {fwrd_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        fwrd_scrapped_data = fwrd_scrapped_data[
            ['productLink-href', 'productImage', 'productName', 'brandName', 'originalPrice', 'curentPriceDiscountPrice']
        ] # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')



    # print(fwrd_scrapped_data.head(70))

    len_before_filtering = len(fwrd_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    # fwrd_scrapped_data = fwrd_scrapped_data.dropna()
    # fwrd_scrapped_data.reset_index(drop=True, inplace=True)

    # CLEANING UP
    print()
    product_link = fwrd_scrapped_data['productLink-href']
    image_link = fwrd_scrapped_data['productImage']
    product_name = fwrd_scrapped_data['productName']
    brand_name = fwrd_scrapped_data['brandName']
    original_price = fwrd_scrapped_data['originalPrice']
    discount_price = fwrd_scrapped_data['curentPriceDiscountPrice']
    current_price = discount_price.copy()
    # print(product_link)


    # 1. FILTER OUT A PRODUCT IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR IF THE NUMBER OF PEOPLE WHO
    #    HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.

    countLinkNumber = 0


    for productLink, imageLink in zip(product_link, image_link):


        # 1.
        try:
            # defining current price and converting it to float
            product_in_focus_original_price = original_price[countLinkNumber]
            product_in_focus_discount_price = discount_price[countLinkNumber]
            product_in_focus_current_price = ''

            # print(product_in_focus_original_price, product_in_focus_discount_price)

            if pd.isnull(product_in_focus_discount_price):
                product_in_focus_current_price = product_in_focus_original_price
                # print(product_in_focus_current_price)

            else:
                product_in_focus_current_price = product_in_focus_discount_price

            product_in_focus_current_price = product_in_focus_current_price.split(' ')
            product_in_focus_current_price = product_in_focus_current_price[-1] # The last element usually is the price
            current_price[countLinkNumber] = product_in_focus_current_price

            # print(f'product_in_focus_current_price: {product_in_focus_current_price}')

            product_in_focus_current_price = product_in_focus_current_price[1:] # !!
            product_in_focus_current_price = product_in_focus_current_price.replace(',','')  # extract the price without currency symbol !!
            product_in_focus_current_price = float(product_in_focus_current_price)

            # print(f'product_in_focus_current_price" {product_in_focus_current_price}')

            # defining product's name
            product_in_focus_product_name = brand_name[countLinkNumber]

            # defining product's brand name
            product_in_focus_brand_name = brand_name[countLinkNumber]

        except:
            raise Exception('There was an error while: \n '
                            'a. converting current price string to float, \n'
                            )


        if product_in_focus_current_price < least_product_price_to_display:
            product_link.pop(countLinkNumber)
            image_link.pop(countLinkNumber)
            product_name.pop(countLinkNumber)
            brand_name.pop(countLinkNumber)
            original_price.pop(countLinkNumber)
            discount_price.pop(countLinkNumber)
            current_price.pop(countLinkNumber)

            # print(f'length of each column: {len(product_link)}, {len(image_link)}, {len(product_name)}, {len(brand_name)}, {len(original_price)}, {len(discount_price)}, {len(current_price)}')

        # 2.a
        elif type(productLink) != str:
            raise Exception(f'PRODUCT LINK IN ROW {countLinkNumber} IS NOT A STRING')
            # remove_row = fwrd_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
            # print(remove_row)

        # 2.b
        elif type(imageLink) != str:
            raise Exception(f"PRODUCT'S IMAGE LINK IN ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_in_focus_product_name) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        elif type(product_in_focus_brand_name) != str:
            raise Exception(f"PRODUCT'S BRAND NAME IN ROW {countLinkNumber} IS NOT A STRING")

        else:
            product_in_focus_product_link = product_link[countLinkNumber]
            product_link[countLinkNumber] = product_in_focus_product_link + ref_link


            # defining product in focus' image link
            product_in_focus_image_link = image_link[countLinkNumber]
            product_in_focus_image_link = product_in_focus_image_link.split(' ')
            product_in_focus_image_link = product_in_focus_image_link[0]
            image_link[countLinkNumber] = product_in_focus_image_link



        countLinkNumber += 1

    fwrd_scrapped_data['currentPrice'] = current_price

    fwrd_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'brandName', 'originalPrice', 'curentPriceDiscountPrice', 'Price']

    fwrd_scrapped_data['productLink'] = product_link
    fwrd_scrapped_data['Image Src'] = image_link
    fwrd_scrapped_data['Title'] = product_name
    fwrd_scrapped_data['brandName'] = brand_name
    fwrd_scrapped_data['originalPrice'] = original_price
    fwrd_scrapped_data['curentPriceDiscountPrice'] = discount_price
    fwrd_scrapped_data['Price'] = current_price

    fwrd_scrapped_data = fwrd_scrapped_data[
        ['productLink', 'Image Src', 'Title', 'brandName', 'Price']
    ]

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    fwrd_scrapped_data.dropna(inplace=True)
    fwrd_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_fwrd = fwrd_scrapped_data

    print(cleaned_up_scraped_data_fwrd)

    cleaned_up_scraped_data_fwrd['Price'] = [float(i.split(" ")[-1][1:].replace(",", "")) for i in
                                           cleaned_up_scraped_data_fwrd['Price']]

    print()

    # GROUPING CLEANUP_UP FWRD DATA WITH BRAND NAME AND CURRENTPRICE
    grouped_data = cleaned_up_scraped_data_fwrd[['Title', 'brandName', 'Price']]. \
        groupby(['brandName'], as_index=False).agg(lambda x: len(x))
    grouped_data = grouped_data.sort_values('Title', ascending=False)
    print('NUMBER OF PRODUCTs PER BRAND AFTER CLEAN UP')
    print(grouped_data)


    # print(grouped_data)

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_fwrd.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of items before clean up : {len_before_filtering}")
    # print(f'num of items after_initial_drop_na: {len_after_initial_drop_na}')
    print(f"num of items removed from fwrd's scrapped data: {num_items_removed_from_list}")

    return cleaned_up_scraped_data_fwrd

# try:
#     filter_fwrd_scraped_data(
#         file_address='/Users/admin/Downloads/fwrd_product_corrected.xlsx',
#         minimum_profit_target=150,
#         commission_per_sale=.06,
#         ref_link='?refs'
#     )
# except:
#     raise Exception('There was an error while trying to filters fwrd scrapped data')