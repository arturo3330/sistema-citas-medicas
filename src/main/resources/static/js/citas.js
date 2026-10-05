// ==========================================
// VARIABLES GLOBALES
// ==========================================

let especialidades = [];

let politica = null;

let horarioSeleccionado = null;

const MONTO_MAXIMO = 999999.99;

const MAX_OPERACION = 3;


// ==========================================
// CARGAR POLÍTICA
// ==========================================

async function cargarPolitica() {

    try {

        const respuesta =
            await fetch(
                "/politica-clinica"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudo cargar la política clínica"
            );
        }


        politica =
            await respuesta.json();


    } catch (error) {

        console.error(
            error
        );


        politica =
            null;
    }
}


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


    ocultarDatosPago();


    horarioSeleccionado =
        null;


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


    horarioSeleccionado =
        null;


    ocultarDatosPago();


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


            const option =
                document.createElement(
                    "option"
                );


            option.value =
                h.idHorario;


            option.textContent =
                fecha
                + " | "
                + horaInicio
                + " - "
                + horaFin
                + " | "
                + medico;


            /*
             * Guardamos los datos del horario
             * dentro de la opción.
             */

            option.dataset.horario =
                JSON.stringify(
                    h
                );


            select.appendChild(
                option
            );
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
// CAMBIAR HORARIO
// ==========================================

function cambiarHorario() {

    const select =
        document.getElementById(
            "horario"
        );


    const option =
        select.options[
            select.selectedIndex
            ];


    if (
        !select.value
        ||
        !option
        ||
        !option.dataset.horario
    ) {

        horarioSeleccionado =
            null;


        ocultarDatosPago();


        return;
    }


    try {

        horarioSeleccionado =
            JSON.parse(
                option.dataset.horario
            );


        mostrarDatosPago();


    } catch (error) {

        console.error(
            error
        );


        horarioSeleccionado =
            null;


        ocultarDatosPago();
    }
}


// ==========================================
// MOSTRAR DATOS DEL PAGO
// ==========================================

function mostrarDatosPago() {

    const idEspecialidad =
        document.getElementById(
            "especialidad"
        ).value;


    const especialidad =
        especialidades.find(
            e =>
                Number(
                    e.idEspecialidad
                )
                ===
                Number(
                    idEspecialidad
                )
        );


    if (
        !especialidad
    ) {

        ocultarDatosPago();

        return;
    }


    const costo =
        Number(
            especialidad.costoConsulta
            || 0
        );


    const porcentaje =
        politica
            ? Number(
                politica
                    .porcentajePagoMinimo
                || 0
            )
            : 0;


    const minimo =
        redondearDinero(
            costo
            *
            porcentaje
            /
            100
        );


    document.getElementById(
        "detalleCosto"
    ).innerText =
        dinero(
            costo
        );


    document.getElementById(
        "detallePagoMinimo"
    ).innerText =
        dinero(
            minimo
        );


    document.getElementById(
        "detallePorcentajePago"
    ).innerText =
        porcentaje;


    document.getElementById(
        "textoPagoMinimo"
    ).innerText =
        dinero(
            minimo
        );


    const montoInput =
        document.getElementById(
            "montoPago"
        );


    montoInput.value =
        dinero(
            minimo
        );


    montoInput.min =
        minimo.toFixed(
            2
        );


    montoInput.max =
        Math.min(
            costo,
            MONTO_MAXIMO
        ).toFixed(
            2
        );


    document.getElementById(
        "detalleReserva"
    ).style.display =
        "flex";


    document.getElementById(
        "seccionPagoReserva"
    ).style.display =
        "block";
}


// ==========================================
// OCULTAR DATOS DEL PAGO
// ==========================================

function ocultarDatosPago() {

    const detalle =
        document.getElementById(
            "detalleReserva"
        );


    const pago =
        document.getElementById(
            "seccionPagoReserva"
        );


    if (detalle) {

        detalle.style.display =
            "none";
    }


    if (pago) {

        pago.style.display =
            "none";
    }


    const monto =
        document.getElementById(
            "montoPago"
        );


    const metodo =
        document.getElementById(
            "metodoPago"
        );


    const operacion =
        document.getElementById(
            "numeroOperacion"
        );


    if (monto) {

        monto.value =
            "";
    }


    if (metodo) {

        metodo.value =
            "";
    }


    if (operacion) {

        operacion.value =
            "";
    }
}


