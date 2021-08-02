from application import app
from flask import render_template


@app.route("/my-profile")
def my_profile():
    return render_template("meu_perfil.html")