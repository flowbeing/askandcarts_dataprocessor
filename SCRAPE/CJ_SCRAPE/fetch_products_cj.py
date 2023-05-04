import requests
import json

import pandas as pd

from settings.q.other_settings import cj_pat1, cj_pat2
from settings.q.pd_settings import *

from operations.other_operations.convert_minimum_profit import convert_minimum_profit
from operations.wx.bcknd import *
from settings.q.default_folder_and_filename_settings import all_filtered_data_folder_cj, all_log_files_folder, \
    shorts_progress_log
from settings.q.other_settings import short


def retrieve_cj_data(
        partner_company_name,
        partner_company_id ='0',
        ad_id = '0',
        is_get_products_feed_details = False,
        is_get_products_feed = False,
        is_get_realtime_commissions = False,
        is_get_company_terms = False
        ):

    if is_get_products_feed_details == False \
            and is_get_products_feed == False \
            and is_get_realtime_commissions == False \
            and is_get_company_terms == False:
        raise Exception('Please set one of the following to True: \n'
                        '1. is_get_products_feed_details\n'
                        '2. is_get_products_feed\n'
                        '3. is_get_company_commission\n'
                        '4. is_get_company_terms')
    elif (is_get_products_feed_details == True and is_get_products_feed == True) \
            or (is_get_products_feed_details == True and is_get_realtime_commissions == True) \
            or (is_get_products_feed_details == True and is_get_company_terms == True) \
            or (is_get_products_feed == True and is_get_realtime_commissions == True) \
            or (is_get_products_feed == True and is_get_company_terms == True) \
            or (is_get_realtime_commissions == True and is_get_company_terms == True):
        raise Exception('Please set only one of the following to True: \n'
                        '1. is_get_products_feed_details\n'
                        '2. is_get_products_feed\n'
                        '3. is_get_company_commission\n'
                        '4. is_get_company_terms')


    url = ''

    authorization = f'Bearer {cj_pat2}'

    # 6379318
    
    products_feed_details_query_string =  "{productFeeds(companyId: 6379318, partnerIds: [" + f"{partner_company_id}" + "]) {totalCount, count, resultList { adId, feedName, advertiserId, productCount, advertiserCountry, lastUpdated, advertiserName, language, currency, sourceFeedType}}}"

    # product_feed_query_string = '{products(companyId: "6379318", partnerIds: [' + f"{partner_id}" + ']) {resultList {advertiserId, catalogId, id, title, description, price { amount, currency } linkCode(pid: "100782564") {clickUrl, imageUrl}}}}'

    product_feed_query_string = 'subscription{ shoppingProductCatalog(companyId: 6379318, adId: ' + f'{ad_id}' + ') { id, adId, advertiserId, catalogId, title, description, availability, condition, targetCountry, gender, productType, price { amount, currency }, linkCode(pid: "100782564") {clickUrl, imageUrl}}}' # serviceableAreas

    commission_query_string = '''{ publisherCommissions(forPublishers: ["6379318"], sincePostingDate:"2018-08-08T00:00:00Z",beforePostingDate:"2018-08-09T00:00:00Z"){count payloadComplete records {actionTrackerName websiteName advertiserName postingDate pubCommissionAmountUsd items { quantity perItemSaleAmountPubCurrency totalCommissionPubCurrency } } } }'''

    company_terms_query_string = '{ publisher { contracts(publisherId: "6379318", limit: 1, filters: {advertiserId: "' + f"{partner_company_id}" + '"}) { totalCount count resultList { startTime endTime status advertiserId programTerms { id name specialTerms { name body } isDefault actionTerms { id actionTracker { id name description type } referralPeriod referralOccurrences lockingMethod { type durationInDays } performanceIncentives { threshold { type value } reward { type commissionType value } currency } commissions { rank situation { id name } itemList { id name } promotionalProperties { id name } isViewThrough rate { type value currency } } } } } } } }'


    query_string = ''

    if is_get_products_feed_details == True:

        if partner_company_id == '0':
            raise Exception("Please set the partner's id")

        url = 'https://ads.api.cj.com/query'

        query_string = products_feed_details_query_string

    elif is_get_products_feed:

        if ad_id == '0':
            raise Exception("Please set the adId")

        url = 'https://ads.api.cj.com/query'

        query_string = product_feed_query_string

    elif is_get_realtime_commissions:

        url = 'https://commissions.api.cj.com/query'

        query_string = commission_query_string

    elif is_get_company_terms:

        if partner_company_id == '0':
            raise Exception("Please set the partner's id")

        url = 'https://programs.api.cj.com/query'

        query_string = company_terms_query_string


    req = requests.post(
        url,
        headers={
            'Authorization': f'Bearer {cj_pat2}'
        },
        json={'query': query_string}
    )

    print(f'COMPANY NAME: {partner_company_name}')
    print()
    print(f'req.status_code: {req.status_code}, {type(req.status_code)}')
    print()
    # print(f'req.content: {req.content}')
    print(f'req.text: {req.text}')
    print()
    print(req.reason)

    return_header = req.headers
    print()
    print('RESPONSE HEADERS')
    print('----------------')
    for i in return_header:
        print(f'{i}: {return_header[i]}')

    print('---------------------------------------------------------------------------------')

    return req.text


