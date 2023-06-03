import math
import time

from operations.wx.bcknd.products_recommendation_system.color_detector.color_similarity_detection_tools import \
    calculate_hue_luminousity_and_saturation, is_colors_similar

from operations.wx.bcknd.products_recommendation_system.color_detector.color_vision_api import detect_colors, color_distance_specific

# list of 'all' gold colors from pure  gold to rose gold
def generate_all_gold_colors():
    list_of_gold_colors = []

    # for loop to generate gold colors, from yellow gold to rose gold:
    for green in range(215, 256):

        for blue in range(0, 208):
            current_gold_rgb = (255, green, blue)
            list_of_gold_colors.append(current_gold_rgb)
            # print(f"{current_gold_rgb},")


    return list_of_gold_colors


# function to detect whether a color is a gold color
def is_gold_color_in_color(
        rgb_tuple_color_to_query
):
    is_gold_color = False
    valid_gold_color_shade = ''
    valid_gold_color = ''
    distance_of_valid_gold_color_shade_from_second_color = ''
    diff_in_hue_valid_color_shade_from_second_color = ''

    gold_color_profile = reverse_engineer_suitable_gold_list_to_search_for_match(
        rgb_tuple_color_to_query
    )

    for gold_color in gold_color_profile:

        is_color_gold = is_colors_similar(
            gold_color,
            rgb_tuple_color_to_query,
            is_specifically_close_colors_only=True
        )

        is_color_gold_bool = is_color_gold['is_colors_similar_boolean']
        similar_gold_color_shade = is_color_gold['similar_color_shade']



        if is_color_gold_bool:

            is_gold_color = True
            valid_gold_color_shade = similar_gold_color_shade
            valid_gold_color = gold_color
            distance_of_valid_gold_color_shade_from_second_color = \
                is_color_gold['distance_of_valid_color_shade_from_second_color']
            diff_in_hue_valid_color_shade_from_second_color = is_color_gold['diff_in_hue_valid_color_shade_from_second_color']

            # print(f'color_distance: {color_distance}, gold color: {gold_color}, query color: {rgb_tuple_color_to_query}')
            print()
            print(f'is_color_gold: {is_color_gold_bool}\n'
                  f'query color: {rgb_tuple_color_to_query}\n'
                  f'valid gold color: {gold_color}\n'
                  f'valid gold color shade: {similar_gold_color_shade}')


    return {
            'is_gold_color': is_gold_color,
            'query_color': rgb_tuple_color_to_query,
            'valid_gold_color_shade': valid_gold_color_shade,
            'valid_gold_color': valid_gold_color,
            'distance_of_valid_gold_color_shade_from_second_color': distance_of_valid_gold_color_shade_from_second_color,
            'diff_in_hue_valid_color_shade_from_second_color': diff_in_hue_valid_color_shade_from_second_color
    }


