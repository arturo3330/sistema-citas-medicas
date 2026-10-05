// ==========================================
// VARIABLES GLOBALES
// ==========================================

let citas = [];

let politica = null;

let citaSeleccionada = null;


// ==========================================
// CONSTANTES
// ==========================================

const MONTO_MAXIMO =
    999999.99;

const MAX_OPERACION =
    3;


// ==========================================
// FORMATEAR DINERO
// ==========================================

function dinero(
    valor
) {

    const numero =
        Number(
            valor || 0
        );


    return numero.toFixed(
        2
    );
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
// MOSTRAR MENSAJE
// ==========================================

function mostrarMensaje(
    texto,
    tipo = "error"
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


    if (
        tipo === "ok"
    ) {

        mensaje.style.color =
            "#15803d";

    } else {

        mensaje.style.color =
            "#b3261e";
    }
}


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
                "No se pudo cargar la política"
            );
        }


        politica =
            await respuesta.json();


        const porcentaje =
            document.getElementById(
                "porcentajePolitica"
            );


        if (
            porcentaje
        ) {

            porcentaje.innerText =
                politica
                    .porcentajePagoMinimo
                ?? 0;
        }


    } catch (error) {

        console.error(
            error
        );
    }
}


// ==========================================
// CARGAR CITAS
// ==========================================

async function cargarCitas() {

    const select =
        document.getElementById(
            "cita"
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


        citas =
            await respuesta.json();


        /*
         * Solo mostramos citas:
         *
         * - no anuladas
         * - no perdidas
         * - con saldo pendiente
         */

        const pendientes =
            citas.filter(
                c => {

                    const estado =
                        (
                            c.estado
                            || ""
                        ).toUpperCase();


                    const saldo =
                        Number(
                            c.saldo
                            || 0
                        );


                    return (
                        estado !== "ANULADA"
                        &&
                        estado !== "PERDIDA"
                        &&
                        saldo > 0
                    );
                }
            );


        select.innerHTML = `
            <option value="">
                Seleccione una cita
            </option>
        `;


        if (
            pendientes.length === 0
        ) {

            select.innerHTML = `
                <option value="">
                    No hay citas pendientes de pago
                </option>
            `;


            select.disabled =
                true;


            return;
        }


        pendientes.forEach(
            c => {

                const paciente =
                    c.paciente
                        ? c.paciente.nombre
                        : "-";


                const especialidad =
                    c.horario
                    &&
                    c.horario.medico
                    &&
                    c.horario.medico.especialidad
                        ? c.horario
                            .medico
                            .especialidad
                            .nombre
                        : "-";


                select.innerHTML += `
                    <option value="${c.idCita}">
                        Cita #${c.idCita}
                        -
                        ${escaparTexto(
                    paciente
                )}
                        -
                        ${escaparTexto(
                    especialidad
                )}
                    </option>
                `;
            }
        );


        select.disabled =
            false;


    } catch (error) {

        console.error(
            error
        );


        select.innerHTML = `
            <option value="">
                Error al cargar citas
            </option>
        `;


        select.disabled =
            true;
    }
}


// ==========================================
// CAMBIAR CITA
// ==========================================

