from werkzeug.utils import redirect
from application import app
from flask import session, redirect

@app.route("/logout")
def logout():
    session.clear()

    return redirect("/")