print()
def detect_dominant_gold_color_in_product_image(
        dominant_color_in_product_image,
        most_dominant_color_confidence_score = 0,
        most_dominant_color_pixel_fraction = 0,
        list_of_other_colors_in_image = {}
):

    # RETURN VALUES
    is_color_gold = False
    query_color = ''
    valid_gold_color_shade = ''
    valid_gold_color = ''
    distance_of_valid_gold_color_shade_from_second_color = ''
    confidence_score_most_dominant_color = ''
    confidence_score_other_detected_gold_color = ''
    confidence_detected_other_gold_color_over_dominant_color = ''

    result_detected_gold_colors = {}
    detected_gold_color_final = {}

    # ------
    # DETECTING WHETHER DOMINANT COLOR IS A GOLD COLOR
    is_dominant_color_gold_color = is_gold_color_in_color(
        dominant_color_in_product_image
    )

    is_dominant_color_gold = is_dominant_color_gold_color['is_gold_color']

    if is_dominant_color_gold:
        is_color_gold = is_dominant_color_gold
        query_color = dominant_color_in_product_image
        valid_gold_color_shade = is_dominant_color_gold_color['valid_gold_color_shade']
        valid_gold_color = is_dominant_color_gold_color['valid_gold_color']
        distance_of_valid_gold_color_shade_from_second_color = \
            is_dominant_color_gold_color['distance_of_valid_gold_color_shade_from_second_color']
        diff_in_hue_valid_color_shade_from_second_color = is_dominant_color_gold_color['diff_in_hue_valid_color_shade_from_second_color']
        confidence_score_most_dominant_color = most_dominant_color_confidence_score

        detected_gold_color_final = {
            'is_gold_color': is_color_gold,
            'query_color': query_color,
            'valid_gold_color_shade': valid_gold_color_shade,
            'valid_gold_color': valid_gold_color,
            'distance_of_valid_gold_color_shade_from_second_color': distance_of_valid_gold_color_shade_from_second_color,
            'diff_in_hue_valid_color_shade_from_second_color': diff_in_hue_valid_color_shade_from_second_color,
            'pixel_fraction_most_dominant_color': most_dominant_color_pixel_fraction,
            'confidence_score_other_detected_gold_color': confidence_score_other_detected_gold_color,
            'confidence_score_most_dominant_color': confidence_score_most_dominant_color,
            'confidence_detected_other_gold_color_over_dominant_color': confidence_detected_other_gold_color_over_dominant_color,
            'most_dominant_color': dominant_color_in_product_image,
            'is_dominant_color_gold': is_dominant_color_gold,
        }



    elif is_dominant_color_gold == False:

        # ----
        other_colors_in_product_image = list_of_other_colors_in_image
        list_of_other_gold_colors_in_image_if_any = {}

        # first, search for gold colors with predefined (horizontal positioned) gold colors
        detected_gold_color_count = 0
        for other_color in other_colors_in_product_image:

            if other_color[0] > 150: # limiting the number of colors to search for gold colors within 'list_of_other_colors_in_image'

                calc_gold_color = is_gold_color_in_color(
                    other_color
                )

                # update gold color as detected within other_colors_in_product_image
                if calc_gold_color['is_gold_color']:
                    print()
                    other_gold_colors_confidence_score = other_colors_in_product_image[other_color]['confidence_score']
                    other_gold_colors_pixel_fraction = other_colors_in_product_image[other_color]['pixel_fraction']
                    print(f'pixel fraction other gold color: {other_gold_colors_pixel_fraction}')
                    print(f'confidence level other gold color: {other_gold_colors_confidence_score}')
                    print(f"confidence level dominant color: {most_dominant_color_confidence_score}")
                    print()

                    # list_of_other_gold_colors_in_image_if_any[other_color] = {}
                    # list_of_other_gold_colors_in_image_if_any[other_color]['other_colors_confidence_score'] = other_gold_colors_confidence_score
                    # list_of_other_gold_colors_in_image_if_any[other_color]['valid_gold_color_shade'] = valid_gold_color_shade
                    # list_of_other_gold_colors_in_image_if_any['dominant_gold_color_in_product_image'] = dominant_color_in_product_image


                    # Checking whether the detected gold color has a dominance that's close to that of the most dominant
                    # color
                    confidence_detected_other_gold_color_over_dominant_color = \
                        f'{(other_gold_colors_confidence_score / most_dominant_color_confidence_score) * 100:.2f}%'

                    print(f'confidence_detected_other_gold_color_over_dominant_color: {confidence_detected_other_gold_color_over_dominant_color}')

                    # UPDATING DETECTED GOLD COLORS LIST
                    is_color_gold = True
                    query_color = other_color
                    valid_gold_color_shade = calc_gold_color['valid_gold_color_shade']
                    valid_gold_color = calc_gold_color['valid_gold_color']
                    distance_of_valid_gold_color_shade_from_second_color = \
                        calc_gold_color['distance_of_valid_gold_color_shade_from_second_color']
                    diff_in_hue_valid_color_shade_from_second_color = \
                        calc_gold_color['diff_in_hue_valid_color_shade_from_second_color']
                    confidence_score_other_detected_gold_color = other_gold_colors_confidence_score
                    confidence_score_most_dominant_color = most_dominant_color_confidence_score

                    result_detected_gold_colors[detected_gold_color_count] = {
                        'is_gold_color': is_color_gold,
                        'query_color': query_color,
                        'valid_gold_color_shade': valid_gold_color_shade,
                        'valid_gold_color': valid_gold_color,
                        'distance_of_valid_gold_color_shade_from_second_color': distance_of_valid_gold_color_shade_from_second_color,
                        'diff_in_hue_valid_color_shade_from_second_color': diff_in_hue_valid_color_shade_from_second_color,
                        'pixel_fraction_other_detected_gold_color': other_gold_colors_pixel_fraction,
                        'confidence_score_other_detected_gold_color': confidence_score_other_detected_gold_color,
                        'confidence_score_most_dominant_color': confidence_score_most_dominant_color,
                        'confidence_detected_other_gold_color_over_dominant_color': confidence_detected_other_gold_color_over_dominant_color,
                        'most_dominant_color': dominant_color_in_product_image,
                        'is_dominant_color_gold': is_dominant_color_gold,
                    }

                    # stop if the detected gold color within 'list_of_other_colors_in_image' is lesser than 5
                    # (hue) points
                    if diff_in_hue_valid_color_shade_from_second_color < 5:
                        break

                    detected_gold_color_count += 1

        # setting which of the detected gold colors within 'result_detected_gold_colors' should be returned as the final
        # gold value..
        pixel_fraction_tracker = 0.0
        for other_detected_gold_color_index in result_detected_gold_colors:

            other_detected_gold_color = result_detected_gold_colors[other_detected_gold_color_index]
            other_detected_gold_color_pixel_fraction = other_detected_gold_color['pixel_fraction_other_detected_gold_color']
            other_detected_gold_color_confidence = other_detected_gold_color['confidence_score_other_detected_gold_color']

            if float(other_detected_gold_color_pixel_fraction) > pixel_fraction_tracker and \
                    other_detected_gold_color_pixel_fraction > 0.014:

                detected_gold_color_final = other_detected_gold_color
                pixel_fraction_tracker = other_detected_gold_color_pixel_fraction



        # if the detected gold color(s) is not close enough to the second color, adjust the green factor of the rgb
        # to find the closest gold color shade that matches the second color
        # for detected_other_gold_color_key in result_detected_gold_colors:
        #
        #     detected_other_gold_color_data = result_detected_gold_colors[detected_other_gold_color_key]
        #
        #     detected_other_gold_colors_distance_from_second_color = detected_other_gold_color_data['distance_of_valid_gold_color_shade_from_second_color']
        #     detected_other_gold_color_query = detected_other_gold_color_data['query_color']
        #     detected_other_gold_color_valid =  \
        #         list([float(color_code) for color_code in detected_other_gold_color_data['valid_gold_color']])
        #
        #
        #     if detected_other_gold_colors_distance_from_second_color > 3:
        #
        #         detected_variant_count = 0
        #         for green_factor in range(215, 256):
        #
        #             detected_other_gold_color_valid[1] = green_factor
        #             detected_other_gold_color_variant = tuple(detected_other_gold_color_valid)
        #
        #             # redetection: detecting whether the current variant of the detected gold color
        #             # (from other color in image list) is closer to the detected other gold color
        #             # (i.e gold color detected within list_of_other_colors_in_image)
        #             is_detected_other_gold_color_similar_to_variant = is_colors_similar(
        #                 detected_other_gold_color_variant,
        #                 second_color=detected_other_gold_color_query,
        #                 is_main_color_gold=True
        #             )
        #
        #             detected_other_gold_colors_current_variant_distance_from_second_color =  \
        #                 is_detected_other_gold_color_similar_to_variant['distance_of_valid_color_shade_from_second_color']
        #
        #             # update detected other gold color's data with its detected valid variant
        #             if detected_other_gold_colors_current_variant_distance_from_second_color < 17:
        #
        #                 valid_variant_shade = is_detected_other_gold_color_similar_to_variant['similar_color_shade']
        #
        #                 result_detected_gold_colors[detected_other_gold_color_key]['variants'] = {}
        #
        #                 result_detected_gold_colors[detected_other_gold_color_key]['variants'][detected_variant_count] = {
        #                     'first_detected_other_gold_color_variant': detected_other_gold_color_variant,
        #                     'second_detected_other_gold_color_query': detected_other_gold_color_query,
        #                     'valid_variant_shade': valid_variant_shade,
        #                     'distance_of_valid_variant_shade_from_detected_other_gold_color': detected_other_gold_colors_current_variant_distance_from_second_color,
        #                 }
        #
        #                 detected_variant_count += 1
                    
                    




    print()
    if len(detected_gold_color_final) == 0:
        return None
    else:
        return detected_gold_color_final



