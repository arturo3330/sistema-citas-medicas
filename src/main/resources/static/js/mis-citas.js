const usuarioPaciente =
    obtenerUsuarioSesion();


if (!esPaciente()) {

    window.location.href =
        "dashboard.html";
}


// ==========================================
// FORMATEAR ESTADO
// ==========================================

function formatearEstadoCita(
    estado) {

    const valor =
        (estado || "")
            .toUpperCase();


    switch (valor) {

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
// LISTAR MIS CITAS
// ==========================================

async function listarMisCitas() {

    const tabla =
        document.getElementById(
            "tablaCitas"
        );


    // ======================================
    // VALIDAR PACIENTE ASOCIADO
    // ======================================

    if (
        !usuarioPaciente
        ||
        !usuarioPaciente.paciente
        ||
        !usuarioPaciente
            .paciente
            .idPaciente
    ) {

        tabla.innerHTML = `

            <tr>

                <td colspan="6">
                    No se encontró un paciente asociado
                    a esta cuenta.
                </td>

            </tr>
        `;

        return;
    }


    const idPaciente =
        usuarioPaciente
            .paciente
            .idPaciente;


    try {

        const respuesta =
            await fetch(
                "/citas/paciente/"
                + idPaciente
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


        // ======================================
        // SIN CITAS
        // ======================================

        if (
            datos.length === 0
        ) {

            tabla.innerHTML = `

                <tr>

                    <td colspan="6">
                        No tienes citas registradas.
                    </td>

                </tr>
            `;

            return;
        }


        // ======================================
        // ORDENAR POR FECHA Y HORA
        // ======================================

        datos.sort(
            (a, b) => {

                const fechaA =
                    a.horario
                        ? `${a.horario.fecha}T${a.horario.hora}`
                        : "";


                const fechaB =
                    b.horario
                        ? `${b.horario.fecha}T${b.horario.hora}`
                        : "";


                return fechaA.localeCompare(
                    fechaB
                );
            }
        );


        // ======================================
        // MOSTRAR CITAS
        // ======================================

        datos.forEach(
            c => {

                const horario =
                    c.horario;


                const medico =
                    horario
                    &&
                    horario.medico
                        ? horario.medico
                        : null;


                const especialidad =
                    medico
                    &&
                    medico.especialidad
                        ? medico.especialidad
                        : null;


                tabla.innerHTML += `

                    <tr>

                        <td>
                            ${c.idCita}
                        </td>

                        <td>
                            ${
                    medico
                        ? medico.nombre
                        : "-"
                }
                        </td>

                        <td>
                            ${
                    especialidad
                        ? especialidad.nombre
                        : "-"
                }
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
                        ? formatearHora(
                            horario.hora
                        )
                        : "-"
                }
                        </td>

                        <td>
                            <span class="
                                estado-cita
                                ${obtenerClaseEstado(
                    c.estado
                )}
                            ">

                                ${formatearEstadoCita(
                    c.estado
                )}

                            </span>
                        </td>

                    </tr>
                `;
            }
        );


    } catch (error) {

        console.error(
            error
        );


        tabla.innerHTML = `

            <tr>

                <td colspan="6">
                    No se pudieron cargar tus citas.
                </td>

            </tr>
        `;
    }
}


// ==========================================
// CLASE CSS SEGÚN ESTADO
// ==========================================

function obtenerClaseEstado(
    estado) {

    const valor =
        (estado || "")
            .toUpperCase();


    switch (valor) {

        case "PENDIENTE_PAGO":
            return "estado-pendiente";

        case "SEPARADA":
            return "estado-separada";

        case "CONFIRMADA":
            return "estado-confirmada";

        case "ANULADA":
            return "estado-anulada";

        case "PERDIDA":
            return "estado-perdida";

        default:
            return "";
    }
}


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(
    fecha) {

    if (!fecha) {

        return "";
    }


    const partes =
        fecha.split("-");


    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


// ==========================================
// FORMATEAR HORA
// ==========================================

function formatearHora(
    hora) {

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


    return `${horas}:${minutos} ${periodo}`;
}


// ==========================================
// INICIO
// ==========================================

listarMisCitas();