from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    flash
)

from datetime import datetime

from database import conectar
from utils import login_requerido

cocina = Blueprint("cocina", __name__)


# ==========================================
# PANEL DE COCINA
# ==========================================

@cocina.route("/cocina")
@login_requerido
def panel_cocina():

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""
        SELECT

            p.id,
            p.cliente,
            p.estado,
            p.fecha,
            p.hora,
            p.total,

            d.producto,
            d.cantidad,
            d.precio,
            d.subtotal

        FROM pedidos p

        JOIN detalle_pedido d
            ON p.id = d.pedido_id

        WHERE p.estado NOT IN
        (
            'Entregado',
            'Cancelado'
        )

        ORDER BY p.id DESC
    """)

    filas = cursor.fetchall()

    pedidos = {}

    for fila in filas:

        id_pedido = fila["id"]

        if id_pedido not in pedidos:

            pedidos[id_pedido] = {
                "id": fila["id"],
                "cliente": fila["cliente"],
                "estado": fila["estado"],
                "fecha": fila["fecha"],
                "hora": fila["hora"],
                "total": fila["total"],
                "productos": []
            }

        pedidos[id_pedido]["productos"].append({

            "producto": fila["producto"],
            "cantidad": fila["cantidad"],
            "precio": fila["precio"],
            "subtotal": fila["subtotal"]

        })

    pedidos = list(pedidos.values())

    conexion.close()

    return render_template(
        "cocina.html",
        pedidos=pedidos
    )


# ==========================================
# CAMBIAR ESTADO
# ==========================================

@cocina.route("/cambiar_estado/<int:id>", methods=["POST"])
@login_requerido
def cambiar_estado(id):

    estado = request.form["estado"]

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE pedidos
        SET estado=?
        WHERE id=?
    """,
    (
        estado,
        id
    ))

    conexion.commit()
    conexion.close()

    flash(
        "Estado actualizado correctamente.",
        "success"
    )

    return redirect(
        url_for("cocina.panel_cocina")
    )


# ==========================================
# CANCELAR PEDIDO
# ==========================================

@cocina.route("/cancelar/<int:id>", methods=["POST"])
@login_requerido
def cancelar(id):

    motivo = request.form["motivo"]

    fecha_cancelacion = datetime.now().strftime("%d/%m/%Y %H:%M")

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""
        UPDATE pedidos

        SET

            estado=?,
            motivo_cancelacion=?,
            cancelado_por=?,
            fecha_cancelacion=?

        WHERE id=?

    """,
    (
        "Cancelado",
        motivo,
        "Cocina",
        fecha_cancelacion,
        id
    ))

    conexion.commit()
    conexion.close()

    flash(
        "Pedido cancelado correctamente.",
        "warning"
    )

    return redirect(
        url_for("cocina.panel_cocina")
    )