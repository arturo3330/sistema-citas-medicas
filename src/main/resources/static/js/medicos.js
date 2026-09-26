async function cargarEspecialidades() {

    const respuesta = await fetch("/especialidades");
    const datos = await respuesta.json();

    const select = document.getElementById("especialidad");

    select.innerHTML = "";

    datos.forEach(e => {

        select.innerHTML += `
            <option value="${e.idEspecialidad}">
                ${e.nombre}
            </option>
        `;
    });
}


async function listar() {

    const respuesta = await fetch("/medicos");
    const datos = await respuesta.json();

    const tabla = document.getElementById("tablaMedicos");

    tabla.innerHTML = "";

    datos.forEach(m => {

        tabla.innerHTML += `
            <tr>

                <td>${m.idMedico}</td>

                <td>${m.nombre}</td>

                <td>${m.cmp}</td>

                <td>${m.especialidad.nombre}</td>

                <td>
                    ${m.estado ? "Activo" : "Inactivo"}
                </td>

                <td>

                    <button onclick="editar(
                        ${m.idMedico},
                        '${m.nombre}',
                        '${m.cmp}',
                        ${m.especialidad.idEspecialidad},
                        ${m.estado}
                    )">
                        Editar
                    </button>

                    <button onclick="eliminar(${m.idMedico})">
                        Eliminar
                    </button>

                </td>

            </tr>
        `;
    });
}


async function guardar() {

    const id =
        document.getElementById("idMedico").value;

    const nombre =
        document.getElementById("nombre").value;

    const cmp =
        document.getElementById("cmp").value;

    const idEspecialidad =
        document.getElementById("especialidad").value;

    const estado =
        document.getElementById("estado").value === "true";

    const datos = {

        nombre: nombre,

        cmp: cmp,

        especialidad: {
            idEspecialidad: Number(idEspecialidad)
        },

        estado: estado
    };


    if (id === "") {

        await fetch("/medicos", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datos)
        });

    } else {

        await fetch("/medicos/" + id, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(datos)
        });
    }

    limpiar();

    listar();
}


function editar(
    id,
    nombre,
    cmp,
    idEspecialidad,
    estado
) {

    document.getElementById("idMedico").value = id;

    document.getElementById("nombre").value = nombre;

    document.getElementById("cmp").value = cmp;

    document.getElementById("especialidad").value =
        idEspecialidad;

    document.getElementById("estado").value =
        estado.toString();
}


async function eliminar(id) {

    const confirmar =
        confirm("¿Desea eliminar el médico?");

    if (!confirmar) {
        return;
    }

    await fetch(
        "/medicos/" + id,
        {
            method: "DELETE"
        }
    );

    listar();
}


function limpiar() {

    document.getElementById("idMedico").value = "";

    document.getElementById("nombre").value = "";

    document.getElementById("cmp").value = "";

    document.getElementById("estado").value = "true";
}


async function iniciar() {

    await cargarEspecialidades();

    await listar();
}


iniciar();