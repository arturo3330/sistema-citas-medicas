const usuarioCambioClave =
    obtenerUsuarioSesion();


if (usuarioCambioClave) {

    document.getElementById(
        "usuarioActual"
    ).innerText =
        usuarioCambioClave.username;
}


async function cambiarClave() {

    const claveActual =
        document.getElementById(
            "claveActual"
        ).value;

    const claveNueva =
        document.getElementById(
            "claveNueva"
        ).value;

    const confirmarClave =
        document.getElementById(
            "confirmarClave"
        ).value;

    const mensaje =
        document.getElementById(
            "mensaje"
        );


    mensaje.innerText = "";


    // Validar campos
    if (
        claveActual === "" ||
        claveNueva === "" ||
        confirmarClave === ""
    ) {

        mensaje.innerText =
            "Complete todos los campos.";

        mensaje.style.color =
            "red";

        return;
    }


    // Validar confirmación
    if (
        claveNueva !==
        confirmarClave
    ) {

        mensaje.innerText =
            "Las nuevas contraseñas no coinciden.";

        mensaje.style.color =
            "red";

        return;
    }


    // Validar tamaño mínimo
    if (claveNueva.length < 4) {

        mensaje.innerText =
            "La nueva contraseña debe tener al menos 4 caracteres.";

        mensaje.style.color =
            "red";

        return;
    }


    // Evitar reutilizar exactamente
    // la misma contraseña
    if (
        claveNueva ===
        claveActual
    ) {

        mensaje.innerText =
            "La nueva contraseña debe ser diferente a la actual.";

        mensaje.style.color =
            "red";

        return;
    }


    try {

        const respuesta =
            await fetch(
                "/usuarios/cambiar-clave",
                {

                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        username:
                        usuarioCambioClave.username,

                        claveActual:
                        claveActual,

                        claveNueva:
                        claveNueva

                    })
                }
            );


        const texto =
            await respuesta.text();


        if (respuesta.ok) {

            mensaje.innerText =
                "Contraseña actualizada correctamente.";

            mensaje.style.color =
                "green";


            document.getElementById(
                "claveActual"
            ).value = "";

            document.getElementById(
                "claveNueva"
            ).value = "";

            document.getElementById(
                "confirmarClave"
            ).value = "";

        } else {

            mensaje.innerText =
                texto;

            mensaje.style.color =
                "red";
        }

    } catch (error) {

        mensaje.innerText =
            "Error al conectar con el servidor.";

        mensaje.style.color =
            "red";

        console.error(error);
    }
}