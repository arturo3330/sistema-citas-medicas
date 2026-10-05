const usuarioCuenta =
    obtenerUsuarioSesion();


// ==========================================
// FORMATEAR ROL
// ==========================================

function obtenerNombreRol(rol) {

    switch (rol) {

        case "ADMIN":
            return "Administrador";

        case "SECRETARIA":
            return "Secretaría";

        case "PACIENTE":
            return "Paciente";

        default:
            return rol || "-";
    }
}


// ==========================================
// MOSTRAR DATOS GENERALES
// ==========================================

function cargarDatosCuenta() {

    const nombre =
        usuarioCuenta.nombre ||
        usuarioCuenta.username ||
        "Usuario";


    const username =
        usuarioCuenta.username ||
        "-";


    const rol =
        obtenerNombreRol(
            usuarioCuenta.rol
        );


    const estado =
        usuarioCuenta.estado === true
            ? "Activo"
            : "Inactivo";


    // ======================================
    // CABECERA
    // ======================================

    document.getElementById(
        "nombreCuenta"
    ).innerText =
        nombre;


    document.getElementById(
        "usernameCuenta"
    ).innerText =
        username;


    document.getElementById(
        "rolCuenta"
    ).innerText =
        rol;


    document.getElementById(
        "avatarCuenta"
    ).innerText =
        nombre
            .trim()
            .charAt(0)
            .toUpperCase();


    // ======================================
    // DATOS
    // ======================================

    document.getElementById(
        "datoNombre"
    ).innerText =
        nombre;


    document.getElementById(
        "datoUsername"
    ).innerText =
        username;


    document.getElementById(
        "datoRol"
    ).innerText =
        rol;


    document.getElementById(
        "datoEstado"
    ).innerText =
        estado;


    // ======================================
    // PACIENTE
    // ======================================

    if (
        esPaciente()
        &&
        usuarioCuenta.paciente
    ) {

        document.getElementById(
            "seccionPacienteCuenta"
        ).style.display =
            "block";


        document.getElementById(
            "datoDni"
        ).innerText =
            usuarioCuenta.paciente.dni ||
            "-";


        document.getElementById(
            "datoTelefono"
        ).innerText =
            usuarioCuenta.paciente.telefono ||
            "-";


        document.getElementById(
            "datoCorreo"
        ).innerText =
            usuarioCuenta.paciente.correo ||
            "-";
    }
}


// ==========================================
// INICIAR
// ==========================================

cargarDatosCuenta();