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

# function to calculate color distance - effective for non gold colors
def color_distance(c1, c2):

    l1 = lum(c1)
    l2 = lum(c2)
    higher = max(l1, l2)
    lower = min(l1, l2)

    return (higher - lower) / higher

# function to calculate color distance - effective for gold colors
# for accurate & specific (two colors) comparison
def color_distance_specific(col1, col2):
    """Returns a number between 0 and root(3) stating how similar
    two colours are - distance in r,g,b, space.  Only used to find
    names for things."""
    col1_red = col1[0]
    col1_green = col1[1]
    col1_blue =col1[2]

    col2_red = col2[0]
    col2_green = col2[1]
    col2_blue = col2[2]

    return abs(
        math.sqrt(
            (col1_red - col2_red)**2 +
            (col1_green - col2_green)**2 +
            (col1_blue - col2_blue)**2
        )
    )



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
    similar_color_shade = ''
    distance_of_valid_color_shade_from_second_color = 0
    shades_of_main_color = []

    tint_or_shade_counter = 0

    for tint_or_shade_num_line in rgb_alphas_and_betas:

        # to identify whether to stop the search for similar tints or shades of main color
        is_break = False

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

            if is_main_color_gold == False:

                # calculating if a shade of the main color is similar to the second color (as per stated similarity score
                # constraint)
                color_distance_ = abs(color_distance_specific(current_shade_of_main_color_as_rgb, second_color))
                color_similarity_score = 1 - color_distance(current_shade_of_main_color_as_rgb, second_color)
                print(f'color_similarity_score: {color_similarity_score}')

                min_color_similarity_score = ''

                if color_similarity_score >= 0.9958:
                    is_colors_similar_boolean = True
                    similar_color_shade = current_shade_of_main_color_as_rgb
                    distance_of_valid_color_shade_from_second_color = color_distance_
                    print(f'is_colors_similar_boolean: {is_colors_similar_boolean}')
                    is_break = True
                    break

            elif is_main_color_gold:

                # calculating if a shade of the gold color is similar to the second color (as per stated similarity score
                # constraint)
                color_distance_gold_color = abs(color_distance_specific(current_shade_of_main_color_as_rgb, second_color))
                print(f'color_distance_gold: {color_distance_gold_color}')


                if color_distance_gold_color <= 15:
                    is_colors_similar_boolean = True
                    similar_color_shade = current_shade_of_main_color_as_rgb
                    distance_of_valid_color_shade_from_second_color = color_distance_gold_color
                    print(f'is_colors_similar_boolean: {is_colors_similar_boolean}')
                    is_break = True
                    break



        tint_or_shade_counter += 1
        # stop searching if a tint or shade of the main color that matches the second color has been found
        if is_break == True:
            break

    return {
        'is_colors_similar_boolean': is_colors_similar_boolean,
        'similar_color_shade': similar_color_shade,
        'distance_of_valid_color_shade_from_second_color': distance_of_valid_color_shade_from_second_color
    }


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





# function to determine the saturation of a color (rgb) -> TIP: Saturation around or lesser than 4 is a greyscale
'''
    SOURCE: 
    https://donatbalipapp.medium.com/colours-maths-90346fb5abda#:~:text=The%20formula%20for%20Saturation%20uses,
    (RGB)%20values%20and%20Luminosity.&text=We%20have%20calculated%20the%20Luminosity,Min(RGB)%20%3D%200%2C212.
'''
def calculate_hue_luminousity_and_saturation(rgb_tuple):

    '''
        Calculating Hue
        formula source: https://stackoverflow.com/questions/23090019/fastest-formula-to-get-hue-from-rgb
        If Red is max, then Hue = (G-B)/(max-min)
        If Green is max, then Hue = 2.0 + (B-R)/(max-min)
        If Blue is max, then Hue = 4.0 + (R-G)/(max-min)
        '''

    red = rgb_tuple[0]
    green = rgb_tuple[1]
    blue = rgb_tuple[2]

    mininum = min(min(red, green), blue)
    maximum = max(max(red, green), blue)

    if mininum == maximum:
        return 0

    hue = 0
    if maximum == red:
        hue = (green - blue) / (maximum - mininum)

    elif (maximum == green):
        hue = 2 + (blue - red) / (maximum - mininum)

    else:
        hue = 4 + (red - green) / (maximum - mininum)

    hue = hue * 60
    if (hue < 0):
        hue = hue + 360


    '''Calculating lumousity'''
    rgb_tuple_ = []

    for color_code in rgb_tuple:

        if color_code != 0:
            rgb_tuple_.append(color_code/255)
        else:
            rgb_tuple_.append(0)

    rgb_tuple = tuple(rgb_tuple_)

    # print(rgb_tuple)

    maximum = max(rgb_tuple)
    minimum = min(rgb_tuple)

    lum = (1 / 2) * (maximum + minimum)


    '''Calculating Saturation'''
    saturation = 0


    # If L < 1  |  S = (Max(RGB) — Min(RGB)) / (1 — |2L - 1|)
    # (B) If L = 1  |  S = 0

    if rgb_tuple.count(0) == 2 or len(set(rgb_tuple)) == 1:
        saturation = 0
    elif lum < 1:
        saturation = ((maximum - minimum) / (1 - abs((2*lum) - 1)))
    elif lum == 1:
        saturation = 0


    return {
        'hue': hue,
        'saturation': abs(saturation) * 100,
        'luminousity': lum,
    }



# function to calculate all possible color's saturation
def calc_all_posible_colors_saturation():
    list_of_saturation_values = []

    count = 0
    for r in range(255):

        for g in range(255):

            for b in range(255):

                minimum = min((r, g, b))
                maximum = max((r, g, b))
                #print(f'rgb: {(r, g, b)}')

                if True:
                    print(f'current count: {count}')

                    saturation_and_luminousity = calculate_hue_luminousity_and_saturation((r, g, b))
                    saturation = saturation_and_luminousity['saturation']
                    luminousity = saturation_and_luminousity['luminousity']
                    print(f'rgb: {(r, g, b)}, saturation: {saturation}, luminousity: {luminousity}')

                    list_of_saturation_values.append(saturation)

                count += 1

    print()
    print(f'max saturation value: {max(list_of_saturation_values)}')


# sat = calculate_color_saturation((253.0, 254.0, 255.0))

# print(sat)

# calc_all_posible_colors_saturation()

