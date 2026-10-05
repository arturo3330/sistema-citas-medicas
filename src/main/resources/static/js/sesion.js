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


function esSecretaria() {

    return usuarioSesion &&
        usuarioSesion.rol === "SECRETARIA";
}


function esPaciente() {

    return usuarioSesion &&
        usuarioSesion.rol === "PACIENTE";
}


function esPersonalClinica() {

    return esAdmin() ||
        esSecretaria();
}


function protegerAdmin() {

    if (!esAdmin()) {

        window.location.href =
            "dashboard.html";
    }
}


function protegerPersonalClinica() {

    if (!esPersonalClinica()) {

        window.location.href =
            "dashboard.html";
    }
}


function protegerPaciente() {

    if (!esPaciente()) {

        window.location.href =
            "dashboard.html";
    }
}