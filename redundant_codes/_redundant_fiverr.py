import pandas as pd
import numpy as np

# dataframe
fiver_graphics_and_logo = pd.read_csv('/Users/admin/Downloads/fiverr_graphics_and_design_updated.csv')

print(fiver_graphics_and_logo.columns)

# convert review count to absolutes
# gigs_review_count = fiver_graphics_and_logo[['fiverr_graphics_and_design_gigreviewcount']]
# gigs_review_count = gigs_review_count.abs()

# fiver_graphics_and_logo.fiverr_graphics_and_design_gigreviewcount = gigs_review_count

# print(gigs_review_count)

fiver_graphics_and_logo = fiver_graphics_and_logo[[
    'fiverr_graphics_and_design_gigs_link-href',
    'fiverr_graphics_and_design_seller_name',

    'fiverr_graphics_and_design_gigstitle',
    'fiverr_graphics_and_design_gigstars',
    'fiverr_graphics_and_design_gigreviewcount',

    'fiverr_graphics_and_design_basicprice',
    'fiverr_graphics_and_design_standardprice',
    'fiverr_graphics_and_design_premiumprice',

    'fiverr_graphics_and_design_basicdeliverytime',
    'fiverr_graphics_and_design_standarddeliverytime',
    'fiverr_graphics_and_design_premiumdeliverytime',

    'fiverr_graphics_and_design_basicnumberofrevisions',
    'fiverr_graphics_and_design_standardnumberofrevisions',
    'fiverr_graphics_and_design_premiumnumberofrevisions',

    'fiverr_graphics_and_design_basic_whatyouget',
    'fiverr_graphics_and_design_standardwhatyouget',
    'fiverr_graphics_and_design_premiumwhatyouget',

    'fiverr_graphics_and_design_about'

]]


# settings
pd.set_option('display.max_rows', 500)
pd.set_option('display.max_columns', 500)
pd.set_option('expand_frame_repr', False)
pd.set_option('display.max_colwidth', None)

# print(fiver_graphics_and_logo.columns)
# for i in range(len(fiver_graphics_and_logo)):
#
#     isAboutNull = fiver_graphics_and_logo[['fiverr_graphics_and_design_about']].loc[i].isnull()[0]
#     # print(f"about: \n{about}, \n\ntype: {type(about)} \n\nisnulltest : {about.isnull()}")
#     # print()
#
#     isPriceNull = fiver_graphics_and_logo[['fiverr_graphics_and_design_basicstandardandpremiumprices']].loc[i].isnull()[0]
#     # print(f"price: \n{prices}, \n\ntype: {type(prices)}, \n\nisnulltest : {prices.isnull()[0]}")
#     # print('-------')
#
#
#     if isAboutNull == True and isPriceNull == True:
#         fiver_graphics_and_logo.drop(index = i, axis = 0, inplace= True)

print(fiver_graphics_and_logo.head(500))