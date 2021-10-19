from flask.json import jsonify
from application import app
from application.models.models import Enfermeiro, Paciente
from flask import render_template, request, session
from bcrypt import hashpw

@app.route("/login", methods=["POST", "GET"])
def login():

    if request.method == "POST":
        user_data = request.get_json()

        try:
            if user_data["type"] == "SUPER USER":
                user = Enfermeiro.query.filter_by(coren=user_data["identifier"]).first()
            else:
                user = Paciente.query.filter_by(CPF=user_data["identifier"]).first()

            hash_test = hashpw(user_data["password"], user.senha) == user.senha
            
            if(hash_test):
                session["user-type"] = user_data["type"]
                session["user-id"] = user.id
                
                return jsonify({"result":"SUCCESS LOGIN", "user-id":user.id})
            else:
                return jsonify({"result":"INCORRECT LOGIN"})
        except:
            return jsonify({"result":"INCORRECT LOGIN"})

    return render_template("login.html")