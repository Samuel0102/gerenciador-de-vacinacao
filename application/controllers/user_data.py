from application import app
from flask import render_template, jsonify
from bcrypt import hashpw
from application.models.models import Pacient, Nurse

@app.route("/user-data/<user_type>/<int:user_id>")
def user_data(user_type, user_id):
    # route sem template, para obter dados do banco
    try:

        # verifica o tipo de usuário, especificado na url
        # e busca pelo registro com base no id passado
        if(user_type == "SUPER USER"):
            user = Nurse.query.get(user_id)
            user_data = user.json()
            user_data["type"] = "SUPER USER"
        else:
            user = Pacient.query.get(user_id)
            user_data = user.json()
            user_data["type"] = "NORMAL USER"

        # troca o separador "-" por "." a fim do 
        # formatador automático do JS não formatar de
        # forma errada a data
        user_born = user_data["born"].date() 
        user_data["born"] = str(user_born).replace("-",".")

        return jsonify({"result": user_data})
    except:

        # se o id não obtiver sucesso, em raros casos, impede o fornecimento
        # dos dados
        return jsonify({"result":"USER NOT FOUND"})