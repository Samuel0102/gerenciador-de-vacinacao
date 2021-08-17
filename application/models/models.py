from datetime import date
from application import app
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)

class Vacina(db.Model):
    #usado nas classes para definir nome nas tabelas do banco
    __tablename__ = "vacinas"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.Text)
    data_fabricacao = db.Column(db.DateTime)
    fabricante = db.Column(db.Text)

    def __repr__(self):
        return f"<Vacina {self.nome}>"

    #usado para não necessitar especificação do atributo na instanciação
    def __init__(self, nome:str, data_fabricacao:date, fabricante:str):
        self.nome = nome
        self.data_fabricacao = data_fabricacao
        self.fabricante = fabricante

    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "data_fabricacao": self.data_fabricacao,
            "fabricante": self.fabricante
        }

class Paciente(db.Model):
    __tablename__ = "pacientes"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.Text)
    data_nascimento = db.Column(db.DateTime)
    CPF = db.Column(db.Text, nullable=False, unique=True)
    telefone = db.Column(db.Text)
    email = db.Column(db.Text)
    sexo = db.Column(db.Text)
    senha = db.Column(db.Text)
    
    def __repr__(self):
        return f"<Paciente {self.nome}"

    def __init__(self, nome:str, data_nascimento:date,
                CPF:str, telefone:str, email:str, sexo:str, senha:str):
        self.nome = nome
        self.data_nascimento = data_nascimento
        self.CPF = CPF
        self.telefone = telefone
        self.email = email
        self.sexo = sexo
        self.senha = senha

    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "data_nascimento": self.data_nascimento,
            "CPF": self.CPF,
            "telefone": self.telefone,
            "email": self.email,
            "sexo": self.sexo,
            "senha": self. senha
        }

class Enfermeiro(db.Model):
    __tablename__ = "enfermeiros"

    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.Text)
    data_nascimento = db.Column(db.DateTime)
    CPF = db.Column(db.Text, nullable=False, unique=True)
    coren = db.Column(db.Text, nullable=False, unique=True)
    telefone = db.Column(db.Text)
    email = db.Column(db.Text)
    sexo = db.Column(db.Text)
    senha = db.Column(db.Text)
    

    def __repr__(self):
        return f"<Enfermeiro {self.nome}"

    def __init__(self, nome:str, data_nascimento:date,
                CPF:str, coren:str, telefone:str, email:str, sexo:str, senha:str):
        self.nome = nome
        self.data_nascimento = data_nascimento
        self.CPF = CPF
        self.coren = coren
        self.telefone = telefone
        self.email = email
        self.sexo = sexo
        self.senha = senha

    def json(self):
        return {
            "id": self.id,
            "nome": self.nome,
            "data_nascimento": self.data_nascimento,
            "CPF": self.CPF,
            "coren": self.coren,
            "telefone": self.telefone,
            "email": self.email,
            "sexo": self.sexo,
            "senha": self. senha
        }


class Vacinacao(db.Model):
    __tablename__ = "vacinacoes"

    id = db.Column(db.Integer, primary_key=True)
    data = db.Column(db.DateTime)
    data_proxima_dose = db.Column(db.DateTime)
    dose = db.Column(db.Integer)
    id_vacina = db.Column(db.Integer, db.ForeignKey(Vacina.id), nullable=False)
    vacina = db.relationship("Vacina")
    id_paciente = db.Column(db.Integer, db.ForeignKey(Paciente.id), nullable=False)
    paciente = db.relationship("Paciente")
    id_enfermeiro = db.Column(db.Integer, db.ForeignKey(Enfermeiro.id), nullable=False)
    enfermeiro = db.relationship("Enfermeiro")

    def __repr__(self):
        return "<Vacinacao de {self.paciente.nome}>"

    def __init__(self, data:date, data_proxima_dose:date,
                 dose:int, vacina:Vacina, paciente:Paciente, enfermeiro: Enfermeiro):
        self.data = data
        self.data_proxima_dose = data_proxima_dose
        self.dose = dose
        self.vacina = vacina
        self.paciente = paciente
        self.enfermeiro = enfermeiro

    def json(self):
        return {
            "id": self.id,
            "data": self.data,
            "data_proxima_dose": self.data_proxima_dose,
            "dose": self.dose,
            "id_vacina": self.id_vacina,
            "vacina": self.vacina.json(),
            "id_paciente": self.id_paciente,
            "paciente": self.paciente.json(),
            "id_enfermeiro": self.id_enfermeiro,
            "enfermeiro": self.enfermeiro.json()
        }

