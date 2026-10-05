function formatearHoraPolitica(hora) {

    if (!hora) {
        return "";
    }

    const partes =
        hora.split(":");

    let horas =
        parseInt(partes[0]);

    const minutos =
        partes[1];

    const periodo =
        horas >= 12
            ? "p. m."
            : "a. m.";

    horas =
        horas % 12;

    if (horas === 0) {
        horas = 12;
    }

    return `${horas}:${minutos} ${periodo}`;
}


async function cargarPolitica() {

    try {

        const respuesta =
            await fetch(
                "/politica-clinica"
            );


        if (!respuesta.ok) {

            const mensaje =
                await respuesta.text();

            alert(
                mensaje ||
                "No se pudo cargar la política"
            );

            return;
        }


        const politica =
            await respuesta.json();


        // ================================
        // VISTA PARA TODOS
        // ================================

        document.getElementById(
            "vistaNombre"
        ).innerText =
            politica.nombre;


        document.getElementById(
            "vistaDias"
        ).innerText =
            politica.diasAnticipacion;


        document.getElementById(
            "vistaManana"
        ).innerText =
            `${formatearHoraPolitica(
                politica.horaInicioManana
            )} - ${formatearHoraPolitica(
                politica.horaFinManana
            )}`;


        document.getElementById(
            "vistaTarde"
        ).innerText =
            `${formatearHoraPolitica(
                politica.horaInicioTarde
            )} - ${formatearHoraPolitica(
                politica.horaFinTarde
            )}`;


        document.getElementById(
            "vistaPorcentaje"
        ).innerText =
            politica.porcentajePagoMinimo;


        document.getElementById(
            "vistaCancelacion"
        ).innerText =
            politica.horasLimiteCancelacion;


        // ================================
        // FORMULARIO SOLO PARA ADMIN
        // ================================

        if (esAdmin()) {

            document.getElementById(
                "formularioAdmin"
            ).style.display =
                "block";


            document.getElementById(
                "idPolitica"
            ).value =
                politica.idPolitica;


            document.getElementById(
                "nombre"
            ).value =
                politica.nombre;


            document.getElementById(
                "diasAnticipacion"
            ).value =
                politica.diasAnticipacion;


            document.getElementById(
                "horaInicioManana"
            ).value =
                politica.horaInicioManana
                    .substring(0, 5);


            document.getElementById(
                "horaFinManana"
            ).value =
                politica.horaFinManana
                    .substring(0, 5);


            document.getElementById(
                "horaInicioTarde"
            ).value =
                politica.horaInicioTarde
                    .substring(0, 5);


            document.getElementById(
                "horaFinTarde"
            ).value =
                politica.horaFinTarde
                    .substring(0, 5);


            document.getElementById(
                "porcentajePagoMinimo"
            ).value =
                politica.porcentajePagoMinimo;


            document.getElementById(
                "horasLimiteCancelacion"
            ).value =
                politica.horasLimiteCancelacion;
        }


    } catch (error) {

        console.error(error);

        alert(
            "No se pudo conectar con el servidor"
        );
    }
}


async function guardarPolitica() {

    if (!esAdmin()) {

        alert(
            "Solo el administrador puede modificar las políticas"
        );

        return;
    }


    const id =
        document.getElementById(
            "idPolitica"
        ).value;


    const nombre =
        document.getElementById(
            "nombre"
        ).value.trim();


    const diasAnticipacion =
        Number(
            document.getElementById(
                "diasAnticipacion"
            ).value
        );


    const horaInicioManana =
        document.getElementById(
            "horaInicioManana"
        ).value;


    const horaFinManana =
        document.getElementById(
            "horaFinManana"
        ).value;


    const horaInicioTarde =
        document.getElementById(
            "horaInicioTarde"
        ).value;


    const horaFinTarde =
        document.getElementById(
            "horaFinTarde"
        ).value;


    const porcentajePagoMinimo =
        Number(
            document.getElementById(
                "porcentajePagoMinimo"
            ).value
        );


    const horasLimiteCancelacion =
        Number(
            document.getElementById(
                "horasLimiteCancelacion"
            ).value
        );


    if (
        nombre === "" ||
        !diasAnticipacion ||
        horaInicioManana === "" ||
        horaFinManana === "" ||
        horaInicioTarde === "" ||
        horaFinTarde === ""
    ) {

        alert(
            "Complete todos los campos"
        );

        return;
    }


    const datos = {

        nombre:
        nombre,

        diasAnticipacion:
        diasAnticipacion,

        horaInicioManana:
        horaInicioManana,

        horaFinManana:
        horaFinManana,

        horaInicioTarde:
        horaInicioTarde,

        horaFinTarde:
        horaFinTarde,

        porcentajePagoMinimo:
        porcentajePagoMinimo,

        horasLimiteCancelacion:
        horasLimiteCancelacion,

        estado:
            true
    };


    try {

        const respuesta =
            await fetch(
                "/politica-clinica/" + id,
                {

                    method:
                        "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(datos)
                }
            );


        if (!respuesta.ok) {

            const mensaje =
                await respuesta.text();

            alert(
                mensaje ||
                "No se pudo actualizar la política"
            );

            return;
        }


        alert(
            "Política actualizada correctamente"
        );


        await cargarPolitica();


    } catch (error) {

        console.error(error);

        alert(
            "No se pudo conectar con el servidor"
        );
    }
}


cargarPolitica();