// ==========================================
// NAVBAR GLOBAL - MAKANITOS
// ==========================================

const usuarioNavbar =
    obtenerUsuarioSesion();

// ==========================================
// CREAR FOOTER GLOBAL
// ==========================================

function crearFooter() {

    /*
     * Evitar crear el footer dos veces.
     */
    if (
        document.getElementById(
            "footerMakanitos"
        )
    ) {

        return;
    }


    const footer =
        document.createElement(
            "footer"
        );


    footer.id =
        "footerMakanitos";


    footer.className =
        "footer-makanitos";


    footer.innerHTML = `

        <div class="footer-contenido">


            <!-- ==================================
                 IDENTIDAD / SOBRE NOSOTROS
                 ================================== -->

            <div class="footer-columna footer-identidad">

                <a
                    href="dashboard.html"
                    class="footer-brand">

                    <span class="footer-brand-icon">
                        ✚
                    </span>


                    <span class="footer-brand-texto">

                        <span>
                            Clínica
                        </span>

                        <strong>
                            Makanitos
                        </strong>

                    </span>

                </a>


                <h3>
                    Sobre nosotros
                </h3>


                <p>
                    En Clínica Makanitos trabajamos
                    para brindar una atención médica
                    organizada, accesible y cercana
                    a nuestros pacientes.
                </p>

            </div>


            <!-- ==================================
                 LEGAL
                 ================================== -->

            <div class="footer-columna">

                <h3>
                    Legal
                </h3>


                <a
                    href="politica-clinica.html"
                    class="footer-link">

                    Política de Clínica

                </a>

            </div>


            <!-- ==================================
                 INFORMACIÓN
                 ================================== -->

            <div class="footer-columna">

                <h3>
                    Atención
                </h3>


                <p>
                    Sistema de gestión de citas,
                    médicos, horarios y pagos.
                </p>


                <p>
                    Atención organizada según
                    las políticas vigentes
                    de la clínica.
                </p>

            </div>

        </div>


        <!-- ======================================
             PARTE INFERIOR
             ====================================== -->

        <div class="footer-inferior">

            <span>
                © ${new Date().getFullYear()}
                Clínica Makanitos
            </span>


            <span>
                Todos los derechos reservados
            </span>

        </div>
    `;


    document.body.appendChild(
        footer
    );
}

// ==========================================
// CREAR BARRA DE NAVEGACIÓN
// ==========================================

