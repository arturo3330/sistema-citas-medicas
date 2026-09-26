const usuarioPaciente =
    obtenerUsuarioSesion();


if (!esPaciente()) {

    window.location.href =
        "dashboard.html";
}


async function listarMisCitas() {

    const idPaciente =
        usuarioPaciente
            .paciente
            .idPaciente;


    const respuesta =
        await fetch(
            "/citas/paciente/"
            + idPaciente
        );


    const datos =
        await respuesta.json();


    const tabla =
        document.getElementById(
            "tablaCitas"
        );


    tabla.innerHTML = "";


    datos.forEach(c => {

        tabla.innerHTML += `
            <tr>

                <td>
                    ${c.idCita}
                </td>

                <td>
                    ${c.horario.medico.nombre}
                </td>

                <td>
                    ${c.horario.medico.especialidad.nombre}
                </td>

                <td>
                    ${formatearFecha(c.horario.fecha)}
                </td>

                <td>
                    ${formatearHora(c.horario.hora)}
                </td>

                <td>
                    ${c.estado}
                </td>

            </tr>
        `;
    });
}

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

listarMisCitas();