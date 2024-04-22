# uvicorn main:app --reload
from fastapi import FastAPI, Request

from fastapi.routing import APIRoute
from fastapi.responses import Response
from fastapi.middleware.cors import CORSMiddleware

from sqlmodel import Session, select, delete, update
from sqlalchemy.orm import aliased

from projects import Project
from models import Face, Cluster, FaceClusterAssignment, ImageCache, ClusterPublic
import models
from lib import image_process
from lib import get_faces_info, initalize_clusters as _initalize_clusters, reduce_embeddings
from utils import list_jpg_files
from tqdm import tqdm
import numpy as np
from pydantic import BaseModel, Field

def custom_generate_unique_id(route: APIRoute):
    return f"{route.name}"


app = FastAPI(generate_unique_id_function=custom_generate_unique_id)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/addImagesFromFolder')
def add_images_from_folder(images_dir : str) -> None:
    with Session(Project.engine) as session:
        faces_in_db = session.exec(select(Face.image_path)).all()

    for skip in faces_in_db:
        print("skipping", skip)

    # skipping the faces that are already within the project.
    image_paths = list(set(list_jpg_files(images_dir)) - set(faces_in_db))
    if image_paths:
        for image_path in tqdm(image_paths):
            faces= get_faces_info(image_path)

            with Session(Project.engine) as session:
                session.bulk_save_objects(faces)
                session.commit()

    return { "ok" : True }


@app.post('/initializeClusters')
def initialize_clusters(min_samples : int, min_cluster_size : int):
    with Session(Project.engine) as session:
        data = list(session.exec(select(Face.id, Face.embedding)))
    
    if len(data) == 0:
        return 

    # unzipping the list of tuples https://stackoverflow.com/questions/12974474/how-to-unzip-a-list-of-tuples-into-individual-lists
    face_ids, embeddings = list(zip(*data))

    # convert embeddings into numpy array
    embeddings = [
        np.frombuffer(e, dtype=np.float64)
        for e in embeddings
    ]

    clusters, face_cluster_assignments = _initalize_clusters(face_ids, embeddings, min_samples, min_cluster_size)
    with Session(Project.engine) as session:
        session.exec(delete(Cluster))
        session.exec(delete(FaceClusterAssignment))

        session.bulk_save_objects(clusters)
        session.bulk_save_objects(face_cluster_assignments)

        session.commit()

    return

@app.get('/clusters', response_model=list[models.ClusterPublic])
def get_clusters():
    with Session(Project.engine) as session:
        representative_face = aliased(Face, name="representative_face")
        data = session.exec(select(Cluster.id, representative_face).join(Cluster, Cluster.representative_face_id == representative_face.id)).all()
    
    if len(data) == 0:
        return []

    embeddings = [
        np.frombuffer(cluster.representative_face.embedding, dtype=np.float64)
        for cluster in data
    ]

    reduced_embeddings = reduce_embeddings(embeddings)
    clusters : list[ClusterPublic] = []

    for dims, item in zip(reduced_embeddings, data):
        clusters.append(
            ClusterPublic(
                id=item.id,
                representative_face=models.FacePublicWithXY(
                    id = item.representative_face.id,
                    image_path=item.representative_face.image_path,
                    x=item.representative_face.x,
                    y=item.representative_face.y,
                    w=item.representative_face.w,
                    h=item.representative_face.h,
                    embedding_x=dims[0],
                    embedding_y=dims[1]
                )
            )
        )
    return clusters

@app.delete('/clusters')
def reset_clusters():
    with Session(Project.engine) as session:
        session.exec(delete(Cluster))
        session.exec(delete(FaceClusterAssignment))
        session.commit()

@app.get('/faceClusterAssignments', response_model=list[FaceClusterAssignment])
def get_face_cluster_assignments():
    with Session(Project.engine) as session:
        data = session.exec(select(FaceClusterAssignment)).all()
    return data

@app.get('/imageClusterAssignments', response_model=list[models.ImageClusterAssignment])
def get_image_cluster_assignments():
    with Session(Project.engine) as session:
        data = session.exec(select(
            Face.image_path,
            FaceClusterAssignment.cluster_id,
            FaceClusterAssignment.face_id
        ).join(FaceClusterAssignment, FaceClusterAssignment.face_id == Face.id)).all()
    return data

@app.get('/faces', response_model=list[models.FacePublic])
def get_faces():
    with Session(Project.engine) as session:

        data = session.exec(
            select(Face)
        ).all()
        
    return data

@app.get("/image")
def get_image(
    request: Request,
    filePath: str,
    width: int = None,
    cache: bool = False,
    x: float = None,
    y: float = None,
    w: float = None,
    h: float = None
):
    bb = (x, y, w, h) if x and y and w and h else None
    if cache:
        url = str(request.url)
        with Session(Project.engine) as session:
            image_data = session.exec(select(ImageCache.image_data).where(ImageCache.resource_url == url)).first()

        if image_data == None:

            image_data = image_process(filePath, width, bb)

            with Session(Project.engine) as session:
                session.add(ImageCache(resource_url=url, image_data=image_data))
                session.commit()
        
        return Response(content=image_data, media_type="image/png")        

    image_data = image_process(filePath, width, bb)
    return Response(content=image_data, media_type="image/png")

class MergeClustersRequest(BaseModel):
    cluster_ids: list[int] = Field()

@app.post('/mergeClusters')
def merge_clusters(request_body: MergeClustersRequest):
    cluster_ids = request_body.cluster_ids
    cluster_ids = list(set(cluster_ids)) # cannot have duplicates
    if len(cluster_ids) < 2:
        return

    first = cluster_ids[0]
    rest = cluster_ids[1:]
    
    with Session(Project.engine) as session:
        session.exec(
            update(FaceClusterAssignment)
            .where(FaceClusterAssignment.cluster_id.in_(rest))
            .values(cluster_id=first))
        
        session.exec(
            delete(Cluster)
            .where(Cluster.id.in_(rest))
        )
        
        session.commit()
    
    return { "ok" : True }
    
@app.get('/projects', response_model=list[str])
def get_projects() -> list[str]:
    return Project.listAll()

@app.get('/projects/{project_name}')
def switch_project(project_name : str) -> None:
    Project.switch(project_name)
    return { "ok" : True }

# returns current project
@app.get('/project', response_model=str)
def get_current_project() -> str:
    return Project.name

@app.get('/images', response_model=list[str])
def get_images():
    with Session(Project.engine) as session:
        data = session.exec(select(Face.image_path).distinct())
    return data

