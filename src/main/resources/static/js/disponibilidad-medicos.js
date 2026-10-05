let medicos = [];
let medicoSeleccionado = null;
let politica = null;


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

    if (!fecha) {
        return "";
    }

    const partes =
        fecha.split("-");

    return (
        partes[2]
        + "/"
        + partes[1]
        + "/"
        + partes[0]
    );
}


// ==========================================
// FORMATEAR HORA
// ==========================================

function formatearHora(hora) {

    if (!hora) {
        return "";
    }

    return hora.substring(
        0,
        5
    );
}


// ==========================================
// FORMATEAR DÍA
// ==========================================

function formatearDia(dia) {

    if (!dia) {
        return "-";
    }

    const dias = {

        LUNES:
            "Lunes",

        MARTES:
            "Martes",

        MIERCOLES:
            "Miércoles",

        JUEVES:
            "Jueves",

        VIERNES:
            "Viernes",

        SABADO:
            "Sábado",

        DOMINGO:
            "Domingo"
    };

    return dias[dia]
        || dia;
}


// ==========================================
// CARGAR MÉDICOS
// ==========================================

async function cargarMedicos() {

    const select =
        document.getElementById(
            "medico"
        );

    try {

        select.innerHTML = `
            <option value="">
                Cargando médicos...
            </option>
        `;

        const respuesta =
            await fetch(
                "/medicos"
            );

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los médicos"
            );
        }

        const datos =
            await respuesta.json();


        /*
         * Solo mostramos médicos activos
         * que tengan especialidad activa.
         */
        medicos =
            datos.filter(m =>

                m.estado === true
                &&
                m.especialidad
                &&
                m.especialidad.estado === true
            );


        select.innerHTML = `
            <option value="">
                Seleccione un médico
            </option>
        `;


        if (
            medicos.length === 0
        ) {

            select.innerHTML = `
                <option value="">
                    No hay médicos activos
                </option>
            `;

            select.disabled =
                true;

            return;
        }


        medicos.forEach(m => {

            const especialidad =
                m.especialidad
                    ? m.especialidad.nombre
                    : "Sin especialidad";


            select.innerHTML += `
                <option value="${m.idMedico}">
                    ${m.nombre}
                    -
                    ${especialidad}
                </option>
            `;
        });


        select.disabled =
            false;


        select.addEventListener(
            "change",
            cambiarMedico
        );


    } catch (error) {

        console.error(
            error
        );

        select.innerHTML = `
            <option value="">
                Error al cargar médicos
            </option>
        `;

        select.disabled =
            true;

        mostrarMensaje(
            "No se pudieron cargar los médicos.",
            false
        );
    }
}


// ==========================================
// CAMBIAR MÉDICO
// ==========================================

async function cambiarMedico() {

    const idMedico =
        document.getElementById(
            "medico"
        ).value;


    medicoSeleccionado =
        null;


    ocultarResumen();


    if (
        idMedico === ""
    ) {

        mostrarTablaVacia(
            "Seleccione un médico para consultar sus horarios."
        );

        return;
    }


    medicoSeleccionado =
        medicos.find(
            m =>
                Number(m.idMedico)
                ===
                Number(idMedico)
        );


    if (
        !medicoSeleccionado
    ) {

        mostrarTablaVacia(
            "No se encontró la información del médico."
        );

        return;
    }


    mostrarResumenMedico();


    await cargarHorariosMedico(
        idMedico
    );
}


// ==========================================
// MOSTRAR RESUMEN DEL MÉDICO
// ==========================================

function mostrarResumenMedico() {

    if (
        !medicoSeleccionado
    ) {

        return;
    }


    const resumen =
        document.getElementById(
            "resumenMedico"
        );


    const especialidad =
        medicoSeleccionado
            .especialidad;


    document.getElementById(
        "resumenNombreMedico"
    ).innerText =
        medicoSeleccionado.nombre
        || "-";


    document.getElementById(
        "resumenEspecialidad"
    ).innerText =
        especialidad
            ? especialidad.nombre
            : "-";


    const duracion =
        especialidad
        &&
        especialidad
            .tiempoAtencionMinutos
            ? especialidad
                .tiempoAtencionMinutos
            : null;


    document.getElementById(
        "resumenDuracion"
    ).innerText =
        duracion
            ? (
                duracion === 60
                    ? "1 hora"
                    : duracion
                    + " minutos"
            )
            : "No configurada";


    resumen.style.display =
        "grid";
}


