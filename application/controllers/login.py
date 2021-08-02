from application import app
from flask import render_template


@app.route("/login")
def login():
    return render_template("login.html")