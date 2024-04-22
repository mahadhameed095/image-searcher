import os
import pandas as pd
import numpy as np

# def load_image(path):
#     return Image.open(path)

# def crop_image(image, BB):
#     x, y, w, h = BB['x'], BB['y'], BB['w'], BB['h']
#     return image.crop((x, y, w + x, h + y))

def read_results_csv(path):
    df = pd.read_csv(path)
    df['BB'] = df['BB'].apply(eval)
    df['embedding'] = df['embedding'].apply(eval)
    return df

# def get_image_size(path):
#     return Image.open(path).size

def transform_bbox(bb, image_size):
    image_width, image_height = image_size
    x, y, w, h = bb['x'], bb['y'], bb['w'], bb['h']
    x = x / image_width
    y = y / image_height
    w = w / image_width
    h = h / image_height
    return {
        'x': x * 100,
        'y': y * 100,
        'w': w * 100,
        'h': h * 100
    }

def normalize_path_to_forward_slashes(path):
    return '/'.join(path.split(os.sep))

def list_jpg_files(source_folder: str, relative: bool = False):
    """
    Get a list of all .jpg files in the specified source folder and its subdirectories.

    Parameters:
    - source_folder (str): The path to the source folder.
    - relative (bool): Whether to return relative paths (default: True).

    Returns:
    - list: A numpy list of paths to all .jpg files.
    """
    jpg_files = [os.path.relpath(os.path.join(root, file), source_folder) if relative else os.path.join(root, file)
                 for root, dirs, files in os.walk(source_folder)
                 for file in files if file.lower().endswith('.jpg')]
    normalized_to_forward_slashes = [normalize_path_to_forward_slashes(file) for file in jpg_files]
    return np.array(normalized_to_forward_slashes)