// ==========================================
// ACTUALIZAR HORARIOS ACTUALES
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


        ocultarDatosPago();


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
// RESERVAR CITA + PAGO
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


    const montoTexto =
        document.getElementById(
            "montoPago"
        ).value.trim();


    const metodoPago =
        document.getElementById(
            "metodoPago"
        ).value;


    const numeroOperacion =
        document.getElementById(
            "numeroOperacion"
        ).value.trim();


    mostrarMensaje(
        "",
        false
    );


    // ======================================
    // PACIENTE
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


    // ======================================
    // ESPECIALIDAD
    // ======================================

    if (
        idEspecialidad === ""
    ) {

        mostrarMensaje(
            "Seleccione una especialidad.",
            false
        );


        return;
    }


    // ======================================
    // HORARIO
    // ======================================

    if (
        idHorario === ""
    ) {

        mostrarMensaje(
            "Seleccione un horario disponible.",
            false
        );


        return;
    }


    if (
        !horarioSeleccionado
    ) {

        mostrarMensaje(
            "El horario seleccionado no es válido.",
            false
        );


        return;
    }


    // ======================================
    // ESPECIALIDAD SELECCIONADA
    // ======================================

    const especialidad =
        especialidades.find(
            e =>
                Number(
                    e.idEspecialidad
                )
                ===
                Number(
                    idEspecialidad
                )
        );


    if (
        !especialidad
    ) {

        mostrarMensaje(
            "No se pudo obtener la especialidad seleccionada.",
            false
        );


        return;
    }


    const costo =
        Number(
            especialidad.costoConsulta
            || 0
        );


    if (
        !Number.isFinite(
            costo
        )
        ||
        costo <= 0
    ) {

        mostrarMensaje(
            "La especialidad no tiene un costo de consulta válido.",
            false
        );


        return;
    }


    // ======================================
    // MONTO
    // ======================================

    if (
        montoTexto === ""
    ) {

        mostrarMensaje(
            "Debe ingresar el monto del pago.",
            false
        );


        return;
    }


    const monto =
        Number(
            montoTexto
        );


    if (
        !Number.isFinite(
            monto
        )
        ||
        monto <= 0
    ) {

        mostrarMensaje(
            "Ingrese un monto de pago válido.",
            false
        );


        return;
    }


    if (
        monto > MONTO_MAXIMO
    ) {

        mostrarMensaje(
            "El monto no puede ser mayor que S/ "
            + dinero(
                MONTO_MAXIMO
            )
            + ".",
            false
        );


        return;
    }


    if (
        !tieneMaximoDosDecimales(
            montoTexto
        )
    ) {

        mostrarMensaje(
            "El monto solo puede tener hasta 2 decimales.",
            false
        );


        return;
    }


    if (
        monto > costo
    ) {

        mostrarMensaje(
            "El monto no puede ser mayor que el costo de la consulta: S/ "
            + dinero(
                costo
            )
            + ".",
            false
        );


        return;
    }


    // ======================================
    // PAGO MÍNIMO
    // ======================================

    if (
        !politica
    ) {

        mostrarMensaje(
            "No se pudo obtener la política de pago de la clínica.",
            false
        );


        return;
    }


    const porcentaje =
        Number(
            politica
                .porcentajePagoMinimo
            || 0
        );


    const minimo =
        redondearDinero(
            costo
            *
            porcentaje
            /
            100
        );


    if (
        monto < minimo
    ) {

        mostrarMensaje(
            "El pago inicial debe ser como mínimo S/ "
            + dinero(
                minimo
            )
            + " ("
            + porcentaje
            + "% del costo de la consulta).",
            false
        );


        return;
    }


    // ======================================
    // MÉTODO DE PAGO
    // ======================================

    if (
        metodoPago === ""
    ) {

        mostrarMensaje(
            "Seleccione un método de pago.",
            false
        );


        return;
    }


    // ======================================
    // NÚMERO DE OPERACIÓN
    // ======================================

    if (
        numeroOperacion === ""
    ) {

        mostrarMensaje(
            "Ingrese el número de operación.",
            false
        );


        return;
    }


    if (
        !/^\d+$/.test(
            numeroOperacion
        )
    ) {

        mostrarMensaje(
            "El número de operación solo puede contener números.",
            false
        );


        return;
    }


    if (
        numeroOperacion.length
        > MAX_OPERACION
    ) {

        mostrarMensaje(
            "El número de operación debe tener como máximo 3 dígitos.",
            false
        );


        return;
    }


    // ======================================
    // CONFIRMAR
    // ======================================

    const confirmar =
        confirm(
            "¿Confirmar la reserva?\n\n"
            +
            "Costo: S/ "
            +
            dinero(
                costo
            )
            +
            "\n"
            +
            "Pago inicial: S/ "
            +
            dinero(
                monto
            )
        );


    if (!confirmar) {

        return;
    }


    const boton =
        document.getElementById(
            "btnReservar"
        );


    boton.disabled =
        true;


    try {

        // ======================================
        // ENVIAR RESERVA + PAGO
        // ======================================

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
                                    ),

                                monto:
                                    redondearDinero(
                                        monto
                                    ),

                                metodoPago:
                                metodoPago,

                                numeroOperacion:
                                numeroOperacion
                            }
                        )
                }
            );


        const contenido =
            await respuesta.text();


        // ======================================
        // CORRECTO
        // ======================================

        if (
            respuesta.ok
        ) {

            let cita =
                null;


            try {

                cita =
                    JSON.parse(
                        contenido
                    );

            } catch (error) {

                /*
                 * Si el backend no devuelve JSON,
                 * igualmente consideramos correcta
                 * la operación.
                 */
            }


            if (
                cita
                &&
                Number(
                    cita.saldo
                ) === 0
            ) {

                mostrarMensaje(
                    "Cita registrada y pagada completamente.",
                    true
                );

            } else {

                mostrarMensaje(
                    "Cita registrada correctamente. "
                    +
                    "El pago inicial fue registrado.",
                    true
                );
            }


            alert(
                "Reserva registrada correctamente."
                +
                "\n\n"
                +
                "Pago registrado: S/ "
                +
                dinero(
                    monto
                )
            );


            limpiarReserva();


            await actualizarHorariosActuales();


            await listarCitas();


            boton.disabled =
                false;


            return;
        }


        // ======================================
        // HORARIO OCUPADO
        // ======================================

        if (
            respuesta.status === 400
            &&
            contenido
                .toLowerCase()
                .includes(
                    "horario ya ocupado"
                )
        ) {

            mostrarMensaje(
                "Otro usuario reservó este horario antes que usted. "
                +
                "Seleccione otro horario disponible.",
                false
            );


            alert(
                "Horario no disponible\n\n"
                +
                "Otro usuario reservó este horario antes que usted.\n\n"
                +
                "Seleccione otro horario disponible."
            );


            horarioSeleccionado =
                null;


            ocultarDatosPago();


            await actualizarHorariosActuales();


            boton.disabled =
                false;


            return;
        }


        // ======================================
        // OTRO ERROR DEL BACKEND
        // ======================================

        mostrarMensaje(
            contenido
            ||
            "No se pudo registrar la cita.",
            false
        );


        await actualizarHorariosActuales();


    } catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            "No se pudo conectar con el servidor.",
            false
        );


    } finally {

        boton.disabled =
            false;
    }
}


