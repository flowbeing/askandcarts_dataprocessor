import time
import traceback

from operations.other_operations.convert_minimum_profit import convert_minimum_profit

from settings.commissions import *
from filters.filter_amazon import *
from filters.filter_anthropologie import *
from filters.filter_ashford import *
from filters.filter_fnp_ae import *
from filters.filter_fwrd import *
from filters.filter_jimmychoo import *
from filters.filter_livwatches import *
from filters.filter_mujeri import *
from filters.filter_theluxurycloset import *
from filters.filter_watches_com import *


filter_functions_per_site = {
    'AMAZON_AE': filter_amazon_scraped_data,
    'AMAZON_SG': filter_amazon_scraped_data,
    'AMAZON_US': filter_amazon_scraped_data,
    'ANTHROPOLOGIE': filter_anthropologie_scraped_data,
    'ASHFORD': filter_ashford_scraped_data,
    'FNP_AE': filter_fnp_ae_scraped_data,
    'FWRD': filter_fwrd_scraped_data,
    'JIMMY_CHOO': filter_jimmychoo_scraped_data,
    'LIVWATCHES': filter_livwatches_scraped_data,
    'MUJERI': filter_mujeri_scraped_data,
    'THE_LUXURY_CLOSET': filter_theluxurycloset_scraped_data,
    # making up for the luxury closet's naming error
    'THE_LUXURY_STORE': filter_theluxurycloset_scraped_data,
    'WATCHES_COM': filter_watches_com_scraped_data
}

# future -> rimowa, rado, nanushka


