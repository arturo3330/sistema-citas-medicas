// ==========================================
// CARGAR ESPECIALIDADES
// ==========================================

async function cargarEspecialidades() {

    const select =
        document.getElementById(
            "especialidad"
        );


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


        const datos =
            await respuesta.json();


        select.innerHTML = `
            <option value="">
                Seleccione una especialidad
            </option>
        `;


        datos.forEach(e => {

            if (
                e.estado === true
            ) {

                select.innerHTML += `
                    <option value="${e.idEspecialidad}">
                        ${escaparTexto(e.nombre)}
                    </option>
                `;
            }
        });


    } catch (error) {

        console.error(
            error
        );


        select.innerHTML = `
            <option value="">
                Error al cargar especialidades
            </option>
        `;
    }
}


// ==========================================
// LISTAR MÉDICOS
// ==========================================

async function listar() {

    const tabla =
        document.getElementById(
            "tablaMedicos"
        );


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


        tabla.innerHTML =
            "";


        if (
            datos.length === 0
        ) {

            tabla.innerHTML = `
                <tr>
                    <td colspan="6">
                        No hay médicos activos registrados.
                    </td>
                </tr>
            `;

            return;
        }


        datos.forEach(m => {

            const especialidad =
                m.especialidad
                    ? m.especialidad.nombre
                    : "-";


            tabla.innerHTML += `
                <tr>

                    <td>
                        ${m.idMedico}
                    </td>

                    <td>
                        ${escaparTexto(
                m.nombre
            )}
                    </td>

                    <td>
                        ${escaparTexto(
                m.cmp
            )}
                    </td>

                    <td>
                        ${escaparTexto(
                especialidad
            )}
                    </td>

                    <td>
                        ${
                m.estado
                    ? "Activo"
                    : "Inactivo"
            }
                    </td>

                    <td>

                        <button
                            type="button"
                            onclick="editar(
                                ${m.idMedico},
                                '${escaparParaJs(m.nombre)}',
                                '${escaparParaJs(m.cmp)}',
                                ${m.especialidad.idEspecialidad},
                                ${m.estado}
                            )">

                            Editar

                        </button>


                        <button
                            type="button"
                            onclick="eliminar(
                                ${m.idMedico}
                            )">

                            Desactivar

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
                <td colspan="6">
                    Error al cargar los médicos.
                </td>
            </tr>
        `;
    }
}


// ==========================================
// GUARDAR / ACTUALIZAR
// ==========================================

async function guardar() {

    const id =
        document.getElementById(
            "idMedico"
        ).value;


    const nombre =
        document.getElementById(
            "nombre"
        ).value.trim();


    const cmp =
        document.getElementById(
            "cmp"
        ).value.trim();


    const idEspecialidad =
        document.getElementById(
            "especialidad"
        ).value;


    const estado =
        document.getElementById(
            "estado"
        ).value === "true";


    // ======================================
    // VALIDACIONES
    // ======================================

    if (
        nombre === ""
    ) {

        mostrarMensaje(
            "Ingrese el nombre del médico.",
            false
        );

        return;
    }


    if (
        cmp === ""
    ) {

        mostrarMensaje(
            "Ingrese el CMP del médico.",
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


    const datos = {

        nombre:
        nombre,

        cmp:
        cmp,

        especialidad: {

            idEspecialidad:
                Number(
                    idEspecialidad
                )
        },

        estado:
        estado
    };


    try {

        let respuesta;


        // ======================================
        // NUEVO
        // ======================================

        if (
            id === ""
        ) {

            respuesta =
                await fetch(
                    "/medicos",
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


            // ======================================
            // ACTUALIZAR
            // ======================================

        } else {

            respuesta =
                await fetch(
                    "/medicos/" + id,
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


        const contenido =
            await respuesta.text();


        if (
            !respuesta.ok
        ) {

            mostrarMensaje(
                contenido
                ||
                "No se pudo guardar el médico.",
                false
            );


            return;
        }


        if (
            id === ""
        ) {

            mostrarMensaje(
                "Médico registrado correctamente.",
                true
            );

        } else {

            mostrarMensaje(
                "Médico actualizado correctamente.",
                true
            );
        }


        limpiar();


        await listar();


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
// EDITAR
// ==========================================

function editar(
    id,
    nombre,
    cmp,
    idEspecialidad,
    estado
) {

    document.getElementById(
        "idMedico"
    ).value =
        id;


    document.getElementById(
        "nombre"
    ).value =
        nombre;


    document.getElementById(
        "cmp"
    ).value =
        cmp;


    document.getElementById(
        "especialidad"
    ).value =
        idEspecialidad;


    document.getElementById(
        "estado"
    ).value =
        estado.toString();


    mostrarMensaje(
        "Editando médico seleccionado.",
        true
    );
}


// ==========================================
// DESACTIVAR MÉDICO
// ==========================================

async function eliminar(
    id
) {

    const confirmar =
        confirm(
            "¿Desea desactivar este médico?\n\n"
            +
            "El médico dejará de aparecer como disponible, "
            +
            "pero se conservarán sus horarios y citas históricas."
        );


    if (
        !confirmar
    ) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                "/medicos/" + id,
                {

                    method:
                        "DELETE"
                }
            );


        const contenido =
            await respuesta.text();


        // ======================================
        // ERROR DEL BACKEND
        // ======================================

        if (
            !respuesta.ok
        ) {

            mostrarMensaje(
                contenido
                ||
                "No se pudo desactivar el médico.",
                false
            );


            return;
        }


        // ======================================
        // CORRECTO
        // ======================================

        mostrarMensaje(
            contenido
            ||
            "Médico desactivado correctamente.",
            true
        );


        await listar();


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
// LIMPIAR FORMULARIO
// ==========================================

function limpiar() {

    document.getElementById(
        "idMedico"
    ).value =
        "";


    document.getElementById(
        "nombre"
    ).value =
        "";


    document.getElementById(
        "cmp"
    ).value =
        "";


    document.getElementById(
        "especialidad"
    ).value =
        "";


    document.getElementById(
        "estado"
    ).value =
        "true";
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


    if (
        !mensaje
    ) {

        if (
            texto !== ""
        ) {

            alert(
                texto
            );
        }


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
// ESCAPAR TEXTO HTML
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
// ESCAPAR TEXTO PARA onclick
// ==========================================

function escaparParaJs(
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
            "\\",
            "\\\\"
        )
        .replaceAll(
            "'",
            "\\'"
        )
        .replaceAll(
            "\n",
            " "
        )
        .replaceAll(
            "\r",
            " "
        );
}


// ==========================================
// INICIAR
// ==========================================

async function iniciar() {

    await cargarEspecialidades();

    await listar();
}


iniciar();