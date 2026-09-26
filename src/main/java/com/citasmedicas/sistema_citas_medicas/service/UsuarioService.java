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
        return usuarioRepository.save(usuario);
    }

    public void eliminar(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> login(
            String username,
            String password) {

        Optional<Usuario> usuario =
                usuarioRepository.findByUsername(username);

        if (
                usuario.isPresent()
                        && usuario.get().getPassword().equals(password)
                        && Boolean.TRUE.equals(usuario.get().getEstado())
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

        if (!usuario.getPassword().equals(claveActual)) {
            throw new RuntimeException(
                    "La contraseña actual es incorrecta"
            );
        }

        usuario.setPassword(claveNueva);

        return usuarioRepository.save(usuario);
    }
}