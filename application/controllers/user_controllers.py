from application import app
from application.models.models import Nurse, Pacient, Vaccination, db
from application.controllers.utilities import send_email
from flask import json, render_template, request, jsonify, session, redirect
from datetime import datetime


@app.route("/user-register", methods=["POST", "GET"])
def user_register():
    if request.method != "POST":
        return render_template("user_register.html")
    # obtem o JSON de dados do novo usuário fornecido pelo front-end
    user_data = request.get_json()
    # verifica qual tipo de usuário será cadastrado
    if("coren" in user_data):
        new_user = Nurse(user_data["name"], user_data["born"],
                         user_data["CPF"], user_data["coren"], user_data["tel"],
                         user_data["email"], user_data["sex"], user_data["password"], True)
    else:
        new_user = Pacient(user_data["name"], user_data["born"],
                           user_data["CPF"], user_data["tel"], user_data["email"],
                           user_data["sex"], user_data["password"])


    # verificação se cpf/coren já consta no banco
    try:
        db.session.add(new_user)
        db.session.commit()

        send_email(type="success_register",
                email=new_user.email, user_name=new_user.name)
    except:
        return jsonify({"result": "CPF/COREN IN USE"})

    return jsonify({"result":"USER REGISTERED"})

@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method != "POST":
        return render_template("login.html")

    # obtém o JSON de 3 atributos fornecido pelo front-end
    user_data = request.get_json()

    if user_data["type"] == "SUPER USER":
        user = Nurse.query.filter_by(coren=user_data["identifier"]).first()

        if(user != None and not user.is_active):
            return jsonify({"result": "USER NOT REGISTERED"})
    else:
        user = Pacient.query.filter_by(CPF=user_data["identifier"]).first()

    # se não houver usuário com cpf/coren a query retorna none
    if user is None:
        return jsonify({"result":"USER NOT REGISTERED"})

    if not (user.equals_password(user_data["password"])):
        # caso a senha não corresponda, retorna login incorreto
        return jsonify({"result": "INCORRECT LOGIN"})
        
    session["user_type"] = user_data["type"]
    session["user_id"] = user.id

    response = {"result": "SUCCESS LOGIN",
                "user-id": user.id, "user-cpf": user.CPF}

    if user_data["type"] == "SUPER USER":
        response["user-coren"] = user.coren

    return jsonify(response)


@app.route("/user-data/<user_type>/<user_cpf>")
def user_data(user_type, user_cpf):
    # query pelo banco com base em tipo de usuario e seu id
    if(user_type == "SUPER USER"):
        user = Nurse.query.filter_by(CPF=user_cpf).first()
    else:
        user = Pacient.query.filter_by(CPF=user_cpf).first()

    if(user != None):
        user_data = user.json()

        # formatacao para não ser interpretado como data do tipo JS
        data = user_data["born"].date()
        user_data["born"] = str(data).replace("-", ".")

        return jsonify({"result": user_data})

    return jsonify({"result": "USER NOT FOUND"})


@app.route("/check-password", methods=["POST"])
def check_password():
    # obter a senha e o id do usuário do front-end
    user_data = request.get_json()

    # verifica em qual tabela será retirada a senha cadastrada
    if user_data["type"] == "NORMAL USER":
        user = Pacient.query.get(user_data["id"])
    else:
        user = Nurse.query.get(user_data["id"])

    # retorna boolean relativo a igualdade das senhas
    return jsonify({"result": user.equals_password(user_data["password"])})


@app.route("/my-profile", methods=["GET", "PUT", "DELETE"])
def my_profile():
    # verifica se o método é PUT ou DELETE
    if request.method != "GET":
        user_data = request.get_json()

        # busca no banco o usuário específico, com base em dados
        # do json dado pelo front-end
        if(user_data["type"] == "NORMAL USER"):
            user = Pacient.query.get(user_data["id"])
        else:
            user = Nurse.query.get(user_data["id"])

        # se o método for delete, apaga o usuário do banco
        if request.method == "DELETE":
            # aqui é feito uma exclusão falsa do usuário enfermeiro
            # ele é impedido de acessar o site e suas funcionalidades
            # porém, seu registro ainda é permanente no banco
            # a fim de garantir os dados de vacinação
            print(user_data)
            if user_data["type"] == "SUPER USER":
                send_email("success_delete", user.email, user.name)
                user.is_active = False
                db.session.commit()
                session.clear()
                return jsonify({"result": "USER DELETED"})

            # envio do email com pdf de vacinações apenas ao
            # usuário comum
            send_email("send_pdf", user.email, user.name, user.CPF)

            # registros de vacinação do usuário
            vaccinations = Vaccination.query.filter(
                Vaccination.pacient.has(CPF=user.CPF)).all()

            # exclusão do usuário e de suas vacinações
            for i in vaccinations:
                db.session.delete(i)

            db.session.delete(user)
            db.session.commit()
            session.clear()

            return jsonify({"result": "USER DELETED"})

        # se o método for put, altera os campos do banco
        # conforme dados fornecidos pelo front-end
        elif request.method == "PUT":
            # percorre o agora dicionário user_data
            for field in user_data:
                if field == "born":
                    date = datetime.strptime(
                        user_data[field], '%Y-%m-%d').date()
                    user_data[field] = date
                
                # alteração dos atributos
                setattr(user, field, user_data[field])
                db.session.commit()

            return jsonify({"result": "ACCOUNT UPDATED"})

    return render_template("my_profile.html")


@app.route("/my-card")
def my_card():
    # barra a entrada de usuários enfermeiros, visto que não possuem
    # dados de vacinação
    if(len(session) > 0 and session["user_type"] == "SUPER USER"):
        return redirect("/")

    return render_template("my_card.html")


@app.route("/logout")
def logout():
    # apaga a sessão do back-end, igualmente ocorre no front-end
    session.clear()
    return redirect("/")
