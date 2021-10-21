from application import app
from flask import render_template, jsonify


@app.route("/my-profile")
def my_profile():
    return render_template("my_profile.html")