function cambiarCita() {

    const id =
        document.getElementById(
            "cita"
        ).value;


    const detalle =
        document.getElementById(
            "detalleCita"
        );


    const boton =
        document.getElementById(
            "btnPagar"
        );


    const montoInput =
        document.getElementById(
            "monto"
        );


    if (
        id === ""
    ) {

        citaSeleccionada =
            null;


        detalle.style.display =
            "none";


        boton.disabled =
            true;


        montoInput.value =
            "";


        return;
    }


    citaSeleccionada =
        citas.find(
            c =>
                Number(
                    c.idCita
                )
                ===
                Number(
                    id
                )
        );


    if (
        !citaSeleccionada
    ) {

        boton.disabled =
            true;

        return;
    }


    const horario =
        citaSeleccionada.horario;


    const medico =
        horario
            ? horario.medico
            : null;


    const especialidad =
        medico
            ? medico.especialidad
            : null;


    // ======================================
    // DETALLE GENERAL
    // ======================================

    document.getElementById(
        "detallePaciente"
    ).innerText =
        citaSeleccionada.paciente
            ? citaSeleccionada
                .paciente
                .nombre
            : "-";


    document.getElementById(
        "detalleEspecialidad"
    ).innerText =
        especialidad
            ? especialidad.nombre
            : "-";


    document.getElementById(
        "detalleMedico"
    ).innerText =
        medico
            ? medico.nombre
            : "-";


    document.getElementById(
        "detalleFecha"
    ).innerText =
        horario
            ? formatearFecha(
                horario.fecha
            )
            : "-";


    document.getElementById(
        "detalleTotal"
    ).innerText =
        dinero(
            citaSeleccionada
                .montoTotal
        );


    document.getElementById(
        "detallePagado"
    ).innerText =
        dinero(
            citaSeleccionada
                .montoPagado
        );


    document.getElementById(
        "detalleSaldo"
    ).innerText =
        dinero(
            citaSeleccionada
                .saldo
        );


    // ======================================
    // PRIMER PAGO O PAGO POSTERIOR
    // ======================================

    const montoPagado =
        Number(
            citaSeleccionada
                .montoPagado
            || 0
        );


    const saldo =
        Number(
            citaSeleccionada
                .saldo
            || 0
        );


    const montoTotal =
        Number(
            citaSeleccionada
                .montoTotal
            || 0
        );


    const esPrimerPago =
        montoPagado === 0;


    let minimoInicial =
        0;


    if (
        esPrimerPago
        &&
        politica
    ) {

        minimoInicial =
            montoTotal
            *
            Number(
                politica
                    .porcentajePagoMinimo
                || 0
            )
            / 100;
    }


    const detalleMinimo =
        document.getElementById(
            "detalleMinimo"
        );


    if (
        esPrimerPago
    ) {

        detalleMinimo.innerText =
            dinero(
                minimoInicial
            );


        montoInput.value =
            dinero(
                minimoInicial
            );


        montoInput.min =
            dinero(
                minimoInicial
            );

    } else {

        detalleMinimo.innerText =
            "No aplica";


        montoInput.value =
            "";


        montoInput.min =
            "0.01";
    }


    // ======================================
    // MÁXIMO PERMITIDO
    // ======================================

    const maximoPermitido =
        Math.min(
            saldo,
            MONTO_MAXIMO
        );


    montoInput.max =
        dinero(
            maximoPermitido
        );


    detalle.style.display =
        "block";


    boton.disabled =
        false;
}


// ==========================================
// REGISTRAR PAGO
// ==========================================

