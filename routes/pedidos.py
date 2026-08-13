from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash,
    jsonify
)

from datetime import datetime
import json

from database import conectar

# ==========================================
# BLUEPRINT
# ==========================================

pedidos = Blueprint("pedidos", __name__)

# ==========================================
# PÁGINAS
# ==========================================

@pedidos.route("/")
def bienvenida():
    return render_template("bienvenida.html")


@pedidos.route("/opciones")
def opciones():
    return render_template("opciones.html")


@pedidos.route("/menu")
def menu():
    return render_template("menu.html")


@pedidos.route("/pedido")
def pedido():
    return render_template("pedido.html")


@pedidos.route("/consultar")
def consultar():
    return render_template("consultar.html")

# ==========================================
# BUSCAR PEDIDO
# ==========================================

@pedidos.route("/buscar_pedido", methods=["POST"])
def buscar_pedido():

    numero = request.form["numero_pedido"]

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""

        SELECT

            p.id,
            p.cliente,

            GROUP_CONCAT(
                d.producto || ' x' || d.cantidad,
                '\n'
            ) AS productos,

            SUM(d.cantidad) AS cantidad,

            p.estado,

            p.fecha,

            p.hora,

            p.total

        FROM pedidos p

        LEFT JOIN detalle_pedido d
            ON p.id = d.pedido_id

        WHERE p.id=?

        GROUP BY
            p.id,
            p.cliente,
            p.estado,
            p.fecha,
            p.hora,
            p.total

    """,(numero,))

    pedido = cursor.fetchone()

    conexion.close()

    if pedido:

        tiempo = pedido["cantidad"] * 4

        pedido = dict(pedido)

        pedido["tiempo"] = tiempo

    return render_template(
        "resultado.html",
        pedido=pedido
    )

# ==========================================
# REGISTRAR PEDIDO
# ==========================================

@pedidos.route("/confirmacion", methods=["POST"])
def confirmacion():

    print("==============")
    print(request.form)
    print("==============")

    cliente = request.form.get("cliente", "").strip()
    productos_json = request.form.get("productos", "[]")

    if cliente == "":
        flash("Debes escribir tu nombre.", "warning")
        return redirect(url_for("pedidos.pedido"))

    try:
        productos = json.loads(productos_json)
    except:
        productos = []

    if len(productos) == 0:
        flash("Debes agregar al menos un producto.", "warning")
        return redirect(url_for("pedidos.pedido"))

    fecha = datetime.now().strftime("%d/%m/%Y")
    hora = datetime.now().strftime("%H:%M")

    conexion = conectar()
    cursor = conexion.cursor()

    total = 0

    for producto in productos:

        producto["subtotal"] = (
        producto["precio"] *
        producto["cantidad"]
    )

    total += producto["subtotal"]

    cursor.execute("""
        INSERT INTO pedidos
        (
            cliente,
            estado,
            fecha,
            hora,
            total
        )
        VALUES (?,?,?,?,?)
    """,
    (
        cliente,
        "Pendiente",
        fecha,
        hora,
        total
    ))

    pedido_id = cursor.lastrowid

    for producto in productos:

        cursor.execute("""
            INSERT INTO detalle_pedido
            (
                pedido_id,
                producto,
                cantidad,
                precio,
                subtotal
            )
            VALUES (?,?,?,?,?)
        """,
        (
            pedido_id,
            producto["nombre"],
            producto["cantidad"],
            producto["precio"],
            producto["precio"] * producto["cantidad"]
        ))

    conexion.commit()
    conexion.close()

    return render_template(
        "confirmacion.html",
        cliente=cliente,
        numero_pedido=pedido_id,
        productos=productos,
        total=total
    )

# ==========================================
# API ESTADO DEL PEDIDO
# ==========================================

@pedidos.route("/estado/<int:pedido_id>")
def estado(pedido_id):

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT
            estado,
            motivo_cancelacion,
            cancelado_por,
            fecha_cancelacion
        FROM pedidos
        WHERE id=?
    """, (pedido_id,))

    pedido = cursor.fetchone()

    conexion.close()

    if pedido:

        return jsonify({

            "estado": pedido["estado"],
            "motivo_cancelacion": pedido["motivo_cancelacion"],
            "cancelado_por": pedido["cancelado_por"],
            "fecha_cancelacion": pedido["fecha_cancelacion"]

        })

    return jsonify({

        "estado":"No encontrado"

    })


# ==========================================
# CANCELAR DESDE EL CLIENTE
# ==========================================

@pedidos.route("/cancelar_cliente/<int:pedido_id>", methods=["POST"])
def cancelar_cliente(pedido_id):

    datos = request.get_json()

    motivo = datos.get("motivo", "Sin motivo")

    conexion = conectar()
    cursor = conexion.cursor()

    fecha = datetime.now().strftime("%d/%m/%Y %H:%M")

    cursor.execute("""

        UPDATE pedidos

        SET

            estado=?,
            motivo_cancelacion=?,
            cancelado_por=?,
            fecha_cancelacion=?

        WHERE id=?

    """, (

        "Cancelado",
        motivo,
        "Cliente",
        fecha,
        pedido_id

    ))

    conexion.commit()
    conexion.close()

    return jsonify({"ok": True})