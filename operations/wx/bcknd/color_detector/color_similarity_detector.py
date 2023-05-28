import math
import numpy as np

'''from operations.wx.bcknd.color_detector.color_vision_api import detect_colors'''


# DETECT WHETHER THE TWO COLORS ARE VERY SIMILAR
def lum(c):

    def factor(component):
        component = component / 255
        if (component <= 0.03928):
            component = component / 12.92
        else:
            component = math.pow(((component + 0.055) / 1.055), 2.4)

        return component
    components = [factor(ci) for ci in c]

    return (components[0] * 0.2126 + components[1] * 0.7152 + components[2] * 0.0722) + 0.05

def color_distance(c1, c2):

    l1 = lum(c1)
    l2 = lum(c2)
    higher = max(l1, l2)
    lower = min(l1, l2)

    return (higher - lower) / higher



# function to convert rgba to rgb - useful when finding shades of main color
def rgba2rgb(
        rgba, # type -> tuple(int, int, int, float)
        background = (255, 255, 255)
):

    return (
        round(((1 - rgba[3]) * background[0]) + (rgba[3] * rgba[0])),
        round(((1 - rgba[3]) * background[1]) + (rgba[3] * rgba[1])),
        round(((1 - rgba[3]) * background[2]) + (rgba[3] * rgba[2])),
    )

# function to add colors (rgb)


# function to compare whether two colors are similar directly or by a shade or tint
def is_colors_similar(
        main_color,
        second_color,
        is_main_color_gold = False,
        isTintsOnly = False,
        isShadesOnly = False,
):

    if isTintsOnly == True and isShadesOnly == True:
        raise Exception(f'Set only one of the following values as True:\n'
                        f'1. {isTintsOnly}\n'
                        f'2. {isShadesOnly}')
    # defining alpha and beta codes (brightness levels codes) for main color
    rgb_alphas_and_betas = [np.arange(0, 1, step=0.01), np.arange(0.53, 2, step=0.01)]

    # setting what versions of the main color should be compared with the second color
    if isTintsOnly == True:
        rgb_alphas_and_betas = [rgb_alphas_and_betas[0]]
    elif isShadesOnly == True:
        rgb_alphas_and_betas = [rgb_alphas_and_betas[1]]

    # DETECTING REASONABLE SHADES OF THE MAIN COLOR
    is_colors_similar_boolean = False
    shades_of_main_color = []

    tint_or_shade_counter = 0

    for tint_or_shade_num_line in rgb_alphas_and_betas:

        for rgb_alpha_or_beta in tint_or_shade_num_line:

            # rgb tuple
            shade_of_main_color = [i for i in main_color]
            # adding alpha to the rgb tuple
            shade_of_main_color.append(rgb_alpha_or_beta)
            shade_of_main_color = tuple(shade_of_main_color)
            # obtaining the rgb version of current shade of the main color
            current_shade_of_main_color_as_rgb = rgba2rgb(shade_of_main_color)

            # stop the operation if any of the values within 'current_shade_of_main_color_as_rgb' tuple is equal to
            # 0 or 255 to avoid invalid rgb (color codes)
            # The highest value within the main color
            max_color_codes_position_within_main_color = main_color.index(max(main_color))

            # The lowest value within the main color
            min_color_codes_position_within_main_color = main_color.index(min(main_color))

            if current_shade_of_main_color_as_rgb[max_color_codes_position_within_main_color] > 255 or \
                current_shade_of_main_color_as_rgb[min_color_codes_position_within_main_color] < 0:
                break

            if isTintsOnly == True:
                print(f'tint_of_main_color_as_rgb: {current_shade_of_main_color_as_rgb}')
            elif isShadesOnly == True:
                print(f'shade_of_main_color_as_rgb: {current_shade_of_main_color_as_rgb}')
            elif tint_or_shade_counter == 0:
                print(f'tint_of_main_color_as_rgb: {current_shade_of_main_color_as_rgb}')
            elif tint_or_shade_counter == 1:
                print(f'shade_of_main_color_as_rgb: {current_shade_of_main_color_as_rgb}')


            shades_of_main_color.append(current_shade_of_main_color_as_rgb)

            # calculating whether a shade of the main color are similar to the second color
            color_similarity_score = 1 - color_distance(current_shade_of_main_color_as_rgb, second_color)
            print(f'color_similarity_score: {color_similarity_score}')

            min_color_similarity_score = ''

            if is_main_color_gold == True:
                min_color_similarity_score = 0.999
            else:
                min_color_similarity_score = 0.9958606603780528

            if color_similarity_score >= min_color_similarity_score:
                is_colors_similar_boolean = True
                print(f'is_colors_similar_boolean: {is_colors_similar_boolean}')
                break

        tint_or_shade_counter += 1

    return is_colors_similar_boolean


# # Main color the second color will be compared against
# main_color = detect_colors('/Users/admin/Downloads/bag_deep_pink.jpeg')['most_dominant_color'] # (186, 245, 80)
#
# # Second color that will be compared against the main color
# second_color = detect_colors('/Users/admin/Downloads/rolext_pink.jpeg')['most_dominant_color'] # (186, 255, 80)
#
# result = is_colors_similar(
#     main_color,
#     second_color
# )
#
# print()
# if result == False:
#
#     print(f'Colors are not similar')
#
# else:
#
#     print(f'Colors are similar')

