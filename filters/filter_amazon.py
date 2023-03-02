import pandas as pd
from settings.pd_settings import *

'''productLink, image, name, brandname, description, currentprice'''

def filter_amazon_scraped_data(
        file_address,
        minimum_profit_target,
        commission_per_sale,
        minimum_ratedBy = 2,
        ref_link = ''
):

    if type(file_address) != str and \
            type(minimum_profit_target) != float and \
            type(commission_per_sale) != float:
        raise Exception("1. 'file_address' should be a string \n"
                        "2. 'minimum_profit_target' and 'commission_per_sale' should be numbers")

    least_product_price_to_display = (minimum_profit_target / (commission_per_sale * 100)) * 100

    # CLEAN UP AND FILTER SECTION
    amazon_scrapped_data = pd.read_csv(file_address)

    amazon_scrapped_data_columns = amazon_scrapped_data.columns
    #print(f'amazon_scrapped_data_columns: {amazon_scrapped_data_columns}')

    # ESSENTIAL DATA -> UNFILTERED
    try:
        amazon_scrapped_data = amazon_scrapped_data[
            ['productLink-href', 'productImage', 'productName', 'productRating', 'ratedBy', 'curentPriceDiscountPrice']
        ]  # !!
    except:
        raise Exception('There was an error while trying to create essential data sheet')

    # print(amazon_scrapped_data.head(70))

    len_before_filtering = len(amazon_scrapped_data.index)

    # DROPPING ALL PRODUCTS THAT DO NOT HAVE a product link, product image, product name or current price
    amazon_scrapped_data = amazon_scrapped_data.dropna()
    amazon_scrapped_data.reset_index(drop=True, inplace=True)

    # CLEANING UP 'productLink' and 'productImage' after removing products whose price have not been presented
    print()
    product_link = amazon_scrapped_data['productLink-href']
    image_link = amazon_scrapped_data['productImage']
    product_name = amazon_scrapped_data['productName']
    product_rating = amazon_scrapped_data['productRating']
    rated_by = amazon_scrapped_data['ratedBy']
    current_price = amazon_scrapped_data['curentPriceDiscountPrice']
    # print(product_link)

    # 1. FILTER OUT A PRODUCT AND MOVE TO THE NEXT ONE IF IT'S PRICE IS LESSER THAN THE LEAST PRICE TO DISPLAY OR
    #    IF THE NUMBER OF PEOPLE WHO HAVE RATED THE PRODUCT IS LESSER THAN THE MINIMUM 'ratedBy'
    # 2. IF A ('SUPPOSED') LINK IN THE PRODUCT LINK OR PRODUCT IMAGE COLUMN IS NOT A STRING, RAISE AN EXCEPTION.
    #    DO THE SAME IF THE PRODUCT'S NAME IS NOT A STRING.
    # 3. FILTER OUT UNNECESSARY STRING TO MAKE SPACE FOR THE RIGHT LINK STRING BY:
    #   a. REMOVING EVERY CHARACTER FROM '/ref' in the 'productLink-href' column
    #   b. MAKING ONLY ONE LINK AVAILABLE WITHIN THE 'productImage' column

    countLinkNumber = 0


    for productLink, imageLink in zip(product_link, image_link):

        try:
            # converting current price string to float
            product_in_focus_current_price = current_price[countLinkNumber][1:].replace(',','')  # extract the price without currency symbol !!
            product_in_focus_current_price = float(product_in_focus_current_price)

            # setting product rating
            product_in_focus_product_rating = product_rating[countLinkNumber]
            product_in_focus_product_rating = product_in_focus_product_rating[0:3]
            product_rating[countLinkNumber] = product_in_focus_product_rating

            # cleaning up 'ratedBy'
            product_in_focus_rated_by = rated_by[countLinkNumber]
            product_in_focus_rated_by = product_in_focus_rated_by[1:-1].replace(',', '')
            product_in_focus_rated_by = int(product_in_focus_rated_by)
            rated_by[countLinkNumber] = product_in_focus_rated_by
            # print(product_in_focus_rated_by)

            # print(f'product_in_focus_current_price" {product_in_focus_current_price}')
        except:
            raise Exception('There was an error while: \n '
                            'a. converting current price string to float, \n'
                            'b. setting product rating and \n'
                            'c. cleaning up rated by data'
                            )

        # 1
        if product_in_focus_current_price < least_product_price_to_display or product_in_focus_rated_by < minimum_ratedBy:
            product_link.pop(countLinkNumber)
            image_link.pop(countLinkNumber)
            product_name.pop(countLinkNumber)
            product_rating.pop(countLinkNumber)
            rated_by.pop(countLinkNumber)
            current_price.pop(countLinkNumber)

        # 2.a
        elif type(productLink) != str:
            raise Exception(f'PRODUCT LINK AT ROW {countLinkNumber} IS NOT A STRING')
            # remove_row = amazon_scrapped_data.drop(axis=0, index=countLinkNumber, inplace=True)
            # print(remove_row)

        # 2.b
        elif type(imageLink) != str:
            raise Exception(f"PRODUCT'S IMAGE LINK AT ROW {countLinkNumber} IS NOT A STRING")

        # 2.c
        elif type(product_name[countLinkNumber]) != str:
            raise Exception(f"PRODUCT'S NAME IN ROW {countLinkNumber} IS NOT A STRING")

        # 3
        else:

            link_in_focus_productLink = product_link[countLinkNumber].replace(' ', '')
            link_in_focus_productImage = image_link[countLinkNumber]

            # 3.a
            # CLEANING UP 'productLink'
            try:
                index_of_slash_ref_productLink = link_in_focus_productLink.index(
                    '/ref')  # REMOVING EVERYTHING AFTER  '/ref' !!
                every_char_before_slash_ref = link_in_focus_productLink[:index_of_slash_ref_productLink]
                # print(every_char_before_slash_ref)
                link_in_focus_productLink = every_char_before_slash_ref
                product_link[countLinkNumber] = link_in_focus_productLink + ref_link
                # print(product_link)
            except:
                raise Exception("THERE WAS AN ERROR WHILE FILTERING 'productLink")

            # 3.b
            # CLEANING UP 'productImage'
            try:
                link_in_focus_productImage = link_in_focus_productImage.split(' ')  # SPLIT WITH EMPTY SPACE !!
                link_in_focus_productImage = \
                    [item for item in link_in_focus_productImage
                     if item.startswith('http') and len(item) > len('https://')]  # EVERY STRING THAT'S NOT A LINK !!
                # print(link_in_focus_productImage)

                index_of_product_image_to_use = -1  # !!

                if len(link_in_focus_productImage) > 0:
                    image_link[countLinkNumber] = link_in_focus_productImage[index_of_product_image_to_use]
            except:
                raise Exception("THERE WAS AN ERROR WHILE FILTERING 'productImage")

        countLinkNumber += 1

    amazon_scrapped_data.columns = \
        ['productLink', 'Image Src', 'Title', 'productRating', 'ratedBy', 'Price']

    amazon_scrapped_data['productLink'] = product_link
    amazon_scrapped_data['Image Src'] = image_link
    amazon_scrapped_data['Title'] = product_name
    amazon_scrapped_data['productRating'] = product_rating
    amazon_scrapped_data['ratedBy'] = rated_by
    amazon_scrapped_data['Price'] = current_price

    # DROPPING ALL PRODUCTS THAT DO HAVE a price that's lower than the price required to hit 'minimum_profit_target'
    amazon_scrapped_data.dropna(inplace=True)
    amazon_scrapped_data.reset_index(drop=True, inplace= True)

    cleaned_up_scraped_data_amazon = amazon_scrapped_data

    cleaned_up_scraped_data_amazon.to_csv(r'/Users/admin/Downloads/amazon_product_cleaned.csv', index=False)

    # NUMBER OF ITEMS THAT HAVE BEEN REMOVED FROM THE LIST
    len_after_filtering = len(cleaned_up_scraped_data_amazon.index)
    num_items_removed_from_list = len_before_filtering - len_after_filtering

    print()
    print(f"num of item before clean up : {len_before_filtering}")
    print(f"num of items removed from amazon's scrapped data: {num_items_removed_from_list}")

    return cleaned_up_scraped_data_amazon


# try:
#     filter_amazon_scraped_data(
#         file_address='/Users/admin/Downloads/amazon_product_minimized.xlsx',
#         minimum_profit_target=120,
#         commission_per_sale=.05,
#         minimum_ratedBy=3,
#         ref_link=''
#     )
# except:
#     raise Exception('There was an error while trying to filters amazon scrapped data')