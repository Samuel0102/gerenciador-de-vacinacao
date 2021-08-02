from application import app
from flask import render_template


@app.route("/user-register")
def user_register():
    return render_template("cadastro_de_usuarios.html")