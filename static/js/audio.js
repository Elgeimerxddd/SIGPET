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


        // Obtener música de fondo
        const musica = document.getElementById("musicaFondo");


        // Guardar volumen actual
        let volumenOriginal = 0;

        if (musica && !musica.paused) {

            volumenOriginal = musica.volume;

            // Bajar música mientras suena el efecto
            musica.volume = Math.min(
                volumenOriginal * 0.35,
                0.35
            );

        }


        // Reiniciar efecto
        audio.currentTime = 0;

        // Reproducir efecto
        audio.play().catch(() => {});


        // Restaurar música al terminar
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
    const btnPausa = document.getElementById("btnPausa");
    const volumenMusica = document.getElementById("volumenMusica");


    // Si no existen los elementos, detener
    if (!musica || !btnMusica || !btnPausa || !volumenMusica) {
        return;
    }


    /* ==========================================
       RECUPERAR POSICIÓN DE LA CANCIÓN
    ========================================== */

    const posicionGuardada =
        localStorage.getItem("musicaPosicion");

    if (posicionGuardada !== null) {

        musica.currentTime =
            parseFloat(posicionGuardada);

    }


    /* ==========================================
       GUARDAR POSICIÓN
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

        const volumen =
            parseFloat(volumenGuardado);

        musica.volume = volumen;

        volumenMusica.value =
            volumen * 100;

    } else {

        musica.volume = 0.8;

        volumenMusica.value = 80;

        localStorage.setItem(
            "sigpetVolumenMusica",
            "0.8"
        );

    }


    /* ==========================================
       RECUPERAR ESTADO DE SILENCIO
    ========================================== */

    const silencioGuardado =
        localStorage.getItem(
            "sigpetMusicaSilenciada"
        ) === "true";


    let volumenAntesDeSilenciar =
        parseFloat(
            localStorage.getItem(
                "sigpetVolumenMusica"
            ) || "0.8"
        );


    /* ==========================================
       ICONO DE VOLUMEN
    ========================================== */

    function actualizarIconoVolumen() {

        if (musica.muted || musica.volume === 0) {

            btnMusica.innerHTML =
                '<i class="fa-solid fa-volume-xmark"></i>';

            btnMusica.setAttribute(
                "aria-label",
                "Activar sonido"
            );

            btnMusica.title =
                "Activar sonido";

        } else if (musica.volume < 0.5) {

            btnMusica.innerHTML =
                '<i class="fa-solid fa-volume-low"></i>';

            btnMusica.setAttribute(
                "aria-label",
                "Silenciar música"
            );

            btnMusica.title =
                "Silenciar música";

        } else {

            btnMusica.innerHTML =
                '<i class="fa-solid fa-volume-high"></i>';

            btnMusica.setAttribute(
                "aria-label",
                "Silenciar música"
            );

            btnMusica.title =
                "Silenciar música";

        }

    }


    /* ==========================================
       ICONO PLAY / PAUSA
    ========================================== */

    function actualizarIconoPausa() {

        if (musica.paused) {

            btnPausa.innerHTML =
                '<i class="fa-solid fa-play"></i>';

            btnPausa.setAttribute(
                "aria-label",
                "Reproducir música"
            );

            btnPausa.title =
                "Reproducir música";

        } else {

            btnPausa.innerHTML =
                '<i class="fa-solid fa-pause"></i>';

            btnPausa.setAttribute(
                "aria-label",
                "Pausar música"
            );

            btnPausa.title =
                "Pausar música";

        }

    }


    /* ==========================================
       RECUPERAR SILENCIO
    ========================================== */

    if (silencioGuardado) {

        musica.muted = true;

    }

    actualizarIconoVolumen();


    /* ==========================================
       RECUPERAR PLAY / PAUSA
    ========================================== */

    const estadoMusica =
        localStorage.getItem(
            "sigpetMusicaEstado"
        );


    function guardarEstadoMusica(estado) {

        localStorage.setItem(
            "sigpetMusicaEstado",
            estado
        );

    }


    /* ==========================================
       INICIAR MÚSICA
       
       Si el usuario la dejó pausada,
       NO se vuelve a reproducir.
    ========================================== */

    function iniciarMusica() {

        if (estadoMusica === "paused") {

            actualizarIconoPausa();

            return;

        }


        musica.play()

            .then(() => {

                guardarEstadoMusica("playing");

                actualizarIconoPausa();

                console.log(
                    "🎵 Música iniciada"
                );

            })

            .catch(() => {

                console.log(
                    "🔇 El navegador bloqueó el autoplay"
                );

                actualizarIconoPausa();

            });

    }


    /* ==========================================
       INTENTAR AUTOPLAY
    ========================================== */

    iniciarMusica();


    /* ==========================================
       SI EL NAVEGADOR BLOQUEA AUTOPLAY
    ========================================== */

    ["click", "touchstart", "keydown"].forEach(
        evento => {

            document.addEventListener(
                evento,
                () => {

                    if (
                        estadoMusica !== "paused" &&
                        musica.paused
                    ) {

                        musica.play()

                            .then(() => {

                                guardarEstadoMusica(
                                    "playing"
                                );

                                actualizarIconoPausa();

                            })

                            .catch(() => {});

                    }

                },
                {
                    once: true
                }
            );

        }
    );


    /* ==========================================
       BOTÓN VOLUMEN / SILENCIO
    ========================================== */

    btnMusica.addEventListener(
        "click",
        () => {

            if (
                musica.muted ||
                musica.volume === 0
            ) {

                musica.muted = false;


                const volumenGuardado =
                    parseFloat(
                        localStorage.getItem(
                            "sigpetVolumenMusica"
                        ) || "0.8"
                    );


                const volumenRestaurar =
                    volumenAntesDeSilenciar > 0
                        ? volumenAntesDeSilenciar
                        : volumenGuardado > 0
                            ? volumenGuardado
                            : 0.8;


                musica.volume =
                    volumenRestaurar;


                volumenMusica.value =
                    volumenRestaurar * 100;


                localStorage.setItem(
                    "sigpetMusicaSilenciada",
                    "false"
                );

            } else {

                volumenAntesDeSilenciar =
                    musica.volume;


                localStorage.setItem(
                    "sigpetVolumenMusica",
                    musica.volume
                );


                musica.muted = true;


                localStorage.setItem(
                    "sigpetMusicaSilenciada",
                    "true"
                );

            }


            actualizarIconoVolumen();

        }
    );


    /* ==========================================
       BOTÓN PLAY / PAUSA
    ========================================== */

    btnPausa.addEventListener(
        "click",
        () => {

            if (musica.paused) {

                musica.play()

                    .then(() => {

                        guardarEstadoMusica(
                            "playing"
                        );

                        actualizarIconoPausa();

                    })

                    .catch(() => {});

            } else {

                musica.pause();

                guardarEstadoMusica(
                    "paused"
                );

                actualizarIconoPausa();

            }

        }
    );


    /* ==========================================
       CONTROL DE VOLUMEN
    ========================================== */

    volumenMusica.addEventListener(
        "input",
        function () {

            const volumen =
                this.value / 100;


            musica.muted = false;

            musica.volume = volumen;


            if (volumen > 0) {

                volumenAntesDeSilenciar =
                    volumen;

            }


            localStorage.setItem(
                "sigpetVolumenMusica",
                volumen
            );


            localStorage.setItem(
                "sigpetMusicaSilenciada",
                volumen === 0
                    ? "true"
                    : "false"
            );


            actualizarIconoVolumen();

        }
    );


    /* ==========================================
       ACTUALIZAR ICONOS AUTOMÁTICAMENTE
    ========================================== */

    musica.addEventListener(
        "play",
        () => {

            actualizarIconoPausa();

        }
    );


    musica.addEventListener(
        "pause",
        () => {

            actualizarIconoPausa();

        }
    );


    musica.addEventListener(
        "volumechange",
        () => {

            actualizarIconoVolumen();

        }
    );


    actualizarIconoPausa();

    actualizarIconoVolumen();

});