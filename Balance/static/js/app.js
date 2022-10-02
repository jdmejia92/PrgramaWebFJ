const peticionarioMovimientos = new XMLHttpRequest()
const peticionarioUpdate = new XMLHttpRequest()
let movimientos

function dameMovimiento(id) {
    id = parseInt(id)
    for (let i=0; i < movimientos.length; i++) {
        const movimiento = movimientos[i]
        if (movimiento.id === id) {
            return movimiento
        }
    }
    return null
}

function clickMovimiento(event) {
    const movimiento_id = event.target.parentNode.id;

    const el_movimiento = dameMovimiento(movimiento_id)

    if (el_movimiento) {
        document.querySelector("#movimiento-activo").classList.remove('inactive')
        document.querySelector("#fecha").value = el_movimiento.fecha
        document.querySelector("#hora").value = el_movimiento.hora
        document.querySelector("#cantidad").value = el_movimiento.cantidad
        document.querySelector("#concepto").value = el_movimiento.concepto
        document.querySelector("#id").value = el_movimiento.id
        if (el_movimiento.es_ingreso) {
            document.querySelector("#es_ingreso").checked = true
        } else {
            document.querySelector("#es_ingreso").checked = false
        }
    }

}

function respuetaModificacion() {
    if (this.readyState === 4 && this.status === 200) {
        respuesta = JSON.parse(this.responseText)
        if (respuesta.status === 'success') {
            pideMovimientosHttp()
        } else {
            alert(respuesta.msg)
        }
    } else {
        alert('Se ha producido un error en la petición')
    }
}

function listaMovimientos() {
    const campos = ['fecha', 'hora', 'concepto', 'es_ingreso', 'cantidad']

    if (this.readyState === 4 && this.status === 200) {
        movimientos = JSON.parse(this.responseText)

        const tbody = document.querySelector("#tbbody-movimientos")
        tbody.innerHTML = ""

        for (let i = 0; i < movimientos.length; i++) {
            const fila = document.createElement('tr')
            fila.addEventListener('click', clickMovimiento)
            const movimiento = movimientos[i]
            fila.id = movimiento.id
            for (const campo of campos) {
                const celda = document.createElement('td')
                /* celda.innerHTML = campo !== 'es_ingreso' ? movimiento[campo] :
                                    movimiento[campo] === 1 ? 'Ingreso' : 'Gasto' */
                if (campo !== 'es_ingreso') {
                    celda.innerHTML = movimiento[campo]
                } else if (movimiento[campo] === 1) {
                    celda.innerHTML = 'Ingreso'
                } else {
                    celda.innerHTML = 'Gasto'
                }
                fila.appendChild(celda)
            }
            tbody.appendChild(fila)
        }

    } else {
        alert("Se ha producido un error al cargar los movimientos")
    }

}

function pideMovimientosHttp() {
    peticionarioMovimientos.open("GET", "http://localhost:5000/api/v01/todos", true)
    peticionarioMovimientos.onload = listaMovimientos
    peticionarioMovimientos.send()
}

pideMovimientosHttp()

document.querySelector("#aceptar").addEventListener('click', (event) => {
    event.preventDefault()
    // Validar los datos ingresados
    const movimiento = {
        fecha: document.querySelector("#fecha").value,
        hora: document.querySelector("#hora").value,
        concepto: document.querySelector("#concepto").value,
        cantidad: document.querySelector("#cantidad").value,
        es_ingreso: document.querySelector("#es_ingreso").checked ? '1' : '0',
    }
    const id = document.querySelector("#id").value
    alert(id+": "+ movimiento)

    peticionarioUpdate.open("UPDATE", `http://localhost:5000/api/v01/movimiento/${id}`, true)
    peticionarioUpdate.onload = respuetaModificacion
    peticionarioUpdate.setRequestHeader("Content-Type", "application/json")
    peticionarioUpdate.send(JSON.stringify(movimiento))

    document.querySelector("#movimiento-activo").classList.add('inactive')
})