# function to get the maximum and minimum hue values for all defined gold colors (from (255, 215, 0) to (255, 255, 207))
def get_max_and_min_hue_in_list_of_all_gold_colors():

    hue_list = []

    # hue_color = calculate_hue_luminousity_and_saturation(
    #     (255, 255, 207) # (255, 215, 0) #
    # )

    for green in range(215, 256):

        for blue in range(0, 208):
            current_gold_rgb = (255, green, blue)

            hue_color = calculate_hue_luminousity_and_saturation(
                (current_gold_rgb)  # (255, 215, 0) #
            )

            if type(hue_color) != float:
                hue_color = hue_color['hue']

            hue_list.append(hue_color)
            # print(f"{current_gold_rgb},")

    print(f'max_hue_value: {max(hue_list)}, min_hue_value: {min(hue_list)}')

get_max_and_min_hue_in_list_of_all_gold_colors()
print()


# function to obtain a minimized version of list of all gold colors that has been defined within the
# 'generate_all_gold_colors' function
def reverse_engineer_suitable_gold_list_to_search_for_match(
        color_to_query
):

    '''color to query's hue:'''
    hue_color_to_query = calculate_hue_luminousity_and_saturation(
        (color_to_query)  # (255, 215, 0) #
    )

    if type(hue_color_to_query) != float:
        hue_color_to_query = hue_color_to_query['hue']


    # REVERSE ENGINEERING
    '''
    gold mininum color code = (255, 215, 0)
    gold maximum color code = (255, 255, 207)
    Hence, the red factor never changes and suitable formula is:
        if mininum == maximum: 
            hue = 0

        if maximum == red:
            hue = (green - blue) / (maximum - mininum) 
                
                    -> maximum number of iterations = 7,245 = 35*207
                    -> minimum and maximum red factor as per configuration = 255, 255 
                            (hence maximum green or blue factor will not exceed 255)
                            
                    -> minimum and maximum green factor as per configuration = 215, 255
                    -> minimum and maximum blue factor as per configuration = 0, 207 
                            (hence maximum blue factor will not meet up to green factors maximum)
                            
                    ->> none of the color codes will ever be equal to zero at the same time but both red and green
                        factors maximum value (255) can equal one another

        hue = hue * 60

        if (hue < 0):
            hue = hue + 360
    '''

    list_of_color_codes_within_hue_range_of_color_to_query = []

    for green in range(215, 256):

        for blue in range(0, 208):

            current_gold_color_code = (255, green, blue)
            maximum = max(current_gold_color_code)
            minimum = min(current_gold_color_code)

            hue_current_gold_color_code = (green - blue) / (maximum - minimum)

            hue_current_gold_color_code = hue_current_gold_color_code * 60

            if (hue_current_gold_color_code < 0):
                hue_current_gold_color_code = hue_current_gold_color_code + 360

            if abs(hue_color_to_query - hue_current_gold_color_code) < 7:
                list_of_color_codes_within_hue_range_of_color_to_query.append(current_gold_color_code)

    return list_of_color_codes_within_hue_range_of_color_to_query




