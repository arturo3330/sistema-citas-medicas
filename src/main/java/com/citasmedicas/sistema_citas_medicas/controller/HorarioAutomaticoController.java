package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.service.HorarioAutomaticoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/horarios-automaticos")
@CrossOrigin(origins = "*")
public class HorarioAutomaticoController {

    private final HorarioAutomaticoService
            horarioAutomaticoService;


    public HorarioAutomaticoController(
            HorarioAutomaticoService horarioAutomaticoService) {

        this.horarioAutomaticoService =
                horarioAutomaticoService;
    }


    // ==========================================
    // GENERAR PARA UN MÉDICO
    // ==========================================

    @PostMapping("/generar/{idMedico}")
    public ResponseEntity<?> generar(
            @PathVariable Long idMedico) {

        try {

            int cantidad =
                    horarioAutomaticoService
                            .generarParaMedico(
                                    idMedico
                            );


            if (cantidad == 0) {

                return ResponseEntity.ok(
                        "No se generaron nuevos horarios. "
                                + "Los horarios del médico ya existen "
                                + "o no hay bloques disponibles."
                );
            }


            return ResponseEntity.ok(
                    "Horarios generados correctamente: "
                            + cantidad
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