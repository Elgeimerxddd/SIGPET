/* ==========================================================
                    SIGPET 2.0
               COCINA EN TIEMPO REAL
========================================================== */

/*==========================================================
                    VARIABLES
==========================================================*/

let panel = null;

let modal = null;

let formularioCancelar = null;

let selectMotivo = null;

let textareaMotivo = null;

let ultimoEstado = "";

/*==========================================================
                    SONIDOS
==========================================================*/

const sonidos = {

    nuevo: new Audio("/static/audio/ding.mp3"),

    preparando: new Audio("/static/audio/preparando.mp3"),

    listo: new Audio("/static/audio/pedido_listo.mp3"),

    entregado: new Audio("/static/audio/entregado.mp3"),

    cancelado: new Audio("/static/audio/cancelado.mp3"),

    error: new Audio("/static/audio/error.mp3")

};

function reproducir(nombre){

    if(!sonidos[nombre]) return;

    sonidos[nombre].currentTime = 0;

    sonidos[nombre].play().catch(()=>{});

}

/*==========================================================
                INICIAR SISTEMA
==========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    panel = document.getElementById("panelPedidos");

    modal = document.getElementById("modalCancelar");

    formularioCancelar = document.getElementById("formCancelar");

    selectMotivo = document.getElementById("motivoSelect");

    textareaMotivo = document.getElementById("otroMotivo");

    configurarModal();

    cargarPedidos();

    verificarCambios();

});

/*==========================================================
                CONFIGURAR MODAL
==========================================================*/

function configurarModal(){

    if(!formularioCancelar){
        return;
    }

    selectMotivo.addEventListener("change",()=>{

        if(selectMotivo.value==="otro"){

            textareaMotivo.style.display="block";

        }else{

            textareaMotivo.style.display="none";

            textareaMotivo.value="";

        }

    });

    formularioCancelar.addEventListener("submit",()=>{

        let motivo = selectMotivo.value;

        if(motivo==="otro"){

            motivo = textareaMotivo.value.trim();

        }

        document.getElementById("motivoFinal").value = motivo;

        reproducir("cancelado");

    });

}

/*==========================================================
                    ABRIR MODAL
==========================================================*/

window.abrirModal = function(id){

    modal.style.display = "flex";

    formularioCancelar.action = "/cancelar/" + id;

}

/*==========================================================
                    CERRAR MODAL
==========================================================*/

window.cerrarModal = function(){

    modal.style.display = "none";

}

/*==========================================================
            CERRAR AL DAR CLICK AFUERA
==========================================================*/

window.addEventListener("click",(event)=>{

    if(event.target===modal){

        cerrarModal();

    }

});

/*==========================================================
            ACTUALIZACIÓN AUTOMÁTICA
==========================================================*/

async function verificarCambios(){

    try{

        const respuesta = await fetch("/api/cocina");

        if(!respuesta.ok){

            return;

        }

        const pedidos = await respuesta.json();

        const estadoActual = JSON.stringify(pedidos);

        // Primera lectura
        if(ultimoEstado === ""){

            ultimoEstado = estadoActual;

            return;

        }

        // Si hubo cambios
        if(ultimoEstado !== estadoActual){

            console.log("🔄 Cambios detectados");

            reproducir("nuevo");

            ultimoEstado = estadoActual;

            setTimeout(()=>{

                location.reload();

            },400);

        }

    }

    catch(error){

        console.error("Error al verificar pedidos:", error);

    }

}

/*==========================================================
                REFRESCO AUTOMÁTICO
==========================================================*/

setInterval(()=>{

    verificarCambios();

},2000);