def is_color_dark(
        color_to_query
):

    is_black = False
    hsl_color_to_query = calculate_hue_luminousity_and_saturation(color_to_query)
    saturation = hsl_color_to_query['saturation']
    luminousity = hsl_color_to_query['luminousity']

    print(hsl_color_to_query)

    if (saturation < 6 and luminousity < 23) or \
            (saturation < 17 and luminousity < 8) or \
            (saturation < 10 and luminousity < 10):
        is_black = True

    return is_black



def is_color_dark_blue(
        color_to_query
):

    is_dark_blue = False
    hsl_color_to_query = calculate_hue_luminousity_and_saturation(color_to_query)
    saturation = hsl_color_to_query['saturation']
    luminousity = hsl_color_to_query['luminousity']

    print(hsl_color_to_query)

    r = color_to_query[0]
    g = color_to_query[1]
    b = color_to_query[2]

    if (b > g * 1.32 and b > r * 1.32) and (
            (saturation > 60 and luminousity < 33) or (saturation > 39 and luminousity < 41)
    ):

        is_dark_blue = True

    return is_dark_blue

# def is_color_vibrant(
#     color_to_query
# ):
#
#     is_vibrant = False
#     hsl_color_to_query = calculate_hue_luminousity_and_saturation(color_to_query)
#     saturation = hsl_color_to_query['saturation']
#     luminousity = hsl_color_to_query['luminousity']
#
#     print(hsl_color_to_query)
#
#     r = color_to_query[0]
#     g = color_to_query[1]
#     b = color_to_query[2]
#
#     if (r > g * 1.32 and r > b * 1.32) and (
#             (saturation > 60 and luminousity < 41) or (saturation > 73 and luminousity < 60) or
#             (saturation > 52 and luminousity < 47) or (saturation > 55 and luminousity < 55)
#     ):
#         is_vibrant = True
#
#     elif (b > g * 1.32 and b > r * 1.32) and (
#             (saturation > 60 and luminousity < 38) or (saturation > 73 and luminousity < 60) or
#             (saturation > 52 and luminousity < 38) or (saturation > 55 and luminousity < 55)
#     ):
#         is_vibrant = True
#
#     elif (g > r * 1.32 and g > r * 1.32) and (
#             (saturation > 60 and luminousity < 41) or (saturation > 73 and luminousity < 60) or
#             (saturation > 52 and luminousity < 47) or (saturation > 55 and luminousity < 55)
#     ):
#         is_vibrant = True
#
#     return is_vibrant


