package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.Paciente;
import com.citasmedicas.sistema_citas_medicas.service.PacienteService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PacienteService pacienteService;


    public PacienteController(
            PacienteService pacienteService
    ) {

        this.pacienteService =
                pacienteService;
    }


    // ==========================================
    // LISTAR
    // ==========================================

    @GetMapping
    public List<Paciente> listar() {

        return pacienteService.listar();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(
            @PathVariable Long id
    ) {

        return pacienteService
                .buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // ==========================================
    // BUSCAR POR DNI
    // ==========================================

    @GetMapping("/dni/{dni}")
    public ResponseEntity<?> buscarPorDni(
            @PathVariable String dni
    ) {

        return pacienteService
                .buscarPorDni(dni)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    // ==========================================
    // GUARDAR
    // ==========================================

    @PostMapping
    public ResponseEntity<?> guardar(
            @RequestBody Paciente paciente
    ) {

        try {

            Paciente guardado =
                    pacienteService.guardar(
                            paciente
                    );

            return ResponseEntity
                    .ok(
                            guardado
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // ==========================================
    // ACTUALIZAR
    // ==========================================

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody Paciente paciente
    ) {

        try {

            Paciente actualizado =
                    pacienteService.actualizar(
                            id,
                            paciente
                    );

            return ResponseEntity
                    .ok(
                            actualizado
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // ==========================================
    // DESACTIVAR
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id
    ) {

        try {

            pacienteService.eliminar(
                    id
            );

            return ResponseEntity
                    .ok(
                            "Paciente desactivado correctamente"
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }
}