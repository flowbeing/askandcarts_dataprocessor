import time
import traceback
import currency_converter as c

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
                                minimum_profit_target=150,
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


                    non_amazon_filter_data_points_count = non_amazon_variant_filter_function(
                        file_name=scraped_sitemap_csv_file_name,
                        file_address=scraped_sitemap_csv_file_address,
                        minimum_profit_target=150,
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

