import os
from utils import normalize_path_to_forward_slashes

PROJECT_ROOT = normalize_path_to_forward_slashes(os.path.dirname(os.path.abspath(__file__)))
class InternalConstants:
    GENERATION_DIR = PROJECT_ROOT + "/.generated/"
    DB_PATH = GENERATION_DIR + "db.sqlite"


class ExternalConstants:
    HDBSCAN_MIN_SAMPLES = 3
    HDBSCAN_MIN_CLUSTER_SIZE = 3
    HDBSCAN_METRIC = 'euclidean'

    # IMAGES_DIR = r"C:/Users/mahad/Downloads/Saani's Wedding/"
    # IMAGES_DIR = "C:/Users/mahad/Downloads/Test/"
    FACIAL_DETECTION_BACKEND = "yolov8"
    FACIAL_EMBEDDINGS_BACKEND = "VGG-Face"
    NORMALIZATION = "VGGFace"