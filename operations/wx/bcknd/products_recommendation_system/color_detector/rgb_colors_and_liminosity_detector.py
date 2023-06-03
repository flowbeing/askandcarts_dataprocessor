import math

# Detect whether two colors are very similar


# Method to determine whether the color is red, green, or blue
def is_color_r_g_or_b(rgb_tuple):
    
    r = rgb_tuple[0]
    g = rgb_tuple[1]
    b = rgb_tuple[2]
    hsp = 0

    ish = {
        'Other': 'Other', #
        'Red': 'Red', # 1
        'Green': 'Green', # 2
        'Blue': 'Blue' # 3
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
    
    color_name = is_color_r_g_or_b(rgb_tuple)
    color_brightness = is_color_light_or_dark(rgb_tuple)['brightness']

    color_description = f'{color_brightness} {color_name}'
    print(color_description)
    color_description = color_description.lower()
    
    if color_description.count('light') > 0 and \
            (color_description.count('red') > 0 or 
             color_description.count('green') > 0 or 
              color_description.count('blue') > 0):
        
        return True
    
    else:
        return False

# rgb_tuple = (30, 70, 255)
# is_color_vibrant_red_green_or_blue = is_color_vibrant_r_g_or_b(rgb_tuple)

# print(is_color_vibrant_red_green_or_blue)
