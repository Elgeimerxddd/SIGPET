/* ==========================================
   SIGPET 2.0
   Aplicación Principal
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("🍔 SIGPET iniciado");

    iniciarAplicacion();

});

function iniciarAplicacion(){

    iniciarAnimaciones();

    iniciarFormularios();

    iniciarBotones();

    detectarPagina();

    iniciarCocina();

}
/*==========================================
            ANIMACIONES
==========================================*/

function iniciarAnimaciones(){

    const cards = document.querySelectorAll(".card");

    cards.forEach((card, i)=>{

        card.style.animationDelay = `${i * 0.12}s`;

        card.classList.add("fade-up");

    });

}

/*==========================================
            BOTONES
==========================================*/

function iniciarBotones(){

    const botones = document.querySelectorAll(".btn");

    botones.forEach(btn=>{

        btn.addEventListener("mouseenter",()=>{

            btn.style.transform="translateY(-3px)";

        });

        btn.addEventListener("mouseleave",()=>{

            btn.style.transform="";

        });

    });

}

/*==========================================
            FORMULARIOS
==========================================*/

function iniciarFormularios(){

    const formularios=document.querySelectorAll("form");

    formularios.forEach(form=>{

        form.addEventListener("submit",()=>{

            AudioSystem.play("ding");

        });

    });

}

/*==========================================
            DETECTAR PÁGINAS
==========================================*/

function detectarPagina(){

    const ruta = window.location.pathname;

    console.log("Página:", ruta);

    switch(ruta){

        case "/":

            AudioSystem.play("login");

            break;

        case "/confirmacion":

            setTimeout(()=>{

                AudioSystem.play("success");

            },300);

            break;

        case "/consultar":

         break;

    }

}

/*==========================================
            COCINA
==========================================*/

function iniciarCocina(){

    document.querySelectorAll('button[name="estado"]').forEach(btn=>{

        btn.addEventListener("click",()=>{

            const estado = btn.value;

            switch(estado){

                case "Preparando":
                    AudioSystem.play("preparando");
                    break;

                case "Listo":
                    AudioSystem.play("pedido_listo");
                    break;

                case "Entregado":
                    AudioSystem.play("entregado");
                    break;

            }

            // NO usar preventDefault()
            // El formulario se enviará normalmente.

        });

    });

}

/* ==========================================
CARRITO SIGPET
========================================== */

let carrito = [];

const listaCarrito =
    document.getElementById("lista-carrito");

const totalElemento =
    document.getElementById("total");

const contadorCarrito =
    document.getElementById("contador-carrito");

if (document.querySelector(".agregar")) {
    iniciarCarrito();
}

function iniciarCarrito() {

    // AGREGAR PRODUCTOS
    document.querySelectorAll(".agregar").forEach(boton => {

        boton.addEventListener("click", () => {

            const tarjeta = boton.closest(".producto");

            const inputCantidad =
                tarjeta.querySelector(".cantidad-input");

            const cantidad = parseInt(inputCantidad.value) || 1;

            const nombre = boton.dataset.nombre;

            const precio = Number(boton.dataset.precio);

            const icono = boton.dataset.icono;

            agregarProducto(
                nombre,
                precio,
                cantidad,
                icono
            );

            // Regresar cantidad a 1
            inputCantidad.value = 1;

        });

    });


    /* ==========================================
        AUMENTAR CANTIDAD DEL PRODUCTO
========================================== */

document.querySelectorAll(".mas").forEach(btn=>{

    btn.addEventListener("click",()=>{

        const input =
            btn.parentElement.querySelector(".cantidad-input");

        input.value = Number(input.value) + 1;


        if(window.AudioSystem){

            AudioSystem.play("counter");

        }

    });

});


/* ==========================================
        DISMINUIR CANTIDAD DEL PRODUCTO
========================================== */

document.querySelectorAll(".menos").forEach(btn=>{

    btn.addEventListener("click",()=>{

        const input =
            btn.parentElement.querySelector(".cantidad-input");

        if(Number(input.value) > 1){

            input.value = Number(input.value) - 1;


            if(window.AudioSystem){

                AudioSystem.play("counter");

            }

        }

    });

});

}

