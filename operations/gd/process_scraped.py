from operations.gd import filings

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

commission_per_sale = {
    'WATCHES': {
     'AMAZON_AE': .08,
     'AMAZON_SG': .12,
     'AMAZON_US': .04,
     'ANTHROPOLOGIE': 0,
     'ASHFORD': 0,
     'FNP_AE': 0,
     'FWRD': 0,
     'JIMMY_CHOO': 0,
     'LIVWATCHES': 0,
     'MUJERI': 0,
     'THELUXURYCLOSET': 0,
     'WATCHES': 0
    },
    'HANDBAG',
    'SHOES',
    'BELT',
    'BRACELETS',
    'FURNITURES',
    'CLOTHINGS',
    'EARRINGS',
    'PERFUMES',
    'NECKLACES',
    'FLOWERS',
    'TRAVEL BAGS',
    'RINGS',
    'HANDBAGS',
    'BAGS',
    'SHOES',
    'ACCESSORIES'

}


def process_scraped(
        scraped_sitemap_csv_file_name,
        scraped_sitemap_csv_file_address
):
    if 'AMAZON' in scraped_sitemap_csv_file_name and 'UAE' in scraped_sitemap_csv_file_name:
        filter_amazon_scraped_data(
            file_address=scraped_sitemap_csv_file_address,
            minimum_profit_target=120,
            commission_per_sale=.05,
            minimum_ratedBy=3,
            ref_link=''
        )
