package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Usuario;
import com.citasmedicas.sistema_citas_medicas.repository.UsuarioRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioService(
            UsuarioRepository usuarioRepository) {

        this.usuarioRepository = usuarioRepository;
    }

    public List<Usuario> listar() {
        return usuarioRepository.findAll();
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    public Usuario guardar(Usuario usuario) {

        validarRol(usuario.getRol());

        usuario.setRol(
                usuario.getRol().toUpperCase()
        );

        return usuarioRepository.save(usuario);
    }

    public Usuario actualizar(
            Long id,
            Usuario datos) {

        Usuario actual = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado"
                        )
                );

        validarRol(datos.getRol());

        // El administrador no puede perder su rol
        if ("ADMIN".equalsIgnoreCase(actual.getRol())
                && !"ADMIN".equalsIgnoreCase(datos.getRol())) {

            throw new RuntimeException(
                    "No se puede cambiar el rol del administrador"
            );
        }

        actual.setUsername(datos.getUsername());
        actual.setNombre(datos.getNombre());
        actual.setRol(
                datos.getRol().toUpperCase()
        );
        actual.setEstado(datos.getEstado());
        actual.setPaciente(datos.getPaciente());

        // Solo actualiza la contraseña si viene una nueva
        if (datos.getPassword() != null
                && !datos.getPassword().isBlank()) {

            actual.setPassword(datos.getPassword());
        }

        return usuarioRepository.save(actual);
    }

    public void eliminar(Long id) {

        Usuario usuario = usuarioRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Usuario no encontrado"
                        )
                );

        // Ningún ADMIN puede ser eliminado
        if ("ADMIN".equalsIgnoreCase(usuario.getRol())) {

            throw new RuntimeException(
                    "El usuario administrador no puede ser eliminado"
            );
        }

        usuarioRepository.delete(usuario);
    }

    public Optional<Usuario> login(
            String username,
            String password) {

        Optional<Usuario> usuario =
                usuarioRepository.findByUsername(username);

        if (
                usuario.isPresent()
                        && usuario.get()
                        .getPassword()
                        .equals(password)
                        && Boolean.TRUE.equals(
                        usuario.get().getEstado()
                )
        ) {

            return usuario;
        }

        return Optional.empty();
    }

    public Usuario cambiarClave(
            String username,
            String claveActual,
            String claveNueva) {

        Usuario usuario =
                usuarioRepository
                        .findByUsername(username)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Usuario no encontrado"
                                )
                        );

        if (!usuario
                .getPassword()
                .equals(claveActual)) {

            throw new RuntimeException(
                    "La contraseña actual es incorrecta"
            );
        }

        if (claveNueva == null
                || claveNueva.isBlank()) {

            throw new RuntimeException(
                    "La nueva contraseña no puede estar vacía"
            );
        }

        usuario.setPassword(claveNueva);

        return usuarioRepository.save(usuario);
    }

    private void validarRol(String rol) {

        if (rol == null
                || rol.isBlank()) {

            throw new RuntimeException(
                    "El rol es obligatorio"
            );
        }

        String rolNormalizado =
                rol.toUpperCase();

        if (!rolNormalizado.equals("ADMIN")
                && !rolNormalizado.equals("SECRETARIA")
                && !rolNormalizado.equals("PACIENTE")) {

            throw new RuntimeException(
                    "Rol de usuario no válido"
            );
        }
    }
}