// ==========================================
// LIMPIAR RESERVA
// ==========================================

function limpiarReserva() {

    document.getElementById(
        "paciente"
    ).value =
        "";


    document.getElementById(
        "especialidad"
    ).value =
        "";


    const horario =
        document.getElementById(
            "horario"
        );


    horario.innerHTML = `
        <option value="">
            Seleccione una especialidad primero
        </option>
    `;


    horario.disabled =
        true;


    horarioSeleccionado =
        null;


    ocultarDatosPago();
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


        if (
            respuesta.ok
        ) {

            mostrarMensaje(
                contenido
                ||
                "Cita eliminada correctamente.",
                true
            );


            await actualizarHorariosActuales();


            await listarCitas();


            return;
        }


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
// FORMATEAR DINERO
// ==========================================

function dinero(
    valor
) {

    const numero =
        Number(
            valor
        );


    if (
        !Number.isFinite(
            numero
        )
    ) {

        return "0.00";
    }


    return numero.toFixed(
        2
    );
}


// ==========================================
// REDONDEAR DINERO
// ==========================================

function redondearDinero(
    valor
) {

    return Math.round(
            (
                Number(valor)
                +
                Number.EPSILON
            )
            *
            100
        )
        /
        100;
}


// ==========================================
// VALIDAR DECIMALES
// ==========================================

function tieneMaximoDosDecimales(
    valor
) {

    return /^\d+(\.\d{1,2})?$/.test(
        String(
            valor
        )
    );
}


// ==========================================
// NÚMERO DE OPERACIÓN
// SOLO NÚMEROS Y MÁXIMO 3
// ==========================================

function limitarNumeroOperacion() {

    const input =
        document.getElementById(
            "numeroOperacion"
        );


    if (!input) {

        return;
    }


    input.value =
        input.value
            .replace(
                /\D/g,
                ""
            )
            .slice(
                0,
                MAX_OPERACION
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
// EVENTOS
// ==========================================

document
    .getElementById(
        "especialidad"
    )
    .addEventListener(
        "change",
        cambiarEspecialidad
    );


document
    .getElementById(
        "horario"
    )
    .addEventListener(
        "change",
        cambiarHorario
    );


document
    .getElementById(
        "numeroOperacion"
    )
    .addEventListener(
        "input",
        limitarNumeroOperacion
    );


// ==========================================
// INICIAR
// ==========================================

async function iniciar() {

    await cargarPolitica();

    await cargarPacientes();

    await cargarEspecialidades();

    await listarCitas();
}


iniciar();