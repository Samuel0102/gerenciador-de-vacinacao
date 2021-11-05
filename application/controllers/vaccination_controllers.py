from flask.json import jsonify
from application import app
from application.models.models import Vaccine, Vaccination, Pacient, Nurse, db
from flask import render_template, session, redirect, request
from datetime import datetime

@app.route("/vaccination-register", methods=["POST", "GET"])
def vaccination_register():
    # verifica qual tipo de usuário esta logado, se for um Pacient
    # barra sua entrada na paǵina de cadastro de vacinação
    if request.method == "POST":
        vaccination_data = request.get_json()

        nurse = Nurse.query.filter_by(coren=vaccination_data["coren"]).first()
        pacient = Pacient.query.filter_by(CPF=vaccination_data["CPF"]).first()
        vaccine = Vaccine.query.filter_by(name=vaccination_data["vaccine-name"]).first()

        date = datetime.strptime(vaccination_data["date"], '%Y-%m-%d').date()
        vaccination_data["date"] = date

        if len(vaccination_data) == 5:
            next_date = datetime.min
        else:
            next_date = vaccination_data["next-date"]

        vaccination = Vaccination(vaccination_data["date"], next_date, vaccination_data["dose"], vaccine, pacient, nurse)

        try:
            db.session.add(vaccination)
            db.session.commit()
            return jsonify({"result":"VACCINATION REGISTERED"})
        except:
            return jsonify({"result":"VACCINATION NOT REGISTERED"})

    if(len(session) > 0 and session["user_type"] == "SUPER USER"):
        return render_template("vaccination_register.html")
    else:
        return redirect("/")