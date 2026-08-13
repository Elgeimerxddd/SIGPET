from flask import (
    Blueprint,
    send_file
)

from database import conectar
from utils import login_requerido

from datetime import datetime

# ==========================================
# REPORTLAB
# ==========================================

from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet

from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
    Image
)

# ==========================================
# OPENPYXL
# ==========================================

from openpyxl import Workbook

from openpyxl.styles import (
    Font,
    PatternFill,
    Alignment
)

# ==========================================
# BLUEPRINT
# ==========================================

exportar = Blueprint(
    "exportar",
    __name__
)

# ==========================================
# OBTENER ESTADÍSTICAS
# ==========================================

def obtener_estadisticas():

    conexion = conectar()
    cursor = conexion.cursor()

    # Total pedidos
    cursor.execute("SELECT COUNT(*) AS total FROM pedidos")
    total = cursor.fetchone()["total"]

    # Pendientes
    cursor.execute("""
        SELECT COUNT(*) AS cantidad
        FROM pedidos
        WHERE estado='Pendiente'
    """)
    pendientes = cursor.fetchone()["cantidad"]

    # Preparando
    cursor.execute("""
        SELECT COUNT(*) AS cantidad
        FROM pedidos
        WHERE estado='Preparando'
    """)
    preparando = cursor.fetchone()["cantidad"]

    # Listos
    cursor.execute("""
        SELECT COUNT(*) AS cantidad
        FROM pedidos
        WHERE estado='Listo'
    """)
    listos = cursor.fetchone()["cantidad"]

    # Entregados
    cursor.execute("""
        SELECT COUNT(*) AS cantidad
        FROM pedidos
        WHERE estado='Entregado'
    """)
    entregados = cursor.fetchone()["cantidad"]

    # Cancelados
    cursor.execute("""
        SELECT COUNT(*) AS cantidad
        FROM pedidos
        WHERE estado='Cancelado'
    """)
    cancelados = cursor.fetchone()["cantidad"]

    # Ventas
    cursor.execute("""
        SELECT IFNULL(SUM(total),0) AS ventas
        FROM pedidos
        WHERE estado='Entregado'
    """)
    ventas = cursor.fetchone()["ventas"]

    # Promedio
    cursor.execute("""
        SELECT IFNULL(AVG(total),0) AS promedio
        FROM pedidos
        WHERE estado='Entregado'
    """)
    promedio = round(cursor.fetchone()["promedio"], 2)

    # Producto favorito
    cursor.execute("""
        SELECT
            producto,
            SUM(cantidad) AS total
        FROM detalle_pedido
        GROUP BY producto
        ORDER BY total DESC
        LIMIT 1
    """)

    favorito = cursor.fetchone()

    conexion.close()

    return {
        "total": total,
        "pendientes": pendientes,
        "preparando": preparando,
        "listos": listos,
        "entregados": entregados,
        "cancelados": cancelados,
        "ventas": ventas,
        "promedio": promedio,
        "favorito": favorito
    }

# ==========================================
# EXPORTAR DASHBOARD PDF
# ==========================================

@exportar.route("/dashboard/pdf")
@login_requerido
def dashboard_pdf():

    datos = obtener_estadisticas()

    archivo = "dashboard_sigpet.pdf"

    pdf = SimpleDocTemplate(
        archivo,
        pagesize=(21 * cm, 29.7 * cm)
    )

    estilos = getSampleStyleSheet()

    elementos = []

    # =============================
    # LOGO
    # =============================

    try:

        logo = Image("static/logo.png")

        logo.drawWidth = 3 * cm
        logo.drawHeight = 3 * cm

        elementos.append(logo)

    except:
        pass

    elementos.append(Spacer(1, 0.4 * cm))

    elementos.append(

        Paragraph(

            "<font size='24'><b>SIGPET 2.0</b></font>",

            estilos["Title"]

        )

    )

    elementos.append(

        Paragraph(

            "Dashboard Administrativo",

            estilos["Heading2"]

        )

    )

    elementos.append(

        Paragraph(

            datetime.now().strftime("%d/%m/%Y %H:%M"),

            estilos["Normal"]

        )

    )

    elementos.append(Spacer(1,0.5*cm))

    tabla = Table([

        ["Indicador","Valor"],

        ["Pedidos Totales", datos["total"]],

        ["Pendientes", datos["pendientes"]],

        ["Preparando", datos["preparando"]],

        ["Listos", datos["listos"]],

        ["Entregados", datos["entregados"]],

        ["Cancelados", datos["cancelados"]],

        ["Ventas Totales", f"$ {datos['ventas']:.2f}"],

        ["Ticket Promedio", f"$ {datos['promedio']:.2f}"],

        [

            "Producto Favorito",

            datos["favorito"]["producto"]

            if datos["favorito"]

            else "Sin datos"

        ]

    ])

    tabla.setStyle(TableStyle([

        ("BACKGROUND",(0,0),(-1,0),colors.HexColor("#0D3B78")),

        ("TEXTCOLOR",(0,0),(-1,0),colors.white),

        ("FONTNAME",(0,0),(-1,0),"Helvetica-Bold"),

        ("GRID",(0,0),(-1,-1),1,colors.black),

        ("ALIGN",(0,0),(-1,-1),"CENTER"),

        ("BACKGROUND",(0,1),(-1,-1),colors.whitesmoke)

    ]))

    elementos.append(tabla)

    elementos.append(Spacer(1,1*cm))

    elementos.append(

        Paragraph(

            "<font color='gray'>Reporte generado automáticamente por SIGPET.</font>",

            estilos["Normal"]

        )

    )

    pdf.build(elementos)

    return send_file(

        archivo,

        as_attachment=True

    )