// ==========================================
// OCULTAR RESUMEN
// ==========================================

function ocultarResumen() {

    const resumen =
        document.getElementById(
            "resumenMedico"
        );

    if (resumen) {

        resumen.style.display =
            "none";
    }
}


// ==========================================
// CARGAR POLÍTICA
// ==========================================

async function cargarPolitica() {

    const texto =
        document.getElementById(
            "infoPoliticaDisponibilidad"
        );

    try {

        const respuesta =
            await fetch(
                "/politica-clinica"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar la política de la clínica"
            );
        }


        politica =
            await respuesta.json();


        if (!politica) {

            throw new Error(
                "No existe política activa"
            );
        }


        texto.innerHTML = `
            Próximos
            <strong>
                ${politica.diasAnticipacion}
                días
            </strong>
            ·
            Mañana:
            <strong>
                ${formatearHora(
            politica.horaInicioManana
        )}
                -
                ${formatearHora(
            politica.horaFinManana
        )}
            </strong>
            ·
            Tarde:
            <strong>
                ${formatearHora(
            politica.horaInicioTarde
        )}
                -
                ${formatearHora(
            politica.horaFinTarde
        )}
            </strong>
        `;


    } catch (error) {

        console.error(
            error
        );


        politica =
            null;


        texto.innerText =
            "No se pudo cargar la política vigente.";
    }
}


// ==========================================
// GENERAR HORARIOS
// ==========================================

async function generarHorarios() {

    const idMedico =
        document.getElementById(
            "medico"
        ).value;


    if (
        idMedico === ""
    ) {

        mostrarMensaje(
            "Debe seleccionar un médico.",
            false
        );

        return;
    }


    if (
        !medicoSeleccionado
    ) {

        mostrarMensaje(
            "No se pudo obtener la información del médico.",
            false
        );

        return;
    }


    const especialidad =
        medicoSeleccionado
            .especialidad;


    if (
        !especialidad
    ) {

        mostrarMensaje(
            "El médico no tiene especialidad asignada.",
            false
        );

        return;
    }


    const duracion =
        Number(
            especialidad
                .tiempoAtencionMinutos
        );


    if (
        duracion !== 30
        &&
        duracion !== 60
    ) {

        mostrarMensaje(
            "La especialidad debe tener una duración de 30 minutos o 1 hora.",
            false
        );

        return;
    }


    const confirmar =
        confirm(
            "¿Desea generar automáticamente los horarios para "
            + medicoSeleccionado.nombre
            + "?"
        );


    if (!confirmar) {

        return;
    }


    const boton =
        document.getElementById(
            "btnGenerarHorarios"
        );


    try {

        boton.disabled =
            true;

        boton.innerText =
            "Generando horarios...";


        mostrarMensaje(
            "Generando horarios según la política vigente...",
            true
        );


        const respuesta =
            await fetch(
                "/horarios-automaticos/generar/"
                + idMedico,
                {

                    method:
                        "POST"
                }
            );


        const mensaje =
            await respuesta.text();


        if (!respuesta.ok) {

            throw new Error(
                mensaje
                ||
                "No se pudieron generar los horarios"
            );
        }


        mostrarMensaje(
            mensaje
            ||
            "Horarios generados correctamente.",
            true
        );


        /*
         * Volvemos a consultar para que
         * la tabla se actualice inmediatamente.
         */
        await cargarHorariosMedico(
            idMedico
        );


    } catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            error.message
            ||
            "No se pudo conectar con el servidor.",
            false
        );


    } finally {

        boton.disabled =
            false;

        boton.innerText =
            "Generar horarios automáticamente";
    }
}


// ==========================================
// CARGAR HORARIOS DEL MÉDICO
// ==========================================

