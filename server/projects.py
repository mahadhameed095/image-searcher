import os
import models # do not remove this. The models need to be defined at this point.
from sqlmodel import create_engine, SQLModel
from sqlalchemy import Engine

DIR = 'projects'
os.makedirs(DIR, exist_ok=True)

class Project:
    name : str = None
    engine : Engine = None

    @staticmethod
    def switch(project_name : str):
        Project.name = project_name
        Project.engine = create_engine(f"sqlite:///{DIR}/{Project.name}.sqlite")
        SQLModel.metadata.create_all(Project.engine)

    # @staticmethod
    # def delete(project_name : str):
    #     # what about deleting default
    #     os.remove(f"{DIR}/{project_name}.sqlite")
        
        
    @staticmethod
    def listAll():
        return [item.removesuffix('.sqlite') for item in os.listdir(DIR)]
    
Project.switch("default")