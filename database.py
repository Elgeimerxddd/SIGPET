"""
==========================================
SIGPET 2.0
database.py
==========================================
Módulo encargado de todas las conexiones
con SQLite.
==========================================
"""

import sqlite3
import os

DATABASE = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "pedidos.db"
)

def inicializar_bd():
    conexion = sqlite3.connect(DATABASE)
    cursor = conexion.cursor()

    # ==========================
    # TABLA USUARIOS
    # ==========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            rol TEXT NOT NULL
        )
    """)

    # ==========================
    # TABLA PEDIDOS
    # ==========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cliente TEXT NOT NULL,
            estado TEXT DEFAULT 'Pendiente',
            fecha TEXT,
            hora TEXT,
            total REAL DEFAULT 0
        )
    """)

    # ==========================
    # TABLA DETALLE PEDIDO
    # ==========================

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS detalle_pedido (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            pedido_id INTEGER,
            producto TEXT,
            cantidad INTEGER,
            precio REAL,
            subtotal REAL,
            FOREIGN KEY (pedido_id)
                REFERENCES pedidos(id)
        )
    """)

    # ==========================
    # USUARIO ADMIN
    # ==========================

    cursor.execute("""
        INSERT OR IGNORE INTO usuarios
        (usuario, password, rol)
        VALUES (?, ?, ?)
    """, (
        "admin",
        "1234",
        "Administrador"
    ))

    conexion.commit()
    conexion.close()

# ------------------------------------------
# Conectar
# ------------------------------------------

def conectar():
    """
    Crea una conexión a SQLite.
    """

    conexion = sqlite3.connect(DATABASE)

    conexion.row_factory = sqlite3.Row

    return conexion


# ------------------------------------------
# Ejecutar SELECT
# ------------------------------------------

def consultar(sql, parametros=()):
    """
    Ejecuta un SELECT y devuelve todos los registros.
    """

    conexion = conectar()

    cursor = conexion.execute(sql, parametros)

    datos = cursor.fetchall()

    conexion.close()

    return datos


# ------------------------------------------
# Ejecutar SELECT UNO
# ------------------------------------------

def consultar_uno(sql, parametros=()):
    """
    Devuelve un solo registro.
    """

    conexion = conectar()

    cursor = conexion.execute(sql, parametros)

    dato = cursor.fetchone()

    conexion.close()

    return dato


# ------------------------------------------
# Ejecutar INSERT / UPDATE / DELETE
# ------------------------------------------

def ejecutar(sql, parametros=()):
    """
    Ejecuta cualquier consulta que modifique la BD.
    """

    conexion = conectar()

    cursor = conexion.execute(sql, parametros)

    conexion.commit()

    ultimo_id = cursor.lastrowid

    conexion.close()

    return ultimo_id


# ------------------------------------------
# Ejecutar muchas consultas
# ------------------------------------------

def ejecutar_varios(sql, datos):
    """
    Ejecuta una consulta varias veces.
    """

    conexion = conectar()

    conexion.executemany(sql, datos)

    conexion.commit()

    conexion.close()