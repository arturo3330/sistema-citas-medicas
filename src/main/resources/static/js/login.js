document
    .getElementById("formLogin")
    .addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            login();
        }
    );


async function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const mensaje =
        document.getElementById("mensaje");

    mensaje.innerText = "";

    if (username === "" || password === "") {

        mensaje.innerText =
            "Ingrese usuario y contraseña.";

        mensaje.style.color = "red";

        return;
    }

    try {

        const respuesta =
            await fetch(
                "/usuarios/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username: username,
                        password: password
                    })
                }
            );


        if (respuesta.ok) {

            const usuario =
                await respuesta.json();

            localStorage.setItem(
                "usuario",
                JSON.stringify(usuario)
            );

            window.location.href =
                "dashboard.html";

        } else {

            const texto =
                await respuesta.text();

            mensaje.innerText = texto;

            mensaje.style.color = "red";
        }

    } catch (error) {

        mensaje.innerText =
            "No se pudo conectar con el servidor.";

        mensaje.style.color = "red";

        console.error(error);
    }
}