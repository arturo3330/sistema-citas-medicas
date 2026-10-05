// ==========================================
// CONSTANTES
// ==========================================

const COSTO_MAXIMO =
    999999.99;


// ==========================================
// LISTAR TODAS LAS ESPECIALIDADES
// ==========================================

async function listar() {

    try {

        const respuesta =
            await fetch(
                "/especialidades/todas"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las especialidades"
            );
        }


        const datos =
            await respuesta.json();


        const tabla =
            document.getElementById(
                "tablaEspecialidades"
            );


        tabla.innerHTML =
            "";


        if (
            datos.length === 0
        ) {

            tabla.innerHTML = `
                <tr>

                    <td
                        colspan="6"
                        class="tabla-vacia">

                        No hay especialidades registradas.

                    </td>

                </tr>
            `;

            return;
        }


        datos.forEach(
            e => {

                const duracion =
                    Number(
                        e.tiempoAtencionMinutos
                        ?? 0
                    );


                const costo =
                    Number(
                        e.costoConsulta
                        ?? 0
                    );


                let textoDuracion =
                    duracion + " min";


                if (
                    duracion === 60
                ) {

                    textoDuracion =
                        "1 hora";
                }


                const textoEstado =
                    e.estado
                        ? "Activo"
                        : "Inactivo";


                tabla.innerHTML += `
                    <tr>

                        <td>
                            ${e.idEspecialidad}
                        </td>

                        <td>
                            ${escaparTexto(
                    e.nombre
                )}
                        </td>

                        <td>
                            ${textoDuracion}
                        </td>

                        <td>
                            S/ ${costo.toFixed(2)}
                        </td>

                        <td>
                            ${textoEstado}
                        </td>

                        <td>

                            <button
                                type="button"
                                onclick="editar(
                                    ${e.idEspecialidad}
                                )">

                                Editar

                            </button>


                            ${
                    e.estado
                        ? `
                                        <button
                                            type="button"
                                            onclick="eliminar(
                                                ${e.idEspecialidad}
                                            )">

                                            Eliminar

                                        </button>
                                      `
                        : ""
                }

                        </td>

                    </tr>
                `;
            }
        );


    } catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            "No se pudieron cargar las especialidades.",
            "error"
        );
    }
}


// ==========================================
// GUARDAR / ACTUALIZAR
// ==========================================

async function guardar() {

    const id =
        document.getElementById(
            "idEspecialidad"
        ).value;


    const nombre =
        document.getElementById(
            "nombre"
        ).value.trim();


    const tiempoTexto =
        document.getElementById(
            "tiempoAtencionMinutos"
        ).value;


    const costoTexto =
        document.getElementById(
            "costoConsulta"
        ).value.trim();


    const estado =
        document.getElementById(
            "estado"
        ).value === "true";


    const tiempoAtencionMinutos =
        Number(
            tiempoTexto
        );


    const costoConsulta =
        Number(
            costoTexto
        );


    // ======================================
    // VALIDAR NOMBRE
    // ======================================

    if (
        nombre === ""
    ) {

        mostrarMensaje(
            "Ingrese el nombre de la especialidad.",
            "error"
        );

        return;
    }


    // ======================================
    // VALIDAR DURACIÓN
    // ======================================

    if (
        tiempoTexto === ""
        ||
        (
            tiempoAtencionMinutos !== 30
            &&
            tiempoAtencionMinutos !== 60
        )
    ) {

        mostrarMensaje(
            "La duración debe ser de 30 minutos o 1 hora.",
            "error"
        );

        return;
    }


    // ======================================
    // VALIDAR COSTO
    // ======================================

    if (
        costoTexto === ""
        ||
        Number.isNaN(
            costoConsulta
        )
        ||
        costoConsulta <= 0
    ) {

        mostrarMensaje(
            "El costo de consulta debe ser mayor que cero.",
            "error"
        );

        return;
    }


    // ======================================
    // COSTO MÁXIMO
    // ======================================

    if (
        costoConsulta > COSTO_MAXIMO
    ) {

        mostrarMensaje(
            "El costo máximo permitido es S/ 999999.99.",
            "error"
        );

        return;
    }


    // ======================================
    // MÁXIMO 2 DECIMALES
    // ======================================

    if (
        !validarMaximoDosDecimales(
            costoTexto
        )
    ) {

        mostrarMensaje(
            "El costo debe tener como máximo 2 decimales.",
            "error"
        );

        return;
    }


    // ======================================
    // CONSTRUIR DATOS
    // ======================================

    const datos = {

        nombre:
        nombre,

        tiempoAtencionMinutos:
        tiempoAtencionMinutos,

        costoConsulta:
        costoConsulta,

        estado:
        estado
    };


    try {

        let respuesta;


        // ==================================
        // NUEVA ESPECIALIDAD
        // ==================================

        if (
            id === ""
        ) {

            respuesta =
                await fetch(
                    "/especialidades",
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

        }

            // ==================================
            // ACTUALIZAR
        // ==================================

        else {

            respuesta =
                await fetch(
                    "/especialidades/" + id,
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


        if (
            !respuesta.ok
        ) {

            const texto =
                await respuesta.text();


            throw new Error(
                texto
                ||
                "No se pudo guardar la especialidad"
            );
        }


        mostrarMensaje(
            id === ""
                ? "Especialidad registrada correctamente."
                : "Especialidad actualizada correctamente.",
            "ok"
        );


        limpiar();


        await listar();


    } catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            error.message
            ||
            "Ocurrió un error al guardar.",
            "error"
        );
    }
}


// ==========================================
// EDITAR
// ==========================================

async function editar(
    id
) {

    try {

        const respuesta =
            await fetch(
                "/especialidades/" + id
            );


        if (
            !respuesta.ok
        ) {

            throw new Error(
                "No se pudo cargar la especialidad"
            );
        }


        const e =
            await respuesta.json();


        document.getElementById(
            "idEspecialidad"
        ).value =
            e.idEspecialidad;


        document.getElementById(
            "nombre"
        ).value =
            e.nombre ?? "";


        document.getElementById(
            "tiempoAtencionMinutos"
        ).value =
            e.tiempoAtencionMinutos ?? "";


        document.getElementById(
            "costoConsulta"
        ).value =
            e.costoConsulta ?? "";


        document.getElementById(
            "estado"
        ).value =
            String(
                e.estado
            );


        window.scrollTo(
            {
                top: 0,
                behavior: "smooth"
            }
        );


        mostrarMensaje(
            "Especialidad cargada para edición.",
            "ok"
        );


    } catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            "No se pudo cargar la especialidad seleccionada.",
            "error"
        );
    }
}


