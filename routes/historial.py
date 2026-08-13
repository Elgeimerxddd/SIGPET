from flask import (
    Blueprint,
    render_template,
    send_file
)

from database import conectar
from utils import login_requerido

from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle
)

from reportlab.lib import colors

# ======================================
# BLUEPRINT
# ======================================

historial = Blueprint(
    "historial",
    __name__
)

# ======================================
# HISTORIAL
# ======================================

@historial.route("/historial")
@login_requerido
def ver_historial():

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

            p.estado,
            p.fecha,
            p.hora,
            p.total

        FROM pedidos p

        LEFT JOIN detalle_pedido d
            ON p.id = d.pedido_id

        GROUP BY
            p.id,
            p.cliente,
            p.estado,
            p.fecha,
            p.hora,
            p.total

        ORDER BY p.id DESC

    """)

    pedidos = cursor.fetchall()

    conexion.close()

    return render_template(
        "historial.html",
        pedidos=pedidos
    )

# ======================================
# EXPORTAR PDF
# ======================================

@historial.route("/historial/pdf")
@login_requerido
def historial_pdf():

    conexion = conectar()
    cursor = conexion.cursor()

    cursor.execute("""

        SELECT

            p.id,
            p.cliente,

            GROUP_CONCAT(
                d.producto || ' x' || d.cantidad,
                ', '
            ) AS productos,

            p.estado,
            p.total,
            p.fecha

        FROM pedidos p

        LEFT JOIN detalle_pedido d
            ON p.id = d.pedido_id

        GROUP BY
            p.id,
            p.cliente,
            p.estado,
            p.total,
            p.fecha

        ORDER BY p.id DESC

    """)

    pedidos = cursor.fetchall()

    conexion.close()

    archivo = "Historial_SIGPET.pdf"

    documento = SimpleDocTemplate(archivo)

    datos = [[

        "Pedido",
        "Cliente",
        "Productos",
        "Estado",
        "Total",
        "Fecha"

    ]]

    for pedido in pedidos:

        datos.append([

            pedido["id"],
            pedido["cliente"],
            pedido["productos"] if pedido["productos"] else "-",
            pedido["estado"],
            f"${pedido['total']:.2f}",
            pedido["fecha"]

        ])

    tabla = Table(datos)

    tabla.setStyle(TableStyle([

        ("BACKGROUND",(0,0),(-1,0),colors.darkblue),
        ("TEXTCOLOR",(0,0),(-1,0),colors.white),
        ("GRID",(0,0),(-1,-1),1,colors.black),
        ("ALIGN",(0,0),(-1,-1),"CENTER"),
        ("BACKGROUND",(0,1),(-1,-1),colors.beige)

    ]))

    documento.build([tabla])

    return send_file(
        archivo,
        as_attachment=True
    )