# add_products_to_table
def add_products_to_table(
        site_name,
        partners_id,
        ad_id,
        is_upload_to_wx = False
):
    # RETRIEVING PROGRAM TERMS, INCLUDING COMMISSION RATE
    program_terms = retrieve_cj_data(
        partner_company_name=site_name,
        partner_company_id=partners_id,
        is_get_company_terms=True,
    )
    program_terms = json.loads(program_terms)
    commission_rate = \
    program_terms['data']['publisher']['contracts']['resultList'][0]['programTerms']['actionTerms'][0]['commissions'][
        0]['rate']['value']

    # RETRIEVING PRODUCT FEED
    products_feeds_result = retrieve_cj_data(
        partner_company_name=site_name,
        partner_company_id=partners_id,
        ad_id= ad_id,
        is_get_products_feed=True
    )

    products_feeds_result = json.loads(products_feeds_result)
    products_feed = products_feeds_result['data']['shoppingProductCatalog']

    print(f'length of product feed: {len(products_feeds_result)}')

    # creating products dictionary to be used in creating products dataframe
    products_feed_dict = {
        'title': [],
        'brandName': [],
        'productCategory': [],
        'gender': [],
        'price': [],
        'commission': [],
        'productLinkCJ': [],
        'productLink': [],
        # 'productLinkShortened': [],
        'imageSrcCJ': [],
        'imageSrc': [],
        # 'imageSrcShortened': [],
        # 'country': [],
        'siteName': []
    }

    # products table dataframe index tracker
    current_index = 0

    # list of links for the current site and their shortened form
    link_shortening_progress = {}

    # GET (LINK SHORTENING) PROGRESS
    with open(f'{all_log_files_folder}{shorts_progress_log}', 'r+') as shorts_progress_log_file:
        shorts_progress_log_json = shorts_progress_log_file.read()
        shorts_progress_log_json_as_dict = json.loads(shorts_progress_log_json)

        last_link_shortening_progress_index_ = shorts_progress_log_json_as_dict.get(site_name, None)

        if last_link_shortening_progress_index_ != None:
            link_shortening_progress = last_link_shortening_progress_index_

        shorts_progress_log_file.close()

    for product in products_feed:

        product_condition = product['condition']
        product_availability = product['availability']
        # determining product commission per sale
        mininum_commission_target_detected_currency = mininimum_commission_as_per_detected_currency(
            product_currency=product['price']['currency'],
            mininum_commission_target_usd=200
        )
        mininum_commission_target_detected_currency_value = list(mininum_commission_target_detected_currency.values())[0]
        mininum_commission_target_detected_currency_symbol = list(mininum_commission_target_detected_currency.keys())[0]
        # print(f'mininum_commission_target_detected_currency: {mininum_commission_target_detected_currency_value}, {mininum_commission_target_detected_currency_symbol}')

        # PRODUCT PRICE
        product_price = f"{product['price']['currency']} {float(product['price']['amount']):,.2f}"

        # PRODUCT COMMISSION
        product_commission = ((float(commission_rate) / 100) * float(product['price']['amount']))

        if (product_condition == 'New' or product_condition == 'new') \
                and product_availability == 'in stock' \
                and product_commission >= mininum_commission_target_detected_currency_value:

            print('------------------------------------------------')
            print('SHORTENING NEW ROW')
            print(product, type(product))
            # DETERMINING ALL OTHER COLUMN VALUES

            # PRODUCT TITLE
            product_title = product['title']

            if ';' in product_title:
                index_of_and_quote = product_title.index(';') + 1
                product_title = product_title[index_of_and_quote:]
            # product_brandName x

            # DETERMINING PRODUCT CATEGORY
            product_category = ''

            if site_name == 'SAMSUNG_UAE':
                product_category = 'LUXURY TECH'

            else:
                product_category = product['productType']

                if len(product_category) != 0:
                    product_category = product['productType'][0].upper()

                    if 'WATCH' in product_category:
                        product_category = 'WATCH'

                    elif 'WALLETS & MONEY CLIPS' in product_category:
                        product_category = 'ACCESSORIES'

                    elif 'ACCESSORIES' in product_category:
                        product_category = 'ACCESSORIES'

                    elif 'SUITCASES' in product_category:
                        product_category = 'TRAVEL_BAG'

                    elif 'BRIEFCASES' in product_category or 'HANDBAGS' in product_category or 'BAGS' in product_category:
                        product_category = 'HANDBAG'

                    elif 'COATS & JACKETS' in product_category or 'CLOTHING' in product_category \
                            or 'COATS & JACKETS' in product_category \
                            or 'DRESSES' in product_category:
                        product_category = 'CLOTHING'

                    elif 'LOAFERS & SLIP-ONS' in product_category:
                        product_category = 'SHOE'

                    elif 'SHOE' in product_category:
                        product_category = 'SHOE'

                    elif 'NECKLACE' in product_category:
                        product_category = 'NECKLACE'

                    elif 'BRACELET' in product_category:
                        product_category = 'BRACELET'

                    elif 'EARRING' in product_category:
                        product_category = 'EARRING'

                    elif 'RING' in product_category:
                        product_category = 'RING'

                    else:
                        product_category = product_category.upper()

                else:
                    product_category = None

            # DEFINING GENDER
            product_gender = product['gender']

            if product_gender != None:
                product_gender = product_gender.upper()
            else:
                product_gender = 'UNISEX'

            # PRODUCT LINK
            product_link = product['linkCode']['clickUrl']

            # PRODUCT LINK SHORTENED
            # first - retrieving shortened links and their relative shorts (short form)
            # print(f'link_shortening_progress: {link_shortening_progress}')
            list_of_short_links_id = list(link_shortening_progress.keys())
            list_of_short_links = list(link_shortening_progress.values())

            product_id = product['id']
            product_links_id = product_id + '-pl'
            image_src_id = product_id + '-is'

            alpha_path = ''
            link_base_count = 1
            short_product_link = ''

            if product_link != '':

                title_copy = f'{product_title}'

                # editing product title so that it can be adapted to 'path'
                for char in title_copy:
                    if char not in 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ':
                        title_copy = title_copy.replace(char, '')

                title_copy.lstrip()
                alpha_path = (title_copy.lower()).replace(' ', '-')
                alpha_path = alpha_path.replace('--', '-')

                if alpha_path[0] == '-':
                    alpha_path = alpha_path[1:]

                link_base_count = 1
                final_pl_path = alpha_path + '-pl' + f'-{str(link_base_count)}'

                code_generated_short_link = 'https://shop.askandcarts.com/' + final_pl_path

                # first generating short link by code to:
                # 1. determine whether the code generated short link already exists so that an upto date path can be
                # generated..
                # 2. have a path to use where short will later be api-generated

                print(f'list_of_short_links_id: {list_of_short_links_id}')
                print(f'list_of_short_links: {list_of_short_links}')

                while list_of_short_links.count(code_generated_short_link) > 0:
                    link_base_count += 1
                    final_pl_path = alpha_path + '-pl' + f'-{str(link_base_count)}'
                    code_generated_short_link = 'https://shop.askandcarts.com/' + final_pl_path
                    print(f'while -> {code_generated_short_link}')

                # if product link's id is (?and not short link, because short link are auto generated and a product
                # link could already have a different short link*) not in the list of already shortened product links
                # id, api-shorten it with the (new) code generated path..
                if list_of_short_links_id.count(product_links_id) < 1:

                    short_product_link = shorten_url(
                        product_title=product_title,
                        product_or_image_link_to_shorten=product_link,
                        path_to_save_shortened_link_to=final_pl_path
                    )

                else:
                    # use the already existing short value that's associated with the product link rather than the
                    # code-generated short link..
                    short_product_link = link_shortening_progress[product_links_id]


            # IMAGE SRC
            image_src = product['linkCode']['imageUrl']

            # IMAGE SRC SHORTENED
            short_image_link = ''

            if image_src != '':
                final_is_path = short_product_link.replace('-pl-', '-is-')  # alpha_path + '-is' + f'-{str(link_base_count)}'
                final_is_path_copy = f'{final_is_path}'
                final_is_path = final_is_path.replace('https://shop.askandcarts.com/', '')

                # if image (src) link's not in the list of already shortened links, api shorten it
                if final_is_path.count('failed_to_shorten') > 0:
                    # skip if the product link shortening above 'failed_to_shorten' to avoid 'failed_to_shorten' dominos errors
                    pass
                elif list_of_short_links_id.count(image_src_id) < 1 and list_of_short_links.count(final_is_path_copy) < 1:

                    short_image_link = shorten_url(
                        product_title=product_title,
                        product_or_image_link_to_shorten=image_src,
                        path_to_save_shortened_link_to=final_is_path
                    )

                else:
                    # use the already existing short value that's associated with the image src rather than the
                    # code-generated short link..
                    short_image_link = link_shortening_progress[image_src_id] # 'https://shop.askandcarts.com/' + final_is_path





            # SITE NAME
            site_name_edited = site_name.replace('_', ' ')

            # populating products feed dict
            products_feed_dict['title'].append(product_title)
            products_feed_dict['brandName'].append('')
            products_feed_dict['productCategory'].append(product_category)
            products_feed_dict['gender'].append(product_gender)
            products_feed_dict['price'].append(product_price)
            products_feed_dict['commission'].append(product_commission)

            products_feed_dict['productLinkCJ'].append(product_link)
            products_feed_dict['productLink'].append(short_product_link)

            # if current_index >= last_link_shortening_progress_index:
            # products_feed_dict['productLinkShortened'].append(short_product_link)

            products_feed_dict['imageSrcCJ'].append(image_src)
            products_feed_dict['imageSrc'].append(short_image_link)

            # if current_index >= last_link_shortening_progress_index:
            # products_feed_dict['imageSrcShortened'].append(short_image_link)

            # products_feed_dict['country'].append(country)
            products_feed_dict['siteName'].append(site_name_edited)

            current_index += 1


            # SAVE (LINK SHORTENING) PROGRESS
            with open(f'{all_log_files_folder}{shorts_progress_log}', 'r+') as shorts_progress_log_file_one:
                shorts_progress_log_json = shorts_progress_log_file_one.read()
                shorts_progress_log_json_as_dict = json.loads(shorts_progress_log_json)

                current_sites_shortened_links_dict = shorts_progress_log_json_as_dict.get(site_name, None)

                if current_sites_shortened_links_dict == None:
                    shorts_progress_log_json_as_dict[site_name] = {}

                # if the product link or image src have been successfully shortened, add it to the list of shortened
                # urls..

                print(f'short_product_link* : {short_product_link}')
                print(f'short_image_link* : {short_image_link}')
                print('---------------------------------------------')
                print()
                print()
                if short_product_link.count('failed_to_shorten') < 1 and short_product_link != '':
                    shorts_progress_log_json_as_dict[site_name][product_links_id] = short_product_link
                if short_image_link.count('failed_to_shorten') < 1 and short_image_link != '':
                    shorts_progress_log_json_as_dict[site_name][image_src_id] = short_image_link

                # update 'link_shortening_progress' dict to reflect shortened links additions
                link_shortening_progress = shorts_progress_log_json_as_dict[site_name]

                # print(f'link_shortening_progress*: {link_shortening_progress}')

                shorts_progress_log_dict_as_json = json.dumps(shorts_progress_log_json_as_dict)

                with open(f'{all_log_files_folder}{shorts_progress_log}', 'w+') as shorts_progress_log_file_two:
                    shorts_progress_log_file_two.write(shorts_progress_log_dict_as_json)

                    shorts_progress_log_file_two.close()

                shorts_progress_log_file_one.close()



    product_feed_df = pd.DataFrame.from_dict(products_feed_dict)


    print(product_feed_df.head(500))
    print(product_feed_df.count())

    # print(product_feed_df['country'].to_list().count('US'))

    file_name = f'{site_name}_CJ_'

    product_feed_df.to_csv(f'{all_filtered_data_folder_cj}{file_name}.csv')




    if is_upload_to_wx == True:

        extract_elements_per_row_from_dataframe(
            file_name,
            product_feed_df,
            is_continue_from_previous_stop_csv=False
        )