// ==========================================
// ELIMINAR
// Eliminación lógica: estado = false
// ==========================================

async function eliminar(
    id
) {

    const confirmar =
        confirm(
            "¿Desea eliminar esta especialidad?\n\n"
            +
            "La especialidad quedará registrada como inactiva."
        );


    if (
        !confirmar
    ) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                "/especialidades/" + id,
                {

                    method:
                        "DELETE"
                }
            );


        const texto =
            await respuesta.text();


        if (
            !respuesta.ok
        ) {

            throw new Error(
                texto
                ||
                "No se pudo eliminar la especialidad"
            );
        }


        mostrarMensaje(
            texto
            ||
            "Especialidad eliminada correctamente.",
            "ok"
        );


        const idActual =
            document.getElementById(
                "idEspecialidad"
            ).value;


        if (
            Number(
                idActual
            )
            ===
            Number(
                id
            )
        ) {

            limpiar();
        }


        await listar();


    } catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            error.message
            ||
            "No se pudo eliminar la especialidad.",
            "error"
        );
    }
}


// ==========================================
// VALIDAR MÁXIMO 2 DECIMALES
// ==========================================

function validarMaximoDosDecimales(
    valor
) {

    return /^\d+(\.\d{1,2})?$/.test(
        valor
    );
}


// ==========================================
// CONTROL DEL CAMPO COSTO
// ==========================================

function configurarCosto() {

    const input =
        document.getElementById(
            "costoConsulta"
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


            let numero =
                Number(
                    valor
                );


            // ==================================
            // EVITAR NEGATIVOS
            // ==================================

            if (
                !Number.isNaN(
                    numero
                )
                &&
                numero < 0
            ) {

                this.value =
                    "";

                return;
            }


            // ==================================
            // MÁXIMO 999999.99
            // ==================================

            if (
                !Number.isNaN(
                    numero
                )
                &&
                numero > COSTO_MAXIMO
            ) {

                this.value =
                    COSTO_MAXIMO
                        .toFixed(
                            2
                        );

                return;
            }


            // ==================================
            // MÁXIMO DOS DECIMALES
            // ==================================

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
// LIMPIAR FORMULARIO
// ==========================================

function limpiar() {

    document.getElementById(
        "idEspecialidad"
    ).value =
        "";


    document.getElementById(
        "nombre"
    ).value =
        "";


    document.getElementById(
        "tiempoAtencionMinutos"
    ).value =
        "";


    document.getElementById(
        "costoConsulta"
    ).value =
        "";


    document.getElementById(
        "estado"
    ).value =
        "true";


    mostrarMensaje(
        "",
        "ok"
    );
}


// ==========================================
// MENSAJES
// ==========================================

function mostrarMensaje(
    texto,
    tipo
) {

    const mensaje =
        document.getElementById(
            "mensaje"
        );


    if (
        !mensaje
    ) {

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

    configurarCosto();

    await listar();
}


iniciar();