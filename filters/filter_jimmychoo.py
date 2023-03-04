import pandas as pd

from settings.commissions import *

from settings.pd_settings import *

from settings.default_folder_and_filename_settings import all_scraped_data_folder


'''productLink, image, name, brandname, description, currentprice'''

def filter_jimmychoo_scraped_data(
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
    jimmychoo_scrapped_data = pd.read_csv(file_address)

    jimmychoo_scrapped_data_columns = jimmychoo_scrapped_data.columns
    print(f'jimmychoo_scrapped_data_columns: {jimmychoo_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        jimmychoo_scrapped_data = jimmychoo_scrapped_data[
            ['productLink-href', 'productImage', 'productName', 'originalPrice']
        ] # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')

    # DROPPING ALL EMPTY DATA
    jimmychoo_scrapped_data.dropna(inplace=True)
    jimmychoo_scrapped_data.reset_index(drop=True, inplace=True)

    len_after_initial_drop_na = len(jimmychoo_scrapped_data.index)

    # print(jimmychoo_scrapped_data.head(70))

    len_before_filtering = len(jimmychoo_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    # jimmychoo_scrapped_data = jimmychoo_scrapped_data.dropna()
    # jimmychoo_scrapped_data.reset_index(drop=True, inplace=True)

    # CLEANING UP
    print()
    product_link = jimmychoo_scrapped_data['productLink-href']
    image_link = jimmychoo_scrapped_data['productImage']
    product_name = jimmychoo_scrapped_data['productName']
    current_price = jimmychoo_scrapped_data['originalPrice']
    # print(product_link)


    # 1. FILTER OUT A PRODUCT IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR IF THE NUMBER OF PEOPLE WHO
    #    HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.

    countLinkNumber = 0

    # print(jimmychoo_scrapped_data.head())


    for productLink, imageLink in zip(product_link, image_link):


        # 1.
        try:
            # defining current price and converting it to float
            product_in_focus_current_price = current_price[countLinkNumber]
            product_in_focus_currency_symbol = ''

            # obtaining first number in currency value
            # product_in_focus_current_price = '1,2348AED'
            index_first_number_in_current_price = 0
            index_last_number_in_current_price = 0

            for i in product_in_focus_current_price:
                if i in '0123456789':
                    first_number_in_currency_value = i
                    index_first_number_in_current_price = product_in_focus_current_price.index(
                        first_number_in_currency_value)

                    # print(f'first_number_in_currency_value: {first_number_in_currency_value}')
                    break

            product_in_focus_current_price_reversed = "".join(reversed(product_in_focus_current_price))

            # print(f'product_in_focus_current_price_reversed: {"".join(product_in_focus_current_price_reversed)}')

            for i in product_in_focus_current_price_reversed:
                if i in '0123456789':
                    last_number_in_currency_value = i
                    index_last_number_in_current_price = (-1 * product_in_focus_current_price_reversed.index(
                        last_number_in_currency_value)) + -1

                    break

            # print(f'index_first_number_in_currency_value: {index_first_number_in_current_price}')
            # print(f'index_last_number_in_currency_value: {index_last_number_in_current_price}')
            if index_last_number_in_current_price == -1:

                product_in_focus_currency_symbol = product_in_focus_current_price[:index_first_number_in_current_price]
                product_in_focus_current_price = product_in_focus_current_price[index_first_number_in_current_price:]

            elif index_last_number_in_current_price < -1:

                product_in_focus_currency_symbol = product_in_focus_current_price[index_last_number_in_current_price + 1:]

                product_in_focus_current_price = \
                    product_in_focus_current_price[
                        index_first_number_in_current_price:index_last_number_in_current_price + 1
                    ]
            # print()



            # print(f'product_in_focus_currency_symbol: {product_in_focus_currency_symbol}')
            # print(f'product_in_focus_current_price: {product_in_focus_current_price}')

            current_price[countLinkNumber] = product_in_focus_currency_symbol + product_in_focus_current_price

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
            # remove_row = jimmychoo_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
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

            # defining and setting product's image link if 'f_auto' is present in image link
            if 'f_auto' in imageLink:
                index_of_f_auto = imageLink.index('f_auto')

                every_string_before_f_auto = imageLink[:index_of_f_auto]
                every_string_from_f_auto = imageLink[index_of_f_auto:]
                every_string_after_f_autos_slash = ''

                chars_after_f_auto_until_slash_counter = 0

                for char in every_string_from_f_auto:
                    chars_after_f_auto_until_slash_counter += 1
                    if char == '/':
                        index_of_slash_immediately_after_f_auto = index_of_f_auto + chars_after_f_auto_until_slash_counter
                        every_string_after_f_autos_slash = imageLink[index_of_slash_immediately_after_f_auto:]
                        break

                image_link[countLinkNumber] = every_string_before_f_auto + every_string_after_f_autos_slash

            # defining and setting product name
            product_in_focus_product_name = product_in_focus_product_name.replace('\n', ' ')  # !!
            product_name[countLinkNumber] = product_in_focus_product_name

        countLinkNumber += 1

    jimmychoo_scrapped_data['currentPrice'] = current_price

    jimmychoo_scrapped_data = jimmychoo_scrapped_data[
        ['productLink-href', 'productImage', 'productName', 'originalPrice']
    ]

    jimmychoo_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'Price']

    jimmychoo_scrapped_data['productLink'] = product_link
    jimmychoo_scrapped_data['Image Src'] = image_link
    jimmychoo_scrapped_data['Title'] = product_name
    jimmychoo_scrapped_data['Price'] = current_price

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    jimmychoo_scrapped_data.dropna(inplace=True)
    jimmychoo_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_jimmychoo = jimmychoo_scrapped_data

    print(cleaned_up_scraped_data_jimmychoo)

    # cleaned_up_scraped_data_jimmychoo['currentPrice'] = [float(i.split(" ")[-1][1:].replace(",", "")) for i in
    #                                        cleaned_up_scraped_data_jimmychoo['currentPrice']]
#
    # print()

    # GROUPING CLEANUP_UP jimmychoo DATA WITH BRAND NAME AND CURRENTPRICE
    # grouped_data = cleaned_up_scraped_data_jimmychoo[['productName', 'brandName', 'currentPrice']]. \
    #     groupby(['brandName'], as_index=False).agg(lambda x: len(x))
    # grouped_data = grouped_data.sort_values('productName', ascending=False)
    # print('NUMBER OF PRODUCTs PER BRAND AFTER CLEAN UP')
    # print(grouped_data)


    # print(grouped_data)

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_jimmychoo.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of items before clean up : {len_before_filtering}")
    print(f'num of items after_initial_drop_na: {len_after_initial_drop_na}')
    print(f"num of items removed from jimmychoo's scrapped data: {num_items_removed_from_list}")

    return cleaned_up_scraped_data_jimmychoo

# try:
#     filter_jimmychoo_scraped_data(
#         file_address=f'{all_scraped_data_folder}thirty_SINGAPORE_BAGS_JIMMY_CHOO_MEN_ONLY.csv',
#         minimum_profit_target=130,
#         commission_per_sale=commission_per_site['JIMMY_CHOO'],
#         ref_link=''
#     )
# except:
#     raise Exception('There was an error while trying to filters jimmychoo scrapped data')