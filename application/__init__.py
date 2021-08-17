from flask import Flask


app = Flask(__name__)
app.config.from_pyfile("../config.py")

from application.controllers import (index, user_register, login,
 vaccination_register, vaccine_register, my_profile, my_card)

from application.models import models