# Method to determine whether the color is red, green, or blue
def is_color_r_g_or_b(rgb_tuple):
    r = rgb_tuple[0]
    g = rgb_tuple[1]
    b = rgb_tuple[2]
    hsp = 0

    ish = {
        'Other': 'Other',  #
        'Red': 'Red',  # 1
        'Green': 'Green',  # 2
        'Blue': 'Blue'  # 3
    }

    # determining whether the color is red, green, or blue
    if (r > 100 and r > (g * 1.34) and r > (b * 1.34)):
        return ish['Red']

    if (g > 100 and g > (r * 1.34) and g > (b * 1.34)):
        return ish['Green']

    if (b > 100 and b > g * 1.34 and b > r * 1.34):
        return ish['Blue']

    return ish['Other']


# Method to detect whether a color is light or bright
def is_color_light_or_dark(rgb_tuple):
    r = rgb_tuple[0]
    g = rgb_tuple[1]
    b = rgb_tuple[2]

    hsp = math.sqrt(
        0.299 * (r * r) +
        0.587 * (g * g) +
        0.114 * (b * b)
    )

    if (hsp >= 100):

        print('hsp: ' + str(hsp))
        return {
            'hsp_value': hsp,
            'brightness': 'light'
        }

    else:

        print('hsp: ' + str(hsp))
        return {
            'hsp_value': hsp,
            'brightness': 'dark'
        }


# Method to detect whether color is a vibrant red, green or blue
def is_color_vibrant_r_g_or_b(rgb_tuple):

    '''Properties:
most dominant color: rgb(228.0, 168.0, 74.0)
most dominant color confidence: 0.44318097829818726
most dominant color pixel fraction: 0.20280000567436218
{(203.0, 183.0, 159.0): {'confidence_score': 0.007390033919364214, 'pixel_fraction': 0.006800000090152025}, (216.0, 156.0, 65.0): {'confidence_score': 0.3952604830265045, 'pixel_fraction': 0.197111114859581}, (168.0, 109.0, 31.0): {'confidence_score': 0.07524926960468292, 'pixel_fraction': 0.015555555932223797}, (191.0, 149.0, 64.0): {'confidence_score': 0.010671650990843773, 'pixel_fraction': 0.006222222000360489}, (141.0, 79.0, 10.0): {'confidence_score': 0.008548201061785221, 'pixel_fraction': 0.0018666667165234685}, (235.0, 177.0, 68.0): {'confidence_score': 0.00817516352981329, 'pixel_fraction': 0.0026222222950309515}, (194.0, 145.0, 89.0): {'confidence_score': 0.007055638357996941, 'pixel_fraction': 0.0044888886623084545}, (225.0, 179.0, 82.0): {'confidence_score': 0.006677725818008184, 'pixel_fraction': 0.00791111122816801}, (189.0, 153.0, 97.0): {'confidence_score': 0.005810340866446495, 'pixel_fraction': 0.0032888888381421566}}
hsp: 180.92807410681183
light Red
{'hue': 36.62337662337662, 'saturation': 74.03846153846155, 'luminousity': 59.21568627450981}
False'''

    print()
    color_name = is_color_r_g_or_b(rgb_tuple)
    color_brightness_data = is_color_light_or_dark(rgb_tuple)
    color_brightness = color_brightness_data['brightness']

    color_hsp = color_brightness_data['hsp_value']

    hsl_color = calculate_hue_luminousity_and_saturation(rgb_tuple)

    saturation = hsl_color['saturation']
    luminousity = hsl_color['luminousity']

    print(f'saturation: {saturation}')
    print(f'luminousity: {luminousity}')

    color_dist_yellow_and_current_color = color_distance_specific((255, 215, 0), rgb_tuple)
    print()
    print(f'color_dist_yellow_and_current_color: {color_dist_yellow_and_current_color}')


    color_description = f'{color_brightness} {color_name}'
    print(color_description)
    color_description = color_description.lower()

    return_value = False

    if color_hsp > 100 and color_hsp < 130 and color_description.count('red') > 0:
        return_value = True

    elif color_hsp > 100 and color_description.count('green') > 0:
        return_value = True

    elif color_hsp > 95 and color_hsp < 130 and color_description.count('blue') > 0:
        return_value = True
    elif color_dist_yellow_and_current_color < 92 and saturation > 70 and luminousity > 50 and color_hsp > 175:
        print(hsl_color)

        return_value = True

    return return_value



