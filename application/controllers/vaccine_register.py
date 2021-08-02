from application import app
from flask import render_template


@app.route("/vaccine-register")
def vaccine_register():
    return render_template("cadastro_vacinas.html")