function crearNavbar() {

    const contenedor =
        document.getElementById(
            "appNavbar"
        );


    if (!contenedor) {

        console.error(
            "No existe el elemento #appNavbar"
        );

        return;
    }


    let menusRol = "";


    // ======================================
    // ADMIN
    // ======================================

    if (esAdmin()) {

        menusRol = `

            <div class="nav-item">

                <button
                    class="nav-dropdown-btn"
                    type="button"
                    onclick="toggleMenu('menuGestion')">

                    Gestión clínica

                    <span class="nav-flecha">
                        ▾
                    </span>

                </button>

                <div
                    class="nav-dropdown"
                    id="menuGestion">

                    <a href="especialidades.html">
                        Especialidades
                    </a>

                    <a href="medicos.html">
                        Médicos
                    </a>

                    <a href="disponibilidad-medicos.html">
                        Disponibilidad médica
                    </a>

                </div>

            </div>


            <div class="nav-item">

                <button
                    class="nav-dropdown-btn"
                    type="button"
                    onclick="toggleMenu('menuAtencion')">

                    Atención

                    <span class="nav-flecha">
                        ▾
                    </span>

                </button>

                <div
                    class="nav-dropdown"
                    id="menuAtencion">

                    <a href="pacientes.html">
                        Pacientes
                    </a>

                    <a href="horarios.html">
                        Horarios
                    </a>

                    <a href="citas.html">
                        Citas
                    </a>

                </div>

            </div>


            <div class="nav-item">

                <button
                    class="nav-dropdown-btn"
                    type="button"
                    onclick="toggleMenu('menuFinanzas')">

                    Finanzas

                    <span class="nav-flecha">
                        ▾
                    </span>

                </button>

                <div
                    class="nav-dropdown"
                    id="menuFinanzas">

                    <a href="pagos.html">
                        Pagos
                    </a>

                </div>

            </div>


            <div class="nav-item">

                <button
                    class="nav-dropdown-btn"
                    type="button"
                    onclick="toggleMenu('menuAdministracion')">

                    Administración

                    <span class="nav-flecha">
                        ▾
                    </span>

                </button>

                <div
                    class="nav-dropdown"
                    id="menuAdministracion">

                    <a href="usuarios.html">
                        Usuarios
                    </a>

                    

                </div>

            </div>
        `;
    }


        // ======================================
        // SECRETARIA
    // ======================================

    else if (esSecretaria()) {

        menusRol = `

            <div class="nav-item">

                <button
                    class="nav-dropdown-btn"
                    type="button"
                    onclick="toggleMenu('menuGestion')">

                    Gestión clínica

                    <span class="nav-flecha">
                        ▾
                    </span>

                </button>

                <div
                    class="nav-dropdown"
                    id="menuGestion">

                    <a href="especialidades.html">
                        Especialidades
                    </a>

                    <a href="medicos.html">
                        Médicos
                    </a>

                    <a href="disponibilidad-medicos.html">
                        Disponibilidad médica
                    </a>

                </div>

            </div>


            <div class="nav-item">

                <button
                    class="nav-dropdown-btn"
                    type="button"
                    onclick="toggleMenu('menuAtencion')">

                    Atención

                    <span class="nav-flecha">
                        ▾
                    </span>

                </button>

                <div
                    class="nav-dropdown"
                    id="menuAtencion">

                    <a href="pacientes.html">
                        Pacientes
                    </a>

                    <a href="horarios.html">
                        Horarios
                    </a>

                    <a href="citas.html">
                        Citas
                    </a>

                </div>

            </div>


            <div class="nav-item">

                <button
                    class="nav-dropdown-btn"
                    type="button"
                    onclick="toggleMenu('menuFinanzas')">

                    Finanzas

                    <span class="nav-flecha">
                        ▾
                    </span>

                </button>

                <div
                    class="nav-dropdown"
                    id="menuFinanzas">

                    <a href="pagos.html">
                        Pagos
                    </a>

                </div>

            </div>


            <div class="nav-item">

                <button
                    class="nav-dropdown-btn"
                    type="button"
                    onclick="toggleMenu('menuAdministracion')">

                    Administración

                    <span class="nav-flecha">
                        ▾
                    </span>

                </button>

                <div
                    class="nav-dropdown"
                    id="menuAdministracion">

                    <a href="usuarios.html">
                        Usuarios
                    </a>

                </div>

            </div>
        `;
    }


        // ======================================
        // PACIENTE
    // ======================================

    else if (esPaciente()) {

        menusRol = `

            <div class="nav-item">

                <button
                    class="nav-dropdown-btn"
                    type="button"
                    onclick="toggleMenu('menuCitasPaciente')">

                    Citas

                    <span class="nav-flecha">
                        ▾
                    </span>

                </button>

                <div
                    class="nav-dropdown"
                    id="menuCitasPaciente">

                    <a href="reservar-cita.html">
                        Reservar cita
                    </a>

                    <a href="mis-citas.html">
                        Mis citas
                    </a>

                </div>

            </div>


            <a
                class="nav-link"
                href="buscar-medico.html">

                Buscar médico

            </a>


            <a
                class="nav-link"
                href="especialidades-paciente.html">

                Especialidades

            </a>


            <a
                class="nav-link"
                href="mis-pagos.html">

                Mis pagos

            </a>


        `;
    }


    // ======================================
    // HTML DE LA BARRA
    // ======================================

    contenedor.innerHTML = `

        <nav class="navbar-makanitos">

            <div class="navbar-contenido">


                <!-- IZQUIERDA -->

                <div class="navbar-izquierda">

                    <a
                        class="navbar-brand"
                        href="dashboard.html">

                        <span class="brand-icon">
                            ✚
                        </span>


                        <span class="brand-texto">

                            <span>
                                Clínica
                            </span>

                            <span>
                                Makanitos
                            </span>

                        </span>

                    </a>


                    <button
                        type="button"
                        class="nav-mobile-btn"
                        onclick="toggleNavegacionMobile()"
                        aria-label="Abrir menú">

                        ☰

                    </button>


                    <div
    class="navbar-links"
    id="navbarLinks">

    ${menusRol}

</div>

                </div>


                <!-- DERECHA -->

                <div class="navbar-derecha">
${esPaciente() ? `
    <a
        class="navbar-accion-principal"
        href="reservar-cita.html">

        Agendar cita

    </a>

` : esSecretaria() ? `
    <a
        class="navbar-accion-principal"
        href="citas.html">

        Nueva cita

    </a>

` : ""}
                    <div class="perfil-wrapper">

                        <button
                            type="button"
                            class="perfil-boton"
                            onclick="toggleMenu('menuPerfil')">

                            <span class="perfil-avatar">
                                ${obtenerInicialUsuario()}
                            </span>


                            <span class="perfil-info">

                                <span class="perfil-nombre">

                                    ${escaparHtml(
        usuarioNavbar.nombre
        ||
        usuarioNavbar.username
    )}

                                </span>


                                <span class="perfil-rol">

                                    ${formatearRol(
        usuarioNavbar.rol
    )}

                                </span>

                            </span>


                            <span class="nav-flecha">
                                ▾
                            </span>

                        </button>


                        <div
                            class="nav-dropdown perfil-dropdown"
                            id="menuPerfil">

                            <div class="perfil-dropdown-header">

                                <strong>

                                    ${escaparHtml(
        usuarioNavbar.nombre
        ||
        usuarioNavbar.username
    )}

                                </strong>

                                <span>

                                    ${escaparHtml(
        usuarioNavbar.username
    )}

                                </span>

                            </div>


                            <div class="dropdown-separador">
                            </div>


                            <a href="mi-cuenta.html">
                                Mi cuenta
                            </a>


                            <a href="cambiar-clave.html">
                                Cambiar contraseña
                            </a>


                            <button
                                type="button"
                                class="cerrar-sesion-btn"
                                onclick="cerrarSesion()">

                                Cerrar sesión

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </nav>
    `;
}


