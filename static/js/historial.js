/* ==========================================
   HISTORIAL SIGPET 2.2
========================================== */

const filas = document.querySelectorAll(".filaPedido");

const buscador = document.getElementById("buscarPedido");

const filtro = document.getElementById("filtroEstado");

const modal = document.getElementById("modalHistorial");

const detalle = document.getElementById("detallePedido");

/*==========================================
        BUSCADOR
==========================================*/

function filtrarTabla() {

    const texto = buscador.value.toLowerCase();

    const estado = filtro.value;

    filas.forEach(fila => {

        const cliente = fila.dataset.cliente.toLowerCase();

        const productos = fila.dataset.productos.toLowerCase();

        const numero = fila.dataset.id;

        const estadoPedido = fila.dataset.estado;

        const coincideTexto =

            cliente.includes(texto) ||

            productos.includes(texto) ||

            numero.includes(texto);

        const coincideEstado =

            estado === "" ||

            estadoPedido === estado;

        fila.style.display =

            coincideTexto && coincideEstado

            ? ""

            : "none";

    });

}

buscador.addEventListener(

    "keyup",

    filtrarTabla

);

filtro.addEventListener(

    "change",

    filtrarTabla

);

/*==========================================
        MODAL DEL HISTORIAL
==========================================*/

document.querySelectorAll(".btnVer").forEach(boton=>{

    boton.addEventListener("click",()=>{

        const fila = boton.closest("tr");

        detalle.innerHTML = `

<div class="menu-item">

    <span>
        <i class="fa-solid fa-hashtag"></i>
        Pedido
    </span>

    <strong>

        #${fila.dataset.id}

    </strong>

</div>

<div class="menu-item">

    <span>
        <i class="fa-solid fa-user"></i>
        Cliente
    </span>

    <strong>

        ${fila.dataset.cliente}

    </strong>

</div>

<div class="menu-item">

    <span>
        <i class="fa-solid fa-utensils"></i>
        Productos
    </span>

    <strong style="white-space:pre-line;">

        ${fila.dataset.productos}

    </strong>

</div>

<div class="menu-item">

    <span>
        <i class="fa-solid fa-truck-fast"></i>
        Estado
    </span>

    <strong>

        ${fila.dataset.estado}

    </strong>

</div>

<div class="menu-item">

    <span>
        <i class="fa-solid fa-money-bill-wave"></i>
        Total
    </span>

    <strong>

        $${fila.dataset.total}

    </strong>

</div>

<div class="menu-item">

    <span>
        <i class="fa-solid fa-calendar-days"></i>
        Fecha
    </span>

    <strong>

        ${fila.dataset.fecha}

    </strong>

</div>

<div class="menu-item">

    <span>
        <i class="fa-solid fa-clock"></i>
        Hora
    </span>

    <strong>

        ${fila.dataset.hora}

    </strong>

</div>

`;


        modal.style.display="flex";

AudioSystem.play("ding");

const contenido = modal.querySelector(".modal-contenido");

contenido.animate([

{

transform:"scale(.85)",

opacity:0

},

{

transform:"scale(1)",

opacity:1

}

],{

duration:250

});

    });

});

/*==========================================
        CERRAR MODAL
==========================================*/

function cerrarHistorial(){

    modal.style.display="none";

}

window.cerrarHistorial=cerrarHistorial;

window.onclick=function(event){

    if(event.target===modal){

        cerrarHistorial();

    }

}

/*==========================================
        ANIMACIONES
==========================================*/

document.querySelectorAll(".filaPedido").forEach((fila, i)=>{

    fila.style.opacity="0";

    fila.style.transform="translateY(20px)";

    setTimeout(()=>{

        fila.style.transition="0.4s";

        fila.style.opacity="1";

        fila.style.transform="translateY(0)";

    },i*60);

});