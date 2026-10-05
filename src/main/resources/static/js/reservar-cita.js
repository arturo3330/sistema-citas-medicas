// ==========================================
// VARIABLES GLOBALES
// ==========================================

const usuarioPaciente =
    obtenerUsuarioSesion();

let especialidades = [];

let medicos = [];

let horariosMedico = [];

let horariosFecha = [];

let horarioSeleccionado = null;

let politica = null;


// ==========================================
// CONSTANTES
// ==========================================

const MONTO_MAXIMO =
    999999.99;

const MAX_OPERACION =
    3;


// ==========================================
// SEGURIDAD DE LA PÁGINA
// ==========================================

if (!esPaciente()) {

    window.location.href =
        "dashboard.html";
}


if (
    !usuarioPaciente
    ||
    !usuarioPaciente.paciente
    ||
    !usuarioPaciente
        .paciente
        .idPaciente
) {

    alert(
        "Este usuario no tiene un paciente asociado."
    );


    window.location.href =
        "dashboard.html";
}


// ==========================================
// DATOS DEL PACIENTE
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


    return `${partes[2]}/${partes[1]}/${partes[0]}`;
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


    return `${horas}:${minutos} ${periodo}`;
}


// ==========================================
// FORMATEAR DINERO
// ==========================================

function formatearDinero(
    valor
) {

    const numero =
        Number(
            valor
        );


    if (
        Number.isNaN(
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
// VALIDAR DECIMALES
// ==========================================

function tieneMaximoDosDecimales(
    valor
) {

    return /^\d+(\.\d{1,2})?$/
        .test(
            String(valor)
        );
}


// ==========================================
// VALIDAR SI EL HORARIO ES FUTURO
// ==========================================

function esHorarioFuturo(
    horario
) {

    if (
        !horario
        ||
        !horario.fecha
        ||
        !horario.hora
    ) {

        return false;
    }


    const fechaHora =
        new Date(
            `${horario.fecha}T${horario.hora}`
        );


    if (
        Number.isNaN(
            fechaHora.getTime()
        )
    ) {

        return false;
    }


    return fechaHora.getTime()
        >
        Date.now();
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
            "green";

    } else {

        mensaje.style.color =
            "red";
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
                "No se pudo cargar la política de la clínica"
            );
        }


        politica =
            await respuesta.json();


        if (
            !politica
            ||
            politica.porcentajePagoMinimo == null
        ) {

            throw new Error(
                "La política no tiene un porcentaje mínimo configurado"
            );
        }


    } catch (error) {

        console.error(
            error
        );


        politica =
            null;


        mostrarMensaje(
            "No se pudo cargar la política de pago de la clínica."
        );
    }
}


// ==========================================
// CALCULAR PAGO MÍNIMO
// ==========================================

function calcularPagoMinimo(
    costo
) {

    if (
        !politica
        ||
        politica.porcentajePagoMinimo == null
    ) {

        return 0;
    }


    const total =
        Number(
            costo
        );


    const porcentaje =
        Number(
            politica
                .porcentajePagoMinimo
        );


    if (
        Number.isNaN(total)
        ||
        Number.isNaN(porcentaje)
    ) {

        return 0;
    }


    /*
     * Redondeamos a 2 decimales.
     */
    return Number(
        (
            total
            *
            porcentaje
            /
            100
        ).toFixed(2)
    );
}


// ==========================================
// CARGAR ESPECIALIDADES
// ==========================================

