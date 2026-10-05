async function listarEspecialidades() {

    const tabla =
        document.getElementById(
            "tablaEspecialidades"
        );


    tabla.innerHTML = `

        <tr>

            <td colspan="3">

                Cargando especialidades...

            </td>

        </tr>
    `;


    try {

        const respuesta =
            await fetch(
                "/especialidades"
            );


        if (!respuesta.ok) {

            throw new Error(
                "No se pudieron cargar las especialidades"
            );
        }


        const especialidades =
            await respuesta.json();


        const activas =
            especialidades.filter(
                especialidad =>
                    especialidad.estado === true
            );


        tabla.innerHTML =
            "";


        if (
            activas.length === 0
        ) {

            tabla.innerHTML = `

                <tr>

                    <td colspan="3">

                        No hay especialidades disponibles.

                    </td>

                </tr>
            `;

            return;
        }


        activas.forEach(
            especialidad => {

                const costo =
                    Number(
                        especialidad
                            .costoConsulta
                        ?? 0
                    );


                tabla.innerHTML += `

                    <tr>

                        <td>
                            ${
                    especialidad
                        .nombre
                    ?? ""
                }
                        </td>

                        <td>
                            ${
                    especialidad
                        .tiempoAtencionMinutos
                    ?? 0
                } min
                        </td>

                        <td>
                            S/ ${costo.toFixed(2)}
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

                <td colspan="3">

                    No se pudieron cargar
                    las especialidades.

                </td>

            </tr>
        `;
    }
}


listarEspecialidades();