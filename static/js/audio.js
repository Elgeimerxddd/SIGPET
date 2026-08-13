/* ==========================================
   SIGPET 2.0
   Sistema de Audio
========================================== */

const AudioSystem = {

    effects: {},

    initialized: false,

    init() {

        if (this.initialized) return;

        this.effects = {

            ding: new Audio("/static/audio/ding.mp3"),

            success: new Audio("/static/audio/success.mp3"),

            preparando: new Audio("/static/audio/preparando.mp3"),

            pedido_listo: new Audio("/static/audio/pedido_listo.mp3"),

            entregado: new Audio("/static/audio/entregado.mp3"),

            cancelado: new Audio("/static/audio/cancelado.mp3"),

            error: new Audio("/static/audio/error.mp3"),

            login: new Audio("/static/audio/login.mp3"),

            notification: new Audio("/static/audio/notification.mp3"),

            counter: new Audio("/static/audio/counter.mp3")

        };

        Object.values(this.effects).forEach(audio => {

            audio.preload = "auto";
            audio.volume = 0.7;

        });

        this.initialized = true;

        console.log("🔊 Audio SIGPET iniciado");

    },


    play(name) {

        if (!this.initialized) {
            this.init();
        }

        const audio = this.effects[name];

        if (!audio) {

            console.warn("No existe:", name);

            return;

        }


        // Obtener la música de fondo
        const musica = document.getElementById("musicaFondo");


        // Guardar volumen actual
        let volumenOriginal = 0;

        if (musica && !musica.paused) {

            volumenOriginal = musica.volume;

            // Bajar música mientras suena el efecto
            musica.volume = Math.min(volumenOriginal * 0.35, 0.35);

        }


        // Reiniciar el efecto
        audio.currentTime = 0;

        // Reproducir efecto
        audio.play().catch(() => {});


        // Cuando termine el efecto, restaurar la música
        audio.onended = () => {

            if (musica && !musica.paused) {

                musica.volume = volumenOriginal;

            }

        };

    },


    setVolume(volume) {

        Object.values(this.effects).forEach(audio => {

            audio.volume = volume;

        });

    }

};


window.AudioSystem = AudioSystem;


/* ==========================================
   SIGPET 2.0
   MÚSICA DE FONDO
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const musica = document.getElementById("musicaFondo");

    const btnMusica = document.getElementById("btnMusica");

    const volumenMusica = document.getElementById("volumenMusica");


    // Si no existen los elementos, detener
    if (!musica || !btnMusica || !volumenMusica) {

        return;

    }


    /* ==========================================
       RECUPERAR POSICIÓN DE LA CANCIÓN
    ========================================== */

    const posicionGuardada =
        localStorage.getItem("musicaPosicion");


    if (posicionGuardada !== null) {

        musica.currentTime = parseFloat(posicionGuardada);

    }


    /* ==========================================
       GUARDAR POSICIÓN DE LA CANCIÓN
    ========================================== */

    musica.addEventListener("timeupdate", () => {

        localStorage.setItem(
            "musicaPosicion",
            musica.currentTime
        );

    });


    /* ==========================================
       RECUPERAR VOLUMEN
    ========================================== */

    const volumenGuardado =
        localStorage.getItem("sigpetVolumenMusica");


    if (volumenGuardado !== null) {

        const volumen = parseFloat(volumenGuardado);

        musica.volume = volumen;

        volumenMusica.value = volumen * 100;

    } else {

        // Volumen inicial si nunca se ha configurado
        musica.volume = 0.8;

        volumenMusica.value = 80;

        localStorage.setItem(
            "sigpetVolumenMusica",
            "0.8"
        );

    }


    /* ==========================================
       INICIAR MÚSICA AUTOMÁTICAMENTE
    ========================================== */

    function iniciarMusica() {

        musica.play()

            .then(() => {

                btnMusica.innerHTML =
                    '<i class="fa-solid fa-volume-high"></i>';

                console.log("🎵 Música iniciada");

            })

            .catch(() => {

                console.log(
                    "🔇 El navegador bloqueó el autoplay"
                );

            });

    }


    /* ==========================================
       INTENTAR INICIAR AUTOMÁTICAMENTE
    ========================================== */

    iniciarMusica();


    /* ==========================================
       SI EL NAVEGADOR BLOQUEA EL AUTOPLAY
    ========================================== */

    ["click", "touchstart", "keydown"].forEach(evento => {

        document.addEventListener(evento, iniciarMusica, {

            once: true

        });

    });


    /* ==========================================
       PLAY / PAUSA
    ========================================== */

    btnMusica.addEventListener("click", () => {

        if (musica.paused) {

            musica.play();

            btnMusica.innerHTML =
                '<i class="fa-solid fa-volume-high"></i>';

        } else {

            musica.pause();

            btnMusica.innerHTML =
                '<i class="fa-solid fa-volume-xmark"></i>';

        }

    });


    /* ==========================================
       CONTROL DE VOLUMEN
    ========================================== */

    volumenMusica.addEventListener("input", function () {

        const volumen = this.value / 100;


        // Cambiar volumen REAL de la música
        musica.volume = volumen;


        // Guardar volumen para las siguientes páginas
        localStorage.setItem(
            "sigpetVolumenMusica",
            volumen
        );

    });


    /* ==========================================
       MANTENER SLIDER SINCRONIZADO
    ========================================== */

    musica.addEventListener("volumechange", () => {

        // No sobrescribir mientras el volumen
        // está siendo bajado temporalmente
        // por un efecto de sonido.

    });

});