async function cargarHorariosMedico(
    idMedico
) {

    mostrarTablaVacia(
        "Cargando horarios..."
    );


    try {

        /*
         * Este endpoint ya es utilizado
         * en la reserva de citas.
         *
         * Devuelve horarios DISPONIBLES
         * del médico seleccionado.
         */
        const respuesta =
            await fetch(
                "/horarios/disponibles/medico/"
                + idMedico
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los horarios"
            );
        }


        let horarios =
            await respuesta.json();


        if (
            !Array.isArray(
                horarios
            )
        ) {

            horarios =
                [];
        }


        horarios.sort(
            (a, b) => {

                const fechaA =
                    (
                        a.fecha
                        || ""
                    )
                    +
                    " "
                    +
                    (
                        a.hora
                        || ""
                    );


                const fechaB =
                    (
                        b.fecha
                        || ""
                    )
                    +
                    " "
                    +
                    (
                        b.hora
                        || ""
                    );


                return fechaA
                    .localeCompare(
                        fechaB
                    );
            }
        );


        mostrarHorarios(
            horarios
        );


    } catch (error) {

        console.error(
            error
        );


        mostrarTablaVacia(
            "No se pudieron cargar los horarios del médico."
        );
    }
}


// ==========================================
// MOSTRAR HORARIOS
// ==========================================

function mostrarHorarios(
    horarios
) {

    const tabla =
        document.getElementById(
            "tablaHorariosGenerados"
        );


    tabla.innerHTML =
        "";


    if (
        horarios.length === 0
    ) {

        mostrarTablaVacia(
            "Este médico todavía no tiene horarios disponibles."
        );

        return;
    }


    horarios.forEach(h => {

        const medico =
            h.medico
                ? h.medico.nombre
                : (
                    medicoSeleccionado
                        ? medicoSeleccionado.nombre
                        : "-"
                );


        let especialidad =
            "-";


        if (
            h.medico
            &&
            h.medico.especialidad
        ) {

            especialidad =
                h.medico
                    .especialidad
                    .nombre;

        } else if (
            medicoSeleccionado
            &&
            medicoSeleccionado
                .especialidad
        ) {

            especialidad =
                medicoSeleccionado
                    .especialidad
                    .nombre;
        }


        tabla.innerHTML += `
            <tr>

                <td>
                    ${formatearFecha(
            h.fecha
        )}
                </td>

                <td>
                    ${formatearDia(
            h.diaSemana
        )}
                </td>

                <td>
                    ${escaparTextoDisponibilidad(
            medico
        )}
                </td>

                <td>
                    ${escaparTextoDisponibilidad(
            especialidad
        )}
                </td>

                <td>
                    ${formatearHora(
            h.hora
        )}
                </td>

                <td>
                    ${formatearHora(
            h.horaFin
        )}
                </td>

                <td>
                    <span class="estado estado-disponible">
                        ${
            formatearEstado(
                h.estado
            )
        }
                    </span>
                </td>

            </tr>
        `;
    });
}


// ==========================================
// TABLA VACÍA
// ==========================================

function mostrarTablaVacia(
    mensaje
) {

    const tabla =
        document.getElementById(
            "tablaHorariosGenerados"
        );


    if (!tabla) {

        return;
    }


    tabla.innerHTML = `
        <tr>

            <td
                colspan="7"
                class="tabla-vacia">

                ${escaparTextoDisponibilidad(
        mensaje
    )}

            </td>

        </tr>
    `;
}


// ==========================================
// FORMATEAR ESTADO
// ==========================================

function formatearEstado(
    estado
) {

    switch (
        String(
            estado || ""
        ).toUpperCase()
        ) {

        case "DISPONIBLE":

            return "Disponible";


        case "RESERVADO":

            return "Reservado";


        case "INACTIVO":

            return "Inactivo";


        default:

            return estado || "-";
    }
}


// ==========================================
// MENSAJES
// ==========================================

function mostrarMensaje(
    texto,
    exito
) {

    const mensaje =
        document.getElementById(
            "mensaje"
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
// ESCAPAR HTML
// ==========================================

function escaparTextoDisponibilidad(
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
// INICIO
// ==========================================

async function iniciar() {

    await cargarPolitica();

    await cargarMedicos();
}


iniciar();