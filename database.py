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

# ------------------------------------------
# Ruta de la Base de Datos
# ------------------------------------------

DATABASE = "pedidos.db"


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