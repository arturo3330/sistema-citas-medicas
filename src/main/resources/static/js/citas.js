// ==========================================
// VARIABLES GLOBALES
// ==========================================

let especialidades = [];


// ==========================================
// CARGAR PACIENTES
// ==========================================

async function cargarPacientes() {

    const select =
        document.getElementById(
            "paciente"
        );


    try {

        const respuesta =
            await fetch(
                "/pacientes"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los pacientes"
            );
        }


        const datos =
            await respuesta.json();


        select.innerHTML = `
            <option value="">
                Seleccione un paciente
            </option>
        `;


        datos.forEach(p => {

            select.innerHTML += `
                <option value="${p.idPaciente}">
                    ${escaparTexto(p.nombre)}
                    -
                    DNI: ${escaparTexto(p.dni)}
                </option>
            `;
        });


    } catch (error) {

        console.error(
            error
        );


        select.innerHTML = `
            <option value="">
                Error al cargar pacientes
            </option>
        `;
    }
}


// ==========================================
// CARGAR ESPECIALIDADES
// ==========================================

async function cargarEspecialidades() {

    const select =
        document.getElementById(
            "especialidad"
        );


    try {

        select.innerHTML = `
            <option value="">
                Cargando especialidades...
            </option>
        `;


        const respuesta =
            await fetch(
                "/especialidades"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las especialidades"
            );
        }


        const datos =
            await respuesta.json();


        especialidades =
            datos.filter(
                e =>
                    e.estado === true
            );


        select.innerHTML = `
            <option value="">
                Seleccione una especialidad
            </option>
        `;


        if (
            especialidades.length === 0
        ) {

            select.innerHTML = `
                <option value="">
                    No hay especialidades activas
                </option>
            `;


            select.disabled =
                true;


            return;
        }


        especialidades.forEach(e => {

            const duracion =
                Number(
                    e.tiempoAtencionMinutos
                );


            let textoDuracion =
                "";


            if (
                duracion === 60
            ) {

                textoDuracion =
                    "1 hora";

            } else if (
                duracion === 30
            ) {

                textoDuracion =
                    "30 min";
            }


            select.innerHTML += `
                <option value="${e.idEspecialidad}">
                    ${escaparTexto(e.nombre)}
                    ${
                textoDuracion !== ""
                    ? `- ${textoDuracion}`
                    : ""
            }
                </option>
            `;
        });


        select.disabled =
            false;


    } catch (error) {

        console.error(
            error
        );


        select.innerHTML = `
            <option value="">
                Error al cargar especialidades
            </option>
        `;


        select.disabled =
            true;
    }
}


// ==========================================
// CAMBIAR ESPECIALIDAD
// ==========================================

async function cambiarEspecialidad() {

    const idEspecialidad =
        document.getElementById(
            "especialidad"
        ).value;


    const selectHorario =
        document.getElementById(
            "horario"
        );


    // ======================================
    // SIN ESPECIALIDAD
    // ======================================

    if (
        idEspecialidad === ""
    ) {

        selectHorario.innerHTML = `
            <option value="">
                Seleccione una especialidad primero
            </option>
        `;


        selectHorario.disabled =
            true;


        return;
    }


    await cargarHorariosPorEspecialidad(
        idEspecialidad
    );
}


// ==========================================
// CARGAR HORARIOS POR ESPECIALIDAD
// ==========================================