def is_color_cream(rgb_tuple):

    '''Properties:
most dominant color: rgb(228.0, 168.0, 74.0)
most dominant color confidence: 0.44318097829818726
most dominant color pixel fraction: 0.20280000567436218
{(203.0, 183.0, 159.0): {'confidence_score': 0.007390033919364214, 'pixel_fraction': 0.006800000090152025}, (216.0, 156.0, 65.0): {'confidence_score': 0.3952604830265045, 'pixel_fraction': 0.197111114859581}, (168.0, 109.0, 31.0): {'confidence_score': 0.07524926960468292, 'pixel_fraction': 0.015555555932223797}, (191.0, 149.0, 64.0): {'confidence_score': 0.010671650990843773, 'pixel_fraction': 0.006222222000360489}, (141.0, 79.0, 10.0): {'confidence_score': 0.008548201061785221, 'pixel_fraction': 0.0018666667165234685}, (235.0, 177.0, 68.0): {'confidence_score': 0.00817516352981329, 'pixel_fraction': 0.0026222222950309515}, (194.0, 145.0, 89.0): {'confidence_score': 0.007055638357996941, 'pixel_fraction': 0.0044888886623084545}, (225.0, 179.0, 82.0): {'confidence_score': 0.006677725818008184, 'pixel_fraction': 0.00791111122816801}, (189.0, 153.0, 97.0): {'confidence_score': 0.005810340866446495, 'pixel_fraction': 0.0032888888381421566}}
hsp: 180.92807410681183
light Red
{'hue': 36.62337662337662, 'saturation': 74.03846153846155, 'luminousity': 59.21568627450981}
False'''

    print()
    color_name = is_color_r_g_or_b(rgb_tuple)
    color_brightness_data = is_color_light_or_dark(rgb_tuple)
    color_brightness = color_brightness_data['brightness']

    color_hsp = color_brightness_data['hsp_value']

    hsl_color = calculate_hue_luminousity_and_saturation(rgb_tuple)

    saturation = hsl_color['saturation']
    luminousity = hsl_color['luminousity']

    print(f'saturation: {saturation}')
    print(f'luminousity: {luminousity}')

    color_dist_yellow_and_current_color = color_distance_specific((255, 215, 0), rgb_tuple)
    print()
    print(f'color_dist_yellow_and_current_color: {color_dist_yellow_and_current_color}')


    color_description = f'{color_brightness} {color_name}'
    print(color_description)
    color_description = color_description.lower()

    return_value = False

    if color_dist_yellow_and_current_color < 195 and color_dist_yellow_and_current_color > 170 and \
            (30 < saturation < 56.5) and luminousity > 70 and color_hsp > 195:
        print(hsl_color)

        return_value = True

    return return_value



def is_color_light_pink(rgb_tuple):

    '''Properties:
most dominant color: rgb(228.0, 168.0, 74.0)
most dominant color confidence: 0.44318097829818726
most dominant color pixel fraction: 0.20280000567436218
{(203.0, 183.0, 159.0): {'confidence_score': 0.007390033919364214, 'pixel_fraction': 0.006800000090152025}, (216.0, 156.0, 65.0): {'confidence_score': 0.3952604830265045, 'pixel_fraction': 0.197111114859581}, (168.0, 109.0, 31.0): {'confidence_score': 0.07524926960468292, 'pixel_fraction': 0.015555555932223797}, (191.0, 149.0, 64.0): {'confidence_score': 0.010671650990843773, 'pixel_fraction': 0.006222222000360489}, (141.0, 79.0, 10.0): {'confidence_score': 0.008548201061785221, 'pixel_fraction': 0.0018666667165234685}, (235.0, 177.0, 68.0): {'confidence_score': 0.00817516352981329, 'pixel_fraction': 0.0026222222950309515}, (194.0, 145.0, 89.0): {'confidence_score': 0.007055638357996941, 'pixel_fraction': 0.0044888886623084545}, (225.0, 179.0, 82.0): {'confidence_score': 0.006677725818008184, 'pixel_fraction': 0.00791111122816801}, (189.0, 153.0, 97.0): {'confidence_score': 0.005810340866446495, 'pixel_fraction': 0.0032888888381421566}}
hsp: 180.92807410681183
light Red
{'hue': 36.62337662337662, 'saturation': 74.03846153846155, 'luminousity': 59.21568627450981}
False'''

    print()
    color_name = is_color_r_g_or_b(rgb_tuple)
    color_brightness_data = is_color_light_or_dark(rgb_tuple)
    color_brightness = color_brightness_data['brightness']

    color_hsp = color_brightness_data['hsp_value']

    hsl_color = calculate_hue_luminousity_and_saturation(rgb_tuple)

    saturation = hsl_color['saturation']
    luminousity = hsl_color['luminousity']

    print(f'saturation: {saturation}')
    print(f'luminousity: {luminousity}')

    color_dist_yellow_and_current_color = color_distance_specific((255, 215, 0), rgb_tuple)
    print()
    print(f'color_dist_yellow_and_current_color: {color_dist_yellow_and_current_color}')


    color_description = f'{color_brightness} {color_name}'
    print(color_description)
    color_description = color_description.lower()

    return_value = False

    if color_dist_yellow_and_current_color < 225 and color_dist_yellow_and_current_color > 195 and \
            (25 < saturation < 56) and luminousity > 70 and color_hsp > 195:
        print(hsl_color)

        return_value = True

    return return_value


