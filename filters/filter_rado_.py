import pandas as pd

'''productLink, image, name, brandname, description, currentprice'''

def filter_rado_scraped_data(
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
    rado_scrapped_data = pd.read_excel(file_address)

    rado_scrapped_data_columns = rado_scrapped_data.columns
    print(f'rado_scrapped_data_columns: {rado_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        rado_scrapped_data = rado_scrapped_data[
            ['productLink-href', 'productImage-src', 'productName', 'originalPrice2']
        ] # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')

    # DROPPING ALL EMPTY DATA
    rado_scrapped_data.dropna(inplace=True)
    rado_scrapped_data.reset_index(drop=True, inplace=True)

    # print(rado_scrapped_data.head(70))

    len_before_filtering = len(rado_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    # rado_scrapped_data = rado_scrapped_data.dropna()
    # rado_scrapped_data.reset_index(drop=True, inplace=True)

    # CLEANING UP
    print()
    product_link = rado_scrapped_data['productLink-href']
    image_link = rado_scrapped_data['productImage-src']
    product_name = rado_scrapped_data['productName']
    current_price = rado_scrapped_data['originalPrice2']
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
            product_in_focus_current_price = current_price[countLinkNumber]

            # product_in_focus_current_price = product_in_focus_current_price.split(' ')

            product_in_focus_current_price = product_in_focus_current_price[1:]

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
            # remove_row = rado_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
            # print(remove_row)

        # 2.b
        elif type(imageLink) != str:
            raise Exception(f"PRODUCT'S IMAGE LINK IN ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_in_focus_product_name) != str:
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
                index_of_id = imageLink.index('.png')
                product_in_focus_image_link = imageLink[:index_of_id + 4]
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

    # rado_scrapped_data['currentPrice'] = current_price

    rado_scrapped_data = rado_scrapped_data[
        ['productLink-href', 'productImage-src', 'productName', 'originalPrice2']
    ]

    rado_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'Price']

    rado_scrapped_data['productLink'] = product_link
    rado_scrapped_data['Image Src'] = image_link
    rado_scrapped_data['Title'] = product_name
    rado_scrapped_data['Price'] = current_price

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    rado_scrapped_data.dropna(inplace=True)
    rado_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_rado = rado_scrapped_data

    print(cleaned_up_scraped_data_rado)

    # cleaned_up_scraped_data_rado['currentPrice'] = [float(i.split(" ")[-1][1:].replace(",", "")) for i in
    #                                        cleaned_up_scraped_data_rado['currentPrice']]
#
    # print()

    # GROUPING CLEANUP_UP rado DATA WITH BRAND NAME AND CURRENTPRICE
    # grouped_data = cleaned_up_scraped_data_rado[['productName', 'brandName', 'currentPrice']]. \
    #     groupby(['brandName'], as_index=False).agg(lambda x: len(x))
    # grouped_data = grouped_data.sort_values('productName', ascending=False)
    # print('NUMBER OF PRODUCTs PER BRAND AFTER CLEAN UP')
    # print(grouped_data)


    # print(grouped_data)

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_rado.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of item before clean up : {len_before_filtering}")
    print(f"num of items removed from rado's scrapped data: {num_items_removed_from_list}")

# try:
#     filter_rado_scraped_data(
#         file_address='/Users/admin/Downloads/rado_product_minimized.xlsx',
#         minimum_profit_target=150,
#         commission_per_sale=.05,
#         ref_link='?refs'
#     )
# except:
#     raise Exception('There was an error while trying to filters rado scrapped data')