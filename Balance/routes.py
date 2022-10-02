from balance import app
from flask import render_template, jsonify, request
from balance.models import ProcesaDatos
import sqlite3

ruta_db = app.config['RUTA_BBDD']
data_manager = ProcesaDatos(ruta_db)

@app.route("/")
def inicio():
    return render_template("index.html")

@app.route("/api/v01/todos")
def todos():
    datos = data_manager.recupera_datos()
    return jsonify(datos)

@app.route("/api/v01/movimiento/<int:id>", methods=["UPDATE"])
def update(id):
    datos = request.json
    try:
        data_manager.update_datos((datos['fecha'], datos['hora'], datos['concepto'], datos['cantidad'], datos['es_ingreso'], id))
        return jsonify({'status': 'success'})
    except sqlite3.Error as e:
        return jsonify({'status': 'error', 'msg': str(e)})