async function cargarEspecialidades() {

    const select =
        document.getElementById(
            "especialidad"
        );


    if (!select) {

        return;
    }


    select.innerHTML = `
        <option value="">
            Cargando especialidades...
        </option>
    `;


    select.disabled =
        true;


    try {

        const respuesta =
            await fetch(
                "/especialidades"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las especialidades"
            );
        }


        especialidades =
            await respuesta.json();


        const activas =
            especialidades.filter(
                e =>
                    e.estado === true
            );


        select.innerHTML = `
            <option value="">
                Seleccione una especialidad
            </option>
        `;


        if (
            activas.length === 0
        ) {

            select.innerHTML = `
                <option value="">
                    No hay especialidades disponibles
                </option>
            `;


            select.disabled =
                true;


            return;
        }


        activas.forEach(
            e => {

                select.innerHTML += `
                    <option value="${e.idEspecialidad}">
                        ${e.nombre}
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


    reiniciarMedico();

    reiniciarFecha();

    reiniciarHorario();

    ocultarDetalle();

    ocultarPago();


    mostrarMensaje(
        ""
    );


    if (
        idEspecialidad === ""
    ) {

        return;
    }


    const selectMedico =
        document.getElementById(
            "medico"
        );


    selectMedico.innerHTML = `
        <option value="">
            Cargando médicos...
        </option>
    `;


    selectMedico.disabled =
        true;


    try {

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


        medicos =
            datos.filter(
                m =>

                    m.estado === true
                    &&
                    m.especialidad
                    &&
                    Number(
                        m.especialidad
                            .idEspecialidad
                    )
                    ===
                    Number(
                        idEspecialidad
                    )
            );


        selectMedico.innerHTML = `
            <option value="">
                Seleccione un médico
            </option>
        `;


        if (
            medicos.length === 0
        ) {

            selectMedico.innerHTML = `
                <option value="">
                    No hay médicos disponibles
                </option>
            `;


            selectMedico.disabled =
                true;


            return;
        }


        medicos.forEach(
            m => {

                selectMedico.innerHTML += `
                    <option value="${m.idMedico}">
                        ${m.nombre}
                    </option>
                `;
            }
        );


        selectMedico.disabled =
            false;


    } catch (error) {

        console.error(
            error
        );


        selectMedico.innerHTML = `
            <option value="">
                Error al cargar médicos
            </option>
        `;


        selectMedico.disabled =
            true;
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


    reiniciarFecha();

    reiniciarHorario();

    ocultarDetalle();

    ocultarPago();


    mostrarMensaje(
        ""
    );


    if (
        idMedico === ""
    ) {

        return;
    }


    const selectFecha =
        document.getElementById(
            "fecha"
        );


    selectFecha.innerHTML = `
        <option value="">
            Cargando fechas...
        </option>
    `;


    selectFecha.disabled =
        true;


    try {

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


        const datosHorarios =
            await respuesta.json();


        horariosMedico =
            datosHorarios.filter(
                horario =>
                    esHorarioFuturo(
                        horario
                    )
            );


        if (
            horariosMedico.length === 0
        ) {

            selectFecha.innerHTML = `
                <option value="">
                    No hay fechas disponibles
                </option>
            `;


            selectFecha.disabled =
                true;


            return;
        }


        // ======================================
        // FECHAS ÚNICAS
        // ======================================

        const fechasUnicas =
            [
                ...new Set(
                    horariosMedico.map(
                        h => h.fecha
                    )
                )
            ];


        fechasUnicas.sort();


        selectFecha.innerHTML = `
            <option value="">
                Seleccione una fecha
            </option>
        `;


        fechasUnicas.forEach(
            fecha => {

                const horarioEjemplo =
                    horariosMedico.find(
                        h =>
                            h.fecha === fecha
                    );


                const dia =
                    horarioEjemplo
                    &&
                    horarioEjemplo.diaSemana
                        ? horarioEjemplo
                            .diaSemana
                        : "";


                selectFecha.innerHTML += `
                    <option value="${fecha}">
                        ${
                    dia
                        ? dia + " - "
                        : ""
                }
                        ${formatearFecha(fecha)}
                    </option>
                `;
            }
        );


        selectFecha.disabled =
            false;


    } catch (error) {

        console.error(
            error
        );


        selectFecha.innerHTML = `
            <option value="">
                Error al cargar fechas
            </option>
        `;


        selectFecha.disabled =
            true;
    }
}


// ==========================================
// CAMBIAR FECHA
// ==========================================

async function cambiarFecha() {

    const idMedico =
        document.getElementById(
            "medico"
        ).value;


    const fecha =
        document.getElementById(
            "fecha"
        ).value;


    reiniciarHorario();

    ocultarDetalle();

    ocultarPago();


    mostrarMensaje(
        ""
    );


    if (
        idMedico === ""
        ||
        fecha === ""
    ) {

        return;
    }


    const selectHorario =
        document.getElementById(
            "horario"
        );


    selectHorario.innerHTML = `
        <option value="">
            Cargando horarios...
        </option>
    `;


    selectHorario.disabled =
        true;


    try {

        const respuesta =
            await fetch(
                "/horarios/disponibles/medico/"
                + idMedico
                + "/fecha/"
                + fecha
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los horarios"
            );
        }


        const datos =
            await respuesta.json();


        horariosFecha =
            datos.filter(
                horario =>
                    esHorarioFuturo(
                        horario
                    )
            );


        horariosFecha.sort(
            (a, b) =>

                (a.hora || "")
                    .localeCompare(
                        b.hora || ""
                    )
        );


        selectHorario.innerHTML = `
            <option value="">
                Seleccione una hora
            </option>
        `;


        if (
            horariosFecha.length === 0
        ) {

            selectHorario.innerHTML = `
                <option value="">
                    No hay horarios disponibles
                </option>
            `;


            selectHorario.disabled =
                true;


            return;
        }


        horariosFecha.forEach(
            h => {

                selectHorario.innerHTML += `
                    <option value="${h.idHorario}">
                        ${formatearHora(
                    h.hora
                )}
                        -
                        ${formatearHora(
                    h.horaFin
                )}
                    </option>
                `;
            }
        );


        selectHorario.disabled =
            false;


    } catch (error) {

        console.error(
            error
        );


        selectHorario.innerHTML = `
            <option value="">
                Error al cargar horarios
            </option>
        `;


        selectHorario.disabled =
            true;
    }
}


// ==========================================
// CAMBIAR HORARIO
// ==========================================

function cambiarHorario() {

    const idHorario =
        document.getElementById(
            "horario"
        ).value;


    const boton =
        document.getElementById(
            "btnReservar"
        );


    ocultarDetalle();

    ocultarPago();


    mostrarMensaje(
        ""
    );


    if (
        idHorario === ""
    ) {

        boton.disabled =
            true;


        horarioSeleccionado =
            null;


        return;
    }


    horarioSeleccionado =
        horariosFecha.find(
            h =>
                Number(
                    h.idHorario
                )
                ===
                Number(
                    idHorario
                )
        );


    if (
        !horarioSeleccionado
    ) {

        boton.disabled =
            true;


        return;
    }


    if (
        !esHorarioFuturo(
            horarioSeleccionado
        )
    ) {

        horarioSeleccionado =
            null;


        boton.disabled =
            true;


        mostrarMensaje(
            "El horario seleccionado ya no está disponible."
        );


        return;
    }


    mostrarDetalle();

    mostrarPago();


    boton.disabled =
        false;
}


// ==========================================
// MOSTRAR DETALLE
// ==========================================

function mostrarDetalle() {

    const idEspecialidad =
        document.getElementById(
            "especialidad"
        ).value;


    const idMedico =
        document.getElementById(
            "medico"
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


    const medico =
        medicos.find(
            m =>
                Number(
                    m.idMedico
                )
                ===
                Number(
                    idMedico
                )
        );


    if (
        !especialidad
        ||
        !medico
        ||
        !horarioSeleccionado
    ) {

        return;
    }


    // ======================================
    // ESPECIALIDAD
    // ======================================

    document.getElementById(
        "detalleEspecialidad"
    ).innerText =
        especialidad.nombre
        || "-";


    // ======================================
    // MÉDICO
    // ======================================

    document.getElementById(
        "detalleMedico"
    ).innerText =
        medico.nombre
        || "-";


    // ======================================
    // FECHA
    // ======================================

    document.getElementById(
        "detalleFecha"
    ).innerText =
        formatearFecha(
            horarioSeleccionado.fecha
        );


    // ======================================
    // HORA
    // ======================================

    document.getElementById(
        "detalleHora"
    ).innerText =
        `${formatearHora(
            horarioSeleccionado.hora
        )} - ${formatearHora(
            horarioSeleccionado.horaFin
        )}`;


    // ======================================
    // DURACIÓN
    // ======================================

    document.getElementById(
        "detalleDuracion"
    ).innerText =
        especialidad
            .tiempoAtencionMinutos
        ?? "-";


    // ======================================
    // COSTO TOTAL
    // ======================================

    const costo =
        Number(
            especialidad
                .costoConsulta
        );


    document.getElementById(
        "detalleCosto"
    ).innerText =
        formatearDinero(
            costo
        );


    // ======================================
    // POLÍTICA DE PAGO
    // ======================================

    const porcentaje =
        politica
        &&
        politica.porcentajePagoMinimo != null
            ? Number(
                politica
                    .porcentajePagoMinimo
            )
            : 0;


    const minimo =
        calcularPagoMinimo(
            costo
        );


    const detallePorcentaje =
        document.getElementById(
            "detallePorcentajePago"
        );


    if (
        detallePorcentaje
    ) {

        detallePorcentaje.innerText =
            porcentaje;
    }


    const detalleMinimo =
        document.getElementById(
            "detallePagoMinimo"
        );


    if (
        detalleMinimo
    ) {

        detalleMinimo.innerText =
            formatearDinero(
                minimo
            );
    }


    // ======================================
    // MOSTRAR DETALLE
    // ======================================

    document.getElementById(
        "detalleHorario"
    ).style.display =
        "block";
}


// ==========================================
// MOSTRAR SECCIÓN DE PAGO
// ==========================================

function mostrarPago() {

    const seccion =
        document.getElementById(
            "seccionPagoReserva"
        );


    const monto =
        document.getElementById(
            "montoPago"
        );


    const textoMinimo =
        document.getElementById(
            "textoPagoMinimo"
        );


    const metodo =
        document.getElementById(
            "metodoPago"
        );


    const operacion =
        document.getElementById(
            "numeroOperacion"
        );


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
        !seccion
        ||
        !monto
        ||
        !especialidad
        ||
        !politica
    ) {

        return;
    }


    const costo =
        Number(
            especialidad
                .costoConsulta
        );


    const minimo =
        calcularPagoMinimo(
            costo
        );


    // ======================================
    // MONTO PREDETERMINADO
    // ======================================

    monto.value =
        formatearDinero(
            minimo
        );


    monto.min =
        formatearDinero(
            minimo
        );


    /*
     * El máximo real será el menor entre:
     *
     * - costo de la consulta
     * - 999999.99
     */
    monto.max =
        formatearDinero(
            Math.min(
                costo,
                MONTO_MAXIMO
            )
        );


    if (
        textoMinimo
    ) {

        textoMinimo.innerText =
            formatearDinero(
                minimo
            );
    }


    if (
        metodo
    ) {

        metodo.value =
            "";
    }


    if (
        operacion
    ) {

        operacion.value =
            "";
    }


    seccion.style.display =
        "flex";
}


// ==========================================
// OCULTAR DETALLE
// ==========================================

function ocultarDetalle() {

    const detalle =
        document.getElementById(
            "detalleHorario"
        );


    const boton =
        document.getElementById(
            "btnReservar"
        );


    if (
        detalle
    ) {

        detalle.style.display =
            "none";
    }


    if (
        boton
    ) {

        boton.disabled =
            true;
    }


    horarioSeleccionado =
        null;
}


// ==========================================
// OCULTAR PAGO
// ==========================================

function ocultarPago() {

    const seccion =
        document.getElementById(
            "seccionPagoReserva"
        );


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


    if (
        seccion
    ) {

        seccion.style.display =
            "none";
    }


    if (
        monto
    ) {

        monto.value =
            "";
    }


    if (
        metodo
    ) {

        metodo.value =
            "";
    }


    if (
        operacion
    ) {

        operacion.value =
            "";
    }
}


// ==========================================
// VALIDAR DATOS DEL PAGO
// ==========================================

function validarPago() {

    if (
        !politica
    ) {

        mostrarMensaje(
            "No se pudo obtener la política de pago."
        );


        return null;
    }


    const montoInput =
        document.getElementById(
            "montoPago"
        );


    const metodo =
        document.getElementById(
            "metodoPago"
        ).value;


    const numeroOperacion =
        document.getElementById(
            "numeroOperacion"
        ).value.trim();


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

        mostrarMensaje(
            "No se pudo obtener el costo de la especialidad."
        );


        return null;
    }


    const textoMonto =
        montoInput.value.trim();


    const monto =
        Number(
            textoMonto
        );


    const costo =
        Number(
            especialidad
                .costoConsulta
        );


    const minimo =
        calcularPagoMinimo(
            costo
        );


    // ======================================
    // MONTO VACÍO
    // ======================================

    if (
        textoMonto === ""
    ) {

        mostrarMensaje(
            "Ingrese el monto del pago."
        );


        return null;
    }


    // ======================================
    // MONTO VÁLIDO
    // ======================================

    if (
        Number.isNaN(
            monto
        )
        ||
        monto <= 0
    ) {

        mostrarMensaje(
            "Ingrese un monto válido."
        );


        return null;
    }


    // ======================================
    // MÁXIMO 2 DECIMALES
    // ======================================

    if (
        !tieneMaximoDosDecimales(
            textoMonto
        )
    ) {

        mostrarMensaje(
            "El monto solo puede tener hasta 2 decimales."
        );


        return null;
    }


    // ======================================
    // MÁXIMO GENERAL
    // ======================================

    if (
        monto > MONTO_MAXIMO
    ) {

        mostrarMensaje(
            "El monto máximo permitido es S/ "
            +
            formatearDinero(
                MONTO_MAXIMO
            )
            +
            "."
        );


        return null;
    }


    // ======================================
    // NO SUPERAR COSTO
    // ======================================

    if (
        monto > costo
    ) {

        mostrarMensaje(
            "El monto no puede superar el costo total de S/ "
            +
            formatearDinero(
                costo
            )
            +
            "."
        );


        return null;
    }


    // ======================================
    // PAGO MÍNIMO
    // ======================================

    if (
        monto < minimo
    ) {

        mostrarMensaje(
            "Para separar la cita debes pagar como mínimo S/ "
            +
            formatearDinero(
                minimo
            )
            +
            " ("
            +
            politica
                .porcentajePagoMinimo
            +
            "% del costo total)."
        );


        return null;
    }


    // ======================================
    // MÉTODO DE PAGO
    // ======================================

    if (
        metodo === ""
    ) {

        mostrarMensaje(
            "Seleccione un método de pago."
        );


        return null;
    }


    // ======================================
    // NÚMERO DE OPERACIÓN
    // ======================================

    if (
        numeroOperacion === ""
    ) {

        mostrarMensaje(
            "Ingrese el número de operación."
        );


        return null;
    }


    if (
        !/^\d+$/.test(
            numeroOperacion
        )
    ) {

        mostrarMensaje(
            "El número de operación solo puede contener números."
        );


        return null;
    }


    if (
        numeroOperacion.length
        >
        MAX_OPERACION
    ) {

        mostrarMensaje(
            "El número de operación puede tener como máximo 3 cifras."
        );


        return null;
    }


    return {

        monto:
        monto,

        metodoPago:
        metodo,

        numeroOperacion:
        numeroOperacion,

        costo:
        costo,

        minimo:
        minimo
    };
}


// ==========================================
// RESERVAR
// ==========================================

async function reservar() {

    const idHorario =
        document.getElementById(
            "horario"
        ).value;


    // ======================================
    // VALIDAR HORARIO
    // ======================================

    if (
        idHorario === ""
    ) {

        mostrarMensaje(
            "Seleccione un horario."
        );


        return;
    }


    if (
        !horarioSeleccionado
    ) {

        mostrarMensaje(
            "El horario seleccionado no es válido."
        );


        return;
    }


    if (
        !esHorarioFuturo(
            horarioSeleccionado
        )
    ) {

        mostrarMensaje(
            "El horario seleccionado ya pasó o dejó de estar disponible."
        );


        await cambiarFecha();


        return;
    }


    // ======================================
    // VALIDAR PAGO
    // ======================================

    const pago =
        validarPago();


    if (
        !pago
    ) {

        return;
    }


    // ======================================
    // CONFIRMAR
    // ======================================

    const confirmar =
        confirm(
            "¿Desea confirmar la cita?\n\n"
            +
            "Costo total: S/ "
            +
            formatearDinero(
                pago.costo
            )
            +
            "\n"
            +
            "Pago inicial: S/ "
            +
            formatearDinero(
                pago.monto
            )
            +
            "\n"
            +
            "Saldo posterior: S/ "
            +
            formatearDinero(
                pago.costo
                -
                pago.monto
            )
        );


    if (
        !confirmar
    ) {

        return;
    }


    const boton =
        document.getElementById(
            "btnReservar"
        );


    // ======================================
    // EVITAR DOBLE CLIC
    // ======================================

    boton.disabled =
        true;


    mostrarMensaje(
        ""
    );


    try {

        // ======================================
        // RESERVA + PAGO
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

                                idHorario:
                                    Number(
                                        idHorario
                                    ),

                                idPaciente:
                                usuarioPaciente
                                    .paciente
                                    .idPaciente,

                                monto:
                                pago.monto,

                                metodoPago:
                                pago.metodoPago,

                                numeroOperacion:
                                pago.numeroOperacion
                            }
                        )
                }
            );


        // ======================================
        // ERROR
        // ======================================

        if (
            !respuesta.ok
        ) {

            const texto =
                await respuesta.text();


            // ==================================
            // HORARIO OCUPADO
            // ==================================

            if (
                respuesta.status === 400
                &&
                texto
                    .toLowerCase()
                    .includes(
                        "horario ya ocupado"
                    )
            ) {

                const fechaActual =
                    document.getElementById(
                        "fecha"
                    ).value;


                await cambiarFecha();


                const selectFecha =
                    document.getElementById(
                        "fecha"
                    );


                if (
                    selectFecha
                    &&
                    fechaActual
                ) {

                    selectFecha.value =
                        fechaActual;
                }


                const mensajeOcupado =
                    "El horario seleccionado acaba de ser reservado "
                    +
                    "por otro paciente. "
                    +
                    "Seleccione otro horario disponible.";


                mostrarMensaje(
                    mensajeOcupado
                );


                alert(
                    "Horario no disponible\n\n"
                    +
                    "Otro paciente reservó este horario antes que usted.\n\n"
                    +
                    "Por favor, seleccione otro horario disponible."
                );


                return;
            }


            // ==================================
            // OTRO ERROR
            // ==================================

            mostrarMensaje(
                texto
                ||
                "No se pudo registrar la cita."
            );


            boton.disabled =
                false;


            return;
        }


        // ======================================
        // RESPUESTA CORRECTA
        // ======================================

        const cita =
            await respuesta.json();


        const total =
            Number(
                cita.montoTotal
                ??
                pago.costo
            );


        const pagado =
            Number(
                cita.montoPagado
                ??
                pago.monto
            );


        const saldo =
            Number(
                cita.saldo
                ??
                (
                    total
                    -
                    pagado
                )
            );


        // ======================================
        // MENSAJE SEGÚN PAGO
        // ======================================

        if (
            saldo <= 0
        ) {

            mostrarMensaje(
                "Cita reservada y pagada correctamente.",
                "ok"
            );


            alert(
                "Reserva realizada correctamente\n\n"
                +
                "Pago registrado: S/ "
                +
                formatearDinero(
                    pagado
                )
                +
                "\n"
                +
                "Saldo pendiente: S/ 0.00\n\n"
                +
                "La cita quedó confirmada."
            );

        } else {

            mostrarMensaje(
                "Cita reservada correctamente. "
                +
                "Pago inicial registrado: S/ "
                +
                formatearDinero(
                    pagado
                )
                +
                ". Saldo pendiente: S/ "
                +
                formatearDinero(
                    saldo
                )
                +
                ".",
                "ok"
            );


            alert(
                "Reserva realizada correctamente\n\n"
                +
                "Pago registrado: S/ "
                +
                formatearDinero(
                    pagado
                )
                +
                "\n"
                +
                "Saldo pendiente: S/ "
                +
                formatearDinero(
                    saldo
                )
                +
                "\n\n"
                +
                "La cita quedó separada."
            );
        }


        // ======================================
        // ACTUALIZAR DISPONIBILIDAD
        // ======================================

        await cambiarMedico();


        ocultarPago();


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
// REINICIAR MÉDICO
// ==========================================

function reiniciarMedico() {

    const select =
        document.getElementById(
            "medico"
        );


    if (!select) {

        return;
    }


    select.innerHTML = `
        <option value="">
            Primero seleccione una especialidad
        </option>
    `;


    select.disabled =
        true;


    medicos =
        [];
}


// ==========================================
// REINICIAR FECHA
// ==========================================

function reiniciarFecha() {

    const select =
        document.getElementById(
            "fecha"
        );


    if (!select) {

        return;
    }


    select.innerHTML = `
        <option value="">
            Primero seleccione un médico
        </option>
    `;


    select.disabled =
        true;


    horariosMedico =
        [];
}


// ==========================================
// REINICIAR HORARIO
// ==========================================

function reiniciarHorario() {

    const select =
        document.getElementById(
            "horario"
        );


    if (!select) {

        return;
    }


    select.innerHTML = `
        <option value="">
            Primero seleccione una fecha
        </option>
    `;


    select.disabled =
        true;


    horariosFecha =
        [];


    horarioSeleccionado =
        null;


    const boton =
        document.getElementById(
            "btnReservar"
        );


    if (
        boton
    ) {

        boton.disabled =
            true;
    }
}


// ==========================================
// LIMPIAR RESERVA
// ==========================================

function limpiarReserva() {

    const especialidad =
        document.getElementById(
            "especialidad"
        );


    if (
        especialidad
    ) {

        especialidad.value =
            "";
    }


    mostrarMensaje(
        ""
    );


    reiniciarMedico();

    reiniciarFecha();

    reiniciarHorario();

    ocultarDetalle();

    ocultarPago();
}


// ==========================================
// LIMITAR MONTO
// ==========================================

function configurarInputMonto() {

    const input =
        document.getElementById(
            "montoPago"
        );


    if (
        !input
    ) {

        return;
    }


    input.addEventListener(
        "input",
        function () {

            let valor =
                this.value;


            if (
                valor === ""
            ) {

                return;
            }


            /*
             * Máximo 2 decimales.
             */
            if (
                valor.includes(".")
            ) {

                const partes =
                    valor.split(".");


                if (
                    partes.length > 2
                ) {

                    valor =
                        partes[0]
                        +
                        "."
                        +
                        partes
                            .slice(1)
                            .join("");
                }


                const enteros =
                    valor.split(".")[0];


                const decimales =
                    valor
                        .split(".")[1]
                    ??
                    "";


                valor =
                    enteros
                    +
                    "."
                    +
                    decimales.slice(
                        0,
                        2
                    );
            }


            let numero =
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

                numero =
                    MONTO_MAXIMO;


                valor =
                    formatearDinero(
                        numero
                    );
            }


            this.value =
                valor;
        }
    );
}


// ==========================================
// CONFIGURAR NÚMERO DE OPERACIÓN
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
// INICIAR
// ==========================================

async function iniciar() {

    const selectEspecialidad =
        document.getElementById(
            "especialidad"
        );


    const selectMedico =
        document.getElementById(
            "medico"
        );


    const selectFecha =
        document.getElementById(
            "fecha"
        );


    const selectHorario =
        document.getElementById(
            "horario"
        );


    // ======================================
    // EVENTOS
    // ======================================

    /*
     * Especialidad, médico y fecha ya tienen
     * onchange en el HTML que me pasaste.
     *
     * Por eso NO volvemos a registrar esos
     * tres eventos aquí.
     *
     * De esa manera evitamos ejecutar
     * cambiarEspecialidad(), cambiarMedico()
     * y cambiarFecha() dos veces.
     */


    if (
        selectHorario
    ) {

        selectHorario.addEventListener(
            "change",
            cambiarHorario
        );
    }


    // ======================================
    // CONFIGURAR CAMPOS
    // ======================================

    configurarInputMonto();

    configurarNumeroOperacion();


    // ======================================
    // ESTADO INICIAL
    // ======================================

    reiniciarMedico();

    reiniciarFecha();

    reiniciarHorario();

    ocultarDetalle();

    ocultarPago();


    // ======================================
    // CARGAR INFORMACIÓN
    // ======================================

    await cargarPolitica();

    await cargarEspecialidades();


    /*
     * Si no se pudo cargar la política,
     * impedimos reservar.
     */
    if (
        !politica
    ) {

        if (
            selectEspecialidad
        ) {

            selectEspecialidad.disabled =
                true;
        }


        mostrarMensaje(
            "No se puede reservar porque no se pudo cargar "
            +
            "la política activa de la clínica."
        );
    }
}


// ==========================================
// EJECUTAR
// ==========================================

iniciar();