from flask.json import jsonify
from application import app
from application.models.models import Nurse, Pacient
from flask import render_template, request, session
from bcrypt import hashpw

@app.route("/login", methods=["POST", "GET"])
def login():

    if request.method == "POST":
        # obtém o JSON de 3 atributos fornecido pelo front-end
        user_data = request.get_json()

        # captação de possíveis erros do login
        try:
            # verifica o tipo de usuário, para saber em qual tabela procurar
            if user_data["type"] == "SUPER USER":
                user = Nurse.query.filter_by(coren=user_data["identifier"]).first()
            else:
                user = Pacient.query.filter_by(CPF=user_data["identifier"]).first()

            # testa se a senha é igual a do banco, através de conversão em hash e após
            # comparação gerando um boolean
            hash_test = hashpw(user_data["password"], user.password) == user.password
            
            # verifica se as senhas são iguais, se sim, cria uma sessão no back-end,
            # que age junto com a do front-end
            if(hash_test):
                session["user-type"] = user_data["type"]
                session["user-id"] = user.id
                
                return jsonify({"result":"SUCCESS LOGIN", "user-id":user.id})
            else:
                # caso a senha não corresponda, retorna login incorreto
                return jsonify({"result":"INCORRECT LOGIN"})
        except:
            # caso não haja usuário cadastrado com CPF/COREN retorna login incorreto
            return jsonify({"result":"INCORRECT LOGIN"})

    return render_template("login.html")