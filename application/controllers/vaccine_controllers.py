from datetime import datetime
from application import app
from application.models.models import Vaccine, db
from flask import render_template, session, redirect, request, jsonify


@app.route("/vaccine-register", methods=["POST", "GET"])
def vaccine_register():
    if request.method == "POST":
        # obtém os três dados de vacina
        vaccine_data = request.get_json()

        # verifica se a vacina ja existe no sistema, com base no nome
        if(Vaccine.query.filter_by(name=vaccine_data["name"]).first() == None):
            # instancia de vacina
            vaccine = Vaccine(
                vaccine_data["name"],
                vaccine_data["fabrication"],
                vaccine_data["owner"])

            # adição ao banco
            db.session.add(vaccine)
            db.session.commit()

            return jsonify({"result": "VACCINE REGISTERED"})

        else:
            return jsonify({"result": "VACCINE IN USE"})

    # verifica qual tipo de usuário esta logado, se for um Paciente
    # barra sua entrada na página de cadastro de vacina
    if(len(session) > 0 and session["user_type"] == "SUPER USER"):
        return render_template("vaccine_register.html")
    else:
        return redirect("/")


@app.route("/check-vaccine/<vaccine_name>")
def vaccines(vaccine_name):
    # realiza query na tabela de vacinas, com base no nome da vacina
    # obtido pela regra da rota
    vaccine = Vaccine.query.filter_by(name=vaccine_name).first()

    # se não encontra-se registro na query, seu valor é NONE
    # se for retorna que a vacina não foi encontrada
    if(vaccine != None):
        return jsonify({"result": "VACCINE FOUND", "vaccine_id": vaccine.id})
    else:
        return jsonify({"result": "VACCINE NOT FOUND"})
