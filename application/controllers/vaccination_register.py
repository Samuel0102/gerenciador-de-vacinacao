from application import app
from flask import render_template


@app.route("/vaccination-register")
def vaccination_register():
    return render_template("cadastro_vacinacao.html")