async function cargarHorariosPorEspecialidad(
    idEspecialidad
) {

    const select =
        document.getElementById(
            "horario"
        );


    select.disabled =
        true;


    select.innerHTML = `
        <option value="">
            Cargando horarios...
        </option>
    `;


    try {

        const respuesta =
            await fetch(
                "/horarios/disponibles/especialidad/"
                + idEspecialidad
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


        // ======================================
        // ORDEN CRONOLÓGICO
        // ======================================

        horarios.sort(
            (a, b) => {

                const valorA =
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


                const valorB =
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


                return valorA
                    .localeCompare(
                        valorB
                    );
            }
        );


        select.innerHTML = `
            <option value="">
                Seleccione un horario
            </option>
        `;


        if (
            horarios.length === 0
        ) {

            select.innerHTML = `
                <option value="">
                    No hay horarios disponibles
                </option>
            `;


            select.disabled =
                true;


            return;
        }


        horarios.forEach(h => {

            const medico =
                h.medico
                    ? h.medico.nombre
                    : "-";


            const fecha =
                formatearFecha(
                    h.fecha
                );


            const horaInicio =
                formatearHora(
                    h.hora
                );


            const horaFin =
                formatearHora(
                    h.horaFin
                );


            select.innerHTML += `
                <option value="${h.idHorario}">
                    ${fecha}
                    |
                    ${horaInicio}
                    -
                    ${horaFin}
                    |
                    ${escaparTexto(medico)}
                </option>
            `;
        });


        select.disabled =
            false;


    } catch (error) {

        console.error(
            error
        );


        select.innerHTML = `
            <option value="">
                Error al cargar horarios
            </option>
        `;


        select.disabled =
            true;
    }
}


// ==========================================
// ACTUALIZAR HORARIOS DE ESPECIALIDAD ACTUAL
// ==========================================

async function actualizarHorariosActuales() {

    const idEspecialidad =
        document.getElementById(
            "especialidad"
        ).value;


    if (
        idEspecialidad === ""
    ) {

        const select =
            document.getElementById(
                "horario"
            );


        select.innerHTML = `
            <option value="">
                Seleccione una especialidad primero
            </option>
        `;


        select.disabled =
            true;


        return;
    }


    await cargarHorariosPorEspecialidad(
        idEspecialidad
    );
}


// ==========================================
// LISTAR CITAS
// ==========================================

async function listarCitas() {

    const tabla =
        document.getElementById(
            "tablaCitas"
        );


    try {

        const respuesta =
            await fetch(
                "/citas"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las citas"
            );
        }


        const datos =
            await respuesta.json();


        tabla.innerHTML =
            "";


        if (
            datos.length === 0
        ) {

            tabla.innerHTML = `
                <tr>

                    <td colspan="8">
                        No hay citas registradas.
                    </td>

                </tr>
            `;


            return;
        }


        datos.forEach(c => {

            const paciente =
                c.paciente
                    ? c.paciente.nombre
                    : "-";


            const horario =
                c.horario;


            const medico =
                horario
                &&
                horario.medico
                    ? horario.medico.nombre
                    : "-";


            const especialidad =
                horario
                &&
                horario.medico
                &&
                horario.medico.especialidad
                    ? horario.medico
                        .especialidad
                        .nombre
                    : "-";


            tabla.innerHTML += `
                <tr>

                    <td>
                        ${c.idCita}
                    </td>

                    <td>
                        ${escaparTexto(
                paciente
            )}
                    </td>

                    <td>
                        ${escaparTexto(
                medico
            )}
                    </td>

                    <td>
                        ${escaparTexto(
                especialidad
            )}
                    </td>

                    <td>
                        ${
                horario
                    ? formatearFecha(
                        horario.fecha
                    )
                    : "-"
            }
                    </td>

                    <td>
                        ${
                horario
                    ? (
                        formatearHora(
                            horario.hora
                        )
                        +
                        (
                            horario.horaFin
                                ? " - "
                                + formatearHora(
                                    horario.horaFin
                                )
                                : ""
                        )
                    )
                    : "-"
            }
                    </td>

                    <td>
                        ${formatearEstadoCita(
                c.estado
            )}
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="eliminarCita(
                                ${c.idCita}
                            )">

                            Eliminar

                        </button>

                    </td>

                </tr>
            `;
        });


    } catch (error) {

        console.error(
            error
        );


        tabla.innerHTML = `
            <tr>

                <td colspan="8">
                    Error al cargar las citas.
                </td>

            </tr>
        `;
    }
}


// ==========================================
// RESERVAR CITA
// ==========================================

