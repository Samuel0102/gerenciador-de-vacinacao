from os import path
from application import app

path = path.abspath(path.dirname(__file__))

SQLALCHEMY_DATABASE_URI = f'sqlite:////{path}/application/database/database.db'
SQLALCHEMY_TRACK_MODIFICATIONS = False