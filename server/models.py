from sqlmodel import Field, SQLModel
from sqlalchemy import PrimaryKeyConstraint
    

class FacePublic(SQLModel):
    id : str = Field(primary_key=True)
    image_path : str = Field()
    x : float = Field()
    y : float = Field()
    w : float = Field()
    h : float = Field()

class FacePublicWithXY(FacePublic):
    embedding_x : float = Field()
    embedding_y : float = Field()

class Face(FacePublic, table=True):
    embedding : bytes = Field()

class ClusterBase(SQLModel):
    id : int = Field(primary_key=True)

class Cluster(ClusterBase, table=True):
    representative_face_id : str = Field(foreign_key="face.id")

class ClusterPublic(ClusterBase):
    representative_face : FacePublicWithXY = Field()

class FaceClusterAssignment(SQLModel, table=True):
    face_id : str = Field(foreign_key="face.id")
    cluster_id : int = Field(foreign_key="cluster.id")

    __table_args__ = (
        PrimaryKeyConstraint("face_id", "cluster_id"),
    )

class ImageCache(SQLModel, table=True):
    resource_url : str = Field(primary_key=True)
    image_data : bytes = Field()


class ImageClusterAssignment(SQLModel):
    image_path : str
    cluster_id : int
    face_id : str