async function registrarPago() {

    mostrarMensaje(
        "",
        "error"
    );


    if (
        !citaSeleccionada
    ) {

        mostrarMensaje(
            "Seleccione una cita."
        );

        return;
    }


    const montoTexto =
        document.getElementById(
            "monto"
        ).value.trim();


    const monto =
        Number(
            montoTexto
        );


    const metodoPago =
        document.getElementById(
            "metodoPago"
        ).value;


    const numeroOperacion =
        document.getElementById(
            "numeroOperacion"
        ).value.trim();


    // ======================================
    // VALIDAR MONTO
    // ======================================

    if (
        montoTexto === ""
        ||
        Number.isNaN(
            monto
        )
        ||
        monto <= 0
    ) {

        mostrarMensaje(
            "Ingrese un monto válido mayor que cero."
        );

        return;
    }


    // ======================================
    // MÁXIMO GLOBAL
    // ======================================

    if (
        monto > MONTO_MAXIMO
    ) {

        mostrarMensaje(
            "El monto máximo permitido es S/ "
            + dinero(
                MONTO_MAXIMO
            )
            + "."
        );

        return;
    }


    // ======================================
    // MÁXIMO 2 DECIMALES
    // ======================================

    if (
        !validarMaximoDosDecimales(
            montoTexto
        )
    ) {

        mostrarMensaje(
            "El monto debe tener como máximo 2 decimales."
        );

        return;
    }


    // ======================================
    // SALDO
    // ======================================

    const saldo =
        Number(
            citaSeleccionada
                .saldo
            || 0
        );


    if (
        monto > saldo
    ) {

        mostrarMensaje(
            "El monto no puede ser mayor que el saldo pendiente de S/ "
            + dinero(
                saldo
            )
            + "."
        );

        return;
    }


    // ======================================
    // PRIMER PAGO
    // ======================================

    const montoPagado =
        Number(
            citaSeleccionada
                .montoPagado
            || 0
        );


    const esPrimerPago =
        montoPagado === 0;


    if (
        esPrimerPago
        &&
        politica
    ) {

        const montoTotal =
            Number(
                citaSeleccionada
                    .montoTotal
                || 0
            );


        const minimo =
            montoTotal
            *
            Number(
                politica
                    .porcentajePagoMinimo
                || 0
            )
            / 100;


        if (
            monto < minimo
        ) {

            mostrarMensaje(
                "El primer pago debe ser como mínimo S/ "
                + dinero(
                    minimo
                )
                + " ("
                + politica
                    .porcentajePagoMinimo
                + "% del total)."
            );

            return;
        }
    }


    // ======================================
    // MÉTODO DE PAGO
    // ======================================

    if (
        metodoPago === ""
    ) {

        mostrarMensaje(
            "Seleccione un método de pago."
        );

        return;
    }


    // ======================================
    // NÚMERO DE OPERACIÓN OBLIGATORIO
    // ======================================

    if (
        numeroOperacion === ""
    ) {

        mostrarMensaje(
            "Ingrese el número de operación."
        );

        return;
    }


    // ======================================
    // NÚMERO DE OPERACIÓN SOLO NÚMEROS
    // ======================================

    if (
        !/^\d+$/.test(
            numeroOperacion
        )
    ) {

        mostrarMensaje(
            "El número de operación solo puede contener números."
        );

        return;
    }


    // ======================================
    // NÚMERO DE OPERACIÓN MÁXIMO 3 CIFRAS
    // ======================================

    if (
        numeroOperacion.length
        > MAX_OPERACION
    ) {

        mostrarMensaje(
            "El número de operación debe tener como máximo 3 cifras."
        );

        return;
    }


    // ======================================
    // CONFIRMACIÓN
    // ======================================

    const confirmar =
        confirm(
            "¿Registrar pago de S/ "
            + dinero(
                monto
            )
            + "?"
        );


    if (
        !confirmar
    ) {

        return;
    }


    const boton =
        document.getElementById(
            "btnPagar"
        );


    boton.disabled =
        true;


    try {

        const respuesta =
            await fetch(
                "/pagos",
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

                                idCita:
                                citaSeleccionada
                                    .idCita,

                                monto:
                                monto,

                                metodoPago:
                                metodoPago,

                                numeroOperacion:
                                numeroOperacion
                            }
                        )
                }
            );


        if (
            !respuesta.ok
        ) {

            const texto =
                await respuesta.text();


            mostrarMensaje(
                texto
                ||
                "No se pudo registrar el pago."
            );


            boton.disabled =
                false;


            return;
        }


        const recibo =
            await respuesta.json();


        // ======================================
        // MENSAJE SEGÚN ESTADO
        // ======================================

        if (
            Number(
                recibo.saldo
            ) === 0
        ) {

            mostrarMensaje(
                "Pago registrado correctamente. "
                +
                "La cita quedó completamente pagada.",
                "ok"
            );

        } else {

            mostrarMensaje(
                "Pago registrado correctamente. "
                +
                "Saldo pendiente: S/ "
                +
                dinero(
                    recibo.saldo
                )
                +
                ".",
                "ok"
            );
        }


        limpiarFormulario();


        await cargarCitas();


        await listarPagos();


    } catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            "No se pudo conectar con el servidor."
        );


        boton.disabled =
            false;
    }
}


// ==========================================
// VALIDAR MÁXIMO 2 DECIMALES
// ==========================================

function validarMaximoDosDecimales(
    valor
) {

    /*
     * Acepta:
     *
     * 10
     * 10.5
     * 10.50
     *
     * Rechaza:
     *
     * 10.555
     */

    return /^\d+(\.\d{1,2})?$/.test(
        valor
    );
}


