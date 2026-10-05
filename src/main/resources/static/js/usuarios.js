// Solo ADMIN y SECRETARIA pueden entrar a esta página
protegerPersonalClinica();


// ==========================================
// CONFIGURACIÓN DE ROLES DEL FORMULARIO
// ==========================================

function configurarRolesFormulario(rolActual = null) {

    const select =
        document.getElementById("rol");

    /*
     * Desde el formulario normal solo se pueden
     * crear PACIENTES y SECRETARIAS.
     */
    select.innerHTML = `
        <option value="PACIENTE">Paciente</option>
        <option value="SECRETARIA">Secretaria</option>
    `;

    /*
     * Si estamos editando al ADMIN,
     * agregamos temporalmente su opción
     * y bloqueamos el cambio de rol.
     */
    if (rolActual === "ADMIN") {

        select.innerHTML += `
            <option value="ADMIN">
                Administrador
            </option>
        `;

        select.value = "ADMIN";
        select.disabled = true;

    } else {

        select.disabled = false;

        if (rolActual) {
            select.value = rolActual;
        } else {
            select.value = "PACIENTE";
        }
    }
}


// ==========================================
// CARGAR PACIENTES
// ==========================================

async function cargarPacientes() {

    try {

        const respuesta =
            await fetch("/pacientes");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los pacientes"
            );
        }

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

    } catch (error) {

        console.error(error);

        alert(
            "No se pudieron cargar los pacientes"
        );
    }
}


// ==========================================
// LISTAR USUARIOS
// ==========================================

async function listar() {

    try {

        const respuesta =
            await fetch("/usuarios");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los usuarios"
            );
        }

        const datos =
            await respuesta.json();

        const tabla =
            document.getElementById(
                "tablaUsuarios"
            );

        tabla.innerHTML = "";

        const usuarioSesion =
            obtenerUsuarioSesion();

        datos.forEach(u => {

            let pacienteNombre = "-";
            let idPaciente = "";

            if (u.paciente) {

                pacienteNombre =
                    u.paciente.nombre;

                idPaciente =
                    u.paciente.idPaciente;
            }


            // ==================================
            // BOTÓN EDITAR
            // ==================================

            let botonEditar = "";

            /*
             * ADMIN puede editar cualquier usuario.
             *
             * SECRETARIA puede editar usuarios,
             * excepto al ADMIN.
             */
            if (
                usuarioSesion.rol === "ADMIN" ||
                u.rol !== "ADMIN"
            ) {

                botonEditar = `
                    <button
                        onclick="editar(
                            ${u.idUsuario},
                            '${u.username}',
                            '${u.nombre}',
                            '${u.rol}',
                            '${idPaciente}',
                            ${u.estado}
                        )"
                    >
                        Editar
                    </button>
                `;
            }


            // ==================================
            // BOTÓN ELIMINAR
            // ==================================

            let botonEliminar = "";

            /*
             * Ningún ADMIN tendrá botón eliminar.
             */
            if (u.rol !== "ADMIN") {

                botonEliminar = `
                    <button
                        onclick="eliminar(
                            ${u.idUsuario}
                        )"
                    >
                        Eliminar
                    </button>
                `;
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
                        ${formatearRol(u.rol)}
                    </td>

                    <td>
                        ${pacienteNombre}
                    </td>

                    <td>
                        ${u.estado
                ? "Activo"
                : "Inactivo"}
                    </td>

                    <td>
                        ${botonEditar}
                        ${botonEliminar}
                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error(error);

        alert(
            "No se pudieron cargar los usuarios"
        );
    }
}


// ==========================================
// FORMATEAR ROL
// ==========================================

function formatearRol(rol) {

    if (rol === "ADMIN") {
        return "Administrador";
    }

    if (rol === "SECRETARIA") {
        return "Secretaria";
    }

    if (rol === "PACIENTE") {
        return "Paciente";
    }

    return rol;
}


// ==========================================
// GUARDAR / ACTUALIZAR
// ==========================================

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


    // ======================================
    // VALIDACIONES
    // ======================================

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


    /*
     * No se permite crear ADMIN
     * desde el formulario.
     */
    if (
        id === "" &&
        rol === "ADMIN"
    ) {

        alert(
            "No se pueden crear administradores desde esta opción"
        );

        return;
    }


    // ======================================
    // CONSTRUIR JSON
    // ======================================

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


    /*
     * Solo enviamos password si realmente
     * se ingresó una nueva.
     *
     * UsuarioService.actualizar()
     * conserva la contraseña anterior
     * cuando este campo no viene.
     */
    if (password !== "") {

        datos.password =
            password;
    }


    try {

        let respuesta;


        // ==================================
        // NUEVO USUARIO
        // ==================================

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

        }


            // ==================================
            // ACTUALIZAR USUARIO
        // ==================================

        else {

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


        // ==================================
        // ERROR DEL BACKEND
        // ==================================

        if (!respuesta.ok) {

            const mensaje =
                await respuesta.text();

            alert(
                mensaje ||
                "No se pudo guardar el usuario"
            );

            return;
        }


        alert(
            id === ""
                ? "Usuario registrado correctamente"
                : "Usuario actualizado correctamente"
        );


        limpiar();

        await listar();


    } catch (error) {

        console.error(error);

        alert(
            "Error de conexión con el servidor"
        );
    }
}


// ==========================================
// EDITAR
// ==========================================

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


    /*
     * No mostramos la contraseña actual.
     */
    document.getElementById(
        "password"
    ).value = "";


    document.getElementById(
        "nombre"
    ).value = nombre;


    configurarRolesFormulario(rol);


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


// ==========================================
// ELIMINAR
// ==========================================

async function eliminar(id) {

    const usuario =
        obtenerUsuarioSesion();


    /*
     * Evitamos que el usuario conectado
     * elimine su propia cuenta.
     */
    if (
        Number(usuario.idUsuario) ===
        Number(id)
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


    try {

        const respuesta =
            await fetch(
                "/usuarios/" + id,
                {
                    method: "DELETE"
                }
            );


        if (!respuesta.ok) {

            const mensaje =
                await respuesta.text();

            alert(
                mensaje ||
                "No se pudo eliminar el usuario"
            );

            return;
        }


        const mensaje =
            await respuesta.text();


        alert(
            mensaje ||
            "Usuario eliminado correctamente"
        );


        await listar();


    } catch (error) {

        console.error(error);

        alert(
            "Error de conexión con el servidor"
        );
    }
}


// ==========================================
// CAMBIAR ROL
// ==========================================

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


// ==========================================
// LIMPIAR FORMULARIO
// ==========================================

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


    configurarRolesFormulario();


    document.getElementById(
        "estado"
    ).value =
        "true";


    document.getElementById(
        "paciente"
    ).value = "";


    cambiarRol();
}


// ==========================================
// INICIAR PÁGINA
// ==========================================

async function iniciar() {

    configurarRolesFormulario();

    await cargarPacientes();

    cambiarRol();

    await listar();
}


iniciar();