console.log("🔔 Notificaciones cocina cargadas");
let ultimoPedido = 0;


async function revisarPedidos() {

    try {

        const respuesta = await fetch("/api/ultimo_pedido");

        const pedido = await respuesta.json();

        if (!pedido.id) return;

        if (ultimoPedido === 0) {

            ultimoPedido = pedido.id;
            return;

        }

        if (pedido.id > ultimoPedido) {

    ultimoPedido = pedido.id;

    AudioSystem.play("notification");

    setTimeout(() => {

        alert(
            "🔔 Nuevo pedido\n\n" +
            "Cliente: " + pedido.nombre +
            "\nPlatillo: " + pedido.platillo
        );

        document.title = "🔴 Nuevo Pedido";

        location.reload();

    }, 300);

}

    } catch (error) {

        console.log("Esperando pedidos...");

    }

}

revisarPedidos();

setInterval(revisarPedidos, 3000);