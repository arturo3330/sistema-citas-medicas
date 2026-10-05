package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.dto.CambioClaveRequest;
import com.citasmedicas.sistema_citas_medicas.dto.LoginRequest;
import com.citasmedicas.sistema_citas_medicas.entity.Usuario;
import com.citasmedicas.sistema_citas_medicas.service.UsuarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // ==========================
    // LOGIN
    // ==========================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        return usuarioService
                .login(
                        request.getUsername(),
                        request.getPassword()
                )
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .status(401)
                                .body("Usuario o contraseña incorrectos")
                );
    }

    // ==========================
    // CAMBIO DE CLAVE
    // ==========================

    @PutMapping("/cambiar-clave")
    public ResponseEntity<?> cambiarClave(
            @RequestBody CambioClaveRequest request) {

        try {

            usuarioService.cambiarClave(
                    request.getUsername(),
                    request.getClaveActual(),
                    request.getClaveNueva()
            );

            return ResponseEntity.ok(
                    "Contraseña actualizada correctamente"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // ==========================
    // GESTIÓN DE USUARIOS
    // ==========================

    @GetMapping
    public List<Usuario> listar() {
        return usuarioService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(
            @PathVariable Long id) {

        return usuarioService
                .buscarPorId(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElseGet(() ->
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }

    @PostMapping
    public ResponseEntity<?> guardar(
            @RequestBody Usuario usuario) {

        try {

            Usuario nuevo =
                    usuarioService.guardar(usuario);

            return ResponseEntity.ok(nuevo);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody Usuario usuario) {

        try {

            Usuario actualizado =
                    usuarioService.actualizar(
                            id,
                            usuario
                    );

            return ResponseEntity.ok(
                    actualizado
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id) {

        try {

            usuarioService.eliminar(id);

            return ResponseEntity.ok(
                    "Usuario eliminado correctamente"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}