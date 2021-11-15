from os import path, environ

path = path.abspath(path.dirname(__file__))
class ConfigBase:
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "ZsllARzUCKF9oB%^7$E%yVFBw"

class Development(ConfigBase):
    DEBUG = True
    REQUEST_IP = "http://192.168.0.30:5000/"
    SQLALCHEMY_DATABASE_URI = f'sqlite:////{path}/application/database/development.db'

class Production(ConfigBase):
    Debug = False
    REQUEST_IP = "https://sistema-unico-vacinacao.herokuapp.com/"
    SQLALCHEMY_DATABASE_URI = f'sqlite:////{path}/application/database/database.db'

app_config = {
    "development": Development(),
    "testing": None,
    "production": Production()
}

app_env = environ.get("FLASK_ENV")

if app_env is None:
    app_env = "development"
