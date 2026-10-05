// ==========================================
// VARIABLES GLOBALES
// ==========================================

let politica = null;

let medicos = [];


// ==========================================
// FORMATEAR FECHA
// ==========================================

function formatearFecha(fecha) {

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

function formatearHora(hora) {

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


    if (horas === 0) {

        horas =
            12;
    }


    return `${horas}:${minutos} ${periodo}`;
}


// ==========================================
// NORMALIZAR HORA HH:mm
// ==========================================

function normalizarHora(hora) {

    if (!hora) {

        return "";
    }


    return hora.substring(
        0,
        5
    );
}


// ==========================================
// CONVERTIR DATE A YYYY-MM-DD
// ==========================================

function convertirFechaInput(fecha) {

    const anio =
        fecha.getFullYear();


    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const dia =
        String(
            fecha.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${anio}-${mes}-${dia}`;
}


// ==========================================
// CARGAR POLÍTICA CLÍNICA
// ==========================================

async function cargarPolitica() {

    const informacion =
        document.getElementById(
            "infoPoliticaHorario"
        );


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


        if (!politica) {

            throw new Error(
                "No existe una política clínica activa"
            );
        }


        // ======================================
        // MOSTRAR POLÍTICA ACTUAL
        // ======================================

        if (informacion) {

            informacion.innerText =
                "Horario permitido: "
                +
                normalizarHora(
                    politica.horaInicioManana
                )
                +
                " a "
                +
                normalizarHora(
                    politica.horaFinManana
                )
                +
                " y "
                +
                normalizarHora(
                    politica.horaInicioTarde
                )
                +
                " a "
                +
                normalizarHora(
                    politica.horaFinTarde
                )
                +
                ". Se pueden registrar horarios hasta "
                +
                politica.diasAnticipacion
                +
                " días de anticipación. "
                +
                "La hora final se calcula automáticamente "
                +
                "según la duración de la especialidad.";
        }


        configurarLimitesFecha();


    } catch (error) {

        console.error(
            error
        );


        politica =
            null;


        if (informacion) {

            informacion.innerText =
                "No se pudo cargar la política vigente. "
                +
                "Las reglas definitivas serán validadas "
                +
                "por el servidor.";
        }


        /*
         * Como mínimo impedimos seleccionar
         * fechas anteriores desde el navegador.
         */
        configurarLimiteMinimoFecha();
    }
}


// ==========================================
// CONFIGURAR SOLO FECHA MÍNIMA
// ==========================================

function configurarLimiteMinimoFecha() {

    const inputFecha =
        document.getElementById(
            "fecha"
        );


    if (!inputFecha) {

        return;
    }


    const hoy =
        new Date();


    inputFecha.min =
        convertirFechaInput(
            hoy
        );


    inputFecha.removeAttribute(
        "max"
    );
}


// ==========================================
// CONFIGURAR LÍMITES DE FECHA
// SEGÚN POLÍTICA
// ==========================================

function configurarLimitesFecha() {

    const inputFecha =
        document.getElementById(
            "fecha"
        );


    if (!inputFecha) {

        return;
    }


    const hoy =
        new Date();


    inputFecha.min =
        convertirFechaInput(
            hoy
        );


    if (
        !politica
        ||
        politica.diasAnticipacion == null
    ) {

        inputFecha.removeAttribute(
            "max"
        );

        return;
    }


    const diasAnticipacion =
        Number(
            politica.diasAnticipacion
        );


    if (
        Number.isNaN(
            diasAnticipacion
        )
        ||
        diasAnticipacion < 0
    ) {

        inputFecha.removeAttribute(
            "max"
        );

        return;
    }


    const limite =
        new Date(
            hoy
        );


    limite.setDate(
        limite.getDate()
        +
        diasAnticipacion
    );


    inputFecha.max =
        convertirFechaInput(
            limite
        );
}


// ==========================================
// CARGAR MÉDICOS
// ==========================================

async function cargarMedicos() {

    const select =
        document.getElementById(
            "medico"
        );


    select.innerHTML = `

        <option value="">
            Cargando médicos...
        </option>
    `;


    select.disabled =
        true;


    try {

        const respuesta =
            await fetch(
                "/medicos"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los médicos"
            );
        }


        const datos =
            await respuesta.json();


        /*
         * Solo usamos médicos activos.
         */
        medicos =
            datos.filter(
                m =>
                    m.estado === true
            );


        select.innerHTML =
            "";


        if (
            medicos.length === 0
        ) {

            select.innerHTML = `

                <option value="">
                    No hay médicos activos registrados
                </option>
            `;


            select.disabled =
                true;


            return;
        }


        select.innerHTML = `

            <option value="">
                Seleccione un médico
            </option>
        `;


        medicos.forEach(
            m => {

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
                Error al cargar médicos
            </option>
        `;


        select.disabled =
            true;


        alert(
            "No se pudieron cargar los médicos"
        );
    }
}


// ==========================================
// LISTAR HORARIOS
// ==========================================

async function listar() {

    const tabla =
        document.getElementById(
            "tablaHorarios"
        );


    try {

        const respuesta =
            await fetch(
                "/horarios"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los horarios"
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

                    <td colspan="9">
                        No hay horarios registrados.
                    </td>

                </tr>
            `;


            return;
        }


        datos.forEach(
            h => {

                const medico =
                    h.medico
                        ? h.medico
                        : null;


                const nombreMedico =
                    medico
                        ? medico.nombre
                        : "-";


                const nombreEspecialidad =
                    medico
                    &&
                    medico.especialidad
                        ? medico.especialidad.nombre
                        : "-";


                const idMedico =
                    medico
                        ? medico.idMedico
                        : "";


                tabla.innerHTML += `

                    <tr>

                        <td>
                            ${h.idHorario}
                        </td>

                        <td>
                            ${nombreMedico}
                        </td>

                        <td>
                            ${nombreEspecialidad}
                        </td>

                        <td>
                            ${formatearFecha(
                    h.fecha
                )}
                        </td>

                        <td>
                            ${formatearHora(
                    h.hora
                )}
                        </td>

                        <td>
                            ${
                    h.horaFin
                        ? formatearHora(
                            h.horaFin
                        )
                        : "-"
                }
                        </td>

                        <td>
                            ${h.diaSemana || "-"}
                        </td>

                        <td>
                            ${h.estado || "-"}
                        </td>

                        <td>

                            <button
                                type="button"
                                onclick="editar(
                                    ${h.idHorario},
                                    ${idMedico},
                                    '${h.fecha}',
                                    '${h.hora}',
                                    '${h.estado}'
                                )">

                                Editar

                            </button>


                            <button
                                type="button"
                                onclick="eliminar(
                                    ${h.idHorario}
                                )">

                                Eliminar

                            </button>

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

                <td colspan="9">
                    Error al cargar los horarios.
                </td>

            </tr>
        `;
    }
}


// ==========================================
// VALIDAR FECHA SEGÚN POLÍTICA
// ==========================================

function validarFechaFrontend(
    fecha
) {

    if (!fecha) {

        return {
            valido: false,
            mensaje:
                "Debe seleccionar una fecha."
        };
    }


    const fechaSeleccionada =
        new Date(
            fecha + "T00:00:00"
        );


    const hoy =
        new Date();


    hoy.setHours(
        0,
        0,
        0,
        0
    );


    if (
        fechaSeleccionada < hoy
    ) {

        return {
            valido: false,
            mensaje:
                "No se pueden registrar horarios en fechas pasadas."
        };
    }


    /*
     * Si por algún motivo la política
     * no cargó, dejamos que el backend
     * haga la validación definitiva.
     */
    if (
        !politica
        ||
        politica.diasAnticipacion == null
    ) {

        return {
            valido: true
        };
    }


    const diasAnticipacion =
        Number(
            politica.diasAnticipacion
        );


    const limite =
        new Date(
            hoy
        );


    limite.setDate(
        limite.getDate()
        +
        diasAnticipacion
    );


    if (
        fechaSeleccionada > limite
    ) {

        return {
            valido: false,

            mensaje:
                "Solo se pueden registrar horarios hasta "
                +
                diasAnticipacion
                +
                " días de anticipación."
        };
    }


    return {
        valido: true
    };
}


// ==========================================
// VALIDAR HORA SEGÚN POLÍTICA
// ==========================================

function validarHoraFrontend(
    hora
) {

    if (!hora) {

        return false;
    }


    /*
     * Sin política dejamos la validación
     * definitiva al backend.
     */
    if (!politica) {

        return true;
    }


    const horaSeleccionada =
        normalizarHora(
            hora
        );


    const inicioManana =
        normalizarHora(
            politica.horaInicioManana
        );


    const finManana =
        normalizarHora(
            politica.horaFinManana
        );


    const inicioTarde =
        normalizarHora(
            politica.horaInicioTarde
        );


    const finTarde =
        normalizarHora(
            politica.horaFinTarde
        );


    const turnoManana =
        horaSeleccionada >= inicioManana
        &&
        horaSeleccionada < finManana;


    const turnoTarde =
        horaSeleccionada >= inicioTarde
        &&
        horaSeleccionada < finTarde;


    return turnoManana
        ||
        turnoTarde;
}


// ==========================================
// CONVERTIR HORA A MINUTOS
// ==========================================

function horaAMinutos(
    hora
) {

    const normalizada =
        normalizarHora(
            hora
        );


    if (!normalizada) {

        return null;
    }


    const partes =
        normalizada.split(":");


    return (
            Number(
                partes[0]
            )
            *
            60
        )
        +
        Number(
            partes[1]
        );
}


// ==========================================
// VALIDAR HORA FINAL
// ==========================================

function validarHoraFinFrontend(
    horaInicio,
    idMedico
) {

    /*
     * El backend sigue siendo
     * la validación definitiva.
     */
    if (!politica) {

        return {
            valido: true
        };
    }


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
        !medico
        ||
        !medico.especialidad
        ||
        medico.especialidad
            .tiempoAtencionMinutos == null
    ) {

        return {
            valido: true
        };
    }


    const duracion =
        Number(
            medico
                .especialidad
                .tiempoAtencionMinutos
        );


    if (
        Number.isNaN(
            duracion
        )
        ||
        duracion <= 0
    ) {

        return {
            valido: true
        };
    }


    const inicio =
        horaAMinutos(
            horaInicio
        );


    const mananaInicio =
        horaAMinutos(
            politica.horaInicioManana
        );


    const mananaFin =
        horaAMinutos(
            politica.horaFinManana
        );


    const tardeInicio =
        horaAMinutos(
            politica.horaInicioTarde
        );


    const tardeFin =
        horaAMinutos(
            politica.horaFinTarde
        );


    const fin =
        inicio
        +
        duracion;


    // ======================================
    // TURNO MAÑANA
    // ======================================

    if (
        inicio >= mananaInicio
        &&
        inicio < mananaFin
    ) {

        if (
            fin > mananaFin
        ) {

            return {
                valido: false,

                mensaje:
                    "La consulta termina después del "
                    +
                    "horario permitido del turno mañana."
            };
        }


        return {
            valido: true
        };
    }


    // ======================================
    // TURNO TARDE
    // ======================================

    if (
        inicio >= tardeInicio
        &&
        inicio < tardeFin
    ) {

        if (
            fin > tardeFin
        ) {

            return {
                valido: false,

                mensaje:
                    "La consulta termina después del "
                    +
                    "horario permitido del turno tarde."
            };
        }


        return {
            valido: true
        };
    }


    return {
        valido: false,
        mensaje:
            "La hora no pertenece a un turno válido."
    };
}


// ==========================================
// VALIDAR SI FECHA/HORA YA PASÓ
// ==========================================

function validarFechaHoraActual(
    fecha,
    hora
) {

    if (
        !fecha
        ||
        !hora
    ) {

        return true;
    }


    const fechaHora =
        new Date(
            `${fecha}T${hora}`
        );


    return fechaHora.getTime()
        >
        Date.now();
}


// ==========================================
// GUARDAR / ACTUALIZAR
// ==========================================

async function guardar() {

    const id =
        document.getElementById(
            "idHorario"
        ).value;


    const idMedico =
        document.getElementById(
            "medico"
        ).value;


    const fecha =
        document.getElementById(
            "fecha"
        ).value;


    const hora =
        document.getElementById(
            "hora"
        ).value;


    const estado =
        document.getElementById(
            "estado"
        ).value;


    // ======================================
    // VALIDACIONES BÁSICAS
    // ======================================

    if (
        idMedico === ""
        ||
        fecha === ""
        ||
        hora === ""
    ) {

        alert(
            "Complete todos los campos"
        );


        return;
    }


    // ======================================
    // VALIDAR FECHA
    // ======================================

    const validacionFecha =
        validarFechaFrontend(
            fecha
        );


    if (
        !validacionFecha.valido
    ) {

        alert(
            validacionFecha.mensaje
        );


        return;
    }


    // ======================================
    // VALIDAR FECHA + HORA ACTUAL
    // ======================================

    if (
        !validarFechaHoraActual(
            fecha,
            hora
        )
    ) {

        alert(
            "No se puede registrar un horario que ya pasó."
        );


        return;
    }


    // ======================================
    // VALIDAR HORA DE INICIO
    // ======================================

    if (
        !validarHoraFrontend(
            hora
        )
    ) {

        let mensaje =
            "La hora seleccionada no pertenece "
            +
            "al horario permitido por la clínica.";


        if (politica) {

            mensaje =
                "La hora debe estar dentro del horario de atención: "
                +
                normalizarHora(
                    politica.horaInicioManana
                )
                +
                " a "
                +
                normalizarHora(
                    politica.horaFinManana
                )
                +
                " o "
                +
                normalizarHora(
                    politica.horaInicioTarde
                )
                +
                " a "
                +
                normalizarHora(
                    politica.horaFinTarde
                )
                +
                ".";
        }


        alert(
            mensaje
        );


        return;
    }


    // ======================================
    // VALIDAR DURACIÓN Y HORA FINAL
    // ======================================

    const validacionHoraFin =
        validarHoraFinFrontend(
            hora,
            idMedico
        );


    if (
        !validacionHoraFin.valido
    ) {

        alert(
            validacionHoraFin.mensaje
        );


        return;
    }


    // ======================================
    // CONSTRUIR JSON
    // ======================================

    const datos = {

        medico: {

            idMedico:
                Number(
                    idMedico
                )
        },

        fecha:
        fecha,

        hora:
        hora,

        estado:
        estado
    };


    try {

        let respuesta;


        // ==================================
        // NUEVO HORARIO
        // ==================================

        if (
            id === ""
        ) {

            respuesta =
                await fetch(
                    "/horarios",
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


        } else {

            // ==================================
            // ACTUALIZAR HORARIO
            // ==================================

            respuesta =
                await fetch(
                    "/horarios/" + id,
                    {

                        method:
                            "PUT",

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
        }


        // ==================================
        // ERROR DEL BACKEND
        // ==================================

        if (
            !respuesta.ok
        ) {

            const texto =
                await respuesta.text();


            alert(
                texto
                ||
                "No se pudo guardar el horario"
            );


            return;
        }


        alert(
            id === ""
                ? "Horario registrado correctamente"
                : "Horario actualizado correctamente"
        );


        limpiar();


        await listar();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "No se pudo conectar con el servidor"
        );
    }
}


// ==========================================
// EDITAR
// ==========================================

function editar(
    id,
    idMedico,
    fecha,
    hora,
    estado
) {

    document.getElementById(
        "idHorario"
    ).value =
        id;


    document.getElementById(
        "medico"
    ).value =
        idMedico;


    document.getElementById(
        "fecha"
    ).value =
        fecha;


    /*
     * input type="time"
     * necesita HH:mm.
     */
    document.getElementById(
        "hora"
    ).value =
        normalizarHora(
            hora
        );


    document.getElementById(
        "estado"
    ).value =
        estado;


    window.scrollTo(
        {
            top: 0,
            behavior: "smooth"
        }
    );
}


// ==========================================
// ELIMINAR
// ==========================================

async function eliminar(
    id
) {

    const confirmar =
        confirm(
            "¿Desea eliminar el horario?"
        );


    if (!confirmar) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                "/horarios/" + id,
                {

                    method:
                        "DELETE"
                }
            );


        if (
            !respuesta.ok
        ) {

            const texto =
                await respuesta.text();


            alert(
                texto
                ||
                "No se pudo eliminar el horario"
            );


            return;
        }


        const mensaje =
            await respuesta.text();


        alert(
            mensaje
            ||
            "Horario eliminado correctamente"
        );


        await listar();


    } catch (error) {

        console.error(
            error
        );


        alert(
            "No se pudo conectar con el servidor"
        );
    }
}


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

function limpiar() {

    document.getElementById(
        "idHorario"
    ).value =
        "";


    document.getElementById(
        "medico"
    ).value =
        "";


    document.getElementById(
        "fecha"
    ).value =
        "";


    document.getElementById(
        "hora"
    ).value =
        "";


    document.getElementById(
        "estado"
    ).value =
        "DISPONIBLE";


    /*
     * Volvemos a aplicar los límites
     * por si la política fue modificada.
     */
    configurarLimitesFecha();
}


// ==========================================
// INICIAR
// ==========================================

async function iniciar() {

    /*
     * Primero cargamos la política,
     * porque de ella dependen las
     * fechas y horas permitidas.
     */
    await cargarPolitica();


    await cargarMedicos();


    await listar();
}


// ==========================================
// EJECUTAR
// ==========================================

iniciar();