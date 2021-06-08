from application import app

@app.route("/")
def hello_world():
    return "ola!"