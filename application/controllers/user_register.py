from datetime import datetime
from bcrypt import hashpw, gensalt
from application import app
from flask import render_template, request, jsonify
from application.models.models import Enfermeiro, Paciente, Vacina, Vacinacao, db

@app.route("/user-register", methods=["POST", "GET"])
def user_register():
    
    if request.method == "POST":
        user_data = request.get_json()

        data = user_data["born"]
        date = datetime.strptime(data, '%Y-%m-%d').date()

        plain_password = user_data["password"]
        hashed_password = hashpw(plain_password, gensalt())

        if(user_data["type"] == "SUPER USER"):
            new_user =  Enfermeiro(user_data["name"], date,
                                    user_data["cpf"], user_data["coren"], user_data["tel"],
                                    user_data["email"], user_data["genre"], hashed_password)
        else:
            new_user =    Paciente(user_data["name"], date,
                                    user_data["cpf"],user_data["tel"], user_data["email"],
                                    user_data["genre"], hashed_password)

        try:
            db.session.add(new_user)
            db.session.commit()
            return jsonify({"result":"USER REGISTERED"})
        except:
            return jsonify({"result":"CPF/COREN IN USE"})

    return render_template("cadastro_de_usuarios.html")