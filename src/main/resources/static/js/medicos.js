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

            select.innerHTML += `
                <option value="${e.idEspecialidad}">
                    ${escaparTexto(e.nombre)}
                </option>
            `;
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
// LISTAR TODOS LOS MÉDICOS
// ==========================================

async function listar() {

    const tabla =
        document.getElementById(
            "tablaMedicos"
        );


    try {

        const respuesta =
            await fetch(
                "/medicos/todos"
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
                        No hay médicos registrados.
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
                            onclick="editar(${m.idMedico})">

                            Editar

                        </button>

                        ${
                m.estado
                    ? `
                                    <button
                                        type="button"
                                        onclick="eliminar(${m.idMedico})">

                                        Eliminar

                                    </button>
                                  `
                    : ""
            }

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

async function editar(
    id
) {

    try {

        const respuesta =
            await fetch(
                "/medicos/" + id
            );


        if (
            !respuesta.ok
        ) {

            mostrarMensaje(
                "No se pudo cargar el médico.",
                false
            );

            return;
        }


        const medico =
            await respuesta.json();


        document.getElementById(
            "idMedico"
        ).value =
            medico.idMedico;


        document.getElementById(
            "nombre"
        ).value =
            medico.nombre || "";


        document.getElementById(
            "cmp"
        ).value =
            medico.cmp || "";


        const selectEspecialidad =
            document.getElementById(
                "especialidad"
            );


        if (
            medico.especialidad
            &&
            medico.especialidad.idEspecialidad
        ) {

            const idEspecialidad =
                String(
                    medico.especialidad.idEspecialidad
                );


            const existe =
                Array.from(
                    selectEspecialidad.options
                ).some(
                    option =>
                        option.value ===
                        idEspecialidad
                );


            if (
                !existe
            ) {

                await cargarEspecialidades();
            }


            selectEspecialidad.value =
                idEspecialidad;
        }


        document.getElementById(
            "estado"
        ).value =
            Boolean(
                medico.estado
            ).toString();


        mostrarMensaje(
            "Editando médico: "
            +
            medico.nombre,
            true
        );


    } catch (error) {

        console.error(
            error
        );


        mostrarMensaje(
            "No se pudo cargar la información del médico.",
            false
        );
    }
}


// ==========================================
// ELIMINAR MÉDICO
// Realmente cambia estado a false
// ==========================================

async function eliminar(
    id
) {

    const confirmar =
        confirm(
            "¿Desea eliminar este médico?\n\n"
            +
            "El médico quedará registrado como inactivo "
            +
            "y se conservarán sus horarios y citas históricas."
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


        if (
            !respuesta.ok
        ) {

            mostrarMensaje(
                contenido
                ||
                "No se pudo eliminar el médico.",
                false
            );

            return;
        }


        mostrarMensaje(
            contenido
            ||
            "Médico eliminado correctamente.",
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
// LIMPIAR
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
// INICIAR
// ==========================================

async function iniciar() {

    await cargarEspecialidades();

    await listar();
}


iniciar();