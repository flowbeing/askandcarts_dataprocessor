import math
import matplotlib.pyplot as plt

from operations.wx.bcknd.color_detector.color_similarity_detection_tools import \
    calculate_hue_luminousity_and_saturation, is_colors_similar

from operations.wx.bcknd.color_detector.color_vision_api import detect_colors

# list of 'all' gold colors from pure  gold to rose gold
def generate_all_gold_colors():
    list_of_gold_colors = []

    # for loop to generate gold colors, from yellow gold to rose gold:
    #for green in range(215, 256):

    for blue in range(208):
        current_gold_rgb = (255, 215, blue)
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

    gold_color_profile = generate_all_gold_colors()

    for gold_color in gold_color_profile:

        is_color_gold = is_colors_similar(
            gold_color,
            rgb_tuple_color_to_query,
            is_main_color_gold=True
        )

        is_color_gold_bool = is_color_gold['is_colors_similar_boolean']
        similar_gold_color_shade = is_color_gold['similar_color_shade']


        if is_color_gold_bool:

            is_gold_color = True
            valid_gold_color_shade = similar_gold_color_shade
            valid_gold_color = gold_color
            distance_of_valid_gold_color_shade_from_second_color = \
                is_color_gold['distance_of_valid_color_shade_from_second_color']

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
            'distance_of_valid_gold_color_shade_from_second_color': distance_of_valid_gold_color_shade_from_second_color
    }


print()
def is_dominant_gold_color_in_product_image(
        dominant_color_in_product_image,
        most_dominant_color_confidence_score,
        list_of_other_colors_in_image
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
        confidence_score_most_dominant_color = most_dominant_color_confidence_score

        result_detected_gold_colors[0] = {
            'is_gold_color': is_color_gold,
            'query_color': query_color,
            'valid_gold_color_shade': valid_gold_color_shade,
            'valid_gold_color': valid_gold_color,
            'distance_of_valid_gold_color_shade_from_second_color': distance_of_valid_gold_color_shade_from_second_color,
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

            calc_gold_color = is_gold_color_in_color(
                other_color
            )

            # update gold color as detected within other_colors_in_product_image
            if calc_gold_color['is_gold_color']:
                print()
                other_gold_colors_confidence_score = other_colors_in_product_image[other_color]
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
                confidence_score_other_detected_gold_color = other_gold_colors_confidence_score
                confidence_score_most_dominant_color = most_dominant_color_confidence_score

                result_detected_gold_colors[detected_gold_color_count] = {
                    'is_gold_color': is_color_gold,
                    'query_color': query_color,
                    'valid_gold_color_shade': valid_gold_color_shade,
                    'valid_gold_color': valid_gold_color,
                    'distance_of_valid_gold_color_shade_from_second_color': distance_of_valid_gold_color_shade_from_second_color,
                    'confidence_score_other_detected_gold_color': confidence_score_other_detected_gold_color,
                    'confidence_score_most_dominant_color': confidence_score_most_dominant_color,
                    'confidence_detected_other_gold_color_over_dominant_color': confidence_detected_other_gold_color_over_dominant_color,
                    'most_dominant_color': dominant_color_in_product_image,
                    'is_dominant_color_gold': is_dominant_color_gold,
                }

                detected_gold_color_count += 1




        # if the detected gold color(s) is not close enough to the second color, adjust the green factor of the rgb
        # to find the closest gold color shade that matches the second color
        for detected_other_gold_color_key in result_detected_gold_colors:

            detected_other_gold_color_data = result_detected_gold_colors[detected_other_gold_color_key]

            detected_other_gold_colors_distance_from_second_color = detected_other_gold_color_data['distance_of_valid_gold_color_shade_from_second_color']
            detected_other_gold_color_query = detected_other_gold_color_data['query_color']
            detected_other_gold_color_valid =  \
                list([float(color_code) for color_code in detected_other_gold_color_data['valid_gold_color']])


            if detected_other_gold_colors_distance_from_second_color > 3:

                detected_variant_count = 0
                for green_factor in range(215, 256):
                    
                    detected_other_gold_color_valid[1] = green_factor
                    detected_other_gold_color_variant = tuple(detected_other_gold_color_valid)

                    # redetection: detecting whether the current variant of the detected gold color
                    # (from other color in image list) is closer to the detected other gold color
                    # (i.e gold color detected within list_of_other_colors_in_image)
                    is_detected_other_gold_color_similar_to_variant = is_colors_similar(
                        detected_other_gold_color_variant,
                        second_color=detected_other_gold_color_query,
                        is_main_color_gold=True
                    )

                    detected_other_gold_colors_current_variant_distance_from_second_color =  \
                        is_detected_other_gold_color_similar_to_variant['distance_of_valid_color_shade_from_second_color']

                    # update detected other gold color's data with its detected valid variant
                    if detected_other_gold_colors_current_variant_distance_from_second_color < 15:

                        valid_variant_shade = is_detected_other_gold_color_similar_to_variant['similar_color_shade']

                        result_detected_gold_colors[detected_other_gold_color_key]['variants'] = {}

                        result_detected_gold_colors[detected_other_gold_color_key]['variants'][detected_variant_count] = {
                            'first_detected_other_gold_color_variant': detected_other_gold_color_variant,
                            'second_detected_other_gold_color_query': detected_other_gold_color_query,
                            'valid_variant_shade': valid_variant_shade,
                            'distance_of_valid_variant_shade_from_detected_other_gold_color': detected_other_gold_colors_current_variant_distance_from_second_color,
                        }

                        detected_variant_count += 1
                    
                    





    return result_detected_gold_colors


# # Second color that will be compared against the main color

silver = 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-rolex-new-watches-p760451-004.jpeg'
rose_gold_bracelet = 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-hermes-new-fine-jewelry-p765208-004.jpg'
rose_gold_watch_one = 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-omega-new-watches-p795420-001.jpg'

product_colors = detect_colors(rose_gold_watch_one) # (186, 255, 80)


print()
print(f"product's dominant color: {product_colors['most_dominant_color']}")

result_detected_gold_colors = is_dominant_gold_color_in_product_image(
    dominant_color_in_product_image= product_colors['most_dominant_color'],
    most_dominant_color_confidence_score= product_colors['most_dominant_color_confidence_score'],
    list_of_other_colors_in_image= product_colors['other_colors']
)

print()
print('OTHER GOLD COLORS IN PRODUCT IMAGE')
print(len(result_detected_gold_colors))
for result_index in result_detected_gold_colors:

    detected_gold_color_data = result_detected_gold_colors[result_index]

    for detected_gold_color_info in detected_gold_color_data:

        if detected_gold_color_info != 'variants':
            print(f'{detected_gold_color_info}: {detected_gold_color_data[detected_gold_color_info]}')
        else:

            print()
            variants = detected_gold_color_data[detected_gold_color_info]
            print('VARIANTS')
            for variant_index in variants:

                variant = variants[variant_index]

                # for variant_info in variant:
#
                #     print(f'{variant_info}: {variant[variant_info]}')

                print()

    print()










































