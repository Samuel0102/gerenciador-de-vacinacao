from werkzeug.utils import redirect
from application import app
from flask import session, redirect

@app.route("/logout")
def logout():
    # apaga a sessão do back-end, igualmente ocorre no front-end
    session.clear()

    return redirect("/")