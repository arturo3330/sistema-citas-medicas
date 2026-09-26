const usuarioSesion =
    JSON.parse(
        localStorage.getItem("usuario")
    );


if (!usuarioSesion) {

    window.location.href =
        "index.html";
}


function cerrarSesion() {

    localStorage.removeItem(
        "usuario"
    );

    window.location.href =
        "index.html";
}


function obtenerUsuarioSesion() {

    return usuarioSesion;
}


function esAdmin() {

    return usuarioSesion &&
        usuarioSesion.rol === "ADMIN";
}


function esPaciente() {

    return usuarioSesion &&
        usuarioSesion.rol === "PACIENTE";
}


function protegerAdmin() {

    if (!esAdmin()) {

        window.location.href =
            "dashboard.html";
    }
}