/* ==========================================
   DASHBOARD ADMINISTRATIVO SIGPET 2.2
========================================== */

let graficaEstados;
let graficaPlatillos;
let graficaVentas;

/*==========================================
            INICIO
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    iniciarGraficas();

    actualizarDashboard();

    setInterval(actualizarDashboard,3000);

});

/*==========================================
        CREAR GRÁFICAS
==========================================*/

function iniciarGraficas(){

    crearGraficaEstados();

    crearGraficaPlatillos();

    crearGraficaVentas();

}

/*==========================================
      DONA - ESTADOS
==========================================*/

function crearGraficaEstados(){

    const canvas=document.getElementById("graficaEstados");

    if(!canvas) return;

    graficaEstados=new Chart(canvas,{

        type:"doughnut",

        data:{

            labels:[

                "Entregados",

                "Cancelados"

            ],

            datasets:[{

                data:[

                    datosDashboard.entregados,

                    datosDashboard.cancelados

                ],

                backgroundColor:[

                    "#2ecc71",

                    "#e74c3c"

                ],

                borderWidth:2

            }]

        },

        options:{

            responsive:true,

            animation:{

                duration:700

            },

            plugins:{

                legend:{

                    position:"bottom"

                }

            }

        }

    });

}

/*==========================================
     BARRAS - PLATILLOS
==========================================*/

function crearGraficaPlatillos(){

    const canvas=document.getElementById("graficaPlatillos");

    if(!canvas) return;

    graficaPlatillos=new Chart(canvas,{

        type:"bar",

        data:{

            labels:datosDashboard.platillos.map(p=>p.platillo),

            datasets:[{

                label:"Pedidos",

                data:datosDashboard.platillos.map(p=>p.total),

                backgroundColor:"#ff6b35",

                borderRadius:10

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    beginAtZero:true

                }

            }

        }

    });

}

/*==========================================
      LÍNEAS - VENTAS POR DÍA
==========================================*/

function crearGraficaVentas(){

    const canvas=document.getElementById("graficaVentas");

    if(!canvas) return;

    graficaVentas=new Chart(canvas,{

        type:"line",

        data:{

            labels:datosDashboard.ventasDia.map(v=>v.fecha),

            datasets:[{

                label:"Ventas ($)",

                data:datosDashboard.ventasDia.map(v=>v.ventas),

                borderColor:"#ff6b35",

                backgroundColor:"rgba(255,107,53,.2)",

                fill:true,

                tension:.4,

                pointRadius:5,

                pointHoverRadius:7

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:true

                }

            },

            scales:{

                y:{

                    beginAtZero:true

                }

            }

        }

    });

}

/*==========================================
      ACTUALIZAR DASHBOARD
==========================================*/

async function actualizarDashboard(){

    try{

        // ==========================
        // Tarjetas
        // ==========================

        const respuesta=await fetch("/api/dashboard");

        const datos=await respuesta.json();

        actualizarNumero("totalPedidos",datos.total);

        actualizarNumero("pendientes",datos.pendientes);

        actualizarNumero("preparando",datos.preparando);

        actualizarNumero("listos",datos.listos);

        actualizarNumero("entregados",datos.entregados);

        actualizarNumero("cancelados",datos.cancelados);

        actualizarNumero("ventas","$"+Number(datos.ventas).toFixed(2));

        actualizarNumero("promedio","$"+Number(datos.promedio).toFixed(2));

        // ==========================
        // Dona
        // ==========================

        if(graficaEstados){

            graficaEstados.data.datasets[0].data=[

                datos.entregados,

                datos.cancelados

            ];

            graficaEstados.update();

        }

        // ==========================
        // Platillos
        // ==========================

        const rPlatillos=await fetch("/api/platillos");

        const platillos=await rPlatillos.json();

        if(graficaPlatillos){

            graficaPlatillos.data.labels=

                platillos.map(p=>p.platillo);

            graficaPlatillos.data.datasets[0].data=

                platillos.map(p=>p.total);

            graficaPlatillos.update();

        }

        // ==========================
        // Ventas por Día
        // ==========================

        const rVentas=await fetch("/api/ventas_dia");

        const ventas=await rVentas.json();

        if(graficaVentas){

            graficaVentas.data.labels=

                ventas.map(v=>v.fecha);

            graficaVentas.data.datasets[0].data=

                ventas.map(v=>v.ventas);

            graficaVentas.update();

        }

    }

    catch(error){

        console.log("Dashboard esperando cambios...");

    }

}

/*==========================================
      ANIMACIÓN DE LOS NÚMEROS
==========================================*/

function actualizarNumero(id, valor){

    const elemento=document.getElementById(id);

    if(!elemento) return;

    if(elemento.textContent!=valor){

        elemento.textContent=valor;

        elemento.animate(

            [

                {

                    transform:"scale(1.20)",

                    opacity:.6

                },

                {

                    transform:"scale(1)",

                    opacity:1

                }

            ],

            {

                duration:350,

                easing:"ease-out"

            }

        );

    }

}