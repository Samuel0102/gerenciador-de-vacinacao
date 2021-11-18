from datetime import date, datetime
from application import app
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from bcrypt import hashpw, gensalt

db = SQLAlchemy(app)
migrate = Migrate(app, db)

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
        self.fabrication_date = self.format_fabrication_date(fabrication_date)
        self.owner = owner

    def format_fabrication_date(self, fabrication_date:date):
        data = fabrication_date
        fabrication_date = datetime.strptime(data, '%Y-%m-%d').date()

        return fabrication_date

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
        self.born = self.format_born_date(born)
        self.CPF = CPF
        self.tel = tel
        self.email = email
        self.sex = sex
        self.password = self.hash_password(password)

    def hash_password(self, password:str):
        # transforma a senha de plain str para um hash adicionado de salt,
        # garantindo mais segurança no armazenamento
        plain_password = password
        hashed_password = hashpw(plain_password, gensalt())

        return hashed_password

    def format_born_date(self, born:date):
        # converte a data do tipo str para o tipo datetime, exigido pelo domînio
        # do campo 'born' das tabelas de paciente e enfermeiros
        data = born
        date = datetime.strptime(data, '%Y-%m-%d').date()

        return date

    def equals_password(self, password:str):
         # testa se a senha é igual a do banco, através de conversão em hash e após
        # comparação gerando um boolean
        hash_test = hashpw(password, self.password) == self.password

        return hash_test

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
                CPF:str, coren:str, tel:str, email:str, sex:str, password:str, is_active:bool):
        self.name = name
        self.born = self.format_born_date(born)
        self.CPF = CPF
        self.coren = coren
        self.tel = tel
        self.email = email
        self.sex = sex
        self.password = self.hash_password(password)
        self.is_active = is_active

    def hash_password(self, password:str):
        # transforma a senha de plain str para um hash adicionado de salt,
        # garantindo mais segurança no armazenamento
        plain_password = password
        hashed_password = hashpw(plain_password, gensalt())

        return hashed_password

    def format_born_date(self, born:date):
        # converte a data do tipo str para o tipo datetime, exigido pelo domînio
        # do campo 'born' das tabelas de paciente e enfermeiros
        data = born
        date = datetime.strptime(data, '%Y-%m-%d').date()

        return date

    def equals_password(self, password:str):
        hash_test = hashpw(password, self.password) == self.password

        return hash_test

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
    dose = db.Column(db.String(50))
    id_vaccine = db.Column(db.Integer, db.ForeignKey(Vaccine.id), nullable=False)
    vaccine = db.relationship("Vaccine")
    id_pacient = db.Column(db.Integer, db.ForeignKey(Pacient.id), nullable=False)
    pacient = db.relationship("Pacient")
    id_nurse = db.Column(db.Integer, db.ForeignKey(Nurse.id), nullable=False)
    nurse = db.relationship("Nurse")

    def __repr__(self):
        return "<Vaccination of {self.pacient.name}>"

    def __init__(self, date:date, next_dose_date:date,
                 dose:str, vaccine:Vaccine, pacient:Pacient, nurse: Nurse):
        self.date = self.format_vaccination_date(date)
        self.next_dose_date = self.format_vaccination_date(next_dose_date)
        self.dose = dose
        self.vaccine = vaccine
        self.pacient = pacient
        self.nurse = nurse

    def format_vaccination_date(self, vaccination_date:date):
        vaccination_date = datetime.strptime(
        vaccination_date, '%Y-%m-%d').date()

        return vaccination_date

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


