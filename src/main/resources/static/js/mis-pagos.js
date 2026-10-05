const usuarioPaciente =
    obtenerUsuarioSesion();


// ==========================================
// VALIDAR PACIENTE
// ==========================================

if (
    !esPaciente()
    ||
    !usuarioPaciente
    ||
    !usuarioPaciente.paciente
    ||
    !usuarioPaciente.paciente.idPaciente
) {

    alert(
        "Este usuario no tiene un paciente asociado."
    );


    window.location.href =
        "dashboard.html";
}


// ==========================================
// MOSTRAR NOMBRE
// ==========================================

const nombrePaciente =
    document.getElementById(
        "nombrePaciente"
    );


if (
    nombrePaciente
    &&
    usuarioPaciente
    &&
    usuarioPaciente.paciente
) {

    nombrePaciente.innerText =
        usuarioPaciente
            .paciente
            .nombre;
}


// ==========================================
// FORMATEAR DINERO
// ==========================================

function dinero(valor) {

    return Number(
        valor || 0
    ).toFixed(2);
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
// FORMATEAR ESTADO DE CITA
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
// CLASE DEL ESTADO DE CITA
// ==========================================

function obtenerClaseEstadoCita(
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
// FORMATEAR ESTADO DEL PAGO
// ==========================================

function formatearEstadoPago(
    estado) {

    const valor =
        (estado || "")
            .toUpperCase();


    switch (valor) {

        case "PENDIENTE":
            return "Sin pago";

        case "PARCIAL":
            return "Pago parcial";

        case "PAGADO":
            return "Pagado";

        default:
            return estado || "-";
    }
}


// ==========================================
// CLASE DEL ESTADO DE PAGO
// ==========================================

function obtenerClaseEstadoPago(
    estado) {

    const valor =
        (estado || "")
            .toUpperCase();


    switch (valor) {

        case "PENDIENTE":
            return "estado-pago-pendiente";

        case "PARCIAL":
            return "estado-pago-parcial";

        case "PAGADO":
            return "estado-pago-completo";

        default:
            return "";
    }
}


// ==========================================
// BUSCAR RECIBO DE UNA CITA
// ==========================================

async function buscarRecibo(
    idCita
) {

    try {

        const respuesta =
            await fetch(
                "/pagos/cita/"
                + idCita
            );


        /*
         * Si no existe recibo,
         * significa que todavía
         * no se registró ningún pago.
         */
        if (!respuesta.ok) {

            return null;
        }


        return await respuesta.json();


    } catch (error) {

        console.error(
            error
        );


        return null;
    }
}


// ==========================================
// CARGAR MIS PAGOS
// ==========================================

async function cargarMisPagos() {

    const tabla =
        document.getElementById(
            "tablaMisPagos"
        );


    if (!tabla) {

        return;
    }


    tabla.innerHTML = `

        <tr>

            <td colspan="9">
                Cargando información...
            </td>

        </tr>
    `;


    try {

        const idPaciente =
            usuarioPaciente
                .paciente
                .idPaciente;


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


        const citas =
            await respuesta.json();


        tabla.innerHTML =
            "";


        // ======================================
        // SIN CITAS
        // ======================================

        if (
            citas.length === 0
        ) {

            tabla.innerHTML = `

                <tr>

                    <td colspan="9">
                        No tienes citas registradas.
                    </td>

                </tr>
            `;


            return;
        }


        // ======================================
        // ORDENAR MÁS RECIENTES PRIMERO
        // ======================================

        citas.sort(
            (a, b) => {

                const fechaA =
                    a.horario
                        ? `${a.horario.fecha}T${a.horario.hora}`
                        : "";


                const fechaB =
                    b.horario
                        ? `${b.horario.fecha}T${b.horario.hora}`
                        : "";


                return fechaB.localeCompare(
                    fechaA
                );
            }
        );


        // ======================================
        // MOSTRAR CADA CITA
        // ======================================

        for (
            const cita of citas
            ) {

            const recibo =
                await buscarRecibo(
                    cita.idCita
                );


            const horario =
                cita.horario;


            const medico =
                horario
                    ? horario.medico
                    : null;


            const especialidad =
                medico
                    ? medico.especialidad
                    : null;


            // ==================================
            // ESTADO DEL PAGO
            // ==================================

            let estadoPago =
                "PENDIENTE";


            if (
                recibo
                &&
                recibo.estado
            ) {

                estadoPago =
                    recibo.estado;
            }


            tabla.innerHTML += `

                <tr>

                    <td>
                        #${cita.idCita}
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
                medico
                    ? medico.nombre
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
                        S/ ${dinero(
                cita.montoTotal
            )}
                    </td>


                    <td>
                        S/ ${dinero(
                cita.montoPagado
            )}
                    </td>


                    <td>
                        S/ ${dinero(
                cita.saldo
            )}
                    </td>


                    <td>

                        <span class="
                            estado-cita
                            ${obtenerClaseEstadoCita(
                cita.estado
            )}
                        ">

                            ${formatearEstadoCita(
                cita.estado
            )}

                        </span>

                    </td>


                    <td>

                        <span class="
                            estado-pago
                            ${obtenerClaseEstadoPago(
                estadoPago
            )}
                        ">

                            ${formatearEstadoPago(
                estadoPago
            )}

                        </span>

                    </td>

                </tr>
            `;
        }


    } catch (error) {

        console.error(
            error
        );


        tabla.innerHTML = `

            <tr>

                <td colspan="9">
                    No se pudo cargar la información de pagos.
                </td>

            </tr>
        `;
    }
}


// ==========================================
// INICIO
// ==========================================

cargarMisPagos();