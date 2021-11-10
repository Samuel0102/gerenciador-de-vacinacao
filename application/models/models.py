from datetime import date
from application import app
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(app)

class Vaccine(db.Model):
    #usado nas classes para definir name nas tabelas do banco
    __tablename__ = "vaccines"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    fabrication_date = db.Column(db.DateTime)
    owner = db.Column(db.Text)

    def __repr__(self):
        return f"<Vaccine {self.name}>"

    #usado para não necessitar especificação do atributo na instanciação
    def __init__(self, name:str, fabrication_date:date, owner:str):
        self.name = name
        self.fabrication_date = fabrication_date
        self.owner = owner

    # retorno facilitado dos dados dos usuarios
    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "fabrication_date": self.fabrication_date,
            "owner": self.owner
        }

class Pacient(db.Model):
    __tablename__ = "pacients"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    born = db.Column(db.DateTime)
    CPF = db.Column(db.Text, nullable=False, unique=True)
    tel = db.Column(db.Text)
    email = db.Column(db.Text)
    sex = db.Column(db.Text)
    password = db.Column(db.Text)
    
    def __repr__(self):
        return f"<Pacient {self.name}"

    def __init__(self, name:str, born:date,
                CPF:str, tel:str, email:str, sex:str, password:str):
        self.name = name
        self.born = born
        self.CPF = CPF
        self.tel = tel
        self.email = email
        self.sex = sex
        self.password = password

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "born": self.born,
            "CPF": self.CPF,
            "tel": self.tel,
            "email": self.email,
            "sex": self.sex,
            "password": self. password
        }

class Nurse(db.Model):
    __tablename__ = "nurses"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.Text)
    born = db.Column(db.DateTime)
    CPF = db.Column(db.Text, nullable=False, unique=True)
    coren = db.Column(db.Text, nullable=False, unique=True)
    tel = db.Column(db.Text)
    email = db.Column(db.Text)
    sex = db.Column(db.Text)
    password = db.Column(db.Text)
    is_active = db.Column(db.Boolean)
    
    def __repr__(self):
        return f"<Nurse {self.name}"

    def __init__(self, name:str, born:date,
                CPF:str, coren:str, tel:str, email:str, sex:str, password:str, is_active=True):
        self.name = name
        self.born = born
        self.CPF = CPF
        self.coren = coren
        self.tel = tel
        self.email = email
        self.sex = sex
        self.password = password
        self.is_active = is_active

    def json(self):
        return {
            "id": self.id,
            "name": self.name,
            "born": self.born,
            "CPF": self.CPF,
            "coren": self.coren,
            "tel": self.tel,
            "email": self.email,
            "sex": self.sex,
            "password": self.password,
            "is_active": self.is_active
        }

class Vaccination(db.Model):
    __tablename__ = "vaccinations"

    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime)
    next_dose_date = db.Column(db.DateTime)
    dose = db.Column(db.Integer)
    id_vaccine = db.Column(db.Integer, db.ForeignKey(Vaccine.id), nullable=False)
    vaccine = db.relationship("Vaccine")
    id_pacient = db.Column(db.Integer, db.ForeignKey(Pacient.id), nullable=False)
    pacient = db.relationship("Pacient")
    id_nurse = db.Column(db.Integer, db.ForeignKey(Nurse.id), nullable=False)
    nurse = db.relationship("Nurse")

    def __repr__(self):
        return "<Vaccination of {self.pacient.name}>"

    def __init__(self, date:date, next_dose_date:date,
                 dose:int, vaccine:Vaccine, pacient:Pacient, nurse: Nurse):
        self.date = date
        self.next_dose_date = next_dose_date
        self.dose = dose
        self.vaccine = vaccine
        self.pacient = pacient
        self.nurse = nurse

    def json(self):
        return {
            "id": self.id,
            "date": self.date,
            "next_dose_date": self.next_dose_date,
            "dose": self.dose,
            "id_vaccine": self.id_vaccine,
            "vaccine": self.vaccine.json(),
            "id_pacient": self.id_pacient,
            "pacient": self.pacient.json(),
            "id_nurse": self.id_nurse,
            "nurse": self.nurse.json()
        }