# function to identify silver or bright products. Products that can go with products that don't gold on them
def is_color_silvergrey_or_white(
        color_to_query
):

    is_silvergrey = False
    hsl_color_to_query = calculate_hue_luminousity_and_saturation(color_to_query)
    saturation = hsl_color_to_query['saturation']
    luminousity = hsl_color_to_query['luminousity']

    print(hsl_color_to_query)

    color_dist_yellow_and_current_color = color_distance_specific((255, 215, 0), color_to_query)
    print()
    print(f'color_dist_yellow_and_current_color: {color_dist_yellow_and_current_color}')

    # 197, 75,, 228.93, 89,, 208, 78,, 231.5, 90,, 205, 77
    if saturation < 7.7 and (195 < color_dist_yellow_and_current_color < 235) and (60 < luminousity < 101):
        is_silvergrey = True

    return is_silvergrey


# function to identify conservative products. May not be perfect but very close
def is_color_darkgrey(
        color_to_query
):
    is_silvergrey = False

    is_r_g_b = is_color_r_g_or_b(color_to_query)
    is_cream = is_color_cream(color_to_query)
    is_vibrant = is_color_vibrant_r_g_or_b(color_to_query)
    is_light_pink = is_color_light_pink(color_to_query)
    is_dark_blue = is_color_dark_blue(color_to_query)

    if is_r_g_b.count('Other') > 0 and \
            is_cream == False and \
            is_vibrant == False and \
            is_light_pink == False and \
            is_dark_blue == False:

        hsl_color_to_query = calculate_hue_luminousity_and_saturation(color_to_query)
        hue = hsl_color_to_query['hue']
        saturation = hsl_color_to_query['saturation']
        luminousity = hsl_color_to_query['luminousity']

        print(hsl_color_to_query)

        color_dist_yellow_and_current_color = color_distance_specific((255, 215, 0), color_to_query)
        print()
        print(f'color_dist_yellow_and_current_color: {color_dist_yellow_and_current_color}')

        # 197, 75,, 228.93, 89,, 208, 78,, 231.5, 90,, 205, 77
        if saturation < 19 and \
                (190 < color_dist_yellow_and_current_color < 267) and \
                (20 <= luminousity < 47) and \
                (13 < hue < 345):
            is_silvergrey = True

    print('result')

    return is_silvergrey



# vibrants saturation > 60 luminousity < 41, saturation > 73 luminousity < 60, saturation > 52 luminousity < 47, saturation > 55 luminousity < 55

# product_colors = detect_colors('https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-hermes-new-handbags-p796537-002.jpg')  # (186, 255, 80)

# print(is_gold_color_in_color(product_colors['most_dominant_color']))

# ---------------------------------------------


# print()
# print('OTHER GOLD COLORS IN PRODUCT IMAGE')
# print(len(result_detected_gold_colors))
# for result_index in result_detected_gold_colors:
#     detected_gold_color_data = result_detected_gold_colors[result_index]
#     for detected_gold_color_info in detected_gold_color_data:
#         if detected_gold_color_info != 'variants':
#             print(f'{detected_gold_color_info}: {detected_gold_color_data[detected_gold_color_info]}')
#         else:
#             print()
#             variants = detected_gold_color_data[detected_gold_color_info]
#             print('VARIANTS')
#             for variant_index in variants:
#                 variant = variants[variant_index]
#                 # for variant_info in variant:
# #
#                 #     print(f'{variant_info}: {variant[variant_info]}')
#                 print()
#     print()

# product_colors_image_one = detect_colors(rose_gold_watch_one)
# product_colors_image_two =  detect_colors(rose_gold_bracelet)

# dominant_color_in_image_one = product_colors_image_one['most_dominant_color']
# dominant_color_in_image_two = product_colors_image_two['most_dominant_color']


# detects the gold
# print(is_gold_color_in_color(dominant_color_in_image_one))
# print(is_gold_color_in_color(dominant_color_in_image_two))
#
# print(calculate_hue_luminousity_and_saturation(dominant_color_in_image_one))
# print(calculate_hue_luminousity_and_saturation(dominant_color_in_image_two))
#
# print(is_colors_similar(dominant_color_in_image_one, dominant_color_in_image_two, is_main_color_gold=True))




