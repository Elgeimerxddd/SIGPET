from flask import (
    Blueprint,
    render_template,
    request,
    redirect,
    url_for,
    session,
    flash
)

from database import consultar_uno

# ==========================================
# Blueprint
# ==========================================

auth = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth"
)

# ==========================================
# LOGIN
# ==========================================

@auth.route("/", methods=["GET", "POST"])
def login():

    if request.method == "POST":

        usuario = request.form["usuario"]

        password = request.form["password"]

        datos = consultar_uno("""

            SELECT *

            FROM usuarios

            WHERE usuario=? AND password=?

        """,(usuario,password))

        if datos:

            session["usuario"] = datos["usuario"]

            session["rol"] = datos["rol"]

            return redirect(url_for("dashboard.dashboard_admin"))

        flash("Usuario o contraseña incorrectos")

    return render_template("login.html")


# ==========================================
# SALIR
# ==========================================

@auth.route("/logout")
def logout():

    session.clear()

    return redirect(url_for("auth.login"))