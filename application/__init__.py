from flask import Flask
from config import app_env, app_config

app = Flask(__name__)
config = app_config[app_env]

app.secret_key = config.SECRET_KEY
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = config.SQLALCHEMY_TRACK_MODIFICATIONS

app.config.from_object(app_config[app_env])
app.config.from_pyfile("../config.py")

from application.controllers import (index, user_controllers, vaccine_controllers,
                                    vaccination_controllers)
