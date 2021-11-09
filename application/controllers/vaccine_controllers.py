from datetime import datetime
from application import app
from application.models.models import Vaccine, db
from flask import render_template, session, redirect, request, jsonify


@app.route("/vaccine-register", methods=["POST", "GET"])
def vaccine_register():
    if request.method == "POST":
        vaccine_data = request.get_json()

        if(Vaccine.query.filter_by(name=vaccine_data["name"]).first() == None):
            data = vaccine_data["fabrication"]
            fabrication_date = datetime.strptime(data, '%Y-%m-%d').date()

            vaccine = Vaccine(
                vaccine_data["name"], fabrication_date, vaccine_data["owner"])

            db.session.add(vaccine)
            db.session.commit()

            return jsonify({"result": "VACCINE REGISTERED"})

        else:
            return jsonify({"result": "VACCINE IN USE"})

    # verifica qual tipo de usuário esta logado, se for um Pacient
    # barra sua entrada na paǵina de cadastro de vacina
    if(len(session) > 0 and session["user_type"] == "SUPER USER"):
        return render_template("vaccine_register.html")
    else:
        return redirect("/")


@app.route("/check-vaccine/<vaccine_name>")
def vaccines(vaccine_name):

    vaccine = Vaccine.query.filter_by(name=vaccine_name).first()
    if(vaccine != None):
        return jsonify({"result": "VACCINE FOUND", "vaccine_id": vaccine.id})
    else:
        return jsonify({"result": "VACCINE NOT FOUND"})
