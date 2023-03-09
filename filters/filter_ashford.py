from settings.q.pd_settings import *

from settings.q.default_folder_and_filename_settings import all_filtered_data_folder


'''productLink, image, name, brandname, description, currentprice'''

def filter_ashford_scraped_data(
        file_name,
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
    ashford_scrapped_data = pd.read_csv(file_address)

    ashford_scrapped_data_columns = ashford_scrapped_data.columns
    #print(f'ashford_scrapped_data_columns: {ashford_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        ashford_scrapped_data = ashford_scrapped_data[
            ['productLink-href', 'productImage-src', 'productName', 'curentPriceDiscountPrice']
        ] # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')


    # print(ashford_scrapped_data.head(70))

    len_before_filtering = len(ashford_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    ashford_scrapped_data = ashford_scrapped_data.dropna()
    ashford_scrapped_data.reset_index(drop=True, inplace=True)

    len_after_initial_drop_na = len(ashford_scrapped_data.index)

    # CLEANING UP
    print()
    product_link = ashford_scrapped_data['productLink-href']
    image_link = ashford_scrapped_data['productImage-src']
    product_name = ashford_scrapped_data['productName']
    current_price = ashford_scrapped_data['curentPriceDiscountPrice']
    # print(product_link)

    # 1. FILTER OUT A PRODUCT IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR IF THE NUMBER OF PEOPLE WHO
    #    HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.

    countLinkNumber = 0


    for productLink, imageLink in zip(product_link, image_link):

        # 1.
        try:
            # converting current price string to float
            product_in_focus_current_price = current_price[countLinkNumber]
            product_in_focus_current_price = product_in_focus_current_price[1:] # !!
            product_in_focus_current_price = product_in_focus_current_price.replace(',','')  # extract the price without currency symbol !!
            product_in_focus_current_price = float(product_in_focus_current_price)

            # print(f'product_in_focus_current_price" {product_in_focus_current_price}')

            # defining product's name
            product_in_focus_productName = product_name[countLinkNumber]

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
            raise Exception(f'PRODUCT LINK IN ROW {countLinkNumber} IS NOT A STRING')
            # remove_row = ashford_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
            # print(remove_row)

        # 2.b
        elif type(imageLink) != str:
            raise Exception(f"PRODUCT'S IMAGE LINK IN ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_in_focus_productName) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        # 3.
        else:
            try:
                # defining and setting product name
                product_in_focus_productName = product_in_focus_productName.replace('\n', ' ')  # !!
                product_name[countLinkNumber] = product_in_focus_productName

                # defining and setting product link
                product_in_focus_product_link = product_link[countLinkNumber] + ref_link
                product_link[countLinkNumber] = product_in_focus_product_link

            except:
                raise Exception("There was an error while defining up product's name and setting product link")

        countLinkNumber += 1

    ashford_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'Price']

    ashford_scrapped_data['productLink'] = product_link
    ashford_scrapped_data['Image Src'] = image_link
    ashford_scrapped_data['Title'] = product_name
    ashford_scrapped_data['Price'] = current_price

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    ashford_scrapped_data.dropna(inplace=True)
    ashford_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_ashford = ashford_scrapped_data

    print(f'{cleaned_up_scraped_data_ashford}')

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_ashford.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of items before clean up : {len_before_filtering}")
    print(f'num of items after_initial_drop_na: {len_after_initial_drop_na}')
    print(f"num of items removed from ashford's scrapped data: {num_items_removed_from_list}")

    cleaned_up_scraped_data_ashford.to_csv(f'{all_filtered_data_folder}{file_name[:-4]}_FILTERED.csv', index=False)

    return len(cleaned_up_scraped_data_ashford.index)

# try:
#     filter_ashford_scraped_data(
#         file_address='/Users/admin/Downloads/ashford_product_minimized.xlsx',
#         minimum_profit_target=150,
#         commission_per_sale=.04,
#         ref_link='?refs'
#     )
# except:
#     raise Exception('There was an error while trying to filters ashford scrapped data')
