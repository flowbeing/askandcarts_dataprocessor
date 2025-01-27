import os

from operations.wx.bcknd.products_recommendation_system.color_detector.color_similarity_detection_tools import *

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="/Users/admin/OneDrive/docs/affiliate/color_detector/ringed-cell-388001-24f0c04ada83.json"

def detect_colors(
        path
):
    """Detects image properties in the file."""
    # from google.cloud import vision
    # client = vision.ImageAnnotatorClient()
    # image = vision.Image()
    # image.source.image_uri = uri
    #
    # response = client.image_properties(image=image)
    # props = response.image_properties_annotation
    # print('Properties:')
    #
    # # all dominant colors detected by cloud vision
    # cloud_vision_detected_dominant_colors = props.dominant_colors.colors

    """Detects image properties in the file."""
    from google.cloud import vision
    client = vision.ImageAnnotatorClient()

    with open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.image_properties(image=image)
    props = response.image_properties_annotation

    cloud_vision_detected_dominant_colors = props.dominant_colors.colors

    # most dominant color
    most_dominant_colors_rgb = ''
    most_dominant_colors_rgb_confidence = ''
    most_dominant_color_pixel_fraction = ''
    colors_dominance_score = []

    ''' {rgb_color_code: dominance score} '''
    other_colors_in_image = {}

    # identifying the most dominant color with a for loop
    for color in cloud_vision_detected_dominant_colors:

        r = color.color.red
        g = color.color.green
        b = color.color.blue
        # a = color.color.alpha
        rgb_tuple = (r, g, b)

        current_colors_dominance_score = color.score
        current_colors_pixel_fraction = color.pixel_fraction
        colors_dominance_score.append(current_colors_dominance_score)

        # print(max(colors_dominance_score), current_colors_dominance_score)

        # identifying and setting value of the most dominant color
        if max(colors_dominance_score) == current_colors_dominance_score:
            most_dominant_colors_rgb = rgb_tuple
            most_dominant_colors_rgb_confidence = current_colors_dominance_score
            most_dominant_color_pixel_fraction = current_colors_pixel_fraction
            print(f'most dominant color: rgb{most_dominant_colors_rgb}')
            print(f'most dominant color confidence: {most_dominant_colors_rgb_confidence}')
            print(f'most dominant color pixel fraction: {most_dominant_color_pixel_fraction}')

        else:
            # including all colors in other_colors_in_image
            other_colors_in_image[str(rgb_tuple)] = {}
            other_colors_in_image[str(rgb_tuple)]['confidence_score'] = current_colors_dominance_score
            other_colors_in_image[str(rgb_tuple)]['pixel_fraction'] = current_colors_pixel_fraction



    # removing dominant color from list of non dominant colors
    # other_colors_in_image.pop(most_dominant_colors_rgb)

    print(other_colors_in_image)

    # for color in props.dominant_colors.colors:
    #     print(type(color))
    #     print(f'fraction: {color.pixel_fraction}')
    #     print(f'\tr: {color.color.red}')
    #     print(f'\tg: {color.color.green}')
    #     print(f'\tb: {color.color.blue}')
    #     print(f'\ta: {color.color.alpha}')

    if response.error.message:

        print(response.error)

        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))

    return {
        'most_dominant_color': most_dominant_colors_rgb,
        'most_dominant_color_confidence_score': most_dominant_colors_rgb_confidence,
        'most_dominant_color_pixel_fraction': most_dominant_color_pixel_fraction,
        'other_colors': other_colors_in_image
    }


if __name__ == 'yay':
    image_path_one = 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-hermes-new-handbags-p758494-001.jpeg'  # 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-hermes-new-handbags-p791272-001.jpg' # # '/Users/admin/Downloads/luxury-women-hermes-new-handbags-p788458-001.jpeg' # luxury-women-hermes-new-handbags-p796525-001.jpeg'
    image_path_two = 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-rolex-new-watches-p760451-004.jpeg'  # 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-rolex-new-watches-p777785-002.jpg' # 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-rolex-new-watches-p760451-004.jpeg' # 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-rolex-new-watches-p758277-002.jpeg' # 'https://cdn.theluxurycloset.com/uploads/products/full/luxury-women-rolex-new-watches-p757453-004.jpg' #

    detect_image_one_colors = detect_colors(image_path_one)
    detect_image_two_colors = detect_colors(image_path_two)

    print('BAGS DOMINANT COLOR -> WATCH DOMINANT COLOR')
    is_colors_similar(detect_image_one_colors['most_dominant_color'], detect_image_two_colors['most_dominant_color'])

    print()
    print('BAGS GOLD PIECE COLOR -> WATCH DOMINANT COLOR')
    is_colors_similar(
        (225, 194, 132),
        detect_image_two_colors['most_dominant_color'],
        is_specifically_close_colors_only=True
    )

    # COLORS TO MIND
    # GOLD
    # gold_colors_main = [(214.0, 198.0, 167), (225, 194, 132)]
    # if the color is gold, similarity score should be >= 0.9985

    # GREY & SILVER
    # grey_colors_silver = [(198.0, 198.0, 198.0)]

    # ISSUES
    # 1.  silver or a light shade of grey matching with all products when after it's been detected as the dominant color while
    # there's another evident dominant color. Matching silver or grey and gold

    # 2. identifying whether the bag's color is a shade of black so as to match with gold dominant colored assesories
