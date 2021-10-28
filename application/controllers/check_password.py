from application import app
from flask import request, jsonify
from bcrypt import hashpw
from application.models.models import Nurse, Pacient

@app.route("/check-password", methods=["POST"])
def check_password():
    # obter a senha e o id do usuário do front-end
    user_data = request.get_json()
    
    # verifica em qual tabela será retirada a senha cadastrada
    if user_data["type"] == "NORMAL USER":
        user = Pacient.query.get(user_data["id"])
    else:
        user = Nurse.query.get(user_data["id"])

    # como está em hash é necessário hashear a senha a ser verifica e após 
    # comparar com o hash salvo no banco
    hash_test = hashpw(user_data["password"], user.password) == user.password

    # retorna um boolean indicando se a senha é a correspondente a guardada
    # no banco
    if(hash_test):
        return jsonify({"result":True})
    else:
        return jsonify({"result":False})