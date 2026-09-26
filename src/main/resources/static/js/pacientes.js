async function listar() {

    const respuesta = await fetch("/pacientes");
    const datos = await respuesta.json();

    const tabla = document.getElementById("tablaPacientes");

    tabla.innerHTML = "";

    datos.forEach(p => {

        tabla.innerHTML += `
            <tr>
                <td>${p.idPaciente}</td>
                <td>${p.dni}</td>
                <td>${p.nombre}</td>
                <td>${p.telefono ?? ""}</td>
                <td>${p.correo ?? ""}</td>

                <td>
                    <button onclick="editar(
                        ${p.idPaciente},
                        '${p.dni}',
                        '${p.nombre}',
                        '${p.telefono ?? ""}',
                        '${p.correo ?? ""}'
                    )">
                        Editar
                    </button>

                    <button onclick="eliminar(${p.idPaciente})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}


async function guardar() {

    const id =
        document.getElementById("idPaciente").value;

    const dni =
        document.getElementById("dni").value.trim();

    const nombre =
        document.getElementById("nombre").value.trim();

    const telefono =
        document.getElementById("telefono").value.trim();

    const correo =
        document.getElementById("correo").value.trim();

    if (dni === "" || nombre === "") {
        alert("DNI y nombre son obligatorios");
        return;
    }

    if (dni.length !== 8) {
        alert("El DNI debe tener 8 dígitos");
        return;
    }

    const datos = {
        dni: dni,
        nombre: nombre,
        telefono: telefono,
        correo: correo
    };

    let respuesta;

    if (id === "") {

        respuesta = await fetch("/pacientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });

    } else {

        respuesta = await fetch("/pacientes/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        });
    }

    if (!respuesta.ok) {
        alert("No se pudo guardar el paciente");
        return;
    }

    limpiar();
    listar();
}


function editar(
    id,
    dni,
    nombre,
    telefono,
    correo
) {

    document.getElementById("idPaciente").value = id;
    document.getElementById("dni").value = dni;
    document.getElementById("nombre").value = nombre;
    document.getElementById("telefono").value = telefono;
    document.getElementById("correo").value = correo;
}


async function eliminar(id) {

    const confirmar =
        confirm("¿Desea eliminar el paciente?");

    if (!confirmar) {
        return;
    }

    const respuesta = await fetch(
        "/pacientes/" + id,
        {
            method: "DELETE"
        }
    );

    if (!respuesta.ok) {
        alert("No se pudo eliminar el paciente");
        return;
    }

    listar();
}


function limpiar() {

    document.getElementById("idPaciente").value = "";
    document.getElementById("dni").value = "";
    document.getElementById("nombre").value = "";
    document.getElementById("telefono").value = "";
    document.getElementById("correo").value = "";
}


listar();