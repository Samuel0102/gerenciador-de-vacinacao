from application import app
from flask import render_template


@app.route("/my-card")
def my_card():
    return render_template("minha_carteirinha.html")