# REQUEST FOR (BYTE DATA) SITEMAP
# FIRST STEP OF MANUAL URL BYTE TO DICTIONARY CONVERSION
def single_sitemap_byte_data_request(url):

    get_request = requests.get(url)

    # print response header -> view rate limit
    print(f"X-RateLimit-Remaining: {get_request.headers['X-RateLimit-Remaining']}")

    # returned data is a byte typed data
    data_returned = get_request.content

    return data_returned




# CONVERT BYTE OR STRING DATA TO DICTIONARY -> SECOND OF MANUAL URL BYTE TO DICTIONARY CONVERSION
def convert_byte_or_string_data_to_dict(bytedata):

    byte_data_as_str = str(bytedata)

    forwardslash = chr(92)
    doublequote = chr(34)

    # remove all '\' char from sitemap's response string
    byte_data_as_str = byte_data_as_str.replace(forwardslash, '')

     # print(byte_data_as_str)

    # replace all " char after "sitemap:" and before }] with ' ( in sitemap's response string)

    index_count = 0

    # print()
    # print(f'len_byte_data_str: {len(byte_data_as_str)}')

    # print(f'type(byte_data_as_str: {type(byte_data_as_str)}')

    byte_data_as_str_as_list = [char for char in byte_data_as_str]

    # print(f'byte_data_as_str_as_list:{byte_data_as_str_as_list}')

    index_first_constraint = byte_data_as_str.index('map') + 5  # implies everything after "sitemap":"{
    index_ending_constraint = byte_data_as_str.index('}"}}') # "}]"  # implies the end of a 'sitemap' dictionary

    # print(f'index_first_constraint: {index_first_constraint}')
    # print(f'index_ending_constraint: {index_ending_constraint}')
#
    # print()

    for character in byte_data_as_str:

        if len(byte_data_as_str_as_list) > index_count > index_first_constraint \
                and index_count < index_ending_constraint \
                and character == '"':
            byte_data_as_str_as_list[index_count] = "'"

        index_count += 1
        # print('here')

    # print(f'index_count: {index_count}')

    byte_data_as_str_as_list.pop(0) # remove 'b'
    byte_data_as_str_as_list.pop(0) # remove '
    byte_data_as_str_as_list.pop(-1) # remove '

    byte_data_as_str = "".join(char for char in byte_data_as_str_as_list)
    # print(byte_data_as_str)

    # for i in byte_data_as_str:
    #     print(f"{i}: {ord(i)}")

    response = json.loads(byte_data_as_str)
    # print(f'response: {response}')

    return response



