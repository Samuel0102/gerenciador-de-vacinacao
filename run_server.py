from application import app
from application.models.models import db, Nurse, Pacient, Vaccine, Vaccination
from os import path

if __name__ == "__main__":
    if not path.exists("application/database/database.db"):
        db.create_all()
        
    app.run(debug=True, host="192.168.0.30")