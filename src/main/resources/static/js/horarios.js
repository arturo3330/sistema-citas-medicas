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



async function cargarMedicos() {

    try {

        const respuesta =
            await fetch("/medicos");

        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron obtener los médicos"
            );
        }

        const datos =
            await respuesta.json();

        const select =
            document.getElementById(
                "medico"
            );

        select.innerHTML = "";


        if (datos.length === 0) {

            select.innerHTML = `
                <option value="">
                    No hay médicos registrados
                </option>
            `;

            return;
        }


        datos.forEach(m => {

            select.innerHTML += `
                <option value="${m.idMedico}">
                    ${m.nombre}
                    -
                    ${m.especialidad.nombre}
                </option>
            `;
        });

    } catch (error) {

        console.error(error);
    }
}



async function listar() {

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

        const tabla =
            document.getElementById(
                "tablaHorarios"
            );

        tabla.innerHTML = "";


        datos.forEach(h => {

            tabla.innerHTML += `
                <tr>

                    <td>
                        ${h.idHorario}
                    </td>

                    <td>
                        ${h.medico.nombre}
                    </td>

                    <td>
                        ${h.medico.especialidad.nombre}
                    </td>

                    <td>
                        ${formatearFecha(h.fecha)}
                    </td>

                    <td>
                        ${formatearHora(h.hora)}
                    </td>

                    <td>
                        ${h.estado}
                    </td>

                    <td>

                        <button onclick="editar(
                            ${h.idHorario},
                            ${h.medico.idMedico},
                            '${h.fecha}',
                            '${h.hora}',
                            '${h.estado}'
                        )">
                            Editar
                        </button>

                        <button onclick="eliminar(
                            ${h.idHorario}
                        )">
                            Eliminar
                        </button>

                    </td>

                </tr>
            `;
        });

    } catch (error) {

        console.error(error);
    }
}



async function guardar() {

    const id =
        document.getElementById(
            "idHorario"
        ).value;

    const idMedico =
        document.getElementById(
            "medico"
        ).value;

    const fecha =
        document.getElementById(
            "fecha"
        ).value;

    const hora =
        document.getElementById(
            "hora"
        ).value;

    const estado =
        document.getElementById(
            "estado"
        ).value;


    if (
        idMedico === "" ||
        fecha === "" ||
        hora === ""
    ) {

        alert(
            "Complete todos los campos"
        );

        return;
    }


    const datos = {

        medico: {

            idMedico:
                Number(idMedico)

        },

        fecha:
        fecha,

        hora:
        hora,

        estado:
        estado
    };


    let respuesta;


    try {

        if (id === "") {

            respuesta =
                await fetch(
                    "/horarios",
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                datos
                            )
                    }
                );

        } else {

            respuesta =
                await fetch(
                    "/horarios/" + id,
                    {

                        method:
                            "PUT",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                datos
                            )
                    }
                );
        }


        if (!respuesta.ok) {

            const texto =
                await respuesta.text();

            alert(
                texto ||
                "No se pudo guardar el horario"
            );

            return;
        }


        limpiar();

        await listar();

    } catch (error) {

        console.error(error);

        alert(
            "No se pudo conectar con el servidor"
        );
    }
}



function editar(
    id,
    idMedico,
    fecha,
    hora,
    estado
) {

    document.getElementById(
        "idHorario"
    ).value = id;


    document.getElementById(
        "medico"
    ).value =
        idMedico;


    document.getElementById(
        "fecha"
    ).value =
        fecha;


    /*
     * El input type="time"
     * necesita HH:mm.
     *
     * Por eso aquí usamos la hora
     * original, no la hora formateada.
     *
     * Ejemplo:
     * 14:30:00 -> 14:30
     */
    document.getElementById(
        "hora"
    ).value =
        hora.substring(
            0,
            5
        );


    document.getElementById(
        "estado"
    ).value =
        estado;
}



async function eliminar(id) {

    const confirmar =
        confirm(
            "¿Desea eliminar el horario?"
        );


    if (!confirmar) {

        return;
    }


    try {

        const respuesta =
            await fetch(
                "/horarios/" + id,
                {

                    method:
                        "DELETE"

                }
            );


        if (!respuesta.ok) {

            const texto =
                await respuesta.text();

            alert(
                texto ||
                "No se pudo eliminar el horario"
            );

            return;
        }


        await listar();

    } catch (error) {

        console.error(error);

        alert(
            "No se pudo conectar con el servidor"
        );
    }
}



function limpiar() {

    document.getElementById(
        "idHorario"
    ).value = "";


    document.getElementById(
        "fecha"
    ).value = "";


    document.getElementById(
        "hora"
    ).value = "";


    document.getElementById(
        "estado"
    ).value =
        "DISPONIBLE";
}



async function iniciar() {

    await cargarMedicos();

    await listar();
}


iniciar();