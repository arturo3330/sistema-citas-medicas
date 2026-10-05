// ==========================================
// DASHBOARD MAKANITOS
// ==========================================

const usuarioDashboard =
    obtenerUsuarioSesion();


// ==========================================
// INICIALIZAR DASHBOARD
// ==========================================

async function iniciarDashboard() {

    configurarAccesosPorRol();

    await cargarActividadReciente();

    await cargarEspecialidadesFelicitacion();

    await cargarFelicitaciones();

    configurarFormularioFelicitacion();
}


// ==========================================
// CONFIGURAR ACCESOS SEGÚN ROL
// ==========================================

function configurarAccesosPorRol() {

    const accesosPersonal =
        document.getElementById(
            "accesosPersonal"
        );


    const accesosPaciente =
        document.getElementById(
            "accesosPaciente"
        );


    const actividad =
        document.querySelector(
            ".actividad-dashboard"
        );


    const invitacion =
        document.querySelector(
            ".felicitacion-invitacion"
        );


    // ======================================
    // ADMIN / SECRETARIA
    // ======================================

    if (
        esAdmin()
        ||
        esSecretaria()
    ) {

        if (accesosPersonal) {

            accesosPersonal.style.display =
                "grid";
        }


        if (accesosPaciente) {

            accesosPaciente.style.display =
                "none";
        }


        if (actividad) {

            actividad.style.display =
                "block";
        }


        /*
         * Solo los pacientes pueden
         * dejar una felicitación.
         */
        if (invitacion) {

            invitacion.style.display =
                "none";
        }


        return;
    }


    // ======================================
    // PACIENTE
    // ======================================

    if (esPaciente()) {

        if (accesosPersonal) {

            accesosPersonal.style.display =
                "none";
        }


        if (accesosPaciente) {

            accesosPaciente.style.display =
                "grid";
        }


        /*
         * Actividad reciente es una
         * función del personal.
         */
        if (actividad) {

            actividad.style.display =
                "none";
        }


        if (invitacion) {

            invitacion.style.display =
                "flex";
        }
    }
}


// ==========================================
// ACTIVIDAD RECIENTE
// ==========================================

async function cargarActividadReciente() {

    const contenedor =
        document.getElementById(
            "actividadReciente"
        );


    /*
     * El paciente no necesita consultar
     * este endpoint.
     */
    if (
        !esAdmin()
        &&
        !esSecretaria()
    ) {

        return;
    }


    if (!contenedor) {

        return;
    }


    contenedor.innerHTML = `

        <div class="actividad-vacia">

            <p>
                Cargando actividad reciente...
            </p>

        </div>
    `;


    try {

        const respuesta =
            await fetch(
                "/actividades/recientes"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar la actividad reciente"
            );
        }


        const actividades =
            await respuesta.json();


        contenedor.innerHTML =
            "";


        if (
            !Array.isArray(
                actividades
            )
            ||
            actividades.length === 0
        ) {

            contenedor.innerHTML = `

                <div class="actividad-vacia">

                    <p>
                        Todavía no hay actividad reciente.
                    </p>

                </div>
            `;


            return;
        }


        actividades.forEach(
            actividad => {

                contenedor.innerHTML +=
                    crearActividadHtml(
                        actividad
                    );
            }
        );


    } catch (error) {

        console.error(
            error
        );


        contenedor.innerHTML = `

            <div class="actividad-vacia">

                <p>
                    No se pudo cargar la actividad reciente.
                </p>

            </div>
        `;
    }
}


// ==========================================
// CREAR ACTIVIDAD
// ==========================================

function crearActividadHtml(
    actividad
) {

    return `

        <div class="actividad-item">

            <div class="actividad-icono">
                ${obtenerIconoActividad(
        actividad.tipo
    )}
            </div>


            <div class="actividad-contenido">

                <strong>
                    ${escaparTextoDashboard(
        actividad.descripcion
        ||
        "Actividad registrada"
    )}
                </strong>


                <div class="actividad-meta">

                    <span>
                        ${escaparTextoDashboard(
        actividad.usuario
        ||
        "-"
    )}
                    </span>

                    <span>
                        •
                    </span>

                    <span>
                        ${formatearRolActividad(
        actividad.rol
    )}
                    </span>

                    <span>
                        •
                    </span>

                    <span>
                        ${formatearFechaHoraActividad(
        actividad.fecha
    )}
                    </span>

                </div>

            </div>

        </div>
    `;
}


// ==========================================
// ICONO SEGÚN ACTIVIDAD
// ==========================================

function obtenerIconoActividad(
    tipo
) {

    switch (
        String(
            tipo || ""
        ).toUpperCase()
        ) {

        case "CITA":

            return "📅";


        case "PAGO":

            return "💳";


        case "MEDICO":

            return "👨‍⚕️";


        case "PACIENTE":

            return "🧑";


        case "ESPECIALIDAD":

            return "🩺";


        case "USUARIO":

            return "👤";


        default:

            return "📌";
    }
}


// ==========================================
// FORMATEAR ROL ACTIVIDAD
// ==========================================

function formatearRolActividad(
    rol
) {

    switch (
        rol
        ) {

        case "ADMIN":

            return "Administrador";


        case "SECRETARIA":

            return "Secretaría";


        case "PACIENTE":

            return "Paciente";


        default:

            return rol || "-";
    }
}


// ==========================================
// FORMATEAR FECHA ACTIVIDAD
// ==========================================

function formatearFechaHoraActividad(
    fecha
) {

    if (!fecha) {

        return "-";
    }


    const valor =
        new Date(
            fecha
        );


    if (
        Number.isNaN(
            valor.getTime()
        )
    ) {

        return fecha;
    }


    return valor.toLocaleString(
        "es-PE",
        {

            dateStyle:
                "short",

            timeStyle:
                "short"
        }
    );
}


// ==========================================
// CARGAR FELICITACIONES
// ==========================================

async function cargarFelicitaciones() {

    const contenedor =
        document.querySelector(
            ".testimonios-grid"
        );


    if (!contenedor) {

        return;
    }


    contenedor.innerHTML = `

        <div class="actividad-vacia">

            <p>
                Cargando opiniones...
            </p>

        </div>
    `;


    try {

        const respuesta =
            await fetch(
                "/felicitaciones"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las felicitaciones"
            );
        }


        const felicitaciones =
            await respuesta.json();


        contenedor.innerHTML =
            "";


        if (
            !Array.isArray(
                felicitaciones
            )
            ||
            felicitaciones.length === 0
        ) {

            contenedor.innerHTML = `

                <div class="actividad-vacia">

                    <p>
                        Todavía no hay experiencias
                        compartidas por nuestros pacientes.
                    </p>

                </div>
            `;


            return;
        }


        felicitaciones.forEach(
            felicitacion => {

                contenedor.innerHTML +=
                    crearFelicitacionHtml(
                        felicitacion
                    );
            }
        );


    } catch (error) {

        console.error(
            error
        );


        contenedor.innerHTML = `

            <div class="actividad-vacia">

                <p>
                    No se pudieron cargar las opiniones.
                </p>

            </div>
        `;
    }
}


// ==========================================
// CREAR TARJETA DE FELICITACIÓN
// ==========================================

function crearFelicitacionHtml(
    felicitacion
) {

    const puntuacion =
        limitarPuntuacion(
            felicitacion.puntuacion
        );


    const estrellas =
        crearEstrellas(
            puntuacion
        );


    return `

        <article class="testimonio-card">

            <p>
                "${escaparTextoDashboard(
        felicitacion.experiencia
        ||
        ""
    )}"
            </p>


            <div class="testimonio-separador">
            </div>


            <div
                class="testimonio-estrellas"
                aria-label="${puntuacion} de 5 estrellas">

                ${estrellas}

            </div>


            <strong>
                ${escaparTextoDashboard(
        felicitacion.paciente
        ||
        "Paciente"
    )}
            </strong>


            <span>
                Paciente
            </span>

        </article>
    `;
}


// ==========================================
// LIMITAR PUNTUACIÓN
// ==========================================

function limitarPuntuacion(
    puntuacion
) {

    const numero =
        Number(
            puntuacion
        );


    if (
        Number.isNaN(
            numero
        )
    ) {

        return 5;
    }


    return Math.min(
        5,
        Math.max(
            1,
            Math.round(
                numero
            )
        )
    );
}


// ==========================================
// CREAR ESTRELLAS
// ==========================================

function crearEstrellas(
    puntuacion
) {

    const llenas =
        "★".repeat(
            puntuacion
        );


    const vacias =
        "☆".repeat(
            5 - puntuacion
        );


    return llenas + vacias;
}


// ==========================================
// CARGAR ESPECIALIDADES EN EL MODAL
// ==========================================

async function cargarEspecialidadesFelicitacion() {

    const select =
        document.getElementById(
            "felicitacionArea"
        );


    if (!select) {

        return;
    }


    select.innerHTML = `

        <option value="">
            Seleccione un área
        </option>
    `;


    try {

        const respuesta =
            await fetch(
                "/especialidades"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener las especialidades"
            );
        }


        const especialidades =
            await respuesta.json();


        especialidades
            .filter(
                especialidad =>
                    especialidad.estado === true
            )
            .forEach(
                especialidad => {

                    const opcion =
                        document.createElement(
                            "option"
                        );


                    opcion.value =
                        especialidad.nombre;


                    opcion.textContent =
                        especialidad.nombre;


                    select.appendChild(
                        opcion
                    );
                }
            );


        const otra =
            document.createElement(
                "option"
            );


        otra.value =
            "Otra";


        otra.textContent =
            "Otra";


        select.appendChild(
            otra
        );


    } catch (error) {

        console.error(
            error
        );


        /*
         * Si no se pueden cargar las
         * especialidades, permitimos Otra.
         */

        const opcion =
            document.createElement(
                "option"
            );


        opcion.value =
            "Otra";


        opcion.textContent =
            "Otra";


        select.appendChild(
            opcion
        );
    }
}


// ==========================================
// CONFIGURAR FORMULARIO
// ==========================================

function configurarFormularioFelicitacion() {

    if (!esPaciente()) {

        return;
    }


    const inputPaciente =
        document.getElementById(
            "felicitacionPaciente"
        );


    if (!inputPaciente) {

        return;
    }


    /*
     * Si la sesión del paciente tiene
     * la entidad asociada, usamos su nombre.
     */
    if (
        usuarioDashboard
        &&
        usuarioDashboard.paciente
        &&
        usuarioDashboard.paciente.nombre
    ) {

        inputPaciente.value =
            usuarioDashboard
                .paciente
                .nombre;
    }
}


// ==========================================
// ABRIR MODAL FELICITACIÓN
// ==========================================

function abrirModalFelicitacion() {

    if (!esPaciente()) {

        alert(
            "Solo los pacientes pueden compartir una experiencia."
        );


        return;
    }


    const modal =
        document.getElementById(
            "modalFelicitacion"
        );


    if (!modal) {

        return;
    }


    modal.classList.add(
        "mostrar"
    );


    document.body.style.overflow =
        "hidden";
}


// ==========================================
// CERRAR MODAL
// ==========================================

function cerrarModalFelicitacion() {

    const modal =
        document.getElementById(
            "modalFelicitacion"
        );


    if (!modal) {

        return;
    }


    modal.classList.remove(
        "mostrar"
    );


    document.body.style.overflow =
        "";
}


// ==========================================
// ENVIAR FELICITACIÓN
// ==========================================

