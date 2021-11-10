from flask.json import jsonify
from application import app
from application.models.models import Vaccine, Vaccination, Pacient, Nurse, db
from flask import render_template, session, redirect, request
from datetime import date, datetime


@app.route("/vaccination-register", methods=["POST", "GET"])
def vaccination_register():
    # verifica qual tipo de usuário esta logado, se for um Pacient
    # barra sua entrada na paǵina de cadastro de vacinação
    if request.method == "POST":
        vaccination_data = request.get_json()

        # instancia os 3 atores necessários na composição
        nurse = Nurse.query.filter_by(coren=vaccination_data["coren"]).first()
        pacient = Pacient.query.filter_by(CPF=vaccination_data["CPF"]).first()
        vaccine = Vaccine.query.filter_by(
            name=vaccination_data["vaccine-name"]).first()

        vaccination_data["date"] = datetime.strptime(
            vaccination_data["date"], '%Y-%m-%d').date()

        # verifica se há data de próxima dose
        if len(vaccination_data) == 5:
            next_date = datetime.min
        else:
            next_date = datetime.strptime(
                vaccination_data["next-date"], '%Y-%m-%d').date()

        # instancia da vacinacao
        vaccination = Vaccination(
            vaccination_data["date"], next_date, vaccination_data["dose"], vaccine, pacient, nurse)

        try:
            db.session.add(vaccination)
            db.session.commit()
            return jsonify({"result": "VACCINATION REGISTERED"})
        except:
            return jsonify({"result": "VACCINATION NOT REGISTERED"})

    # barra entrada de usuários paciente na página
    if(len(session) > 0 and session["user_type"] == "SUPER USER"):
        return render_template("vaccination_register.html")
    else:
        return redirect("/")


@app.route("/list-vaccinations/<cpf>")
def vaccinations(cpf):
    # realiza query de vacinações com base no cpf dado pela regra da rota
    vaccinations_query = Vaccination.query.filter(
        Vaccination.pacient.has(CPF=cpf)).all()
    vaccinations = []

    # loop pela query de vacinações
    for vaccination in vaccinations_query:
        vaccination_data = {}

        # gera um dicionário com todos os dados necessários
        vaccination_data["vaccine-name"] = vaccination.vaccine.name
        vaccination_data["vaccine-owner"] = vaccination.vaccine.owner
        vaccination_data["dose"] = vaccination.dose
        vaccination_data["date"] = str(vaccination.date.date()).replace("-", ".")
        vaccination_data["nurse-name"] = str(vaccination.nurse.name)

        if(str(vaccination.next_dose_date.date()) == "0001-01-01"):
            vaccination_data["next-dose-date"] = "(X)"
        else:
            vaccination_data["next-dose-date"] = str(
                vaccination.next_dose_date.date()).replace("-", ".")

        vaccinations.append(vaccination_data)

    return jsonify(vaccinations)
