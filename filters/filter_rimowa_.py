import pandas as pd

'''productLink, image, name, brandname, description, currentprice'''

def filter_rimowa_scraped_data(
        file_address,
        minimum_profit_target,
        commission_per_sale,
        list_of_brandNames_or_categories_to_exclude = None,
        ref_link = ''
):

    if type(file_address) != str and \
            type(minimum_profit_target) != float and \
            type(commission_per_sale) != float:
        raise Exception("1. 'file_address' should be a string \n"
                        "2. 'minimum_profit_target' and 'commission_per_sale' should be numbers")

    least_product_price_to_display = (minimum_profit_target / (commission_per_sale * 100)) * 100

    # CLEAN UP AND FILTER SECTION
    rimowa_scrapped_data = pd.read_csv(file_address)

    rimowa_scrapped_data_columns = rimowa_scrapped_data.columns
    print(f'rimowa_scrapped_data_columns: {rimowa_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        rimowa_scrapped_data = rimowa_scrapped_data[
            ['productLink-href', 'productImage-src', 'productName', 'brandName', 'currentPriceOriginalPrice']
        ] # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')

    # DROPPING ALL EMPTY DATA
    rimowa_scrapped_data.dropna(inplace=True)
    rimowa_scrapped_data.reset_index(drop=True, inplace=True)

    # print(rimowa_scrapped_data.head(70))

    len_before_filtering = len(rimowa_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    # rimowa_scrapped_data = rimowa_scrapped_data.dropna()
    # rimowa_scrapped_data.reset_index(drop=True, inplace=True)

    # CLEANING UP
    print()
    product_link = rimowa_scrapped_data['productLink-href']
    image_link = rimowa_scrapped_data['productImage-src']
    product_name = rimowa_scrapped_data['productName']
    brand_name = rimowa_scrapped_data['brandName']
    current_price = rimowa_scrapped_data['currentPriceOriginalPrice']
    # print(product_link)


    # 1. FILTER OUT A PRODUCT IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR IF THE NUMBER OF PEOPLE WHO
    #    HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.

    countLinkNumber = 0

    def check_if_item_to_exclude_is_in_string(column_string_item):


        if list_of_brandNames_or_categories_to_exclude != None:

            for item_to_exclude in list_of_brandNames_or_categories_to_exclude:

                if item_to_exclude in column_string_item:
                    return True
                else:
                    return False

        else:
            return False

    for productLink, imageLink in zip(product_link, image_link):


        # 1.
        try:
            # defining current price and converting it to float
            product_in_focus_current_price = current_price[countLinkNumber]

            # product_in_focus_current_price = product_in_focus_current_price.split(' ')

            product_in_focus_current_price = product_in_focus_current_price[1:]

            product_in_focus_current_price = product_in_focus_current_price.replace(',', '')
            product_in_focus_current_price_float = float(product_in_focus_current_price)

            # defining product's name
            product_in_focus_product_name = product_name[countLinkNumber]

            # defining product's brand name
            product_in_focus_brand_name = brand_name[countLinkNumber]


        except:
            raise Exception('There was an error while: \n '
                            'a. converting current price string to float, \n'
                            )


        if product_in_focus_current_price_float < least_product_price_to_display or \
                check_if_item_to_exclude_is_in_string(product_in_focus_brand_name):
            product_link.pop(countLinkNumber)
            image_link.pop(countLinkNumber)
            product_name.pop(countLinkNumber)
            brand_name.pop(countLinkNumber)
            current_price.pop(countLinkNumber)

            # print(f'length of each column: {len(product_link)}, {len(image_link)}, {len(product_name)}, {len(brand_name)}, {len(original_price)}, {len(discount_price)}, {len(current_price)}')

        # 2.a
        elif type(productLink) != str:
            raise Exception(f'PRODUCT LINK IN ROW {countLinkNumber} IS NOT A STRING')
            # remove_row = rimowa_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
            # print(remove_row)

        # 2.b
        elif type(imageLink) != str:
            raise Exception(f"PRODUCT'S IMAGE LINK IN ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_in_focus_product_name) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_in_focus_brand_name) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        else:
            try:
                # defining and setting product's link
                product_in_focus_product_link = product_link[countLinkNumber] + ref_link
                # index_of_qID = product_in_focus_product_link.index('?qID')
                # product_in_focus_product_link = product_in_focus_product_link[:index_of_qID]
                # product_in_focus_product_link = product_in_focus_product_link + ref_link
                product_link[countLinkNumber] = product_in_focus_product_link

                # defining and setting product's image link
                # index_of_id = imageLink.index('.png')
                product_in_focus_image_link = 'https://rimowa.com' + imageLink
                # product_in_focus_image_link = product_in_focus_image_link.split('https://')
                # product_in_focus_image_link = 'https://' + product_in_focus_image_link[-1]
                image_link[countLinkNumber] = product_in_focus_image_link
                # print(f'product_link[countLinkNumber]: {image_link[countLinkNumber]}')

                # defining and setting product name
                # product_in_focus_product_name = product_in_focus_product_name.replace('\n', ' ')  # !!
                # product_name[countLinkNumber] = product_in_focus_product_name

                # define currency symbol
                # if (product_in_focus_currency == 'SGD'):
                #     product_in_focus_currency = 'S$'
                # elif (product_in_focus_currency == 'AED'):
                #     product_in_focus_currency = 'AED'
                # elif (product_in_focus_currency == 'USD'):
                #     product_in_focus_currency = '$ '
                # # elif (product_in_focus_currency == 'GBP'):
                # #     product_in_focus_currency = '£'
                # else:
                #     raise Exception("There was an error while parsing product's currency")

                # defining and setting current product's price
                # product_in_focus_price = product_in_focus_currency + f'{product_in_focus_current_price_float:.2f}'  # !!
                # current_price[countLinkNumber] = product_in_focus_price
            except:
                raise Exception("Error while configuring product's link and product's image link")

        countLinkNumber += 1

    # rimowa_scrapped_data['currentPrice'] = current_price

    rimowa_scrapped_data = rimowa_scrapped_data[
        ['productLink-href', 'productImage-src', 'productName','brandName', 'currentPriceOriginalPrice']
    ]

    rimowa_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'category', 'Price']

    rimowa_scrapped_data['productLink'] = product_link
    rimowa_scrapped_data['Image Src'] = image_link
    rimowa_scrapped_data['Title'] = product_name
    rimowa_scrapped_data['category'] = brand_name
    rimowa_scrapped_data['Price'] = current_price

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    rimowa_scrapped_data.dropna(inplace=True)
    rimowa_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_rimowa = rimowa_scrapped_data

    print(cleaned_up_scraped_data_rimowa)

    # cleaned_up_scraped_data_rimowa['currentPrice'] = [float(i.split(" ")[-1][1:].replace(",", "")) for i in
    #                                        cleaned_up_scraped_data_rimowa['currentPrice']]
#
    # print()

    # GROUPING CLEANUP_UP rimowa DATA WITH BRAND NAME AND CURRENTPRICE
    # grouped_data = cleaned_up_scraped_data_rimowa[['productName', 'brandName', 'currentPrice']]. \
    #     groupby(['brandName'], as_index=False).agg(lambda x: len(x))
    # grouped_data = grouped_data.sort_values('productName', ascending=False)
    # print('NUMBER OF PRODUCTs PER BRAND AFTER CLEAN UP')
    # print(grouped_data)


    # print(grouped_data)

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_rimowa.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of item before clean up : {len_before_filtering}")
    print(f"num of items removed from rimowa's scrapped data: {num_items_removed_from_list}")

    return cleaned_up_scraped_data_rimowa

# try:
#     filter_rimowa_scraped_data(
#         file_address='/Users/admin/Downloads/rimowa_product.xlsx',
#         minimum_profit_target=100,
#         commission_per_sale=.05,
#         list_of_brandNames_or_categories_to_exclude = ['LIMITED', 'RIMOWA X'],
#         ref_link='?refs'
#     )
# except:
#     raise Exception('There was an error while trying to filters rimowa scrapped data')