# MANUALLY EXTRACT SITEMAP'S DETAILS AND CONFIGURATION FROM RESPONSE DATA DICTIONARY (AS A DICTIONARY)
# THIRD STEP OF MANUAL URL BYTE TO DICTIONARY CONVERSION
def extract_sitemap_details_and_config_from_response_data_dict_manually(response_data_dict):

    sitemap_details = response_data_dict['data']
    sitemaps_config = sitemap_details['sitemap']
    sitemaps_config_list = ['"' if i == "'" else i for i in sitemaps_config]
    sitemaps_config = ''.join(sitemaps_config_list)

    # convert sitemap's configuration from string to dictionary
    # sitemaps_config = json.loads(sitemaps_config)

    # replace sitemap's configuration in sitemap'sR details with it's dictionary equivalent
    # sitemaps_configuration = sitemaps_configuration_dictionary

    print(f'sitemaps_config: {sitemaps_config}')
    # print(f"'selector' index: {sitemaps_config.find('selector')}")
    # print(sitemaps_config[44:54])
    # print(set(sitemaps_config))

    print()

    index_range_that_contain_selector_without_selectors = []
    index_range_that_contain_starturl = []
    index_count = 0
    limit = index_count + 9 # has to be 9 to accommodate the word 'selectors'

    # OBTAIN THE POSITION OF 'SELECTOR' (KEY) THAT'S NOT PART OF A 'SELECTORS' (KEY)
    for character in sitemaps_config:

        # print(f'index:limit - {index_count}:{limit}')
        # print(f'index:limit - {index_count}:{limit}')
        if limit < len(sitemaps_config) \
                and character == "s" \
                and sitemaps_config[index_count: limit - 1] == 'selector' \
                and sitemaps_config[index_count: limit] != 'selectors':

            index_range_that_contain_selector_without_selectors.append((index_count, limit - 1))
            # print(f'index - {index_count}:{limit - 1}')
            # print(sitemaps_config[index_count: limit - 1])
            # print()

        if limit < len(sitemaps_config) \
                and character == "s" \
                and sitemaps_config[index_count: limit - 1] == 'startUrl':
            index_range_that_contain_starturl.append((index_count, limit - 1))


        index_count += 1
        limit = index_count + 9

    # print(index_range_that_contain_selector_without_selectors)
    print(f'index_range_that_contain_starturl: {index_range_that_contain_starturl}')

    index_of_each_comma_after_selector_without_selectors = []
    index_of_each_comma_after_starturl = []

    # OBTAIN THE POSITION OF ',' AFTER EACH 'SELECTOR' KEY THAT'S NOT PART OF A 'SELECTORS' (KEY)
    for i in index_range_that_contain_selector_without_selectors:
        index_in_focus = i[1] - 1
        list_in_focus = sitemaps_config[index_in_focus:]

        count_till_comma_selector = 0
        for ii in list_in_focus:
            if ii == ',':
                index_of_each_comma_after_selector_without_selectors.append(index_in_focus + count_till_comma_selector)
                break

            count_till_comma_selector += 1


    for i in index_range_that_contain_starturl:
        index_in_focus = i[1] - 1
        list_in_focus = sitemaps_config[index_in_focus:]

        count_till_comma_startup = 0
        for ii in list_in_focus:
            if ii == ',':
                index_of_each_comma_after_starturl.append(index_in_focus + count_till_comma_startup)
                break


            count_till_comma_startup += 1


    # print(f'index_of_each_comma_after_selector_without_selectors: {index_of_each_comma_after_selector_without_selectors}')


    # TEST WHETHER OR NOT OBTAINED INDEX OF EACH COMMA FROM 'SELECTOR' (KEY) WORKS
    # for i in index_of_each_comma_after_selector_without_selectors:
    #     print(type(i))
    #     print(print(f'comma: {sitemaps_config[i]}'))


    #
    # OBTAIN CHARACTERS BETWEEN ' SELECTOR":" ' AND ITS IMMEDIATE ' ",'
    start_index_of_chars_btw = [i[1]+3 for i in index_range_that_contain_selector_without_selectors]
    end_index_of_chars_btw = [i-1 for i in index_of_each_comma_after_selector_without_selectors]
    range_char_btw = zip(start_index_of_chars_btw, end_index_of_chars_btw)

    for i in range_char_btw:
        start_index = i[0]
        end_index = i[1]

        chars_in_focus = sitemaps_config[i[0] : i[1]]
        # chars_in_focus_list = [char for char in chars_in_focus]

        chars_in_focus = chars_in_focus.replace('"', "'")

        # UPDATE DATA WITHIN SITEMAPS_CONFIG
        chars_in_focus_sitemaps_config = sitemaps_config[start_index:end_index]
        sitemaps_config = sitemaps_config.replace(chars_in_focus_sitemaps_config, chars_in_focus)

        # print(f'start_index,end_index - {start_index}:{end_index}')
        # print(chars_in_focus)
        # print(sitemaps_config[start_index:end_index])


        # print()

    # OBTAIN CHARACTERS BETWEEN ' STARTURL":[" ' AND ITS IMMEDIATE ' ",'
    start_index_of_chars_btw = [i[1] + 2 for i in index_range_that_contain_starturl]
    end_index_of_chars_btw = [i for i in index_of_each_comma_after_starturl]
    range_char_btw = zip(start_index_of_chars_btw, end_index_of_chars_btw)

    for i in range_char_btw:
        start_index = i[0]
        end_index = i[1]

        chars_in_focus = sitemaps_config[i[0]: i[1]]
        chars_in_focus = str(chars_in_focus)
        # chars_in_focus_list = [char for char in chars_in_focus]

        # UPDATE DATA WITHIN SITEMAPS_CONFIG
        chars_in_focus_sitemaps_config = sitemaps_config[start_index:end_index]
        sitemaps_config = sitemaps_config.replace(chars_in_focus_sitemaps_config, chars_in_focus)

        # print(f'start_index,end_index - {start_index}:{end_index}')
        # print(chars_in_focus)
        print(sitemaps_config[start_index:end_index])

    print(f'char 1455: {sitemaps_config[1455:]} ')


        # print()

    # convert sitemap's configuration from string to dictionary
    sitemaps_config = json.loads(sitemaps_config)
    # print(f'sitemaps_config: {sitemaps_config}')
    # print(sitemaps_config)

    return [sitemap_details, sitemaps_config]



# MANUALLY CONVERT URL BYTE DATA TO DICTIONARY --> HAS ISSUES !!!
def extract_sitemap_details_manually_from_url(url):

    byte_response = single_sitemap_byte_data_request(url)
    dict_response = convert_byte_or_string_data_to_dict(byte_response)
    sitemap_data = extract_sitemap_details_and_config_from_response_data_dict_manually(dict_response)

    sitemap_detail_manual = sitemap_data[0]  # sitemap_configuration is a string within this variable
    sitemap_configuration = sitemap_data[1]  # sitemap_configuration is a map within this variable

    # UPDATE SITE CONFIGURATION WITHIN SITEMAP'S DETAIL
    sitemap_detail_manual['sitemap'] = sitemap_configuration
    print(f'sitemap_detail_manual (full dict version) -> {sitemap_detail_manual}')
    # print(f'sitemap_configuration: {sitemap_configuration}')

    return sitemap_detail_manual