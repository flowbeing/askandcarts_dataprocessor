import time

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

import pandas as pd

import traceback

commission_per_site = {

     'AMAZON_AE': {
         'HANDBAG': .09,
         'TRAVEL_BAG': .09,
         'BAG': .09,
         'SHOE': .09,
         'BELT': .09,
         'BRACELET': .08,
         'CLOTHING': .09,
         'EARRING': .08,
         'PERFUME': .07,
         'NECKLACE': .08,
         'RING': .08,
         'WATCHES': .08,
     },

     'AMAZON_SG': {
         'HANDBAG': .1,
         'TRAVEL_BAG': .1,
         'BAG': .1,
         'SHOE': .1,
         'BELT': .1,
         'BRACELET': .12,
         'CLOTHING': .1,
         'EARRING': .12,
         'PERFUME': .055,
         'NECKLACE': .12,
         'RING': .12,
         'WATCHES': .12,
     },

     'AMAZON_US': {
         'HANDBAG': .04,
         'TRAVEL_BAG': .04,
         'BAG': .04,
         'SHOE': .04,
         'BELT': .04,
         'BRACELET': .04,
         'CLOTHING': .04,
         'EARRING': .04,
         'PERFUME': .01,
         'NECKLACE': .04,
         'RING': .04,
         'WATCHES': .04,
     },

     'ANTHROPOLOGIE': .06,
     'ASHFORD': 0.04,
     'FNP_AE': 0.0615,
     'FWRD': 0.06,
     'JIMMY_CHOO': 0.08,
     'LIVWATCHES': 0.2,
     'MUJERI': 0.05,
     'THE_LUXURY_CLOSET': 0.0767,
     # making up for the luxury closet's naming error
     'THE_LUXURY_STORE': 0.0767,
     'WATCHES_COM': 0.1
    }

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


def process_scraped_site(
        scraped_sitemap_csv_file_name,
        scraped_sitemap_csv_file_address
):

    list_of_amazon_variants = list(commission_per_site.keys())[0:3]
    list_of_amazon_countries_syntax = ['_UAE_', '_SINGAPORE_', ['_USA_', '_US_']]
    list_of_non_amazon_variants = list(commission_per_site.keys())[3:]

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

                            amazon_filter_data = amazon_variant_filter_function(
                                file_address=scraped_sitemap_csv_file_address,
                                minimum_profit_target=150,
                                commission_per_sale=current_products_commission_as_per_amazon_variant,
                                minimum_ratedBy=3,
                                ref_link=''
                            )

                            print(f'amazon_filter_data: {amazon_filter_data}')


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

                    non_amazon_variant_filter_function(
                        file_address=scraped_sitemap_csv_file_address,
                        minimum_profit_target=150,
                        commission_per_sale=non_amazon_variants_commission,
                        minimum_ratedBy=3,
                        ref_link=''
                    )

                except:

                    time.sleep(3)
                    print()
                    traceback.print_exc()
                    time.sleep(3)


                    raise Exception(f'There was an error while trying to filter {scraped_sitemap_csv_file_name}')

                break

