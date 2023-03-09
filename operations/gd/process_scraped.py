import time
import traceback

from operations.other_operations.convert_minimum_profit import convert_minimum_profit

from settings.q.commissions import *
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
    print(f'list_of_non_amazon_variants: {list_of_non_amazon_variants}')

    current_csv_file_data_points_count = 0
    is_file_empty_after_filtering = False

    # OBTAINING MINIMUM PROFIT'S VALUE IN USD
    standard_minimum_profit_usd = 150

    minimum_profit = 10000  # 10,000 to allow for easy spotting of errors
    eur_to_sgd_exchange_rate = 'Not defined'
    usd_to_sgd_exchange_rate = 'Not defined'
    usd_to_aed_exchange_rate = 'Not defined'

    currency_symbol = ''

    if '_USA_' in scraped_sitemap_csv_file_name or '_US_' in scraped_sitemap_csv_file_name:
        minimum_profit = standard_minimum_profit_usd
        currency_symbol = '$'

    # Because jimmy_choo returns singapore prices as eur. Hence, the need to convert those prices to sgd
    elif '_SINGAPORE_' in scraped_sitemap_csv_file_name and 'JIMMY_CHOO' in scraped_sitemap_csv_file_name:
        try:
            print('here')
            minimum_profit_usd_to_sgd_dict = convert_minimum_profit(
                is_usd_to_sgd=True,
                is_get_eur_to_sgd_exchange_rate=True
            )

            value_minimum_profit_usd_to_sgd = minimum_profit_usd_to_sgd_dict['minimum_profit_target_usd_to_sgd']
            minimum_profit = value_minimum_profit_usd_to_sgd

            eur_to_sgd_exchange_rate = minimum_profit_usd_to_sgd_dict['eur_to_sgd_exchange_rate']
            usd_to_sgd_exchange_rate = value_minimum_profit_usd_to_sgd / standard_minimum_profit_usd

            currency_symbol = 'S$'

        except:
            raise Exception('There was an error while:\n '
                            'a. converting the minimum profit from USD to SGD\n'
                            'b. retrieving the exchange rate EUR/SGD')

    elif '_SINGAPORE_' in scraped_sitemap_csv_file_name:

        try:
            minimum_profit_usd_to_sgd_dict = convert_minimum_profit(
                is_usd_to_sgd=True
            )

            value_minimum_profit_usd_to_sgd = minimum_profit_usd_to_sgd_dict['minimum_profit_target_usd_to_sgd']
            minimum_profit = value_minimum_profit_usd_to_sgd

            usd_to_sgd_exchange_rate = value_minimum_profit_usd_to_sgd / standard_minimum_profit_usd

            currency_symbol = 'S$'

        except:
            raise Exception('There was an error while:\n '
                            'a. converting the minimum profit from USD to SGD')


    elif '_UAE_' in scraped_sitemap_csv_file_name:
        try:
            minimum_profit_usd_to_aed = convert_minimum_profit(
                is_usd_to_aed=True
            )

            value_minimum_profit_usd_to_aed = minimum_profit_usd_to_aed['minimum_profit_target_usd_to_aed']
            minimum_profit = value_minimum_profit_usd_to_aed

            usd_to_aed_exchange_rate = value_minimum_profit_usd_to_aed / standard_minimum_profit_usd

            currency_symbol = 'AED '

        except:
            raise Exception('There was an error while:\n '
                            'a. converting the minimum profit from USD to AED')

    # time.sleep(5)

    print()
    print(f'minimum_revenue_per_sale: {currency_symbol}{minimum_profit}')
    print(f'eur_to_sgd_exchange_rate: {eur_to_sgd_exchange_rate}')
    print(f'usd_to_sgd_exchange_rate: {usd_to_sgd_exchange_rate}')
    print(f'usd_to_aed_exchange_rate: {usd_to_aed_exchange_rate}')

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

                            amazon_filter_data_points_count = 0

                            while amazon_filter_data_points_count == 0:

                                amazon_variant_filter_function = filter_functions_per_site[amazon_variant]

                                amazon_filter_data_points_count = amazon_variant_filter_function(
                                    file_name = scraped_sitemap_csv_file_name,
                                    file_address=scraped_sitemap_csv_file_address,
                                    minimum_profit_target=minimum_profit,
                                    commission_per_sale=current_products_commission_as_per_amazon_variant,
                                    minimum_ratedBy=3,
                                    ref_link=''
                                )

                                minimum_profit -= 1  # expected to be in different currencies (USD , SGD, AED)

                                profit_baseline = 0

                                # defining profit baseline
                                if 'UAE' in scraped_sitemap_csv_file_name:
                                    profit_baseline = 100 * usd_to_aed_exchange_rate  # 100 dollars to AED
                                elif 'SINGAPORE' in scraped_sitemap_csv_file_name:
                                    profit_baseline = 100 * usd_to_sgd_exchange_rate  # 100 dollars to SGD
                                else:
                                    profit_baseline = standard_minimum_profit_usd

                                print(f'minimum_profit_here: {minimum_profit}')
                                print(f'profit_baseline: {profit_baseline}')

                                if minimum_profit <= profit_baseline:
                                    break

                            if amazon_filter_data_points_count == 0:
                                is_file_empty_after_filtering = True

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

                    # filter JIMMY_CHOO Singapore's products and convert every price from EUR to SGD while doing it..
                    # Due to JIMMY_CHOO Singapore's
                    if 'JIMMY_CHOO' in scraped_sitemap_csv_file_name and 'SINGAPORE' in scraped_sitemap_csv_file_name:

                        while non_amazon_filter_data_points_count == 0:

                            non_amazon_filter_data_points_count = filter_jimmychoo_scraped_data(
                                file_name=scraped_sitemap_csv_file_name,
                                file_address=scraped_sitemap_csv_file_address,
                                minimum_profit_target=minimum_profit,
                                eur_to_sgd_exchange_rate=eur_to_sgd_exchange_rate,
                                commission_per_sale=non_amazon_variants_commission,
                                ref_link=''
                            )

                            minimum_profit -= 1  # expected to be in SGD

                            profit_baseline = 100 * usd_to_sgd_exchange_rate  # 100 dollars to SGD

                            if minimum_profit <= profit_baseline:
                                break

                        if non_amazon_filter_data_points_count == 0:
                            is_file_empty_after_filtering = True


                    elif 'THE_LUXURY_CLOSET' in scraped_sitemap_csv_file_name and 'SINGAPORE' in scraped_sitemap_csv_file_name:

                        while non_amazon_filter_data_points_count == 0:

                            non_amazon_filter_data_points_count = filter_theluxurycloset_scraped_data(
                                file_name=scraped_sitemap_csv_file_name,
                                file_address=scraped_sitemap_csv_file_address,
                                minimum_profit_target=minimum_profit,
                                usd_to_sgd_exchange_rate = usd_to_sgd_exchange_rate,
                                commission_per_sale=non_amazon_variants_commission,
                                ref_link=''
                            )

                            minimum_profit -= 1  # expected to be in SGD

                            profit_baseline = 100 * usd_to_sgd_exchange_rate  # 100 dollars to SGD

                            if minimum_profit <= profit_baseline:
                                break

                        if non_amazon_filter_data_points_count == 0:
                            is_file_empty_after_filtering = True

                    else:

                        while non_amazon_filter_data_points_count == 0:

                            non_amazon_filter_data_points_count = non_amazon_variant_filter_function(
                                file_name=scraped_sitemap_csv_file_name,
                                file_address=scraped_sitemap_csv_file_address,
                                minimum_profit_target=minimum_profit,
                                commission_per_sale=non_amazon_variants_commission,
                                ref_link=''
                            )

                            minimum_profit -= 1  # expected to be in different currencies (USD , SGD, AED)

                            profit_baseline = 0

                            # defining profit baseline
                            if 'UAE' in scraped_sitemap_csv_file_name:
                                profit_baseline = 100 * usd_to_aed_exchange_rate  # 100 dollars to AED
                            elif 'SINGAPORE' in scraped_sitemap_csv_file_name:
                                profit_baseline = 100 * usd_to_sgd_exchange_rate  # 100 dollars to SGD
                            else:
                                profit_baseline = standard_minimum_profit_usd

                            print(f'minimum_profit_here: {minimum_profit}')
                            print(f'profit_baseline: {profit_baseline}')


                            if minimum_profit <= profit_baseline:
                                break

                        if non_amazon_filter_data_points_count == 0:
                            is_file_empty_after_filtering = True

                    current_csv_file_data_points_count = non_amazon_filter_data_points_count

                    # print(f'{non_amazon_filter_data}')

                except:

                    time.sleep(3)
                    print()
                    traceback.print_exc()
                    time.sleep(3)


                    raise Exception(f'There was an error while trying to filter {scraped_sitemap_csv_file_name}')

                break

    return [current_csv_file_data_points_count, is_file_empty_after_filtering]


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