async function reservar() {

    const idPaciente =
        document.getElementById(
            "paciente"
        ).value;


    const idEspecialidad =
        document.getElementById(
            "especialidad"
        ).value;


    const idHorario =
        document.getElementById(
            "horario"
        ).value;


    const mensaje =
        document.getElementById(
            "mensaje"
        );


    mensaje.innerText =
        "";


    // ======================================
    // VALIDACIONES
    // ======================================

    if (
        idPaciente === ""
    ) {

        mostrarMensaje(
            "Seleccione un paciente.",
            false
        );


        return;
    }


    if (
        idEspecialidad === ""
    ) {

        mostrarMensaje(
            "Seleccione una especialidad.",
            false
        );


        return;
    }


    if (
        idHorario === ""
    ) {

        mostrarMensaje(
            "Seleccione un horario disponible.",
            false
        );


        return;
    }


    try {

        const respuesta =
            await fetch(
                "/citas/reservar",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            {

                                idPaciente:
                                    Number(
                                        idPaciente
                                    ),

                                idHorario:
                                    Number(
                                        idHorario
                                    )
                            }
                        )
                }
            );


        const contenido =
            await respuesta.text();


        // ======================================
        // RESERVA CORRECTA
        // ======================================

        if (
            respuesta.ok
        ) {

            mostrarMensaje(
                "Cita registrada correctamente. "
                + "Queda pendiente el pago requerido.",
                true
            );


            /*
             * El horario reservado deja de estar
             * DISPONIBLE, por lo que recargamos
             * únicamente los horarios de la
             * especialidad seleccionada.
             */

            await actualizarHorariosActuales();


            await listarCitas();


            return;
        }


        // ======================================
        // ERROR DEL BACKEND
        // ======================================

        mostrarMensaje(
            contenido
            ||
            "No se pudo registrar la cita.",
            false
        );


        /*
         * Puede ocurrir que otro usuario haya
         * tomado el horario unos segundos antes.
         * Actualizamos el combo.
         */

        await actualizarHorariosActuales();


    } catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            "No se pudo conectar con el servidor.",
            false
        );
    }
}


// ==========================================
// ELIMINAR CITA
// ==========================================

async function eliminarCita(
    idCita
) {

    const confirmar =
        confirm(
            "¿Desea eliminar esta cita?"
        );


    if (!confirmar) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                "/citas/" + idCita,
                {

                    method:
                        "DELETE"
                }
            );


        const contenido =
            await respuesta.text();


        // ======================================
        // ELIMINACIÓN CORRECTA
        // ======================================

        if (
            respuesta.ok
        ) {

            mostrarMensaje(
                contenido
                ||
                "Cita eliminada correctamente.",
                true
            );


            /*
             * Al eliminar una cita sin pagos,
             * el horario vuelve a DISPONIBLE.
             */

            await actualizarHorariosActuales();


            await listarCitas();


            return;
        }


        // ======================================
        // ERROR DEL BACKEND
        // ======================================

        mostrarMensaje(
            contenido
            ||
            "No se pudo eliminar la cita.",
            false
        );


    } catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            "No se pudo conectar con el servidor.",
            false
        );
    }
}


// ==========================================
// MOSTRAR MENSAJE
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
// FORMATEAR ESTADO DE CITA
// ==========================================

function formatearEstadoCita(
    estado
) {

    switch (
        String(
            estado || ""
        ).toUpperCase()
        ) {

        case "PENDIENTE_PAGO":

            return "Pendiente de pago";


        case "SEPARADA":

            return "Separada";


        case "CONFIRMADA":

            return "Confirmada";


        case "ANULADA":

            return "Anulada";


        case "PERDIDA":

            return "Perdida";


        default:

            return estado || "-";
    }
}


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(
    fecha
) {

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

function formatearHora(
    hora
) {

    if (!hora) {

        return "";
    }


    const partes =
        hora.split(":");


    let horas =
        parseInt(
            partes[0]
        );


    const minutos =
        partes[1];


    const periodo =
        horas >= 12
            ? "p. m."
            : "a. m.";


    horas =
        horas % 12;


    if (
        horas === 0
    ) {

        horas =
            12;
    }


    return (
        horas
        + ":"
        + minutos
        + " "
        + periodo
    );
}


// ==========================================
// ESCAPAR TEXTO
// ==========================================

function escaparTexto(
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
// EVENTO DE ESPECIALIDAD
// ==========================================

document
    .getElementById(
        "especialidad"
    )
    .addEventListener(
        "change",
        cambiarEspecialidad
    );


// ==========================================
// INICIAR
// ==========================================

async function iniciar() {

    await cargarPacientes();

    await cargarEspecialidades();

    await listarCitas();
}


iniciar();