'''Properties:
most dominant color: rgb(37.0, 49.0, 79.0)
most dominant color confidence: 0.30910688638687134
{(33.0, 45.0, 92.0): {'confidence_score': 0.1483040452003479, 'pixel_fraction': 0.009644444100558758}, (215.0, 188.0, 167.0): {'confidence_score': 0.04229826480150223, 'pixel_fraction': 0.019244443625211716}, (193.0, 153.0, 128.0): {'confidence_score': 0.028409438207745552, 'pixel_fraction': 0.006977777928113937}, (31.0, 50.0, 92.0): {'confidence_score': 0.06407288461923599, 'pixel_fraction': 0.004533333238214254}, (43.0, 43.0, 77.0): {'confidence_score': 0.05767448991537094, 'pixel_fraction': 0.00568888895213604}, (69.0, 80.0, 110.0): {'confidence_score': 0.04797118157148361, 'pixel_fraction': 0.005333333276212215}, (20.0, 28.0, 54.0): {'193.0, 153.0, 128.0': 0.04428636655211449, 'pixel_fraction': 0.005333333276212215}, (224.0, 182.0, 154.0): {'confidence_score': 0.027516614645719528, 'pixel_fraction': 0.0067111109383404255}, (249.0, 225.0, 204.0): {'confidence_score': 0.01912798546254635, 'pixel_fraction': 0.01737777702510357}}
Properties:
most dominant color: rgb(216.0, 190.0, 163.0)
most dominant color confidence: 0.4228588044643402
{(181.0, 156.0, 130.0): {'confidence_score': 0.19147101044654846, 'pixel_fraction': 0.03302222117781639}, (35.0, 13.0, 9.0): {'confidence_score': 0.0009591107373125851, 'pixel_fraction': 0.00039999998989515007}, (242.0, 221.0, 198.0): {'confidence_score': 0.08927486091852188, 'pixel_fraction': 0.014755555428564548}, (143.0, 118.0, 91.0): {'confidence_score': 0.06728091090917587, 'pixel_fraction': 0.012222222052514553}, (239.0, 230.0, 220.0): {'confidence_score': 0.053975868970155716, 'pixel_fraction': 0.8183555603027344}, (204.0, 194.0, 184.0): {'confidence_score': 0.05023008957505226, 'pixel_fraction': 0.018355555832386017}, (167.0, 158.0, 149.0): {'confidence_score': 0.04224083572626114, 'pixel_fraction': 0.015466666780412197}, (108.0, 83.0, 56.0): {'confidence_score': 0.015380810014903545, 'pixel_fraction': 0.003599999938160181}, (183.0, 145.0, 112.0): {'confidence_score': 0.012156795710325241, 'pixel_fraction': 0.0019555555190891027}}
'''



# color = (242.0, 221.0, 198.0) # (249.0, 225.0, 204.0)
# is_color_gold = is_gold_color_in_color(color)
# valid_gold_color = is_color_gold['valid_gold_color']
#
# print(is_color_gold)
# print(calculate_hue_luminousity_and_saturation(color))
# print(calculate_hue_luminousity_and_saturation(valid_gold_color))

# print(is_colors_similar((242.0, 221.0, 198.0), (249.0, 225.0, 204.0)))



# # Second color that will be compared against the main color

def temp():

    print()

    silver = 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-rolex-new-watches-p760451-004.jpeg'
    rose_gold_bracelet = 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-hermes-new-fine-jewelry-p765208-004.jpg'
    rose_gold_watch_one = 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-omega-new-watches-p795420-001.jpg'
    yellow_cream_bag = 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-hermes-new-handbags-p796537-002.jpg'
    red_goyardine_bag = 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-goyard-new-handbags-p779074-002.jpg'

    product_colors = detect_colors(yellow_cream_bag)  # (186, 255, 80)

    print()

    print(f"product's dominant color: {product_colors['most_dominant_color']}")

    start_time = time.time()
    dominant_gold_color_in_product_image = detect_dominant_gold_color_in_product_image(
        dominant_color_in_product_image=product_colors['most_dominant_color'],
        most_dominant_color_confidence_score=product_colors['most_dominant_color_confidence_score'],
        most_dominant_color_pixel_fraction= product_colors['most_dominant_color_pixel_fraction'],
        list_of_other_colors_in_image=product_colors['other_colors']
    )

    ending_time = time.time()
    process_completion_time = ending_time - start_time

    # print(dominant_gold_color_in_product_image)

    if dominant_gold_color_in_product_image is not None:

        for gold_color_info in dominant_gold_color_in_product_image:
            print(f'{gold_color_info}: {dominant_gold_color_in_product_image[gold_color_info]}')

        print()
        print(f'gold color detection completion_time: {process_completion_time}')

    elif dominant_gold_color_in_product_image is None:
        print('No gold colors was found in image!')


temp()