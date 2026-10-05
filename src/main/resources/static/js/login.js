// ==========================================
// ELEMENTOS
// ==========================================

const inputUsername =
    document.getElementById(
        "username"
    );


const inputPassword =
    document.getElementById(
        "password"
    );


const botonIngresar =
    document.getElementById(
        "btnIngresar"
    );


const mensaje =
    document.getElementById(
        "mensaje"
    );


// ==========================================
// LOGIN
// ==========================================

async function login() {

    const username =
        inputUsername.value.trim();


    const password =
        inputPassword.value;


    mensaje.innerText = "";


    // ======================================
    // VALIDACIONES
    // ======================================

    if (
        username === ""
        ||
        password === ""
    ) {

        mensaje.innerText =
            "Ingrese usuario y contraseña.";

        mensaje.style.color =
            "#b3261e";

        return;
    }


    botonIngresar.disabled =
        true;


    botonIngresar.innerText =
        "Ingresando...";


    try {

        const respuesta =
            await fetch(
                "/usuarios/login",
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            username:
                            username,

                            password:
                            password
                        })
                }
            );


        if (!respuesta.ok) {

            const texto =
                await respuesta.text();


            mensaje.innerText =
                texto ||
                "Usuario o contraseña incorrectos.";

            mensaje.style.color =
                "#b3261e";

            return;
        }


        const usuario =
            await respuesta.json();


        // ======================================
        // GUARDAR SESIÓN
        // ======================================

        localStorage.setItem(
            "usuario",
            JSON.stringify(
                usuario
            )
        );


        // ======================================
        // IR AL NUEVO INICIO
        // ======================================

        window.location.href =
            "dashboard.html";


    } catch (error) {

        console.error(error);


        mensaje.innerText =
            "No se pudo conectar con el servidor.";

        mensaje.style.color =
            "#b3261e";

    } finally {

        botonIngresar.disabled =
            false;


        botonIngresar.innerText =
            "Ingresar";
    }
}


// ==========================================
// ENTER PARA INICIAR SESIÓN
// ==========================================

function detectarEnter(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        login();
    }
}


inputUsername.addEventListener(
    "keydown",
    detectarEnter
);


inputPassword.addEventListener(
    "keydown",
    detectarEnter
);


// ==========================================
// FOCO INICIAL
// ==========================================

window.addEventListener(
    "load",
    () => {

        inputUsername.focus();

    }
);