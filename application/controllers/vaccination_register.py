from application import app
from flask import render_template, session, redirect


@app.route("/vaccination-register")
def vaccination_register():
    # verifica qual tipo de usuário esta logado, se for um Pacient
    # barra sua entrada na paǵina de cadastro de vacinação
    if(session["user_type"] == "NORMAL USER"):
        return redirect("/")
    else:
        return render_template("vaccination_register.html")