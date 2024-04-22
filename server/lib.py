from PIL import Image
from deepface import DeepFace
import numpy as np
from constants import ExternalConstants
from models import Face, Cluster, FaceClusterAssignment
from sklearn.cluster import HDBSCAN
from utils import transform_bbox
from sklearn.decomposition import PCA
import io

def get_faces_info(image_path : str):
    detector_backend = ExternalConstants.FACIAL_DETECTION_BACKEND
    model_name = ExternalConstants.FACIAL_EMBEDDINGS_BACKEND
    normalization = ExternalConstants.NORMALIZATION
    
    image = Image.open(image_path)
    image_size = image.size

    detected_faces = DeepFace.represent(
        img_path=np.asarray(image),
        enforce_detection=False,
        detector_backend=detector_backend,
        model_name=model_name,
        normalization=normalization
    )

    faces = []

    # Adding each face's image_path, its bounding box, and embedding to their respective lists.
    for face_number, face in enumerate(detected_faces):
        
        id = image_path + str(face_number)
        
        faces.append(
            Face(
                id=id,
                image_path=image_path,
                face_number=face_number,
                embedding= np.array(face['embedding']).tobytes(),
                **transform_bbox(face['facial_area'], image_size)
            )
        )

    return faces


def initalize_clusters(face_ids : np.ndarray, embeddings : np.ndarray, min_samples : int, min_cluster_size : int):
    metric = ExternalConstants.HDBSCAN_METRIC

    hdbscan = HDBSCAN(
        min_samples=min_samples,
        min_cluster_size=min_cluster_size,
        metric=metric,
        n_jobs=-1
    )

    hdbscan.fit(embeddings)
    cluster_ids = hdbscan.labels_
    probabilities = hdbscan.probabilities_

    face_cluster_assignments = [
        FaceClusterAssignment(
            face_id=face_id,
            cluster_id=int(cluster_id)
        )

        for face_id, cluster_id in zip(face_ids, cluster_ids)
    ]

    # We will find representative sample of each cluster.
    clusters : list[Cluster] = []

    for cluster_id in np.unique(cluster_ids):
        # Indices of samples in the current cluster
        cluster_indices = np.argwhere(cluster_ids == cluster_id)

        # Among faces within a cluster, get the index of the face with the highest probability of it belong to that cluster
        representative_index = cluster_indices[np.argmax(probabilities[cluster_indices])][0]
        
        # Store the representative index for the cluster
        clusters.append(
            Cluster(
                id=int(cluster_id),
                representative_face_id=face_ids[representative_index]
            )
        )
        
    return clusters, face_cluster_assignments


def image_process(
        file_path : str,
        width : int | None = None,
        bb : tuple[float, float, float, float] | None = None):
    
    image = Image.open(file_path)
    # Calculate new width if provided
    if width:
        # Calculate the new height to maintain aspect ratio
        height = int(width * image.height / image.width)
        # Resize the image
        image = image.resize((width, height))

    
    if bb:
        x, y, w, h = bb
        x_pixel = int(x * image.width / 100)
        y_pixel = int(y * image.height / 100)
        w_pixel = int(w * image.width / 100)
        h_pixel = int(h * image.height / 100)

        image = image.crop((x_pixel, y_pixel, x_pixel + w_pixel, y_pixel + h_pixel))

    with io.BytesIO() as output:
        image.save(output, format="PNG")
        image_data = output.getvalue()

    return image_data

def reduce_embeddings(embeddings : list[np.ndarray]) -> list[tuple[float, float]]:
    """
    Compresses embeddings to two dimensions using PCA.

    Parameters:
    embeddings (list of np.arrays): List of embeddings (float64).

    Returns:
    list of tuples: List of tuples representing 2D points.
    """
    # Convert the list of embeddings to a 2D numpy array
    X = np.vstack(embeddings)

    # Apply PCA to reduce dimensions to 2
    pca = PCA(n_components=2)
    X_2d = pca.fit_transform(X)

    # Convert compressed points to list of tuples
    compressed_points = [(x[0], x[1]) for x in X_2d]

    return compressed_points
