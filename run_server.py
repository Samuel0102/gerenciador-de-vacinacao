from application import app
from application.models.models import db, Nurse, Pacient, Vaccine, Vaccination
from os import path

# inicialização do servidor além da verificação da existência
# do banco
if __name__ == "__main__":
    if not path.exists("application/database/database.db"):
        db.create_all()
        
    app.run()