// ==========================================
// ABRIR / CERRAR DROPDOWN
// ==========================================

function toggleMenu(idMenu) {

    const menu =
        document.getElementById(
            idMenu
        );


    if (!menu) {

        return;
    }


    const estabaAbierto =
        menu.classList.contains(
            "mostrar"
        );


    cerrarMenus();


    if (!estabaAbierto) {

        menu.classList.add(
            "mostrar"
        );
    }
}


// ==========================================
// CERRAR TODOS LOS MENÚS
// ==========================================

function cerrarMenus() {

    document
        .querySelectorAll(
            ".nav-dropdown"
        )
        .forEach(
            menu => {

                menu.classList.remove(
                    "mostrar"
                );
            }
        );
}


// ==========================================
// MENÚ MÓVIL
// ==========================================

function toggleNavegacionMobile() {

    const links =
        document.getElementById(
            "navbarLinks"
        );


    if (!links) {

        return;
    }


    links.classList.toggle(
        "mostrar-mobile"
    );
}


// ==========================================
// INICIAL DEL USUARIO
// ==========================================

function obtenerInicialUsuario() {

    const texto =
        usuarioNavbar.nombre
        ||
        usuarioNavbar.username
        ||
        "U";


    return escaparHtml(
        texto
            .trim()
            .charAt(0)
            .toUpperCase()
    );
}


// ==========================================
// MOSTRAR ROL BONITO
// ==========================================

function formatearRol(rol) {

    switch (rol) {

        case "ADMIN":

            return "Administrador";


        case "SECRETARIA":

            return "Secretaría";


        case "PACIENTE":

            return "Paciente";


        default:

            return rol || "";
    }
}


// ==========================================
// ESCAPAR TEXTO
// ==========================================

function escaparHtml(texto) {

    if (texto == null) {

        return "";
    }


    return String(texto)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// ==========================================
// CERRAR AL HACER CLIC FUERA
// ==========================================

document.addEventListener(
    "click",
    function (event) {

        const dentroDropdown =
            event.target.closest(
                ".nav-item"
            );


        const dentroPerfil =
            event.target.closest(
                ".perfil-wrapper"
            );


        if (
            !dentroDropdown
            &&
            !dentroPerfil
        ) {

            cerrarMenus();
        }
    }
);


// ==========================================
// ESCAPE CIERRA MENÚS
// ==========================================

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            cerrarMenus();
        }
    }
);


// ==========================================
// INICIALIZAR NAVBAR
// ==========================================

crearNavbar();

crearFooter();

// ==========================================
// OCULTAR AL BAJAR
// MOSTRAR AL SUBIR
// ==========================================

let ultimaPosicionScroll =
    window.scrollY;


const umbralScroll =
    4;


window.addEventListener(
    "scroll",
    () => {

        const navbar =
            document.getElementById(
                "appNavbar"
            );


        if (!navbar) {

            return;
        }


        const posicionActual =
            Math.max(
                window.scrollY,
                0
            );


        const diferencia =
            posicionActual
            -
            ultimaPosicionScroll;


        // ======================================
        // PARTE SUPERIOR
        // ======================================

        if (
            posicionActual <= 20
        ) {

            navbar.classList.remove(
                "navbar-oculta"
            );


            cerrarMenus();


            ultimaPosicionScroll =
                posicionActual;


            return;
        }


        // ======================================
        // IGNORAR MOVIMIENTOS MÍNIMOS
        // ======================================

        if (
            Math.abs(
                diferencia
            )
            <
            umbralScroll
        ) {

            return;
        }


        // ======================================
        // BAJANDO
        // ======================================

        if (
            diferencia > 0
        ) {

            navbar.classList.add(
                "navbar-oculta"
            );


            cerrarMenus();
        }


            // ======================================
            // SUBIENDO
        // ======================================

        else if (
            diferencia < 0
        ) {

            navbar.classList.remove(
                "navbar-oculta"
            );
        }


        ultimaPosicionScroll =
            posicionActual;
    },
    {
        passive: true
    }


);