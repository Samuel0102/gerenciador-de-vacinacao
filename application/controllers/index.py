from application import app
from flask import render_template
from .utilities import send_email

@app.route("/")
def index():
    return render_template("index.html")