# shorts.io url - API implementation
def shorten_url(
        product_title,
        product_or_image_link_to_shorten,
        path_to_save_shortened_link_to,
        link_title_to_save_as="OOPS! The offer you're looking for has expired.",
):

    url = 'https://api.short.io/links'

    body = {
        'domain': 'shop.askandcarts.com',
        'originalURL': product_or_image_link_to_shorten,
        'path': path_to_save_shortened_link_to,
        'title': link_title_to_save_as,
        # 'cloaking': 'true'
    }

    # body_jsonified = json.dumps(body)

    req = requests.post(
        url,
        headers={
            'Authorization': short,
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        json=body

    )

    print('SHORTENING LINK')
    print('-----------------------')
    print(f'PRODUCT TITLE: {product_title}')
    print(f'PRODUCT OR IMAGE LINK: {product_or_image_link_to_shorten}')
    print()
    print(f'req.status_code: {req.status_code}, {type(req.status_code)}')
    print()
    # print(f'req.content: {req.content}')
    print(f'req.text: {req.text}')
    print()
    print(req.reason)

    return_header = req.headers
    print()
    print('RESPONSE HEADERS')
    print('----------------')
    for i in return_header:
        print(f'{i}: {return_header[i]}')

    print('---------------------------------------------------------------------------------')

    shortened_url = ''

    if req.status_code == 200:
        shortened_url = json.loads(req.text)
        shortened_url = shortened_url['shortURL']
    else:
        shortened_url = 'failed_to_shorten'

    return shortened_url # req.text


def mininimum_commission_as_per_detected_currency(
    product_currency,
    mininum_commission_target_usd
):
    mininum_commission_target_detected_currency = 0

    if 'AED' in product_currency:

        mininum_commission_target_detected_currency = convert_minimum_profit(
            is_usd_to_aed=True,
            minimum_commission_target_usd=mininum_commission_target_usd
        )

    elif 'SGD' in product_currency:

        mininum_commission_target_detected_currency = convert_minimum_profit(
            is_usd_to_sgd=True,
            minimum_commission_target_usd=mininum_commission_target_usd
        )

    elif 'USD' in product_currency:

        mininum_commission_target_detected_currency = {
            'mininum_commission_target_usd': mininum_commission_target_usd
        }

    else:
        raise Exception('Error while converting minimum commission target.\n'
                        'Could not detect CJ defined currency, \n'
                        'or CJ defined currency is not among current search currencies.')


    return mininum_commission_target_detected_currency

# PARTNERS ID
partners = {

        0: {
            'partners_company_name': 'FARFETCH',
            'partners_company_id': '5172007',
            'partners_company_ad_id': ''
            }, #x

        1: {
            'partners_company_name': 'THE_LUXURY_CLOSET',
            'partners_company_id': '5312449',
            'partners_company_ad_id': '15447452'
            },

        2:{
            'partners_company_name': 'SAMSUNG_UAE',
            'partners_company_id': '6123659',
            'partners_company_ad_id': '15245400'
            },

        3: {
            'partners_company_name': 'FERNS_N_PETALS',
            'partners_company_id': '5763053',
            'partners_company_ad_id': ''
            }, #

        4: {'partners_company_name': 'HOTELS MIDDLE-EAST',
            'partners_company_id': '5275628',
            'partners_company_ad_id': ''
            } #

}

partner_to_fetch_num = 2

add_products_to_table(
    site_name= partners[partner_to_fetch_num]['partners_company_name'],
    partners_id= partners[partner_to_fetch_num]['partners_company_id'],
    ad_id= partners[partner_to_fetch_num]['partners_company_ad_id'],
    is_upload_to_wx= False
)

# retrieve realtime commissions
# retrieve_cj_data(
#     company_name= company_name,
#     is_get_company_commission= True
# )

# print(f'commission: {commission}')