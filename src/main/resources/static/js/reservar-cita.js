function formatearFecha(fecha) {

    if (!fecha) {
        return "";
    }

    const partes = fecha.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


function formatearHora(hora) {

    if (!hora) {
        return "";
    }

    const partes = hora.split(":");

    let horas = parseInt(partes[0]);
    const minutos = partes[1];

    const periodo =
        horas >= 12 ? "p. m." : "a. m.";

    horas = horas % 12;

    if (horas === 0) {
        horas = 12;
    }

    return `${horas}:${minutos} ${periodo}`;
}


const usuarioPaciente =
    obtenerUsuarioSesion();


if (!esPaciente()) {

    window.location.href =
        "dashboard.html";
}


if (!usuarioPaciente.paciente) {

    alert(
        "Este usuario no tiene un paciente asociado."
    );

    window.location.href =
        "dashboard.html";
}


document.getElementById(
    "nombrePaciente"
).innerText =
    usuarioPaciente.paciente.nombre;



async function cargarHorarios() {

    try {

        const respuesta =
            await fetch("/horarios");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los horarios"
            );
        }

        const datos =
            await respuesta.json();

        const select =
            document.getElementById(
                "horario"
            );

        select.innerHTML = "";


        const disponibles =
            datos.filter(
                h =>
                    h.estado ===
                    "DISPONIBLE"
            );


        if (
            disponibles.length === 0
        ) {

            select.innerHTML = `
                <option value="">
                    No hay horarios disponibles
                </option>
            `;

            return;
        }


        disponibles.forEach(h => {

            select.innerHTML += `
                <option value="${h.idHorario}">
                    ${h.medico.nombre}
                    -
                    ${h.medico.especialidad.nombre}
                    -
                    ${formatearFecha(h.fecha)}
                    -
                    ${formatearHora(h.hora)}
                </option>
            `;
        });

    } catch (error) {

        console.error(error);

        const select =
            document.getElementById(
                "horario"
            );

        select.innerHTML = `
            <option value="">
                Error al cargar horarios
            </option>
        `;
    }
}



async function reservar() {

    const idHorario =
        document.getElementById(
            "horario"
        ).value;


    const mensaje =
        document.getElementById(
            "mensaje"
        );


    mensaje.innerText = "";


    if (idHorario === "") {

        mensaje.innerText =
            "Seleccione un horario.";

        mensaje.style.color =
            "red";

        return;
    }


    try {

        const respuesta =
            await fetch(
                "/citas/reservar",
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            idHorario:
                                Number(idHorario),

                            idPaciente:
                            usuarioPaciente
                                .paciente
                                .idPaciente

                        })
                }
            );


        const texto =
            await respuesta.text();


        if (respuesta.ok) {

            mensaje.innerText =
                "Cita registrada correctamente.";

            mensaje.style.color =
                "green";

            await cargarHorarios();

        } else {

            mensaje.innerText =
                texto;

            mensaje.style.color =
                "red";
        }

    } catch (error) {

        console.error(error);

        mensaje.innerText =
            "No se pudo conectar con el servidor.";

        mensaje.style.color =
            "red";
    }
}


cargarHorarios();