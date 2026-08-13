from flask import Flask, render_template

from config import SECRET_KEY

from routes.auth import auth
from routes.pedidos import pedidos
from routes.cocina import cocina
from routes.dashboard import dashboard
from routes.historial import historial
from routes.exportar import exportar
from routes.api import api

app = Flask(__name__)

app.secret_key = SECRET_KEY



# ======================================
# REGISTRO DE BLUEPRINTS
# ======================================

app.register_blueprint(auth)
app.register_blueprint(pedidos)
app.register_blueprint(cocina)
app.register_blueprint(dashboard)
app.register_blueprint(historial)
app.register_blueprint(exportar)
app.register_blueprint(api)

# ======================================
# ERROR 404
# ======================================

@app.errorhandler(404)
def pagina_no_encontrada(error):
    return render_template("404.html"), 404

# ======================================
# INICIAR SERVIDOR
# ======================================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )