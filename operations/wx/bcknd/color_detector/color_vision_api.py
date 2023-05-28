import os
import io
from google.cloud import vision

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="/Users/admin/OneDrive/docs/affiliate/color_detector/ringed-cell-388001-24f0c04ada83.json"


def detect_colors(path):
    """Detects image properties in the file."""
    from google.cloud import vision
    client = vision.ImageAnnotatorClient()

    with open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.image_properties(image=image)
    props = response.image_properties_annotation
    print('Properties:')

    # all dominant colors detected by cloud vision
    cloud_vision_detected_dominant_colors = props.dominant_colors.colors

    # most dominant color
    most_dominant_colors_rgb = ''
    colors_dominance_score = []

    other_colors_in_image = []

    # identifying the most dominant color with a for loop
    for color in cloud_vision_detected_dominant_colors:

        r = color.color.red
        g = color.color.green
        b = color.color.blue
        # a = color.color.alpha
        rgb_tuple = (r, g, b)

        current_colors_dominance_score = color.score
        colors_dominance_score.append(current_colors_dominance_score)

        # print(max(colors_dominance_score), current_colors_dominance_score)

        # identifying and setting value of the most dominant color
        if max(colors_dominance_score) == current_colors_dominance_score:
            most_dominant_colors_rgb = rgb_tuple
            print(f'most dominant color: rgb{most_dominant_colors_rgb}')

        # including all colors in other_colors_in_image
        other_colors_in_image.append(rgb_tuple)


    # removing dominant color from list of non dominant colors
    other_colors_in_image.remove(most_dominant_colors_rgb)
    print(other_colors_in_image)

    # for color in props.dominant_colors.colors:
    #     print(type(color))
    #     print(f'fraction: {color.pixel_fraction}')
    #     print(f'\tr: {color.color.red}')
    #     print(f'\tg: {color.color.green}')
    #     print(f'\tb: {color.color.blue}')
    #     print(f'\ta: {color.color.alpha}')

    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))

    return {
        'most_dominant_color': most_dominant_colors_rgb,
        'other_colors': other_colors_in_image
    }


image_path = '/Users/admin/Downloads/luxury-women-hermes-new-handbags-p788458-001.jpeg' # luxury-women-hermes-new-handbags-p796525-001.jpeg'
# detect_colors(image_path)