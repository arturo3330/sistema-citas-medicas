async function cargarPacientes() {

    const respuesta =
        await fetch("/pacientes");

    const datos =
        await respuesta.json();

    const select =
        document.getElementById("paciente");

    select.innerHTML =
        '<option value="">Seleccione paciente</option>';

    datos.forEach(p => {

        select.innerHTML += `
            <option value="${p.idPaciente}">
                ${p.nombre} - DNI: ${p.dni}
            </option>
        `;
    });
}


async function listar() {

    const respuesta =
        await fetch("/usuarios");

    const datos =
        await respuesta.json();

    const tabla =
        document.getElementById(
            "tablaUsuarios"
        );

    tabla.innerHTML = "";


    datos.forEach(u => {

        let pacienteNombre = "-";

        let idPaciente = "";

        if (u.paciente) {

            pacienteNombre =
                u.paciente.nombre;

            idPaciente =
                u.paciente.idPaciente;
        }


        tabla.innerHTML += `
            <tr>

                <td>
                    ${u.idUsuario}
                </td>

                <td>
                    ${u.username}
                </td>

                <td>
                    ${u.nombre}
                </td>

                <td>
                    ${u.rol}
                </td>

                <td>
                    ${pacienteNombre}
                </td>

                <td>
                    ${u.estado ? "Activo" : "Inactivo"}
                </td>

                <td>

                    <button onclick="editar(
                        ${u.idUsuario},
                        '${u.username}',
                        '${u.nombre}',
                        '${u.rol}',
                        '${idPaciente}',
                        ${u.estado}
                    )">
                        Editar
                    </button>

                    <button onclick="eliminar(
                        ${u.idUsuario}
                    )">
                        Eliminar
                    </button>

                </td>

            </tr>
        `;
    });
}


async function guardar() {

    const id =
        document.getElementById(
            "idUsuario"
        ).value;

    const username =
        document.getElementById(
            "username"
        ).value.trim();

    const password =
        document.getElementById(
            "password"
        ).value;

    const nombre =
        document.getElementById(
            "nombre"
        ).value.trim();

    const rol =
        document.getElementById(
            "rol"
        ).value;

    const idPaciente =
        document.getElementById(
            "paciente"
        ).value;

    const estado =
        document.getElementById(
            "estado"
        ).value === "true";


    if (
        username === "" ||
        nombre === ""
    ) {

        alert(
            "Username y nombre son obligatorios"
        );

        return;
    }


    if (
        id === "" &&
        password === ""
    ) {

        alert(
            "Debe ingresar una contraseña"
        );

        return;
    }


    if (
        rol === "PACIENTE" &&
        idPaciente === ""
    ) {

        alert(
            "Debe asociar un paciente"
        );

        return;
    }


    const datos = {

        username: username,
        nombre: nombre,
        rol: rol,
        estado: estado,

        paciente:
            rol === "PACIENTE"
                ? {
                    idPaciente:
                        Number(idPaciente)
                }
                : null
    };


    if (password !== "") {
        datos.password = password;
    }


    let respuesta;


    if (id === "") {

        respuesta =
            await fetch(
                "/usuarios",
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(datos)
                }
            );

    } else {

        /*
         * Si estamos editando y no ingresamos
         * una nueva contraseña, necesitamos
         * conservar la anterior.
         */

        const usuarioActualRespuesta =
            await fetch(
                "/usuarios/" + id
            );

        const usuarioActual =
            await usuarioActualRespuesta.json();


        if (password === "") {

            datos.password =
                usuarioActual.password;
        }


        respuesta =
            await fetch(
                "/usuarios/" + id,
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(datos)
                }
            );
    }


    if (!respuesta.ok) {

        alert(
            "No se pudo guardar el usuario"
        );

        return;
    }


    limpiar();

    listar();
}


function editar(
    id,
    username,
    nombre,
    rol,
    idPaciente,
    estado
) {

    document.getElementById(
        "idUsuario"
    ).value = id;


    document.getElementById(
        "username"
    ).value = username;


    document.getElementById(
        "password"
    ).value = "";


    document.getElementById(
        "nombre"
    ).value = nombre;


    document.getElementById(
        "rol"
    ).value = rol;


    document.getElementById(
        "estado"
    ).value =
        estado.toString();


    cambiarRol();


    if (idPaciente !== "") {

        document.getElementById(
            "paciente"
        ).value =
            idPaciente;
    }
}


async function eliminar(id) {

    const usuario =
        obtenerUsuarioSesion();


    if (
        usuario.idUsuario === id
    ) {

        alert(
            "No puede eliminar su propio usuario."
        );

        return;
    }


    const confirmar =
        confirm(
            "¿Desea eliminar este usuario?"
        );


    if (!confirmar) {
        return;
    }


    const respuesta =
        await fetch(
            "/usuarios/" + id,
            {
                method: "DELETE"
            }
        );


    if (!respuesta.ok) {

        alert(
            "No se pudo eliminar el usuario"
        );

        return;
    }


    listar();
}


function cambiarRol() {

    const rol =
        document.getElementById(
            "rol"
        ).value;

    const contenedor =
        document.getElementById(
            "contenedorPaciente"
        );


    if (rol === "PACIENTE") {

        contenedor.style.display =
            "block";

    } else {

        contenedor.style.display =
            "none";

        document.getElementById(
            "paciente"
        ).value = "";
    }
}


function limpiar() {

    document.getElementById(
        "idUsuario"
    ).value = "";


    document.getElementById(
        "username"
    ).value = "";


    document.getElementById(
        "password"
    ).value = "";


    document.getElementById(
        "nombre"
    ).value = "";


    document.getElementById(
        "rol"
    ).value =
        "PACIENTE";


    document.getElementById(
        "estado"
    ).value =
        "true";


    document.getElementById(
        "paciente"
    ).value = "";


    cambiarRol();
}


async function iniciar() {

    await cargarPacientes();

    cambiarRol();

    await listar();
}


iniciar();