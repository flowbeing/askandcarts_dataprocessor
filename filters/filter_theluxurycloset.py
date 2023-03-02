import pandas as pd

'''productLink, image, name, brandname, description, currentprice'''

def filter_theluxurycloset_scraped_data(
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
    theluxurycloset_scrapped_data = pd.read_excel(file_address)

    theluxurycloset_scrapped_data_columns = theluxurycloset_scrapped_data.columns
    print(f'theluxurycloset_scrapped_data_columns: {theluxurycloset_scrapped_data_columns}')


    # ESSENTIAL DATA -> UNFILTERED
    try:
        theluxurycloset_scrapped_data = theluxurycloset_scrapped_data[
            ['productLink-href', 'productImage-src', 'productName', 'brandName', 'onlyPriceOriginalPrice', 'curentPriceDiscountPrice',
             'currentPriceBestOffer']
        ] # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')

    # DROPPING ALL EMPTY DATA
    # theluxurycloset_scrapped_data.dropna(inplace=True)
    # theluxurycloset_scrapped_data.reset_index(drop=True, inplace=True)

    # print(theluxurycloset_scrapped_data.head(70))

    len_before_filtering = len(theluxurycloset_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    # theluxurycloset_scrapped_data = theluxurycloset_scrapped_data.dropna()
    # theluxurycloset_scrapped_data.reset_index(drop=True, inplace=True)

    # CLEANING UP
    print()
    product_link = theluxurycloset_scrapped_data['productLink-href']
    image_link = theluxurycloset_scrapped_data['productImage-src']
    product_name = theluxurycloset_scrapped_data['productName']
    brand_name = theluxurycloset_scrapped_data['brandName']
    original_price_current_price = theluxurycloset_scrapped_data['onlyPriceOriginalPrice']
    discount_price = theluxurycloset_scrapped_data['curentPriceDiscountPrice']
    best_price = theluxurycloset_scrapped_data['currentPriceBestOffer']


    # print(product_link)


    # 1. FILTER OUT A PRODUCT IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR IF THE NUMBER OF PEOPLE WHO
    #    HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.

    countLinkNumber = 0


    for productLink, imageLink in zip(product_link, image_link):


        # 1.
        try:
            # defining current price (and currency) and converting it to float
            product_in_focus_current_price = ''
            product_in_focus_currency = ''


            # if the following are not empty, set the the current price accordingly
            product_in_focus_original_price_current_price = original_price_current_price[countLinkNumber]
            product_in_focus_discount_price = discount_price[countLinkNumber]
            product_in_focus_best_price = best_price[countLinkNumber]


            if not pd.isnull(product_in_focus_original_price_current_price):
                product_in_focus_current_price = product_in_focus_original_price_current_price
            elif not pd.isnull(product_in_focus_discount_price):
                product_in_focus_current_price = product_in_focus_discount_price
            elif not pd.isnull(product_in_focus_best_price):
                product_in_focus_current_price = product_in_focus_best_price

            # print(type(product_in_focus_current_price))

            # defining supposed currency for current product
            product_in_focus_current_price = product_in_focus_current_price.split(' ')
            supposed_product_in_focus_currency = product_in_focus_current_price[-1]

            product_in_focus_currency = ''

            # if the last character in the supposed position (and length) of product's price currency symbol as defined
            # below is right, set it as thus and vice versa...
            if supposed_product_in_focus_currency[-1] not in '0123456789' and \
                    len(supposed_product_in_focus_currency) <= 3 and \
                    product_in_focus_current_price[0][0] in '0123456789': # if the first item which in this condition is supposed to be a number is a number

                product_in_focus_currency = product_in_focus_current_price[-1]
                product_in_focus_current_price = product_in_focus_current_price[0][0:] # !! could change if website code changes

            elif supposed_product_in_focus_currency[-1] not in '0123456789' and \
                    len(supposed_product_in_focus_currency) <= 3 and \
                    product_in_focus_current_price[0][0] not in '0123456789': # if the first item which in this condition is supposed to be a number is not a number

                product_in_focus_currency = product_in_focus_current_price[-1]
                product_in_focus_current_price = product_in_focus_current_price[0][1:]

            else:
                product_in_focus_currency = product_in_focus_current_price[0][0]
                product_in_focus_current_price = product_in_focus_current_price[0][0:]

            # product_in_focus_current_price = product_in_focus_current_price.split(' ')

            product_in_focus_current_price = product_in_focus_current_price.replace(',', '')
            product_in_focus_current_price_float = float(product_in_focus_current_price)

            # defining product's name
            product_in_focus_product_name = product_name[countLinkNumber]

            # defining product's brand name
            product_in_focus_brand_name = product_name[countLinkNumber]

        except:
            raise Exception('There was an error while: \n '
                            'a. converting current price string to float, \n'
                            )


        if product_in_focus_current_price_float < least_product_price_to_display:
            product_link.pop(countLinkNumber)
            image_link.pop(countLinkNumber)
            product_name.pop(countLinkNumber)
            brand_name.pop(countLinkNumber)
            discount_price.pop(countLinkNumber)
            best_price.pop(countLinkNumber)

            # print(f'length of each column: {len(product_link)}, {len(image_link)}, {len(product_name)}, {len(brand_name)}, {len(original_price)}, {len(discount_price)}, {len(current_price)}')

        # 2.a
        elif type(productLink) != str:
            raise Exception(f'PRODUCT LINK IN ROW {countLinkNumber} IS NOT A STRING')
            # remove_row = theluxurycloset_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
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
            try:
                # defining and setting product's link
                product_in_focus_product_link = product_link[countLinkNumber] + ref_link
                # index_of_qID = product_in_focus_product_link.index('?qID')
                # product_in_focus_product_link = product_in_focus_product_link[:index_of_qID]
                # product_in_focus_product_link = product_in_focus_product_link + ref_link
                product_link[countLinkNumber] = product_in_focus_product_link

                # defining and setting product's image link
                # index_of_id = imageLink.index('.png')
                # product_in_focus_image_link = imageLink[:index_of_id + 4]
                # product_in_focus_image_link = product_in_focus_image_link.split('https://')
                # product_in_focus_image_link = 'https://' + product_in_focus_image_link[-1]
                # image_link[countLinkNumber] = product_in_focus_image_link
                # print(f'product_link[countLinkNumber]: {image_link[countLinkNumber]}')

                # defining and setting product name
                # product_in_focus_product_name = product_in_focus_product_name.replace('\n', ' ')  # !!
                # product_name[countLinkNumber] = product_in_focus_product_name

                # define currency symbol
                if (product_in_focus_currency == 'SGD' ):
                    product_in_focus_currency = 'S$'
                elif (product_in_focus_currency == 'AED'):
                    product_in_focus_currency = 'AED'
                elif (product_in_focus_currency == 'EUR'):
                    product_in_focus_currency = '£'
                elif (product_in_focus_currency == 'USD'):
                    product_in_focus_currency = '$ '
                # elif (product_in_focus_currency == 'GBP'):
                #     product_in_focus_currency = '£'

                best_price[countLinkNumber] = product_in_focus_currency + f'{product_in_focus_current_price_float:,.2f}'


                # defining and setting current product's price
                # product_in_focus_price = product_in_focus_currency + f'{product_in_focus_current_price_float:.2f}'  # !!
                # current_price[countLinkNumber] = product_in_focus_price
            except:
                raise Exception("Error while configuring product's link and product's image link")

        countLinkNumber += 1

    # theluxurycloset_scrapped_data['currentPrice'] = current_price

    theluxurycloset_scrapped_data = theluxurycloset_scrapped_data[
        ['productLink-href', 'productImage-src', 'productName', 'brandName', 'curentPriceDiscountPrice',
             'currentPriceBestOffer']
    ]

    theluxurycloset_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'brandName', 'curentPriceDiscountPrice', 'Price']

    theluxurycloset_scrapped_data['productLink'] = product_link
    theluxurycloset_scrapped_data['Image Src'] = image_link
    theluxurycloset_scrapped_data['Title'] = product_name
    theluxurycloset_scrapped_data['brandName'] = brand_name
    theluxurycloset_scrapped_data['curentPriceDiscountPrice'] = discount_price
    theluxurycloset_scrapped_data['Price'] = best_price


    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    theluxurycloset_scrapped_data.dropna(inplace=True)
    theluxurycloset_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_theluxurycloset = \
        theluxurycloset_scrapped_data[[
            'productLink', 'Image Src', 'Title', 'brandName', 'Price'
        ]]


    print(cleaned_up_scraped_data_theluxurycloset)




    # GROUPING BY BRAND NAME
    # index_of_first_number = 0
    # first_price = cleaned_up_scraped_data_theluxurycloset['currentPrice'][0]
#
    # count = 0
    # for char in first_price:
    #     print(f'char: {char}')
#
    #     if char in '0123456789':
    #         index_of_first_number = count
    #         break
#
    #     count += 1
#
    # cleaned_up_scraped_data_theluxurycloset['currentPrice'] = [float(i[index_of_first_number:].replace(',', '')) for i in
    #                                         cleaned_up_scraped_data_theluxurycloset['currentPrice']]

#
    # print()

    # GROUPING CLEANUP_UP theluxurycloset DATA WITH BRAND NAME AND CURRENTPRICE
    grouped_data = cleaned_up_scraped_data_theluxurycloset[['productName', 'brandName', 'currentPrice']]. \
        groupby(['brandName'], as_index=False).agg(lambda x: len(x))
    grouped_data = grouped_data.sort_values('productName', ascending=False)
    print('NUMBER OF PRODUCTs PER BRAND AFTER CLEAN UP')
    print(grouped_data)


    # print(grouped_data)

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_theluxurycloset.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of item before clean up : {len_before_filtering}")
    print(f"num of items removed from theluxurycloset's scrapped data: {num_items_removed_from_list}")

    return cleaned_up_scraped_data_theluxurycloset


# try:
#     filter_theluxurycloset_scraped_data(
#         file_address='/Users/admin/Downloads/theluxurycloset.xlsx',
#         minimum_profit_target=100,
#         commission_per_sale=.0767,
#         ref_link='?refs'
#     )
# except:
#     raise Exception('There was an error while trying to filters theluxurycloset scrapped data')