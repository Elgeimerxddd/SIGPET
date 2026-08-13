"""
==========================================
SIGPET 2.0
Funciones auxiliares
==========================================
"""

from functools import wraps

from flask import (
    session,
    redirect,
    url_for
)

def login_requerido(func):

    @wraps(func)
    def verificar(*args, **kwargs):

        if "usuario" not in session:

            return redirect(
                url_for("auth.login")
            )

        return func(*args, **kwargs)

    return verificar