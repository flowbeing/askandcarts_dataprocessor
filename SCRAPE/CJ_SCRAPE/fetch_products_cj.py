import sys
import urllib.parse

from settings.q.other_settings import cj_pat2

# from operations.wx.bcknd.product_recommendation_system.color_detector.color_vision_api import detect_colors

from operations.other_operations.convert_minimum_profit import convert_minimum_profit
from operations.wx.bcknd.bcknd import *
from settings.q.default_folder_and_filename_settings import all_filtered_data_folder_cj, all_log_files_folder, \
    shorts_progress_log
from settings.productCategory import productCategories
from operations.short.shorten_url import shorten_url
from settings.q.pd_settings import *



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
        mininum_commission_target_detected_currency_value,
        is_upload_to_wx = False
):

    # JUST IN CASE REMINDER
    # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    print()
    print()
    confirm_commission_non_error = input("1. You didn't use the right exchange to calculate minimum commissions\n"
                                         "2. You included 'added' in imageUrl and clickUrl:\n"
                                         "(t)rue/(f)alse: ")

    while confirm_commission_non_error != 't' and confirm_commission_non_error != 'f':

        if confirm_commission_non_error == 't':
            sys.exit('Operation terminated - YOU WERE NOT PAYING ATTENTION..')
        elif confirm_commission_non_error == 'f':
            pass
        else:
            confirm_commission_non_error = input(
                "You didn't use the right exchange to calculate minimum commissions - (t)rue/(f)alse: ")

    # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
        # 'description': [],
        'title': [],
        'brandName': [],
        'productCategory': [],
        'gender': [],
        'price': [],
        'commission': [],
        'productLink_CJ': [],
        'productLink': [],
        # 'productLinkShortened': [],
        'imageSrc_CJ': [],
        'imageSrc': [],
        # 'imageSrcShortened': [],
        # 'country': [],
        'siteName': [],

        'isProductLinkUpdated': [],
        'baseProductLinksId': [],
        'isImageSrcUpdated': [],
        'baseImageSrcsId': [],

        # 'dominantColor': [],
        # 'goldColor': [],
        # 'stateID': [] # recommendations profile
    }

    list_of_luxury_brands = ["Samung", "Louis Vuitton", "Gucci", "Hermès", "Prada", "Chanel", "Burberry", "Fendi", "Givenchy",
                             "Dior", "Versace", "Armani", "Balenciaga", "Yves Saint Laurent", "Rolex", "Tiffany",
                             "Cartier", "Valentino", "Nina Ricci", "Dolce Gabbana", "Bulgari", "Tom Ford", "Hugo Boss",
                             "Jimmy Choo", "Moschino", "Kenzo", "Ralph Lauren", "Oscar de la Renta", "MCM", "OMEGA",
                             "Salvatore Ferragamo S.p.A.", "Michael Kors", "Kate Spade", "Vera Wang", "Tory Burch",
                             "Zegna", "DKNY", "LOEWE", "Goyard", "Celine", "Berluti", "Rimowa", "Marc Jacobs",
                             "Emilio Pucci", "Loro Piana", "Fenty", "Paul Stuart", "Chloé", "Ray-Ban", "Ray Ban",
                             "RayBan", "Longines", "Swarovski", "Miu Miu", "Coach", "Patek Philippe SA", "Moynat",
                             "Marni", "Cesare Attolini", "Braccialini", "Canali", "Brioni", "Roberto Cavalli",
                             "Corneliani", "Alexander Mcqueen", "Balmain", "Jil Sander", "Etro", "Brunello Cucinelli",
                             "Furla", "Genny", "Nicholas Kirkwood", "Isaia", "La Perla", "Diesel", "Larusmiani", "Malo",
                             "Fila", "Max Mara", "Lardini", "Stefano Ricci", "Marina Rinaldi", "Rubinacci", "Pinko",
                             "Piquadro", "Missoni", "André Laug", "Pal Zileri", "Borsalino", "Luciano Barbera",
                             "Paul Smith", "Audemars Piguet", "Fiorucci", "Bottega Veneta", "Pomellato", "Lanvin",
                             "Jérôme Dreyfuss", "Jerome Dreyfuss", "Bell & Ross", "Bell Ross", "Escada", "Moncler",
                             "Franck Muller", "Rouje", "Iceberg", "Hermes", "Place Vendome", "Girard Perregaux",
                             "TagHeuer", "Bvlgari", "Damiani", "Corum", "Breitling", "Chopard", "Bvlgari",
                             "Montegrappa", "Van Cleef Arpels", "Jaeger LeCoultre", "Graham", "Vacheron Constantin",
                             "S.T. Dupont", "S.T.Dupont", "Montblanc", 'Tag Heuer']

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

        ## mininum_commission_target_detected_currency = mininimum_commission_as_per_detected_currency(
        ##     product_currency=product['price']['currency'],
        ##     mininum_commission_target_usd=200
        ## )
        ## mininum_commission_target_detected_currency_value = list(mininum_commission_target_detected_currency.values())[0]
        ## mininum_commission_target_detected_currency_symbol = list(mininum_commission_target_detected_currency.keys())[0]

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

            # PRODUCT DESCRIPTION
            product_description = product['description']

            # PRODUCT TITLE
            product_title = product['title']

            product_title_split = product_title.split(' ')

            # detect and delete redundant 'words' in product_title
            current_word_count = 0
            for word in product_title_split:

                if word.count('&') > 0 and word.count(';') > 0: # and word.count(',')
                    index_of_and = word.index('&')
                    chars_before_and = word[:index_of_and]

                    # extract non-numeric characters from all characters before '&'
                    non_numeric_chars_before_and = []
                    for char in chars_before_and:

                        if '0123456789'.count(char) == 0:
                            non_numeric_chars_before_and.append(char)

                    # if characters before '&' do not contain a non-numeric character, delete the current (redundant)
                    # word from product title..
                    if len(non_numeric_chars_before_and) == 0:
                        product_title_split.remove(word)
                    # otherwise, remove the current word and replace it with non-numeric characters
                    # that exist before '&'
                    else:
                        word_replacement = ''.join(non_numeric_char for non_numeric_char in non_numeric_chars_before_and)
                        product_title_split.remove(word)
                        product_title_split.insert(current_word_count, word_replacement)

                elif word.count('&') > 0 and word.count(';,'):
                    index_of_and = word.index('&')
                    chars_before_and = word[:index_of_and]

                    index_of_semicolon_and_comma = word.index(';,') + 2
                    chars_after_semicolon_and_comma = word[index_of_semicolon_and_comma:]

                    # extract non-numeric characters from all characters before '&'
                    non_numeric_chars_before_and = []
                    for char in chars_before_and:

                        if '0123456789'.count(char) == 0:
                            non_numeric_chars_before_and.append(char)

                    # determining word replacement
                    non_numeric_chars_before_and = \
                        ''.join(non_numeric_char for non_numeric_char in non_numeric_chars_before_and)

                    word_replacement = ''
                    if len(non_numeric_chars_before_and) != 0:
                        word_replacement = non_numeric_chars_before_and + chars_after_semicolon_and_comma
                    else:
                        word_replacement = chars_after_semicolon_and_comma

                    product_title_split.remove(word)
                    product_title_split.insert(current_word_count, word_replacement)


                current_word_count += 1

                product_title = ' '.join(word for word in product_title_split)


            # if '&sup2;' in product_title:
            #     index_of_and_quote = product_title.index('&sup2;') + 5
            #     product_title = product_title[index_of_and_quote:]
            # elif '&quot;' in product_title:
            #     index_of_and_quote = product_title.index('uot;') + 4
            #     product_title = product_title[index_of_and_quote:]
            # elif ';,' in product_title:
            #     index_of_semicolon = product_title.index(';')
            #     product_title = product_title[:index_of_semicolon]
            # elif ';' in product_title:
            #     index_of_semicolon = product_title.index(';') + 1
            #     product_title = product_title[index_of_semicolon:]
            # product_brandName x



            # BRAND NAME
            brand_name = ''

            for brand_full_name in list_of_luxury_brands:

                brand_full_name = brand_full_name.lower()

                luxury_brand_name_split = brand_full_name.split(' ')

                if brand_full_name in product['title'].lower() or \
                    brand_full_name in product['description'].lower() or \
                        brand_full_name in product['linkCode']['imageUrl'].lower() or \
                        brand_full_name in product['linkCode']['clickUrl'].lower():

                    brand_name = brand_full_name.upper()

                    break

                else:

                    for word in luxury_brand_name_split:

                        word = word.lower()

                        if word != '&' and \
                                word != ' ' and \
                                word != 'de' and \
                                word != 'la' and \
                                word != 'le' and \
                                len(word) > 4 and \
                                (word in product['title'].lower()
                                            or word in product['description'].lower()
                                            or word in product['linkCode']['imageUrl'].lower()
                                            or word in product['linkCode']['clickUrl'].lower()
                        ):

                            brand_name = brand_full_name.upper()





            # DETERMINING PRODUCT CATEGORY
            product_category = ''

            if site_name.count('SAMSUNG_UAE') > 0:
                product_category = 'LUXURY TECH'

            else:
                product_category_copy = product['productType']

                if type(product_category_copy) == list and len(product_category_copy) != 0:

                    print('here 1')

                    product_category_copy = product['productType'][0].upper()

                    if 'WATCH' in product_category_copy:
                        product_category = 'WATCH'

                    elif 'WALLETS & MONEY CLIPS' in product_category_copy:
                        product_category = 'ACCESSORIES'

                    elif 'ACCESSORIES' in product_category_copy:
                        product_category = 'ACCESSORIES'

                    elif 'SUITCASES' in product_category_copy:
                        product_category = 'TRAVEL_BAG'

                    elif 'BRIEFCASES' in product_category_copy or 'HANDBAGS' in product_category_copy or 'BAGS' in product_category_copy:
                        product_category = 'HANDBAG'

                    elif 'COATS & JACKETS' in product_category_copy or 'CLOTHING' in product_category_copy \
                            or 'COATS & JACKETS' in product_category_copy \
                            or 'DRESSES' in product_category_copy:
                        product_category = 'CLOTHING'

                    elif 'LOAFERS & SLIP-ONS' in product_category_copy:
                        product_category = 'SHOE'

                    elif 'SHOE' in product_category_copy:
                        product_category = 'SHOE'

                    elif 'NECKLACE' in product_category_copy:
                        product_category = 'NECKLACE'

                    elif 'BRACELET' in product_category_copy:
                        product_category = 'BRACELET'

                    elif 'EARRING' in product_category_copy:
                        product_category = 'EARRING'

                    elif 'RING' in product_category_copy:
                        product_category = 'RING'

                    else:

                        # try to deduce the product category from already defined list of product categories and product
                        # description list
                        for prod_category in productCategories:

                            product_description = product['description'].lower()
                            predefined_product_category = prod_category.lower()
                            print(f'predefined_product_category: {predefined_product_category}')
                            print(f'product_description: {product_description}')

                            if product_category_copy.count(predefined_product_category) > 0 or \
                                    product_description.count(predefined_product_category) > 0 or \
                                    (product_title.lower()).count(predefined_product_category) > 0:

                                print(f'prod_category for loop: {prod_category}')

                                product_category = prod_category

                                print(f'product_category for loop: {product_category}')

                                break

                        # if product_category was not found, make it equal to 'None'
                        if product_category == '':

                            product_category = product_category_copy.upper()

                else:

                    # try to deduce the product category from already defined list of product categories
                    for prod_category in productCategories:

                        product_description = product['description'].lower()
                        predefined_product_category = (prod_category.replace('_', ' ')).lower()
                        # print(f'predefined_product_category: {predefined_product_category}')
                        # print(f'product_description: {product_description}')

                        if product_description.count(predefined_product_category) > 0 or \
                                (product_title.lower()).count(predefined_product_category) > 0:

                            # print(f'prod_category for loop: {prod_category}')

                            product_category = prod_category

                            # print(f'product_category for loop: {product_category}')

                            break

                    # if product_category was not found, make it equal to 'None'
                    if product_category == '':
                        product_category = 'OTHER_FANCY_ITEMS'

            #
            # PRODUCT LINK
            product_link = product['linkCode']['clickUrl']
            # index_of_product_link_less_trigger = product_link.index('url=') + 4
            # product_link_less_cj_trigger = product_link[index_of_product_link_less_trigger:]
            product_link_less_cj_trigger = (product_link.split('url='))[-1]

            # calculating product link's clean link
            # PRODUCT LINK SHORTENED
            # first - retrieving shortened links id, their relative shorts, and originals (short form)
            # print(f'link_shortening_progress: {link_shortening_progress}')
            list_of_links_metadata_id = list(link_shortening_progress.keys()) # id of all links data (includes long and short links data)
            links_metadata = link_shortening_progress.values() # a dictionary containing short and original links
            list_of_short_links = [metadata['short_link'] for metadata in links_metadata]
            list_of_original_links = [metadata['original_link'] for metadata in links_metadata]

            # deriving product link id and image src's id from product id
            product_id = product['id']

            product_links_id = product_id + '-pl'
            product_links_id_updated = '' # to register changes in product link

            image_src_id = product_id + '-is'
            image_src_id_updated = '' # to register changes in image src

            alpha_path = '' # used to decide the product link and image src's final short form (final (pl or is) path)
            link_base_count = 1
            short_product_link = ''
            version_product_link_change_was_previously_implemented_in = '' # to track whether the current short_product_link has previously been implemented

            short_product_link_creation_time = ''
            short_product_link_id_string = ''
            short_product_link_domain_id = ''
            short_product_link_owner_id = ''

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

                print(f'list_of_short_links_id: {list_of_links_metadata_id}')
                print(f'list_of_short_links: {list_of_short_links}')

                # ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


                while list_of_short_links.count(code_generated_short_link) > 0:
                    link_base_count += 1
                    final_pl_path = alpha_path + '-pl' + f'-{str(link_base_count)}'
                    code_generated_short_link = 'https://shop.askandcarts.com/' + final_pl_path
                    print(f'while -> {code_generated_short_link}')

                # ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------

                # if product link's id is (?and not short link, because short link are auto generated and a product
                # link could already have a different short link*) not in the list of already shortened product links
                # id, api-shorten it with the (new) code generated path..
                if list_of_links_metadata_id.count(product_links_id) < 1:

                    shorten_product_link_operation = shorten_url(
                        product_title=product_title,
                        product_or_image_link_to_shorten=product_link,
                        path_to_save_shortened_link_to=final_pl_path,
                        links_title=product_title
                    )

                    if type(shorten_product_link_operation) != str:
                        short_product_link = shorten_product_link_operation['shortened_url']
                        short_product_link_creation_time = shorten_product_link_operation['created_at']
                        short_product_link_id_string = shorten_product_link_operation['id_string']
                        short_product_link_domain_id = shorten_product_link_operation['domain_id']
                        short_product_link_owner_id = shorten_product_link_operation['owner_id']

                    else:
                        short_product_link = shorten_product_link_operation
                        short_product_link_creation_time = shorten_product_link_operation
                        short_product_link_id_string = shorten_product_link_operation
                        short_product_link_domain_id = shorten_product_link_operation
                        short_product_link_owner_id = shorten_product_link_operation



                # else if the cj affiliate link has changed without considering the affiliate tracking link or trigger,
                # create a short link for the updated product link..
                elif list_of_links_metadata_id.count(product_links_id) > 0 and \
                        link_shortening_progress[product_links_id][
                            'original_link_less_cj_trigger'] != product_link_less_cj_trigger:


                    version_change_was_previously_implemented_in = ''
                    number_of_existing_versions_change_does_not_exist_in = 0

                    if link_shortening_progress[product_links_id].get('current_links_updates_ids') != None:

                        current_products_link_versions = link_shortening_progress[product_links_id][
                            'current_links_updates_ids']

                        # if there's been previous update(s) to the current product link, if any, register the version the
                        # current change was implemented in otherwise register the number of times the change was not
                        # registered
                        if len(current_products_link_versions) > 0:

                            for link_version in current_products_link_versions:

                                if link_shortening_progress[link_version] \
                                        ['original_link_less_cj_trigger'] == product_link_less_cj_trigger:

                                    version_change_was_previously_implemented_in = link_version
                                    version_product_link_change_was_previously_implemented_in = version_change_was_previously_implemented_in

                                # has sentimental value
                                else:

                                    number_of_existing_versions_change_does_not_exist_in += 1

                        # if the detected change has been implemented in an existing version, extract short_link's value
                        # from there..
                        if (len(current_products_link_versions) > 0 and version_change_was_previously_implemented_in != ""):

                            short_product_link = link_shortening_progress[
                                version_change_was_previously_implemented_in]['short_link']


                    # if there's been no previous update to the current product link or detected change has not been
                    # implemented in any existing update or link version, implement an update
                    if version_change_was_previously_implemented_in == "":

                        print()
                        print('product_link (without trigger) has changed')

                        old_original_link_less_cj_trigger = link_shortening_progress[product_links_id][
                            'original_link_less_cj_trigger']

                        print(f'old original_link_less_cj_trigger: {old_original_link_less_cj_trigger}')
                        print(f'new original_link_less_cj_trigger: {product_link_less_cj_trigger}')


                        shorten_product_link_operation = shorten_url(
                            product_title=product_title,
                            product_or_image_link_to_shorten=product_link,
                            path_to_save_shortened_link_to=final_pl_path,
                            links_title=product_title
                        )

                        if type(shorten_product_link_operation) != str:
                            short_product_link = shorten_product_link_operation['shortened_url']
                            short_product_link_creation_time = shorten_product_link_operation['created_at']
                            short_product_link_id_string = shorten_product_link_operation['id_string']
                            short_product_link_domain_id = shorten_product_link_operation['domain_id']
                            short_product_link_owner_id = shorten_product_link_operation['owner_id']

                        else:
                            short_product_link = shorten_product_link_operation
                            short_product_link_creation_time = shorten_product_link_operation
                            short_product_link_id_string = shorten_product_link_operation
                            short_product_link_domain_id = shorten_product_link_operation
                            short_product_link_owner_id = shorten_product_link_operation

                        # updating product_id to ensure proper registration
                        link_id_incrementor = 0
                        product_links_id_updated = product_links_id

                        while list_of_links_metadata_id.count(product_links_id_updated) > 0:

                            link_id_incrementor += 1
                            product_links_id_updated = product_links_id + '-update-' + f'{link_id_incrementor}'

                            print()
                            print(f'while (product_links_id_updated)-> {product_links_id_updated}')


                else:
                    # use the already existing short value that's associated with the product link rather than the
                    # code-generated short link..
                    short_product_link = link_shortening_progress[product_links_id]['short_link']


            # IMAGE SRC
            image_src = product['linkCode']['imageUrl']
            # index_of_product_link_less_trigger = product_link.index('imgurl=') + 7
            # image_src_less_cj_trigger = image_src[index_of_product_link_less_trigger:]
            image_src_less_cj_trigger = (image_src.split('imgurl='))[-1]
            image_src_less_cj_trigger_unquoted = urllib.parse.unquote(image_src_less_cj_trigger).replace('http://', 'https://')
            image_src_updated = False

            # IMAGE SRC SHORTENED -> PAUSED (REPLACED WITH ORIGINAL IMAGE LINK REPRESENTATION AND CHANGE IDENTIFICATION)
            short_image_link = ''
            version_short_image_link_change_was_previously_implemented_in = '' # to track whether the current short_image_link has previously been implemented

            short_image_link_creation_time = ''
            short_image_link_id_string = ''
            short_image_link_domain_id = ''
            short_image_link_owner_id = ''

            if image_src != '':
                # final_is_path = short_product_link.replace('-pl-', '-is-')  # alpha_path + '-is' + f'-{str(link_base_count)}' -> PAUSED IMAGE LINK SHORTENING
                # final_is_path_copy = f'{final_is_path}'  -> PAUSED IMAGE LINK SHORTENING
                # final_is_path = final_is_path.replace('https://shop.askandcarts.com/', '') -> PAUSED IMAGE LINK SHORTENING

                # ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


                # if image (src) link's not in the list of already shortened links, api shorten it
                # if final_is_path.count('failed_to_shorten') > 0: -> PAUSED IMAGE LINK SHORTENING
                #     # skip if the product link shortening above 'failed_to_shorten' to avoid 'failed_to_shorten' dominos errors  -> PAUSED IMAGE LINK SHORTENING
                #     pass -> PAUSED IMAGE LINK SHORTENING

                # ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------


                # elif list_of_short_links_id.count(image_src_id) < 1 and list_of_short_links.count(final_is_path_copy) < 1:  -> PAUSED IMAGE LINK SHORTENING
                #
                #     shorten_image_link_operation = shorten_url(
                #         product_title=product_title,
                #         product_or_image_link_to_shorten=image_src,
                #         path_to_save_shortened_link_to=final_is_path
                #     )
                #
                #     if type(shorten_image_link_operation) != str:
                #         short_image_link = shorten_image_link_operation['shortened_url']
                #         short_image_link_creation_time = shorten_image_link_operation['created_at']
                #         short_image_link_id_string = shorten_image_link_operation['id_string']
                #         short_image_link_domain_id = shorten_image_link_operation['domain_id']
                #         short_image_link_owner_id = shorten_image_link_operation['owner_id']
                #
                #     else:
                #         short_image_link = shorten_image_link_operation
                #         short_image_link_creation_time = shorten_image_link_operation
                #         short_image_link_id_string = shorten_image_link_operation
                #         short_image_link_domain_id = shorten_image_link_operation
                #         short_image_link_owner_id = shorten_image_link_operation

                # ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------



                # else if the cj affiliate link has changed without considering the affiliate tracking link or trigger,
                # create a short link for the updated product link..
                # elif list_of_short_links_id.count(image_src_id) > 0 and \
                #         link_shortening_progress[image_src_id]['original_link_less_cj_trigger'] != image_src_less_cj_trigger:
                #
                #     version_change_was_previously_implemented_in = ''
                #     number_of_existing_versions_change_does_not_exist_in = 0
                #
                #     if link_shortening_progress[image_src_id].get('current_links_updates_ids') != None:
                #
                #         current_image_links_versions = link_shortening_progress[image_src_id]['current_links_updates_ids']
                #
                #         # if there's been previous update(s) to the current image src, register the version the
                #         # current change was implemented in (if any), otherwise register the number of times the change
                #         # was not registered
                #         if len(current_image_links_versions) > 0:
                #
                #             for link_version in current_image_links_versions:
                #
                #                 if link_shortening_progress[link_version] \
                #                         ['original_link_less_cj_trigger'] == image_src_less_cj_trigger:
                #
                #                     version_change_was_previously_implemented_in = link_version
                #                     version_short_image_link_change_was_previously_implemented_in = version_change_was_previously_implemented_in
                #
                #                 # has sentimental value
                #                 else:
                #
                #                     number_of_existing_versions_change_does_not_exist_in += 1
                #
                #         # if the detected change has been implemented in an existing version, extract short_link's value
                #         # from there..
                #         if (len(current_image_links_versions) > 0 and version_change_was_previously_implemented_in != ""):
                #
                #             short_image_link = link_shortening_progress[
                #                 version_change_was_previously_implemented_in]['short_link']
                #
                #     # if there's been no previous update to the current image src or detected change has not been
                #     # implemented in any existing update or link version, implement an update
                #     if version_change_was_previously_implemented_in == "":
                #
                #         print()
                #         print('Image src (without trigger) has changed')
                #
                #         old_original_link_less_cj_trigger = link_shortening_progress[image_src_id][
                #             'original_link_less_cj_trigger']
                #         print()
                #
                #         print(f'old original_link_less_cj_trigger: {old_original_link_less_cj_trigger}')
                #         print(f'new original_link_less_cj_trigger: {image_src_less_cj_trigger}')
                #
                #         shorten_image_link_operation = shorten_url(
                #             product_title=product_title,
                #             product_or_image_link_to_shorten=image_src,
                #             path_to_save_shortened_link_to=final_is_path
                #         )
                #
                #         if type(shorten_image_link_operation) != str:
                #             short_image_link = shorten_image_link_operation['shortened_url']
                #             short_image_link_creation_time = shorten_image_link_operation['created_at']
                #             short_image_link_id_string = shorten_image_link_operation['id_string']
                #             short_image_link_domain_id = shorten_image_link_operation['domain_id']
                #             short_image_link_owner_id = shorten_image_link_operation['owner_id']
                #
                #         else:
                #             short_image_link = shorten_image_link_operation
                #             short_image_link_creation_time = shorten_image_link_operation
                #             short_image_link_id_string = shorten_image_link_operation
                #             short_image_link_domain_id = shorten_image_link_operation
                #             short_image_link_owner_id = shorten_image_link_operation
                #
                #         # updating image_src_id to ensure proper registration
                #         link_id_incrementor = 0
                #         image_src_id_updated = image_src_id
                #
                #         while list_of_short_links_id.count(image_src_id_updated) > 0:
                #             link_id_incrementor += 1
                #             image_src_id_updated = image_src_id + '-update-' + f'{link_id_incrementor}'
                #
                #             print()
                #             print(f'while (image_src_id_updated)-> {image_src_id_updated}')

                ## TO DETERMINE WHETHER OR NOT AN ORIGINAL CJ IMAGE LINK HAS CHANGED -> DELETE WHEN IMAGE LINK SHORTENING GETS RESUMED
                #if list_of_links_metadata_id.count(image_src_id) > 0 and \
                #        link_shortening_progress[image_src_id]['original_link_less_cj_trigger'] != image_src_less_cj_trigger:
                #
                #    version_change_was_previously_implemented_in = ''
                #    number_of_existing_versions_change_does_not_exist_in = 0
                #
                #    if link_shortening_progress[image_src_id].get('current_links_updates_ids') != None:
                #
                #        current_image_links_versions = link_shortening_progress[image_src_id]['current_links_updates_ids']
                #
                #        # if there's been previous update(s) to the current image src, register the version the
                #        # current change was implemented in (if any), otherwise register the number of times the change
                #        # was not registered
                #        if len(current_image_links_versions) > 0:
                #
                #            for link_version in current_image_links_versions:
                #
                #                if link_shortening_progress[link_version] \
                #                        ['original_link_less_cj_trigger'] == image_src_less_cj_trigger:
                #
                #                    version_change_was_previously_implemented_in = link_version
                #                    version_short_image_link_change_was_previously_implemented_in = version_change_was_previously_implemented_in
                #
                #                # has sentimental value
                #                else:
                #
                #                    number_of_existing_versions_change_does_not_exist_in += 1
                #
                #        # if the detected change has been implemented in an existing version, extract short_link's value
                #        # from there..
                #        if (len(current_image_links_versions) > 0 and version_change_was_previously_implemented_in != ""):
                #
                #            short_image_link = link_shortening_progress[
                #                version_change_was_previously_implemented_in]['short_link']
                #
                #    # if there's been no previous update to the current image src or detected change has not been
                #    # implemented in any existing update or link version, implement an update
                #    if version_change_was_previously_implemented_in == "":
                #
                #        print()
                #        print('Image src (without trigger) has changed')
                #
                #        old_original_link_less_cj_trigger = link_shortening_progress[image_src_id][
                #            'original_link_less_cj_trigger']
                #        print()
                #
                #        print(f'old original_link_less_cj_trigger: {old_original_link_less_cj_trigger}')
                #        print(f'new original_link_less_cj_trigger: {image_src_less_cj_trigger}')
                #
                #        shorten_image_link_operation = shorten_url(
                #            product_title=product_title,
                #            product_or_image_link_to_shorten=image_src,
                #            path_to_save_shortened_link_to=final_is_path
                #        )
                #
                #        if type(shorten_image_link_operation) != str:
                #            short_image_link = shorten_image_link_operation['shortened_url']
                #            short_image_link_creation_time = shorten_image_link_operation['created_at']
                #            short_image_link_id_string = shorten_image_link_operation['id_string']
                #            short_image_link_domain_id = shorten_image_link_operation['domain_id']
                #            short_image_link_owner_id = shorten_image_link_operation['owner_id']
                #
                #        else:
                #            short_image_link = shorten_image_link_operation
                #            short_image_link_creation_time = shorten_image_link_operation
                #            short_image_link_id_string = shorten_image_link_operation
                #            short_image_link_domain_id = shorten_image_link_operation
                #            short_image_link_owner_id = shorten_image_link_operation
                #
                #        # updating image_src_id to ensure proper registration
                #        link_id_incrementor = 0
                #        image_src_id_updated = image_src_id
                #
                #        while list_of_links_metadata_id.count(image_src_id_updated) > 0:
                #            link_id_incrementor += 1
                #            image_src_id_updated = image_src_id + '-update-' + f'{link_id_incrementor}'
                #
                #            print()
                #            print(f'while (image_src_id_updated)-> {image_src_id_updated}')

                # else:
                #     # use the already existing short value that's associated with the image src rather than the
                #     # code-generated short link..
                #     short_image_link = link_shortening_progress[image_src_id]['short_link'] # 'https://shop.askandcarts.com/' + final_is_path

                # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                # DELETE -> WHEN IMAGE LINK SHORTENING GETS RESUMED
                # check whether current image src's version already exists..
                list_of_original_links_less_cj_trigger = [urllib.parse.unquote(original_link.split('imgurl=')[-1]) for
                                                          original_link in list_of_original_links]
                all_image_link_version_lists = [metadata.get('list_of_image_src_versions', None) for metadata in links_metadata if metadata.get('list_of_image_src_versions', None) != None]

                if len(all_image_link_version_lists) != 0:

                    list_of_image_src_versions_versions = [image_link_version for image_src_version_list in
                                                           all_image_link_version_lists for image_link_version in
                                                           image_src_version_list]

                    # if the image src id already exists but the current image src is not in the list of original
                    # links (less CJ trigger), nor is it in the list of (all) link versions, indicate that the current
                    # product's image src has been updated..
                    if list_of_links_metadata_id.count(image_src_id) > 0 and \
                            list_of_original_links_less_cj_trigger.count(image_src_less_cj_trigger_unquoted) == 0 and \
                            list_of_image_src_versions_versions.count(image_src_less_cj_trigger_unquoted) == 0:

                        image_src_updated = True

                    # else if the image src id already exists but the current image src is not in the list of original links
                    # (less CJ trigger), but it's in the list of image src's versions, retrieve the previously implemented
                    # image src update as 'image_src_less_cj_trigger_update'
                    # useful in case a previous image src update was not implemented in DB..
                    elif list_of_links_metadata_id.count(image_src_id) > 0 and \
                            list_of_original_links_less_cj_trigger.count(image_src_less_cj_trigger_unquoted) == 0 and \
                            list_of_image_src_versions_versions.count(image_src_less_cj_trigger_unquoted) > 0:

                        image_src_updated = True

                # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


            # DEFINING GENDER
            product_gender = product['gender']

            if product_gender != None:
                if (product_gender.lower()).count('female') > 0:
                    product_gender = 'WOMEN'

                elif (product_gender.lower()).count('male') > 0:
                    product_gender = 'MEN'

                else:
                    product_gender = product_gender.upper()

            else:

                genders = [' MEN', '-MEN', 'WOMEN', '-WOMEN', 'LADY', 'LADIES']

                for gender in genders:

                    predefined_gender = gender.lower()
                    product_description = product['description'].lower()


                    if product_description.count(predefined_gender) > 0 or \
                            (product_title.lower()).count(predefined_gender) > 0 or \
                            (product_link.lower()).count(predefined_gender) > 0 or \
                            (image_src.lower()).count(predefined_gender) > 0:
                        # print(f'prod_category for loop: {prod_category}')

                        if gender == 'LADY' or gender == 'LADIES':

                            product_gender = 'WOMEN'

                        else:

                            product_gender = (gender.replace('-', '')).replace(' ', '')

                        # print(f'product_category for loop: {product_category}')

                        break

                # if product gender could not be found, deduce women's product category
                if product_gender == None:

                    manually_defined_womens_categories = ['BRACELET', 'NECKLACE', 'EARRING', 'RING']

                    print()

                    for manually_defined_womens_category in manually_defined_womens_categories:

                        # predefined_womens_category = manually_defined_category

                        print(f'product_category: {product_category}')
                        print(f'manually_defined_womens_category: {manually_defined_womens_category}')

                        if product_category.count(manually_defined_womens_category) > 0:

                            product_gender = 'WOMEN'

                            break


                ## if product gender still could not be found, deduce women's product category
                if product_gender == None:

                    # if brand is SAMSUNG UAE (electronics) and the product is an airdresser,
                    # make the product gender 'WOMEN'
                    if site_name.count('SAMSUNG') > 0 and site_name.count('UAE') > 0 and \
                            (product_title.lower()).count('airdress') > 0:

                        product_gender = 'WOMEN'

                    # if brand is SAMSUNG UAE (electronics), make the product gender unisex
                    elif site_name.count('SAMSUNG') > 0 and site_name.count('UAE') > 0:

                        product_gender = 'UNISEX'

                    else:
                        product_gender = None




            # SITE NAME
            site_name_edited = site_name.replace('_', ' ')

            # populating products feed dict
            # products_feed_dict['description'].append(product_description)
            products_feed_dict['title'].append(product_title)
            products_feed_dict['brandName'].append(brand_name)
            products_feed_dict['productCategory'].append(product_category)
            products_feed_dict['gender'].append(product_gender)
            products_feed_dict['price'].append(product_price)
            products_feed_dict['commission'].append(product_commission)

            products_feed_dict['productLink_CJ'].append(product_link)
            products_feed_dict['productLink'].append(short_product_link)

            # if current_index >= last_link_shortening_progress_index:
            # products_feed_dict['productLinkShortened'].append(short_product_link)

            products_feed_dict['imageSrc_CJ'].append(image_src)
            # DELETE -> WHEN IMAGE SRC SHORTENING GETS RESUMES
            products_feed_dict['imageSrc'].append(image_src_less_cj_trigger_unquoted)

            # PAUSED -> RESUME WHEN IMAGE SRC SHORTENING GETS RESUMES
            # products_feed_dict['imageSrc'].append(short_image_link)

            # if current_index >= last_link_shortening_progress_index:
            # products_feed_dict['imageSrcShortened'].append(short_image_link)

            # products_feed_dict['country'].append(country)
            products_feed_dict['siteName'].append(site_name_edited.replace('CJ',''))

            # base metadata ids
            products_feed_dict['baseProductLinksId'].append(product_links_id)
            products_feed_dict['baseImageSrcsId'].append(image_src_id)

            # determining checker variables to signal whether the current product's links have been updated
            # if product_links_id or image_src_id have been updated or their previous update version(s) has been
            # retrieved, inform that a short link(s) has changed
            if len(product_links_id_updated) > 0 or len(version_product_link_change_was_previously_implemented_in) > 0:
                products_feed_dict['isProductLinkUpdated'].append('true')
            else:
                products_feed_dict['isProductLinkUpdated'].append('false')

            # PAUSED -> RESUME WHEN IMAGE SRC SHORTENING GETS RESUMES
            # if len(image_src_id_updated) > 0 or len(version_short_image_link_change_was_previously_implemented_in) > 0:
            #     products_feed_dict['isImageSrcUpdated'].append('true')
            # elif len(image_src_id_updated) == 0:
            #     products_feed_dict['isImageSrcUpdated'].append('false')

            # DELETE -> WHEN IMAGE SRC SHORTENING GETS RESUMES
            if image_src_updated == True:
                products_feed_dict['isImageSrcUpdated'].append('true')
            elif image_src_updated == False:
                products_feed_dict['isImageSrcUpdated'].append('false')



            current_index += 1


            # SAVE (LINK SHORTENING) PROGRESS
            with open(f'{all_log_files_folder}{shorts_progress_log}', 'r+') as shorts_progress_log_file_one:
                shorts_progress_log_json = shorts_progress_log_file_one.read()
                shorts_progress_log_json_as_dict = json.loads(shorts_progress_log_json)

                current_sites_shortened_links_dict = shorts_progress_log_json_as_dict.get(site_name, None)
                total_number_of_links = shorts_progress_log_json_as_dict.get('total_number_of_links', None)

                # creating current_sites_shortened_links_dict if it does not already exist
                if current_sites_shortened_links_dict == None:
                    shorts_progress_log_json_as_dict[site_name] = {}

                # creating total link count if it does not already exist
                if total_number_of_links == None:
                    shorts_progress_log_json_as_dict['total_number_of_links'] = 0

                # if the product link or image src have been successfully shortened, add it to the list of shortened
                # urls..
                print(f'short_product_link* : {short_product_link}')
                print(f'short_image_link* : {short_image_link}')
                print('---------------------------------------------')
                print()
                print()
                if short_product_link.count('failed_to_shorten') < 1 and short_product_link != '':



                    if shorts_progress_log_json_as_dict[site_name].get(product_links_id, None) == None:
                        shorts_progress_log_json_as_dict[site_name][product_links_id] = {}
                        shorts_progress_log_json_as_dict[site_name][product_links_id]['current_links_updates_ids'] = []

                        shorts_progress_log_json_as_dict[site_name][product_links_id]['short_link'] = short_product_link
                        shorts_progress_log_json_as_dict[site_name][product_links_id]['original_link'] = product_link
                        shorts_progress_log_json_as_dict[site_name][product_links_id]['original_link_less_cj_trigger'] = product_link_less_cj_trigger

                        shorts_progress_log_json_as_dict['total_number_of_links'] += 1
                        shorts_progress_log_json_as_dict[site_name][product_links_id]['link_number'] = shorts_progress_log_json_as_dict['total_number_of_links']
                        shorts_progress_log_json_as_dict[site_name][product_links_id]['id_string'] = short_product_link_id_string
                        shorts_progress_log_json_as_dict[site_name][product_links_id]['domain_id'] = short_product_link_domain_id
                        shorts_progress_log_json_as_dict[site_name][product_links_id]['owner_id'] = short_product_link_owner_id
                        shorts_progress_log_json_as_dict[site_name][product_links_id]['short_link_creation_time'] = short_product_link_creation_time

                    if shorts_progress_log_json_as_dict[site_name].get(product_links_id_updated, None) == None and product_links_id_updated != "":
                        shorts_progress_log_json_as_dict[site_name][product_links_id_updated] = {}

                        shorts_progress_log_json_as_dict[site_name][product_links_id_updated]['short_link'] = short_product_link
                        shorts_progress_log_json_as_dict[site_name][product_links_id_updated]['original_link'] = product_link
                        shorts_progress_log_json_as_dict[site_name][product_links_id_updated]['original_link_less_cj_trigger'] = product_link_less_cj_trigger
                        shorts_progress_log_json_as_dict['total_number_of_links'] += 1
                        shorts_progress_log_json_as_dict[site_name][product_links_id_updated]['link_number'] = shorts_progress_log_json_as_dict['total_number_of_links']
                        shorts_progress_log_json_as_dict[site_name][product_links_id_updated]['id_string'] = short_product_link_id_string
                        shorts_progress_log_json_as_dict[site_name][product_links_id_updated]['domain_id'] = short_product_link_domain_id
                        shorts_progress_log_json_as_dict[site_name][product_links_id_updated]['owner_id'] = short_product_link_owner_id
                        shorts_progress_log_json_as_dict[site_name][product_links_id_updated]['short_link_creation_time'] = short_product_link_creation_time


                        shorts_progress_log_json_as_dict[site_name][product_links_id]['current_links_updates_ids'].append(product_links_id_updated)

                # if short_image_link.count('failed_to_shorten') < 1 and short_image_link != '': -> IMAGE SHORTENING PAUSED
                #
                #     if shorts_progress_log_json_as_dict[site_name].get(image_src_id, None) == None:
                #         shorts_progress_log_json_as_dict[site_name][image_src_id] = {}
                #         shorts_progress_log_json_as_dict[site_name][image_src_id]['current_links_updates_ids'] = []
                #
                #
                #         shorts_progress_log_json_as_dict[site_name][image_src_id]['short_link'] = short_image_link
                #         shorts_progress_log_json_as_dict[site_name][image_src_id]['original_link'] = image_src
                #         shorts_progress_log_json_as_dict[site_name][image_src_id]['original_link_less_cj_trigger'] = image_src_less_cj_trigger
                #
                #         shorts_progress_log_json_as_dict['total_number_of_links'] += 1
                #         shorts_progress_log_json_as_dict[site_name][image_src_id]['link_number'] = shorts_progress_log_json_as_dict['total_number_of_links']
                #         shorts_progress_log_json_as_dict[site_name][image_src_id]['id_string'] = short_image_link_id_string
                #         shorts_progress_log_json_as_dict[site_name][image_src_id]['domain_id'] = short_image_link_domain_id
                #         shorts_progress_log_json_as_dict[site_name][image_src_id]['owner_id'] = short_image_link_owner_id
                #         shorts_progress_log_json_as_dict[site_name][image_src_id]['short_link_creation_time'] = short_image_link_creation_time
                #
                #
                #     if shorts_progress_log_json_as_dict[site_name].get(image_src_id_updated, None) == None and image_src_id_updated != "":
                #         shorts_progress_log_json_as_dict[site_name][image_src_id_updated] = {}
                #
                #         shorts_progress_log_json_as_dict[site_name][image_src_id_updated]['short_link'] = short_image_link
                #         shorts_progress_log_json_as_dict[site_name][image_src_id_updated]['original_link'] = image_src
                #         shorts_progress_log_json_as_dict[site_name][image_src_id_updated][
                #             'original_link_less_cj_trigger'] = image_src_less_cj_trigger
                #         shorts_progress_log_json_as_dict['total_number_of_links'] += 1
                #         shorts_progress_log_json_as_dict[site_name][image_src_id_updated]['link_number'] = shorts_progress_log_json_as_dict['total_number_of_links']
                #         shorts_progress_log_json_as_dict[site_name][image_src_id_updated]['id_string'] = short_image_link_id_string
                #         shorts_progress_log_json_as_dict[site_name][image_src_id_updated]['domain_id'] = short_image_link_domain_id
                #         shorts_progress_log_json_as_dict[site_name][image_src_id_updated]['owner_id'] = short_image_link_owner_id
                #         shorts_progress_log_json_as_dict[site_name][image_src_id_updated]['short_link_creation_time'] = short_image_link_creation_time

                #         shorts_progress_log_json_as_dict[site_name][image_src_id]['current_links_updates_ids'].append(image_src_id_updated)

                # temp code to add product's dominant color and gold color (if any) to table
                # detected_colors = detect_colors(image_src_less_cj_trigger_unquoted)
                # most_dominant_color = detected_colors['most_dominant_color']
                # other_detected_colors = detected_colors['other_colors']
                # gold_color = detect_gold_color_in_product_image(
                #     list_of_non_dominant_colors = other_detected_colors
                # )

                # products_feed_dict['dominantColor'].append(most_dominant_color)
                # products_feed_dict['goldColor'].append(gold_color)

                if image_src != '': # -> DELETE WHEN IMAGE LINK SHORTENING GETS RESUMED

                    # creating new instance of image src metadata
                    if shorts_progress_log_json_as_dict[site_name].get(image_src_id, None) == None:
                        shorts_progress_log_json_as_dict[site_name][image_src_id] = {}
                        shorts_progress_log_json_as_dict[site_name][image_src_id]['list_of_image_src_versions'] = []

                        shorts_progress_log_json_as_dict[site_name][image_src_id]['short_link'] = short_image_link # necessary to have it for avoid error while trying to retreive list of short_product_links
                        shorts_progress_log_json_as_dict[site_name][image_src_id]['original_link'] = image_src
                        shorts_progress_log_json_as_dict[site_name][image_src_id]['original_link_less_cj_trigger'] = image_src_less_cj_trigger_unquoted


                        shorts_progress_log_json_as_dict['total_number_of_links'] += 1
                        shorts_progress_log_json_as_dict[site_name][image_src_id]['link_number'] = shorts_progress_log_json_as_dict['total_number_of_links']

                        shorts_progress_log_json_as_dict[site_name][image_src_id]['id_string'] = short_image_link_id_string # sentimental value
                        shorts_progress_log_json_as_dict[site_name][image_src_id]['domain_id'] = short_image_link_domain_id # sentimental value
                        shorts_progress_log_json_as_dict[site_name][image_src_id]['owner_id'] = short_image_link_owner_id # sentimental value
                        shorts_progress_log_json_as_dict[site_name][image_src_id]['short_link_creation_time'] = short_image_link_creation_time # sentimental value

                        # shorts_progress_log_json_as_dict[site_name][image_src_id]['dominant_color'] = most_dominant_color
                        # shorts_progress_log_json_as_dict[site_name][image_src_id]['other_colors'] = other_detected_colors
                        # shorts_progress_log_json_as_dict[site_name][image_src_id]['gold_color'] = gold_color




                    if image_src_updated == True:

                        image_src_update = image_src_less_cj_trigger_unquoted
                        list_of_current_products_image_src_versions = shorts_progress_log_json_as_dict[site_name][image_src_id]['list_of_image_src_versions']

                        if list_of_current_products_image_src_versions.count(image_src_update) == 0:

                            list_of_current_products_image_src_versions.append(image_src_update)




                # update 'link_shortening_progress' dict to reflect shortened links additions
                link_shortening_progress = shorts_progress_log_json_as_dict[site_name]

                # print(f'link_shortening_progress*: {link_shortening_progress}')

                shorts_progress_log_dict_as_json = json.dumps(shorts_progress_log_json_as_dict)

                with open(f'{all_log_files_folder}{shorts_progress_log}', 'w+') as shorts_progress_log_file_two:
                    shorts_progress_log_file_two.write(shorts_progress_log_dict_as_json)

                    shorts_progress_log_file_two.close()

                shorts_progress_log_file_one.close()




    product_feed_df = pd.DataFrame.from_dict(products_feed_dict)


    print(product_feed_df.head(100000))
    print(product_feed_df.count())

    list_of_available_brands = list(products_feed_dict['brandName'])
    list_of_available_brands = set(list_of_available_brands)

    total_commissions = product_feed_df['commission'].sum()
    total_number_of_products = len(product_feed_df['commission'])

    print(f'list of available brands: {len(list_of_available_brands)}, {list_of_available_brands}')
    print(f'average commissions: {total_commissions/total_number_of_products} -> total commissions: {total_commissions}, total number of products: {total_number_of_products}')


    # print(product_feed_df['country'].to_list().count('US'))

    # EXTRACT AND UPLOAD ROWS?
    # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


    print()
    is_extract_and_upload_rows = input(
        f'Would you like to extract and upload rows for the following scraped file:\n'
        f'{site_name}? y/n\n\n')

    if is_extract_and_upload_rows == 'y':

        is_continue_daily_upload_if_any = False
        is_selection_valid = False

        # confirm whether current extraction and upload operation is for the start of a daily upload to determine if
        # all p value should be reset
        while is_selection_valid == False:

            confirm_daily_upload_start = input('Is this the START of a DAILY UPLOAD?\n'
                                               'Ensure that no previous daily upload has been done if yes?\n'
                                               'y/n? ')
            confirm_daily_upload_continuation = input('Is this a dataframe CONTINUATION of a DAILY UPLOAD? y/n? ')

            if confirm_daily_upload_start == 'y' and confirm_daily_upload_continuation == 'n':
                is_continue_daily_upload_if_any = False
                is_selection_valid = True
            elif confirm_daily_upload_start == 'n' and confirm_daily_upload_continuation == 'y':
                is_continue_daily_upload_if_any = True
                is_selection_valid = True

        is_clear_previous_progress = False
        is_selection_valid = False

        # confirm whether current extraction and upload operation is for the start of a daily upload to determine if
        # all p value should be reset
        while is_selection_valid == False:

            print()
            print()
            confirm_start_from_first_row = input("Should operation continue from this dataframe's saved progress?\n"
                                               'y/n? ')

            if confirm_start_from_first_row == 'y':
                is_clear_previous_progress = False
                is_selection_valid = True
            elif confirm_start_from_first_row == 'n':
                is_clear_previous_progress = True
                is_selection_valid = True




        extract_elements_per_row_from_dataframe(
            file_name=site_name,  # to remove '.csv'
            dataframe=product_feed_df,
            is_continue_daily_upload_if_any=is_continue_daily_upload_if_any,
            is_override_previous_extraction_progress_if_any_and_start_from_scratch=is_clear_previous_progress
        )

    else:

        print()
        print(f"UPLOAD OPERATION FOR '{site_name}' WAS NOT ATTEMPTED FROM YOUR CHOICE!")

    # ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

    file_name = f'{site_name}'

    product_feed_df.to_csv(f'{all_filtered_data_folder_cj}{file_name}.csv')




    if is_upload_to_wx == True:

        extract_elements_per_row_from_dataframe(
            file_name,
            product_feed_df,
            is_continue_daily_upload_if_any=False
        )


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

        0:{
            'partners_company_name': 'SAMSUNG_UAE_CJ', # ✔ AED
            'partners_company_id': '6123659',
            'partners_company_ad_id': '15245400'
            },

        1: {
            'partners_company_name': 'THE_LUXURY_CLOSET_CJ', # ✔ USD
            'partners_company_id': '5312449',
            'partners_company_ad_id': '15447452'
            },

        2: {
            'partners_company_name': 'SHOPWORN_CJ', # ✔ USD
            'partners_company_id': '5597163',
            'partners_company_ad_id': '14356060'
        },

        #3: {
        #    'partners_company_name': 'FERNS_N_PETALS_CJ',
        #    'partners_company_id': '5763053',
        #    'partners_company_ad_id': ''
        #    }, # no product feed, no deeplinking, erased clicks -> (potential error) issue
        #
        #
        #
        #4: {'partners_company_name': 'HOTELS MIDDLE-EAST_CJ',
        #    'partners_company_id': '5275628',
        #    'partners_company_ad_id': ''
        #    } # no product feed, high deeplinking risk, high risk of having clicks erased!
        #
        #5: {
        #    'partners_company_name': 'FARFETCH_CJ',
        #    'partners_company_id': '5172007',
        #    'partners_company_ad_id': ''
        #},  # no product feed -> not worth it .. geographic scraping (potential error) issue

}

partner_to_fetch_num = 1

add_products_to_table(

    site_name=partners[partner_to_fetch_num]['partners_company_name'],
    partners_id=partners[partner_to_fetch_num]['partners_company_id'],
    ad_id=partners[partner_to_fetch_num]['partners_company_ad_id'],
    mininum_commission_target_detected_currency_value= 200, # USD200 TO AED = AED 734.41 => MAY 8
    is_upload_to_wx=False
)


# retrieve realtime commissions
# retrieve_cj_data(
#     company_name= company_name,
#     is_get_company_commission= True
# )

# print(f'commission: {commission}')



# PROCESS, SHORTEN LINKS AND UPLOAD ROW FOR:
# 1. THE_LUXURY_CLOSET_CJ
# 2. SAMSUNG_UAE_CJ

# for index in range(1, 3):
#
#     # print(index)
#
#     partner_to_fetch_num = index
#
#     add_products_to_table(
#
#         site_name=partners[partner_to_fetch_num]['partners_company_name'],
#         partners_id=partners[partner_to_fetch_num]['partners_company_id'],
#         ad_id=partners[partner_to_fetch_num]['partners_company_ad_id'],
#         is_upload_to_wx=False
#
#     )