// ==========================================
// LIMITAR NÚMERO DE OPERACIÓN
// ==========================================

function configurarNumeroOperacion() {

    const input =
        document.getElementById(
            "numeroOperacion"
        );


    if (
        !input
    ) {

        return;
    }


    input.addEventListener(
        "input",
        function () {

            this.value =
                this.value
                    .replace(
                        /[^0-9]/g,
                        ""
                    )
                    .slice(
                        0,
                        MAX_OPERACION
                    );
        }
    );
}


// ==========================================
// CONTROL ADICIONAL DEL MONTO
// ==========================================

function configurarMonto() {

    const input =
        document.getElementById(
            "monto"
        );


    if (
        !input
    ) {

        return;
    }


    input.addEventListener(
        "input",
        function () {

            const valor =
                this.value;


            if (
                valor === ""
            ) {

                return;
            }


            const numero =
                Number(
                    valor
                );


            if (
                !Number.isNaN(
                    numero
                )
                &&
                numero > MONTO_MAXIMO
            ) {

                this.value =
                    MONTO_MAXIMO
                        .toFixed(
                            2
                        );
            }


            /*
             * Si el usuario escribe más
             * de dos decimales, los recortamos.
             */

            if (
                valor.includes(
                    "."
                )
            ) {

                const partes =
                    valor.split(
                        "."
                    );


                if (
                    partes.length > 1
                    &&
                    partes[1].length > 2
                ) {

                    this.value =
                        partes[0]
                        +
                        "."
                        +
                        partes[1]
                            .substring(
                                0,
                                2
                            );
                }
            }
        }
    );
}


// ==========================================
// LISTAR PAGOS / RECIBOS
// ==========================================

async function listarPagos() {

    const tabla =
        document.getElementById(
            "tablaPagos"
        );


    try {

        const respuesta =
            await fetch(
                "/pagos"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los pagos"
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

                    <td colspan="10">
                        No hay recibos registrados
                    </td>

                </tr>
            `;


            return;
        }


        datos.forEach(
            r => {

                const paciente =
                    r.cita
                    &&
                    r.cita.paciente
                        ? r.cita.paciente.nombre
                        : "-";


                tabla.innerHTML += `
                    <tr>

                        <td>
                            ${r.idRecibo}
                        </td>

                        <td>
                            ${
                    r.cita
                        ? r.cita.idCita
                        : "-"
                }
                        </td>

                        <td>
                            ${escaparTexto(
                    paciente
                )}
                        </td>

                        <td>
                            S/ ${dinero(
                    r.montoTotal
                )}
                        </td>

                        <td>
                            S/ ${dinero(
                    r.montoPagado
                )}
                        </td>

                        <td>
                            S/ ${dinero(
                    r.saldo
                )}
                        </td>

                        <td>
                            ${dinero(
                    r.porcentajePagado
                )} %
                        </td>

                        <td>
                            ${escaparTexto(
                    r.metodoPago
                    || "-"
                )}
                        </td>

                        <td>
                            ${escaparTexto(
                    r.numeroOperacion
                    || "-"
                )}
                        </td>

                        <td>
                            ${escaparTexto(
                    r.estado
                    || "-"
                )}
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

                <td colspan="10">
                    Error al cargar pagos
                </td>

            </tr>
        `;
    }
}


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function limpiarFormulario() {

    citaSeleccionada =
        null;


    document.getElementById(
        "cita"
    ).value =
        "";


    document.getElementById(
        "detalleCita"
    ).style.display =
        "none";


    const montoInput =
        document.getElementById(
            "monto"
        );


    montoInput.value =
        "";


    montoInput.min =
        "0.01";


    montoInput.max =
        MONTO_MAXIMO
            .toFixed(
                2
            );


    document.getElementById(
        "metodoPago"
    ).value =
        "";


    document.getElementById(
        "numeroOperacion"
    ).value =
        "";


    document.getElementById(
        "btnPagar"
    ).disabled =
        true;
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
// INICIO
// ==========================================

async function iniciar() {

    configurarNumeroOperacion();

    configurarMonto();


    await cargarPolitica();

    await cargarCitas();

    await listarPagos();
}


iniciar();