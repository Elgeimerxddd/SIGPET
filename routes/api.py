from flask import Blueprint, jsonify
from database import conectar

api = Blueprint("api", __name__)

# ==========================================
# API DE PEDIDOS PARA COCINA
# ==========================================

@api.route("/api/cocina")
def api_cocina():

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

    datos = cursor.fetchall()

    conexion.close()

    pedidos = {}

    for fila in datos:

        pedido_id = fila[0]

        if pedido_id not in pedidos:

            pedidos[pedido_id] = {

                "id": fila[0],
                "cliente": fila[1],
                "estado": fila[2],
                "fecha": fila[3],
                "hora": fila[4],
                "total": fila[5],
                "productos": []

            }

        pedidos[pedido_id]["productos"].append({

            "nombre": fila[6],
            "cantidad": fila[7],
            "precio": fila[8],
            "subtotal": fila[9]

        })

    return jsonify(list(pedidos.values()))