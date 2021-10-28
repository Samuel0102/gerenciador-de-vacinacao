from datetime import datetime
from bcrypt import hashpw, gensalt
from application import app
from flask import render_template, request, jsonify
from application.models.models import Nurse, Pacient, db

@app.route("/user-register", methods=["POST", "GET"])
def user_register():
    
    if request.method == "POST":
        # obtem o JSON de dados do novo usuário fornecido pelo front-end 
        user_data = request.get_json()

        # converte a data do tipo str para o tipo datetime, exigido pelo domînio
        # do campo 'born' das tabelas de paciente e enfermeiros
        data = user_data["born"]
        date = datetime.strptime(data, '%Y-%m-%d').date()

        # transforma a senha de plain str para um hash adicionado de salt,
        # garantindo mais segurança no armazenamento
        plain_password = user_data["password"]
        hashed_password = hashpw(plain_password, gensalt())

        # verifica qual tipo de usuário será cadastrado conforme atributo type
        # do JSON obtido, após instancia ou Nurse ou Pacient
        if(user_data["type"] == "SUPER USER"):
            new_user =  Nurse(user_data["name"], date,
                                    user_data["CPF"], user_data["coren"], user_data["tel"],
                                    user_data["email"], user_data["sex"], hashed_password)
        else:
            new_user =    Pacient(user_data["name"], date,
                                    user_data["CPF"],user_data["tel"], user_data["email"],
                                    user_data["sex"], hashed_password)

        # se o CPF/COREN fornecido não estiver registrado no banco,
        # realiza o cadastro, caso esteja barra o cadastro
        try:
            db.session.add(new_user)
            db.session.commit()

            return jsonify({"result":"USER REGISTERED"})
        except:
            return jsonify({"result":"CPF/COREN IN USE"})

    return render_template("user_register.html")