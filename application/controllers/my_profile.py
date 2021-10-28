from application import app
from datetime import datetime
from flask import render_template, jsonify, request
from application.models.models import Nurse, Pacient, db


@app.route("/my-profile", methods=["GET","PUT","DELETE"])
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
            db.session.delete(user)
            db.session.commit()

            return jsonify({"result":"USER DELETED"})

        # se o método for put, altera os campos do banco
        # conforme dados fornecidos pelo front-end
        elif request.method == "PUT":
            # percorre o agora dicionário user_data
            for field in user_data:
                if field == "born":
                        date = datetime.strptime(user_data[field], '%Y-%m-%d').date()
                        user_data[field] = date

                # utiliza o nome da chave do dicionário para alterar o campo
                # do banco, visto que seus nomes são propositalmente definidos
                # iguais
                setattr(user, field, user_data[field])
                db.session.commit()

            return jsonify({"result":"ACCOUNT UPDATED"})

    return render_template("my_profile.html")