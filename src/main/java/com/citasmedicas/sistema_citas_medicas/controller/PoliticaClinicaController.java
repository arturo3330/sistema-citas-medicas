package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.PoliticaClinica;
import com.citasmedicas.sistema_citas_medicas.service.PoliticaClinicaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/politica-clinica")
@CrossOrigin(origins = "*")
public class PoliticaClinicaController {

    private final PoliticaClinicaService politicaService;

    public PoliticaClinicaController(
            PoliticaClinicaService politicaService) {

        this.politicaService = politicaService;
    }


    @GetMapping
    public ResponseEntity<?> obtener() {

        try {

            return ResponseEntity.ok(
                    politicaService
                            .obtenerPoliticaActiva()
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
            @RequestBody PoliticaClinica politica) {

        try {

            return ResponseEntity.ok(
                    politicaService.actualizar(
                            id,
                            politica
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }
}