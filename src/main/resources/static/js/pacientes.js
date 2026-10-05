async function listar() {

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


        const tabla =
            document.getElementById(
                "tablaPacientes"
            );


        tabla.innerHTML =
            "";


        datos.forEach(p => {

            tabla.innerHTML += `
                <tr>

                    <td>
                        ${p.idPaciente}
                    </td>

                    <td>
                        ${p.dni}
                    </td>

                    <td>
                        ${p.nombre}
                    </td>

                    <td>
                        ${p.telefono ?? ""}
                    </td>

                    <td>
                        ${p.correo ?? ""}
                    </td>

                    <td>

                        <button
                            onclick="editar(
                                ${p.idPaciente},
                                '${p.dni}',
                                '${p.nombre}',
                                '${p.telefono ?? ""}',
                                '${p.correo ?? ""}'
                            )">

                            Editar

                        </button>


                        <button
                            onclick="eliminar(
                                ${p.idPaciente}
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


        alert(
            "No se pudieron cargar los pacientes"
        );
    }
}


// ==========================================
// GUARDAR / ACTUALIZAR
// ==========================================

async function guardar() {

    const id =
        document.getElementById(
            "idPaciente"
        ).value;


    const dni =
        document.getElementById(
            "dni"
        ).value.trim();


    const nombre =
        document.getElementById(
            "nombre"
        ).value.trim();


    const telefono =
        document.getElementById(
            "telefono"
        ).value.trim();


    const correo =
        document.getElementById(
            "correo"
        ).value.trim();


    // ======================================
    // CAMPOS OBLIGATORIOS
    // ======================================

    if (
        dni === ""
        ||
        nombre === ""
    ) {

        alert(
            "DNI y nombre son obligatorios"
        );

        return;
    }


    // ======================================
    // VALIDAR DNI
    // ======================================

    if (
        !/^\d+$/.test(
            dni
        )
    ) {

        alert(
            "El DNI solo puede contener números"
        );

        return;
    }


    if (
        dni.length !== 8
    ) {

        alert(
            "El DNI debe tener exactamente 8 dígitos"
        );

        return;
    }


    // ======================================
    // VALIDAR TELÉFONO
    // ======================================

    if (
        telefono !== ""
        &&
        !/^\d+$/.test(
            telefono
        )
    ) {

        alert(
            "El teléfono solo puede contener números"
        );

        return;
    }


    if (
        telefono.length > 10
    ) {

        alert(
            "El teléfono debe tener como máximo 10 dígitos"
        );

        return;
    }


    // ======================================
    // VALIDAR CORREO
    // ======================================

    if (
        correo !== ""
        &&
        !validarCorreo(
            correo
        )
    ) {

        alert(
            "Ingrese un correo electrónico válido"
        );

        return;
    }


    // ======================================
    // CONSTRUIR DATOS
    // ======================================

    const datos = {

        dni:
        dni,

        nombre:
        nombre,

        telefono:
        telefono,

        correo:
        correo
    };


    try {

        let respuesta;


        // ==================================
        // NUEVO PACIENTE
        // ==================================

        if (
            id === ""
        ) {

            respuesta =
                await fetch(
                    "/pacientes",
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
            // ACTUALIZAR PACIENTE
        // ==================================

        else {

            respuesta =
                await fetch(
                    "/pacientes/" + id,
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

            const mensaje =
                await respuesta.text();


            alert(
                mensaje
                ||
                "No se pudo guardar el paciente"
            );

            return;
        }


        alert(
            id === ""
                ? "Paciente registrado correctamente"
                : "Paciente actualizado correctamente"
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
// VALIDAR CORREO
// ==========================================

function validarCorreo(
    correo
) {

    const patron =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    return patron.test(
        correo
    );
}


// ==========================================
// EDITAR
// ==========================================

function editar(
    id,
    dni,
    nombre,
    telefono,
    correo
) {

    document.getElementById(
        "idPaciente"
    ).value =
        id;


    document.getElementById(
        "dni"
    ).value =
        dni;


    document.getElementById(
        "nombre"
    ).value =
        nombre;


    document.getElementById(
        "telefono"
    ).value =
        telefono;


    document.getElementById(
        "correo"
    ).value =
        correo;


    /*
     * Opcional:
     * mueve la pantalla hacia
     * el formulario al editar.
     */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// ==========================================
// ELIMINAR
// ==========================================

async function eliminar(
    id
) {

    const confirmar =
        confirm(
            "¿Desea eliminar el paciente?"
        );


    if (
        !confirmar
    ) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                "/pacientes/" + id,
                {

                    method:
                        "DELETE"
                }
            );


        if (
            !respuesta.ok
        ) {

            const mensaje =
                await respuesta.text();


            alert(
                mensaje
                ||
                "No se pudo eliminar el paciente"
            );

            return;
        }


        alert(
            "Paciente eliminado correctamente"
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
// LIMPIAR
// ==========================================

function limpiar() {

    document.getElementById(
        "idPaciente"
    ).value =
        "";


    document.getElementById(
        "dni"
    ).value =
        "";


    document.getElementById(
        "nombre"
    ).value =
        "";


    document.getElementById(
        "telefono"
    ).value =
        "";


    document.getElementById(
        "correo"
    ).value =
        "";
}


// ==========================================
// INICIO
// ==========================================

listar();