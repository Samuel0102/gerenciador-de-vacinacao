from application import app
from application.models.models import db, Nurse, Pacient, Vaccine, Vaccination

if __name__ == "__main__":
    app.run(debug=True, host="192.168.0.30")
