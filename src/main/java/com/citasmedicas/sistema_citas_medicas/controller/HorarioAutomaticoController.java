package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.service.HorarioAutomaticoService;
import com.citasmedicas.sistema_citas_medicas.service.RealtimeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/horarios-automaticos")
@CrossOrigin(origins = "*")
public class HorarioAutomaticoController {

    private final HorarioAutomaticoService
            horarioAutomaticoService;

    private final RealtimeService
            realtimeService;


    public HorarioAutomaticoController(
            HorarioAutomaticoService horarioAutomaticoService,
            RealtimeService realtimeService
    ) {

        this.horarioAutomaticoService =
                horarioAutomaticoService;

        this.realtimeService =
                realtimeService;
    }


    // ==========================================
    // GENERAR PARA UN MÉDICO
    // ==========================================

    @PostMapping("/generar/{idMedico}")
    public ResponseEntity<?> generar(
            @PathVariable Long idMedico
    ) {

        try {

            int cantidad =
                    horarioAutomaticoService
                            .generarParaMedico(
                                    idMedico
                            );


            // ======================================
            // NOTIFICAR EN TIEMPO REAL
            // ======================================

            if (cantidad > 0) {

                realtimeService.notificar(
                        "HORARIOS",
                        "GENERADOS",
                        idMedico
                );
            }


            // ======================================
            // SIN NUEVOS HORARIOS
            // ======================================

            if (cantidad == 0) {

                return ResponseEntity.ok(
                        "No se generaron nuevos horarios. "
                                +
                                "Los horarios del médico ya existen "
                                +
                                "o no hay bloques disponibles."
                );
            }


            // ======================================
            // RESPUESTA CORRECTA
            // ======================================

            return ResponseEntity.ok(
                    "Horarios generados correctamente: "
                            +
                            cantidad
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