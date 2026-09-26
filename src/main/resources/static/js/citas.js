async function cargarPacientes() {

    const respuesta = await fetch("/pacientes");
    const datos = await respuesta.json();

    const select = document.getElementById("paciente");

    select.innerHTML = "";

    datos.forEach(p => {

        select.innerHTML += `
            <option value="${p.idPaciente}">
                ${p.nombre} - DNI: ${p.dni}
            </option>
        `;
    });
}


async function cargarHorarios() {

    const respuesta = await fetch("/horarios");
    const datos = await respuesta.json();

    const select = document.getElementById("horario");

    select.innerHTML = "";

    const disponibles =
        datos.filter(h => h.estado === "DISPONIBLE");

    if (disponibles.length === 0) {

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
                - ${h.medico.especialidad.nombre}
                - ${formatearFecha(h.fecha)}
                - ${formatearHora(h.hora)}
            </option>
        `;
    });
}


async function listarCitas() {

    const respuesta = await fetch("/citas");
    const datos = await respuesta.json();

    const tabla =
        document.getElementById("tablaCitas");

    tabla.innerHTML = "";

    datos.forEach(c => {

        tabla.innerHTML += `
            <tr>

                <td>
                    ${c.idCita}
                </td>

                <td>
                    ${c.paciente.nombre}
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


async function reservar() {

    const idPaciente =
        document.getElementById("paciente").value;

    const idHorario =
        document.getElementById("horario").value;

    const mensaje =
        document.getElementById("mensaje");

    mensaje.innerText = "";

    if (
        idPaciente === "" ||
        idHorario === ""
    ) {

        mensaje.innerText =
            "Seleccione paciente y horario.";

        mensaje.style.color = "red";

        return;
    }

    const respuesta = await fetch(
        "/citas/reservar",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                idPaciente: Number(idPaciente),
                idHorario: Number(idHorario)
            })
        }
    );

    const contenido =
        await respuesta.text();

    if (respuesta.ok) {

        mensaje.innerText =
            "Cita registrada correctamente.";

        mensaje.style.color = "green";

        await cargarHorarios();
        await listarCitas();

    } else {

        mensaje.innerText = contenido;

        mensaje.style.color = "red";
    }
}


async function iniciar() {

    await cargarPacientes();

    await cargarHorarios();

    await listarCitas();
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

iniciar();