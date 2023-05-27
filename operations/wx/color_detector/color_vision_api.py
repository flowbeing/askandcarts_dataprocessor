import os
import io
from google.cloud import vision

os.environ["GOOGLE_APPLICATION_CREDENTIALS"]="/Users/admin/OneDrive/docs/affiliate/color_detector/ringed-cell-388001-24f0c04ada83.json"


def detect_properties(path):
    """Detects image properties in the file."""
    from google.cloud import vision
    client = vision.ImageAnnotatorClient()

    with open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.Image(content=content)

    response = client.image_properties(image=image)
    props = response.image_properties_annotation
    print('Properties:')

    for color in props.dominant_colors.colors:
        print(f'fraction: {color.pixel_fraction}')
        print(f'\tr: {color.color.red}')
        print(f'\tg: {color.color.green}')
        print(f'\tb: {color.color.blue}')
        print(f'\ta: {color.color.alpha}')

    if response.error.message:
        raise Exception(
            '{}\nFor more info on error messages, check: '
            'https://cloud.google.com/apis/design/errors'.format(
                response.error.message))


image_path = '/Users/admin/Downloads/luxury-women-hermes-new-handbags-p796525-001.jpeg'
detect_properties(image_path)