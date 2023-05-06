import json
import requests
from settings.q.other_settings import short
from settings.q.default_folder_and_filename_settings import all_log_files_folder, shorts_progress_log

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
        'title': link_title_to_save_as
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

    shortening_operation_data = ''

    if req.status_code == 200:
        response = json.loads(req.text)
        shortened_url = response['shortURL']
        created_at = response['createdAt']
        id_string = response['idString']

        shortening_operation_data = {
            'shortened_url': shortened_url,
            'created_at': created_at,
            'id_string': id_string
        }


    else:
        shortening_operation_data = 'failed_to_shorten'

    return shortening_operation_data # req.text

def shorten_url_filters(
    file_name,
    processed_dataframe_with_affiliate_product_and_image_links,
):
    # SHORTENING LINKS
    # list of links for the current site and their shortened form
    link_shortening_progress = {}

    # GET (LINK SHORTENING) PROGRESS
    with open(f'{all_log_files_folder}{shorts_progress_log}', 'r+') as shorts_progress_log_file:
        shorts_progress_log_json = shorts_progress_log_file.read()
        shorts_progress_log_json_as_dict = json.loads(shorts_progress_log_json)

        last_link_shortening_progress_index_ = shorts_progress_log_json_as_dict.get(file_name, None)

        if last_link_shortening_progress_index_ != None:
            link_shortening_progress = last_link_shortening_progress_index_

        shorts_progress_log_file.close()

    for index in processed_dataframe_with_affiliate_product_and_image_links.index:
        product_title_cj = processed_dataframe_with_affiliate_product_and_image_links.loc[index, 'Title']

        # PRODUCT LINK
        product_link_cj = processed_dataframe_with_affiliate_product_and_image_links.loc[index, 'productLink With Affiliate Link']

        # PRODUCT LINK SHORTENED
        # first - retrieving shortened links and their relative shorts (short form)
        # print(f'link_shortening_progress: {link_shortening_progress}')
        list_of_short_links_id = list(link_shortening_progress.keys())
        list_of_short_links = list(link_shortening_progress.values())

        product_id = processed_dataframe_with_affiliate_product_and_image_links.loc[index, 'productLinkScraped']
        product_links_id = product_id + '-pl'
        image_src_id = product_id + '-is'

        alpha_path = ''
        link_base_count = 1
        short_product_link = ''

        if product_link_cj != '':

            title_copy = f'{product_title_cj}'

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
                    product_title=product_title_cj,
                    product_or_image_link_to_shorten=product_link_cj,
                    path_to_save_shortened_link_to=final_pl_path
                )

            else:
                # use the already existing short value that's associated with the product link rather than the
                # code-generated short link..
                short_product_link = link_shortening_progress[product_links_id]

        # IMAGE SRC
        image_src_cj = processed_dataframe_with_affiliate_product_and_image_links.loc[index, 'image Src With Affiliate Link']
        # IMAGE SRC SHORTENED
        short_image_link = ''

        if image_src_cj != '':
            final_is_path = short_product_link.replace('-pl-',
                                                       '-is-')  # alpha_path + '-is' + f'-{str(link_base_count)}'
            final_is_path_copy = f'{final_is_path}'
            final_is_path = final_is_path.replace('https://shop.askandcarts.com/', '')

            # if image (src) link's not in the list of already shortened links, api shorten it
            if final_is_path.count('failed_to_shorten') > 0:
                # skip if the product link shortening above 'failed_to_shorten' to avoid 'failed_to_shorten' dominos errors
                pass
            elif list_of_short_links_id.count(image_src_id) < 1 and list_of_short_links.count(final_is_path_copy) < 1:

                short_image_link = shorten_url(
                    product_title=product_title_cj,
                    product_or_image_link_to_shorten=image_src_cj,
                    path_to_save_shortened_link_to=final_is_path
                )

            else:
                # use the already existing short value that's associated with the image src rather than the
                # code-generated short link..
                short_image_link = link_shortening_progress[
                    image_src_id]  # 'https://shop.askandcarts.com/' + final_is_path

        # ADDING SHORTENED LINK(S) TO TABLE
        processed_dataframe_with_affiliate_product_and_image_links['productLink'][index] = short_product_link
        processed_dataframe_with_affiliate_product_and_image_links['Image Src'][index] = short_image_link

        # SAVE (LINK SHORTENING) PROGRESS
        with open(f'{all_log_files_folder}{shorts_progress_log}', 'r+') as shorts_progress_log_file_one:
            shorts_progress_log_json = shorts_progress_log_file_one.read()
            shorts_progress_log_json_as_dict = json.loads(shorts_progress_log_json)

            current_sites_shortened_links_dict = shorts_progress_log_json_as_dict.get(file_name, None)

            if current_sites_shortened_links_dict == None:
                shorts_progress_log_json_as_dict[file_name] = {}

            # if the product link or image src have been successfully shortened, add it to the list of shortened
            # urls..
            print(f'short_product_link* : {short_product_link}')
            print(f'short_image_link* : {short_image_link}')
            print('---------------------------------------------')
            print()
            print()
            if short_product_link.count('failed_to_shorten') < 1 and short_product_link != '':
                shorts_progress_log_json_as_dict[file_name][product_links_id] = short_product_link
            if short_image_link.count('failed_to_shorten') < 1 and short_image_link != '':
                shorts_progress_log_json_as_dict[file_name][image_src_id] = short_image_link

            # update 'link_shortening_progress' dict to reflect shortened links additions
            link_shortening_progress = shorts_progress_log_json_as_dict[file_name]

            # print(f'link_shortening_progress*: {link_shortening_progress}')

            shorts_progress_log_dict_as_json = json.dumps(shorts_progress_log_json_as_dict)

            with open(f'{all_log_files_folder}{shorts_progress_log}', 'w+') as shorts_progress_log_file_two:
                shorts_progress_log_file_two.write(shorts_progress_log_dict_as_json)

                shorts_progress_log_file_two.close()

            shorts_progress_log_file_one.close()