def process_scraped_site(
        scraped_sitemap_csv_file_name,
        scraped_sitemap_csv_file_address
):

    list_of_amazon_variants = list(commission_per_site.keys())[0:3]
    list_of_amazon_countries_syntax = ['_UAE_', '_SINGAPORE_', ['_USA_', '_US_']]
    list_of_non_amazon_variants = list(commission_per_site.keys())[3:]

    current_csv_file_data_points_count = 0

    # OBTAINING MINIMUM PROFIT'S VALUE IN USD
    minimum_profit = 10000  # 10,000 to allow for easy spotting of errors
    eur_to_sgd_exchange_rate = 0
    currency_symbol = ''

    if 'USA' in scraped_sitemap_csv_file_name or 'US' in scraped_sitemap_csv_file_name:
        minimum_profit = 150
        currency_symbol = '$'

    # Because jimmy_choo returns singapore prices as eur. Hence, the need to convert those prices to sgd
    elif 'SINGAPORE' in scraped_sitemap_csv_file_name and 'JIMMY_CHOO' in scraped_sitemap_csv_file_name:
        try:
            print('here')
            conversion = convert_minimum_profit(
                is_usd_to_sgd=True,
                is_get_eur_to_sgd_exchange_rate=True
            )
            minimum_profit = conversion['minimum_profit_target_usd_to_sgd']
            eur_to_sgd_exchange_rate = conversion['eur_to_sgd_exchange_rate']
            currency_symbol = 'S$'
        except:
            raise Exception('There was an error while:\n '
                            'a. converting the minimum profit from USD to SGD\n'
                            'b. retrieving the exchange rate EUR/SGD')

    elif 'SINGAPORE' in scraped_sitemap_csv_file_name:

        try:
            conversion = convert_minimum_profit(
                is_usd_to_sgd=True
            )
            minimum_profit = conversion['minimum_profit_target_usd_to_sgd']
            currency_symbol = 'S$'
        except:
            raise Exception('There was an error while:\n '
                            'a. converting the minimum profit from USD to SGD')


    elif 'UAE' in scraped_sitemap_csv_file_name:
        try:
            conversion = convert_minimum_profit(
                is_usd_to_aed=True
            )
            minimum_profit = conversion['minimum_profit_target_usd_to_aed']
            currency_symbol = 'AED '
        except:
            raise Exception('There was an error while:\n '
                            'a. converting the minimum profit from USD to AED')

    # time.sleep(5)

    print()
    print(f'minimum_profit: {currency_symbol}{minimum_profit}')
    print(f'eur_to_sgd_exchange_rate: {eur_to_sgd_exchange_rate}')

    print()
    # Get the commission for the current product per its relevant amazon variant
    if 'AMAZON' in scraped_sitemap_csv_file_name:

        for amazon_variant in list_of_amazon_variants:

            index_of_current_amazon_variant = list_of_amazon_variants.index(amazon_variant)

            amazon_variants_country_syntax = list_of_amazon_countries_syntax[index_of_current_amazon_variant]
            amazon_variants_country_syntax_one = ''
            amazon_variants_country_syntax_two = ''

            # making up for '_US_' '_USA_' file naming mismatch
            if type(amazon_variants_country_syntax) == list:
                amazon_variants_country_syntax_one = amazon_variants_country_syntax[0]
                amazon_variants_country_syntax_two = amazon_variants_country_syntax[1]
            else:
                amazon_variants_country_syntax_one = amazon_variants_country_syntax
                amazon_variants_country_syntax_two = amazon_variants_country_syntax

            print(f'{amazon_variants_country_syntax} {scraped_sitemap_csv_file_name}')


            if amazon_variants_country_syntax_one in scraped_sitemap_csv_file_name or \
                    amazon_variants_country_syntax_two in scraped_sitemap_csv_file_name:

                amazon_variants_product_categories = commission_per_site[amazon_variant]

                for product_category in amazon_variants_product_categories:

                    if product_category in scraped_sitemap_csv_file_name:

                        current_products_commission_as_per_amazon_variant = amazon_variants_product_categories[product_category]

                        try:

                            amazon_variant_filter_function = filter_functions_per_site[amazon_variant]

                            amazon_filter_data_points_count = amazon_variant_filter_function(
                                file_name = scraped_sitemap_csv_file_name,
                                file_address=scraped_sitemap_csv_file_address,
                                minimum_profit_target=minimum_profit,
                                commission_per_sale=current_products_commission_as_per_amazon_variant,
                                minimum_ratedBy=3,
                                ref_link=''
                            )

                            current_csv_file_data_points_count = amazon_filter_data_points_count

                            # print(f'{amazon_filter_data}')


                        except:

                            time.sleep(3)
                            print()
                            traceback.print_exc()
                            time.sleep(3)

                            raise Exception(f'There was an error while trying to filter {scraped_sitemap_csv_file_name}')

                        break

                break





    else:

        for non_amazon_variant in list_of_non_amazon_variants:

            if non_amazon_variant in scraped_sitemap_csv_file_name:

                non_amazon_variants_commission = commission_per_site[non_amazon_variant]

                try:

                    non_amazon_variant_filter_function = filter_functions_per_site[non_amazon_variant]
                    # print(f'non_amazon_variant_filter_function: {non_amazon_variant_filter_function}')

                    non_amazon_filter_data_points_count = 0

                    if 'JIMMY_CHOO' in scraped_sitemap_csv_file_name:
                        non_amazon_filter_data_points_count = non_amazon_variant_filter_function(
                            file_name=scraped_sitemap_csv_file_name,
                            file_address=scraped_sitemap_csv_file_address,
                            minimum_profit_target=minimum_profit,
                            eur_to_sgd_exchange_rate = eur_to_sgd_exchange_rate,
                            commission_per_sale=non_amazon_variants_commission,
                            ref_link=''
                        )

                    else:
                        non_amazon_filter_data_points_count = non_amazon_variant_filter_function(
                            file_name=scraped_sitemap_csv_file_name,
                            file_address=scraped_sitemap_csv_file_address,
                            minimum_profit_target=minimum_profit,
                            commission_per_sale=non_amazon_variants_commission,
                            ref_link=''
                        )

                    current_csv_file_data_points_count = non_amazon_filter_data_points_count

                    # print(f'{non_amazon_filter_data}')

                except:

                    time.sleep(3)
                    print()
                    traceback.print_exc()
                    time.sleep(3)


                    raise Exception(f'There was an error while trying to filter {scraped_sitemap_csv_file_name}')

                break

    return current_csv_file_data_points_count


duplicates_within_folders = {
}

folder_name_value = duplicates_within_folders.get('folder_name', None)

if folder_name_value == None:
    folder_name_value = duplicates_within_folders['folder'] = {}
else:
    folder_name_value  = duplicates_within_folders['folder']

duplicates_value = folder_name_value.get('duplicates_value', None)

if duplicates_value == None:
    duplicate_value = folder_name_value['duplicates_value'] = []
else:
    duplicates_value = folder_name_value['duplicates_value']

print(duplicates_within_folders)

