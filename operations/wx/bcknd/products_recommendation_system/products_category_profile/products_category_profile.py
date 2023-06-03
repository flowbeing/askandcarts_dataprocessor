from operations.wx.bcknd.products_recommendation_system.products_category_profile.state_id import  state_id
from operations.wx.bcknd.products_recommendation_system.color_detector.color_profiles import *

# function to calculate whether a product's category is 'Adventure'
def is_product_category_adventure(
    products_color
    # price does not have to defined
):
    hsl_color_to_query = calculate_hue_luminousity_and_saturation(products_color)
    hue = hsl_color_to_query['hue']

    # if color is not red, categorise
    if 13 < hue < 345:

        return True

# function to calculate whether a product's category is 'High Class and Power'
def is_product_category_high_class_and_power(
        products_color,
        products_price_usd
):

    hsl_color_to_query = calculate_hue_luminousity_and_saturation(products_color)
    # hue = hsl_color_to_query['hue']

    is_light_pink = is_color_light_pink(products_color)
    is_dark_blue = is_color_dark_blue(products_color)
    is_cream = is_color_cream(products_color)
    is_dark = is_color_dark(products_color)
    is_silvergrey_or_white = is_color_silvergrey_or_white(products_color)

    if (is_light_pink or is_dark_blue or is_cream or is_dark or is_silvergrey_or_white) and products_price_usd > 17500:
        return True


# function to calculate whether a product's category is 'Vibrant and Striking'
def is_product_category_vibrant_and_striking(
        products_color,
):

    is_vibrant = is_color_vibrant_r_g_or_b(products_color)

    if is_vibrant:
        return True


# function to calculate whether a product's category is 'Conservative'
def is_product_category_conservative(
        products_color
):

    is_light_grey = is_color_darkgrey(products_color)

    if is_light_grey:
        return True


# function to calculate whether a product's category is 'Dark'
def is_product_category_dark(
        products_color
):

    is_dark = is_color_dark(products_color)

    if is_dark:
        return True


# function to calculate whether a product's category is 'I'm on a budget'
def is_product_category_on_a_budget(
        product_price_usd
):

    if product_price_usd <= 10000:
        return True



# functoin to calculate categor(ies) State Id
def calc_products_state_id(
        products_color,
        products_price_usd
):
    '''1, 2, 3, 4, 5, 6'''
    is_adventure = is_product_category_adventure(products_color) # 1
    is_high_class_and_power = is_product_category_high_class_and_power(products_color, products_price_usd) # 2
    is_vibrant_and_striking = is_product_category_vibrant_and_striking(products_color) # 3
    is_conservative = is_product_category_conservative(products_color) # 4
    is_dark = is_product_category_dark(products_color) # 5
    is_on_a_budget = is_product_category_on_a_budget(products_price_usd) # 6

    state = ''

    if is_adventure:
        state += '1'
    if is_high_class_and_power:
        state += '2'
    if is_vibrant_and_striking:
        state += '3'
    if is_conservative:
        state += '4'
    if is_dark:
        state += '5'
    if is_on_a_budget:
        state += '6'

    current_state_id = state_id[state]

    return current_state_id