function agregarProducto(
    nombre,
    precio,
    cantidad,
    icono
){

    const existente = carrito.find(
        p => p.nombre === nombre
    );


    if(existente){

        existente.cantidad += cantidad;

    }

    else{

        carrito.push({

        nombre,
        precio,
        cantidad,
        icono

});

    }


    /* SONIDO AL AGREGAR */

    if(window.AudioSystem){

        AudioSystem.play("counter");

    }


    actualizarCarrito();

}


function actualizarCarrito(){

    if (!listaCarrito || !totalElemento) {
        console.warn("No se encontraron los elementos del carrito.");
        return;
    }

    listaCarrito.innerHTML = "";

    let total = 0;
    let cantidadTotal = 0;


    carrito.forEach((producto,index)=>{

        const subtotal =
            producto.precio * producto.cantidad;
            cantidadTotal += producto.cantidad;

        total += subtotal;


        listaCarrito.innerHTML += `

        <div class="item-carrito">

            <div class="item-carrito-info">

                <strong class="nombre-producto-carrito">

                <span class="icono-producto-carrito">
                    ${producto.icono || "🍽️"}
                </span>

                ${producto.nombre}

            </strong>

                <small>
                    $${producto.precio} c/u
                </small>

            </div>


            <div class="item-carrito-controles">

                <div class="cantidad cantidad-carrito">

                    <button
                        type="button"
                        onclick="disminuirProducto(${index})">

                        <i class="fa-solid fa-minus"></i>

                    </button>


                    <span class="cantidad-carrito-numero">

                        ${producto.cantidad}

                    </span>


                    <button
                        type="button"
                        onclick="aumentarProducto(${index})">

                        <i class="fa-solid fa-plus"></i>

                    </button>

                </div>


                <strong class="subtotal-carrito">

                    $${subtotal}

                </strong>


                <button
                    type="button"
                    class="eliminar-producto"
                    onclick="eliminarProducto(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

        </div>

        `;

    });


    if(carrito.length === 0){

        listaCarrito.innerHTML = `

            <p class="carrito-vacio">

                <i class="fa-solid fa-cart-shopping"></i>

                Aún no has agregado productos.

            </p>

        `;

    }


    totalElemento.innerText = "$" + total;

if(contadorCarrito){

    contadorCarrito.innerText = cantidadTotal;

}

}

/* ==========================================
        AUMENTAR PRODUCTO DEL CARRITO
========================================== */

function aumentarProducto(indice){

    carrito[indice].cantidad += 1;


    if(window.AudioSystem){

        AudioSystem.play("counter");

    }


    actualizarCarrito();

}


/* ==========================================
        DISMINUIR PRODUCTO DEL CARRITO
========================================== */

function disminuirProducto(indice){

    if(carrito[indice].cantidad > 1){

        carrito[indice].cantidad -= 1;


        if(window.AudioSystem){

            AudioSystem.play("counter");

        }


        actualizarCarrito();

    }

    else{

        eliminarProducto(indice);

    }

}


/* ==========================================
        ELIMINAR PRODUCTO
========================================== */

function eliminarProducto(indice){

    carrito.splice(indice,1);


    if(window.AudioSystem){

        AudioSystem.play("counter");

    }


    actualizarCarrito();

}

function cambiarCantidad(indice, cambio) {

    carrito[indice].cantidad += cambio;


    // Si llega a cero, se elimina automáticamente
    if (carrito[indice].cantidad <= 0) {

        carrito.splice(indice, 1);

    }


    AudioSystem.play("counter");

    actualizarCarrito();

}

/* ==========================================
      ENVIAR PEDIDO
========================================== */

const botonPedido = document.getElementById("realizar-pedido");

if(botonPedido){

    botonPedido.addEventListener("click", ()=>{

        if(carrito.length===0){

            alert("Agrega al menos un producto.");

            return;

        }

        const cliente = document.getElementById("cliente").value.trim();

        if(cliente===""){

            alert("Escribe el nombre del cliente.");

            return;

        }

        document.getElementById("clienteHidden").value = cliente;

        document.getElementById("productosHidden").value =
            JSON.stringify(carrito);

        document.getElementById("formPedido").submit();

    });

}