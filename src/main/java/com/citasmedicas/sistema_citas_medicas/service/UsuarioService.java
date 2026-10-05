package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Usuario;
import com.citasmedicas.sistema_citas_medicas.repository.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    private final ActividadService actividadService;


    public UsuarioService(
            UsuarioRepository usuarioRepository,
            ActividadService actividadService) {

        this.usuarioRepository =
                usuarioRepository;

        this.actividadService =
                actividadService;
    }


    // ==========================================
    // LISTAR
    // ==========================================

    public List<Usuario> listar() {

        return usuarioRepository.findAll();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    public Optional<Usuario> buscarPorId(
            Long id) {

        return usuarioRepository.findById(
                id
        );
    }


    // ==========================================
    // GUARDAR
    // ==========================================

    public Usuario guardar(
            Usuario usuario) {

        validarRol(
                usuario.getRol()
        );


        usuario.setRol(
                usuario
                        .getRol()
                        .toUpperCase()
        );


        Usuario guardado =
                usuarioRepository.save(
                        usuario
                );


        // ======================================
        // REGISTRAR ACTIVIDAD
        // ======================================

        actividadService.registrar(
                "USUARIO",
                "Nuevo usuario registrado: "
                        + guardado.getUsername(),
                null,
                null
        );


        return guardado;
    }


    // ==========================================
    // ACTUALIZAR
    // ==========================================

    public Usuario actualizar(
            Long id,
            Usuario datos) {

        Usuario actual =
                usuarioRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuario no encontrado"
                                )
                        );


        validarRol(
                datos.getRol()
        );


        // ======================================
        // EL ADMIN NO PUEDE PERDER SU ROL
        // ======================================

        if (
                "ADMIN".equalsIgnoreCase(
                        actual.getRol()
                )
                        &&
                        !"ADMIN".equalsIgnoreCase(
                                datos.getRol()
                        )
        ) {

            throw new RuntimeException(
                    "No se puede cambiar el rol del administrador"
            );
        }


        // ======================================
        // ACTUALIZAR DATOS
        // ======================================

        actual.setUsername(
                datos.getUsername()
        );


        actual.setNombre(
                datos.getNombre()
        );


        actual.setRol(
                datos
                        .getRol()
                        .toUpperCase()
        );


        actual.setEstado(
                datos.getEstado()
        );


        actual.setPaciente(
                datos.getPaciente()
        );


        // ======================================
        // CONTRASEÑA
        // ======================================

        /*
         * La contraseña solo se modifica
         * si se envía una nueva.
         */
        if (
                datos.getPassword() != null
                        &&
                        !datos
                                .getPassword()
                                .isBlank()
        ) {

            actual.setPassword(
                    datos.getPassword()
            );
        }


        Usuario actualizado =
                usuarioRepository.save(
                        actual
                );


        // ======================================
        // REGISTRAR ACTIVIDAD
        // ======================================

        actividadService.registrar(
                "USUARIO",
                "Usuario actualizado: "
                        + actualizado.getUsername(),
                null,
                null
        );


        return actualizado;
    }


    // ==========================================
    // ELIMINAR
    // ==========================================

    public void eliminar(
            Long id) {

        Usuario usuario =
                usuarioRepository
                        .findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuario no encontrado"
                                )
                        );


        // ======================================
        // NINGÚN ADMIN PUEDE ELIMINARSE
        // ======================================

        if (
                "ADMIN".equalsIgnoreCase(
                        usuario.getRol()
                )
        ) {

            throw new RuntimeException(
                    "El usuario administrador no puede ser eliminado"
            );
        }


        String username =
                usuario.getUsername();


        usuarioRepository.delete(
                usuario
        );


        // ======================================
        // REGISTRAR ACTIVIDAD
        // ======================================

        actividadService.registrar(
                "USUARIO",
                "Usuario eliminado: "
                        + username,
                null,
                null
        );
    }


    // ==========================================
    // LOGIN
    // ==========================================

    public Optional<Usuario> login(
            String username,
            String password) {

        Optional<Usuario> usuario =
                usuarioRepository
                        .findByUsername(
                                username
                        );


        if (
                usuario.isPresent()
                        &&
                        usuario
                                .get()
                                .getPassword()
                                .equals(
                                        password
                                )
                        &&
                        Boolean.TRUE.equals(
                                usuario
                                        .get()
                                        .getEstado()
                        )
        ) {

            return usuario;
        }


        return Optional.empty();
    }


    // ==========================================
    // CAMBIAR CONTRASEÑA
    // ==========================================

    public Usuario cambiarClave(
            String username,
            String claveActual,
            String claveNueva) {

        Usuario usuario =
                usuarioRepository
                        .findByUsername(
                                username
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuario no encontrado"
                                )
                        );


        // ======================================
        // VALIDAR CONTRASEÑA ACTUAL
        // ======================================

        if (
                !usuario
                        .getPassword()
                        .equals(
                                claveActual
                        )
        ) {

            throw new RuntimeException(
                    "La contraseña actual es incorrecta"
            );
        }


        // ======================================
        // VALIDAR CONTRASEÑA NUEVA
        // ======================================

        if (
                claveNueva == null
                        ||
                        claveNueva.isBlank()
        ) {

            throw new RuntimeException(
                    "La nueva contraseña no puede estar vacía"
            );
        }


        // ======================================
        // EVITAR USAR LA MISMA CONTRASEÑA
        // ======================================

        if (
                claveActual.equals(
                        claveNueva
                )
        ) {

            throw new RuntimeException(
                    "La nueva contraseña debe ser diferente a la actual"
            );
        }


        usuario.setPassword(
                claveNueva
        );


        Usuario actualizado =
                usuarioRepository.save(
                        usuario
                );


        // ======================================
        // REGISTRAR ACTIVIDAD
        // ======================================

        actividadService.registrar(
                "USUARIO",
                "Contraseña actualizada para el usuario "
                        + actualizado.getUsername(),
                null,
                null
        );


        return actualizado;
    }


    // ==========================================
    // VALIDAR ROL
    // ==========================================

    private void validarRol(
            String rol) {

        if (
                rol == null
                        ||
                        rol.isBlank()
        ) {

            throw new RuntimeException(
                    "El rol es obligatorio"
            );
        }


        String rolNormalizado =
                rol.toUpperCase();


        if (
                !rolNormalizado.equals(
                        "ADMIN"
                )
                        &&
                        !rolNormalizado.equals(
                                "SECRETARIA"
                        )
                        &&
                        !rolNormalizado.equals(
                                "PACIENTE"
                        )
        ) {

            throw new RuntimeException(
                    "Rol de usuario no válido"
            );
        }
    }
}