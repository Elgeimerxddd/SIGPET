import sqlite3
import os

# Eliminar la base anterior si existe
if os.path.exists("pedidos.db"):
    os.remove("pedidos.db")

conexion = sqlite3.connect("pedidos.db")
cursor = conexion.cursor()

# ==========================
# TABLA USUARIOS
# ==========================

cursor.execute("""
CREATE TABLE usuarios(

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
CREATE TABLE pedidos(

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
CREATE TABLE detalle_pedido(

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    pedido_id INTEGER,

    producto TEXT,

    cantidad INTEGER,

    precio REAL,

    subtotal REAL,

    FOREIGN KEY(pedido_id)
        REFERENCES pedidos(id)

)
""")

# ==========================
# USUARIO ADMIN
# ==========================

cursor.execute("""
INSERT INTO usuarios(
    usuario,
    password,
    rol
)

VALUES(

'admin',
'1234',
'Administrador'

)
""")

conexion.commit()
conexion.close()

print("====================================")
print("BASE DE DATOS CREADA CORRECTAMENTE")
print("====================================")