package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.DisponibilidadMedico;
import com.citasmedicas.sistema_citas_medicas.service.DisponibilidadMedicoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/disponibilidades")
@CrossOrigin(origins = "*")
public class DisponibilidadMedicoController {

    private final DisponibilidadMedicoService
            disponibilidadService;


    public DisponibilidadMedicoController(
            DisponibilidadMedicoService disponibilidadService) {

        this.disponibilidadService =
                disponibilidadService;
    }


    @GetMapping
    public List<DisponibilidadMedico> listar() {

        return disponibilidadService.listar();
    }


    @PostMapping
    public ResponseEntity<?> guardar(
            @RequestBody DisponibilidadMedico disponibilidad) {

        try {

            return ResponseEntity.ok(
                    disponibilidadService
                            .guardar(disponibilidad)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody DisponibilidadMedico disponibilidad) {

        try {

            return ResponseEntity.ok(
                    disponibilidadService
                            .actualizar(
                                    id,
                                    disponibilidad
                            )
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

            disponibilidadService.eliminar(id);

            return ResponseEntity.ok(
                    "Disponibilidad eliminada correctamente"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}