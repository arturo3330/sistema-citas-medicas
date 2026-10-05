async function listarMedicos() {

    const tabla =
        document.getElementById(
            "tablaMedicos"
        );


    tabla.innerHTML = `

        <tr>

            <td colspan="4">

                Cargando médicos...

            </td>

        </tr>
    `;


    try {

        const respuesta =
            await fetch(
                "/medicos"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar los médicos"
            );
        }


        const medicos =
            await respuesta.json();


        const activos =
            medicos.filter(
                medico =>
                    medico.estado === true
            );


        tabla.innerHTML =
            "";


        if (
            activos.length === 0
        ) {

            tabla.innerHTML = `

                <tr>

                    <td colspan="4">

                        No hay médicos disponibles.

                    </td>

                </tr>
            `;

            return;
        }


        activos.forEach(
            medico => {

                tabla.innerHTML += `

                    <tr>

                        <td>
                            ${medico.nombre ?? ""}
                        </td>

                        <td>
                            ${medico.cmp ?? ""}
                        </td>

                        <td>
                            ${
                    medico.especialidad
                        ?.nombre
                    ?? ""
                }
                        </td>

                        <td>
                            Activo
                        </td>

                    </tr>
                `;
            }
        );


    } catch (error) {

        console.error(
            error
        );


        tabla.innerHTML = `

            <tr>

                <td colspan="4">

                    No se pudieron cargar
                    los médicos.

                </td>

            </tr>
        `;
    }
}


listarMedicos();