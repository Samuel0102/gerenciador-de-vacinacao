from application import app
from application.models.models import Nurse, Pacient, Vaccination, db
from application.controllers.utilities import send_email
from bcrypt import gensalt, hashpw
from flask import render_template, request, jsonify, session, redirect
from datetime import datetime

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
        if("coren" in user_data):
            new_user = Nurse(user_data["name"], date,
                             user_data["CPF"], user_data["coren"], user_data["tel"],
                             user_data["email"], user_data["sex"], hashed_password, True)
        else:
            new_user = Pacient(user_data["name"], date,
                               user_data["CPF"], user_data["tel"], user_data["email"],
                               user_data["sex"], hashed_password)

        # se o CPF/COREN fornecido não estiver registrado no banco,
        # realiza o cadastro, caso esteja barra o cadastro
        try:
            db.session.add(new_user)
            db.session.commit()

            send_email(type="success_register", email=new_user.email, user_name=new_user.name)

            return jsonify({"result": "USER REGISTERED"})
        except:
            return jsonify({"result": "CPF/COREN IN USE"})

    return render_template("user_register.html")


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        # obtém o JSON de 3 atributos fornecido pelo front-end
        user_data = request.get_json()

        # captação de possíveis erros do login
        try:
            # verifica o tipo de usuário, para saber em qual tabela procurar
            if user_data["type"] == "SUPER USER":
                user = Nurse.query.filter_by(
                    coren=user_data["identifier"]).first()

                if(not user.is_active):
                    return jsonify({"result": "USER NOT REGISTERED"})
                    
            else:
                user = Pacient.query.filter_by(
                    CPF=user_data["identifier"]).first()

            # testa se a senha é igual a do banco, através de conversão em hash e após
            # comparação gerando um boolean
            hash_test = hashpw(
                user_data["password"], user.password) == user.password

            # verifica se as senhas são iguais, se sim, cria uma sessão no back-end,
            # que age junto com a do front-end
            if(hash_test):
                session["user_type"] = user_data["type"]
                session["user_id"] = user.id

                response = {"result": "SUCCESS LOGIN",
                            "user-id": user.id, "user-cpf": user.CPF}

                if user_data["type"] == "SUPER USER":
                    response["user-coren"] = user.coren

                return jsonify(response)
            else:
                # caso a senha não corresponda, retorna login incorreto
                return jsonify({"result": "INCORRECT LOGIN"})
        except:
            # caso não haja usuário cadastrado com CPF/COREN retorna login incorreto
            return jsonify({"result": "USER NOT REGISTERED"})

    return render_template("login.html")


@app.route("/user-data/<user_type>/<user_cpf>")
def user_data(user_type, user_cpf):
    # route sem template, para obter dados do banco
    try:
        # verifica o tipo de usuário, especificado na url
        # e busca pelo registro com base no id passado
        if(user_type == "SUPER USER"):
            user = Nurse.query.filter_by(CPF=user_cpf).first()
        else:
            user = Pacient.query.filter_by(CPF=user_cpf).first()

        user_data = user.json()

        # troca o separador "-" por "." a fim do
        # formatador automático do JS não formatar de
        # forma errada a data
        data = user_data["born"].date()
        user_data["born"] = str(data).replace("-", ".")

        return jsonify({"result": user_data})
    except:
        # se o id não obtiver sucesso, em raros casos, impede o fornecimento
        # dos dados
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

    # como está em hash é necessário hashear a senha a ser verificada e após
    # comparar com o hash salvo no banco
    hash_test = hashpw(user_data["password"], user.password) == user.password

    # retorna um boolean indicando se a senha é a correspondente a guardada
    # no banco
    return jsonify({"result": hash_test})


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
            if user_data["type"] == "SUPER USER":
                user.is_active = False
                db.session.commit()
                session.clear()
                return jsonify({"result":"USER DELETED"})

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

                # utiliza o nome da chave do dicionário para alterar o campo
                # do banco, visto que seus nomes são propositalmente definidos
                # iguais
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
