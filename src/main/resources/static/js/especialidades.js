async function listar() {

    const respuesta =
        await fetch("/especialidades");

    const datos =
        await respuesta.json();

    const tabla =
        document.getElementById(
            "tablaEspecialidades"
        );

    tabla.innerHTML = "";

    datos.forEach(e => {

        tabla.innerHTML += `
            <tr>

                <td>
                    ${e.idEspecialidad}
                </td>

                <td>
                    ${e.nombre}
                </td>

                <td>
                    ${e.estado ? "Activo" : "Inactivo"}
                </td>

                <td>

                    <button onclick="editar(
                        ${e.idEspecialidad},
                        '${e.nombre}',
                        ${e.estado}
                    )">
                        Editar
                    </button>

                    <button onclick="eliminar(
                        ${e.idEspecialidad}
                    )">
                        Eliminar
                    </button>

                </td>

            </tr>
        `;
    });
}

async function guardar() {

    const id =
        document.getElementById(
            "idEspecialidad"
        ).value;

    const nombre =
        document.getElementById(
            "nombre"
        ).value;

    const estado =
        document.getElementById(
            "estado"
        ).value === "true";

    const datos = {
        nombre: nombre,
        estado: estado
    };

    if (id === "") {

        await fetch(
            "/especialidades",
            {

                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(datos)
            }
        );

    } else {

        await fetch(
            "/especialidades/" + id,
            {

                method: "PUT",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(datos)
            }
        );
    }

    limpiar();

    listar();
}

function editar(
    id,
    nombre,
    estado
) {

    document.getElementById(
        "idEspecialidad"
    ).value = id;

    document.getElementById(
        "nombre"
    ).value = nombre;

    document.getElementById(
        "estado"
    ).value = estado;
}

async function eliminar(id) {

    const confirmar =
        confirm(
            "¿Desea eliminar la especialidad?"
        );

    if (!confirmar) {
        return;
    }

    await fetch(
        "/especialidades/" + id,
        {
            method: "DELETE"
        }
    );

    listar();
}

function limpiar() {

    document.getElementById(
        "idEspecialidad"
    ).value = "";

    document.getElementById(
        "nombre"
    ).value = "";

    document.getElementById(
        "estado"
    ).value = "true";
}

listar();