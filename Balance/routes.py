from Balance import app

@app.route("/")
def inicio():
    return "Estoy funcionando"