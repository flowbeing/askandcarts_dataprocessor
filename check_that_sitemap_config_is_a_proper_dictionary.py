def check_that_sitemap_config_is_a_proper_dictionary(sitemaps_config):

    for sitemaps_config_key in sitemaps_config:
        value_in_focus = sitemaps_config[sitemaps_config_key]
        values_within_selectors = sitemaps_config['selectors']

        print()
        print(f'sitemaps_config_key :{sitemaps_config_key}, value: {type(value_in_focus)}')
        print()

        if sitemaps_config_key == 'selectors':
            for selectordict in values_within_selectors:
                print()
                print(f''
                      f'sitemaps_config_key :{sitemaps_config_key}, '
                      f'sitemaps_config_keys_subkey: {sitemaps_config_key[:-1]}, '
                      f'value: {type(selectordict)}'
                      )

                for key in selectordict:
                    print(f'{key}: {selectordict[key]}, {type(selectordict[key])} ')
                # for iii in ii:
                    # print(f'iii: {iii}')
        # print(f'{i}, {type(i)}: {sitemaps_config[i]}')