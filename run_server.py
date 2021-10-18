from application import app
from application.models.models import db

if __name__ == "__main__":
    app.run(debug=True)
    db.create_all()

