from flask import Flask

app = Flask(__name__)
app.config.from_pyfile("../config.py")

from application.controllers import (index, user_controllers, vaccine_controllers,
                                    vaccination_controllers)