async function enviarFelicitacion() {

    if (!esPaciente()) {

        return;
    }


    const experiencia =
        document
            .getElementById(
                "felicitacionExperiencia"
            )
            .value
            .trim();


    const area =
        document
            .getElementById(
                "felicitacionArea"
            )
            .value
            .trim();


    const personal =
        document
            .getElementById(
                "felicitacionPersonal"
            )
            .value
            .trim();


    const paciente =
        document
            .getElementById(
                "felicitacionPaciente"
            )
            .value
            .trim();


    const puntuacion =
        Number(
            document
                .getElementById(
                    "felicitacionPuntuacion"
                )
                .value
        );


    const mensaje =
        document.getElementById(
            "mensajeFelicitacion"
        );


    const boton =
        document.querySelector(
            ".btn-enviar-felicitacion"
        );


    // ======================================
    // VALIDACIONES
    // ======================================

    if (
        experiencia === ""
    ) {

        mostrarMensajeFelicitacion(
            "Debe escribir su experiencia.",
            false
        );


        return;
    }


    if (
        experiencia.length > 500
    ) {

        mostrarMensajeFelicitacion(
            "La experiencia no puede superar los 500 caracteres.",
            false
        );


        return;
    }


    if (
        area === ""
    ) {

        mostrarMensajeFelicitacion(
            "Debe seleccionar el área de atención.",
            false
        );


        return;
    }


    if (
        paciente === ""
    ) {

        mostrarMensajeFelicitacion(
            "Debe indicar sus nombres y apellidos.",
            false
        );


        return;
    }


    if (
        puntuacion < 1
        ||
        puntuacion > 5
    ) {

        mostrarMensajeFelicitacion(
            "Seleccione una calificación válida.",
            false
        );


        return;
    }


    const datos = {

        experiencia:
        experiencia,

        area:
        area,

        personal:
            personal === ""
                ? null
                : personal,

        paciente:
        paciente,

        puntuacion:
        puntuacion
    };


    try {

        if (boton) {

            boton.disabled =
                true;


            boton.innerText =
                "Enviando...";
        }


        const respuesta =
            await fetch(
                "/felicitaciones",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            datos
                        )
                }
            );


        if (!respuesta.ok) {

            const texto =
                await respuesta.text();


            throw new Error(
                texto
                ||
                "No se pudo registrar la felicitación"
            );
        }


        mostrarMensajeFelicitacion(
            "Gracias por compartir tu experiencia.",
            true
        );


        /*
         * Actualizamos las tarjetas para
         * mostrar inmediatamente la opinión.
         */
        await cargarFelicitaciones();


        setTimeout(
            () => {

                limpiarFormularioFelicitacion();

                cerrarModalFelicitacion();

            },
            1000
        );


    } catch (error) {

        console.error(
            error
        );


        mostrarMensajeFelicitacion(
            error.message
            ||
            "No se pudo registrar la felicitación.",
            false
        );


    } finally {

        if (boton) {

            boton.disabled =
                false;


            boton.innerText =
                "Enviar";
        }
    }
}


// ==========================================
// MOSTRAR MENSAJE
// ==========================================

function mostrarMensajeFelicitacion(
    texto,
    exito
) {

    const mensaje =
        document.getElementById(
            "mensajeFelicitacion"
        );


    if (!mensaje) {

        return;
    }


    mensaje.innerText =
        texto;


    mensaje.style.color =
        exito
            ? "#1b7f3b"
            : "#b3261e";
}


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function limpiarFormularioFelicitacion() {

    const experiencia =
        document.getElementById(
            "felicitacionExperiencia"
        );


    const area =
        document.getElementById(
            "felicitacionArea"
        );


    const personal =
        document.getElementById(
            "felicitacionPersonal"
        );


    const paciente =
        document.getElementById(
            "felicitacionPaciente"
        );


    const puntuacion =
        document.getElementById(
            "felicitacionPuntuacion"
        );


    const mensaje =
        document.getElementById(
            "mensajeFelicitacion"
        );


    if (experiencia) {

        experiencia.value =
            "";
    }


    if (area) {

        area.value =
            "";
    }


    if (personal) {

        personal.value =
            "";
    }


    if (puntuacion) {

        puntuacion.value =
            "5";
    }


    /*
     * El nombre del paciente permanece
     * precargado cuando existe en sesión.
     */
    if (paciente) {

        if (
            usuarioDashboard
            &&
            usuarioDashboard.paciente
            &&
            usuarioDashboard.paciente.nombre
        ) {

            paciente.value =
                usuarioDashboard
                    .paciente
                    .nombre;

        } else {

            paciente.value =
                "";
        }
    }


    if (mensaje) {

        mensaje.innerText =
            "";
    }
}


// ==========================================
// CERRAR MODAL HACIENDO CLIC FUERA
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "modalFelicitacion"
            );


        if (
            modal
            &&
            event.target === modal
        ) {

            cerrarModalFelicitacion();
        }
    }
);


// ==========================================
// ESCAPE CIERRA EL MODAL
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            cerrarModalFelicitacion();
        }
    }
);


// ==========================================
// ESCAPAR HTML
// ==========================================

function escaparTextoDashboard(
    texto
) {

    if (
        texto == null
    ) {

        return "";
    }


    return String(
        texto
    )

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// ==========================================
// INICIAR
// ==========================================

iniciarDashboard();