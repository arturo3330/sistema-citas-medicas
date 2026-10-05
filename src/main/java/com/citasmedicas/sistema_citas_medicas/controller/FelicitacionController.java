package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.Felicitacion;
import com.citasmedicas.sistema_citas_medicas.service.FelicitacionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/felicitaciones")
public class FelicitacionController {

    private final FelicitacionService felicitacionService;


    public FelicitacionController(
            FelicitacionService felicitacionService) {

        this.felicitacionService =
                felicitacionService;
    }


    // ==========================================
    // ÚLTIMAS FELICITACIONES
    // ==========================================

    @GetMapping
    public ResponseEntity<List<Felicitacion>>
    listarUltimas() {

        return ResponseEntity.ok(
                felicitacionService
                        .listarUltimas()
        );
    }


    // ==========================================
    // REGISTRAR FELICITACIÓN
    // ==========================================

    @PostMapping
    public ResponseEntity<?>
    guardar(
            @RequestBody Felicitacion felicitacion) {

        try {

            Felicitacion nueva =
                    felicitacionService
                            .guardar(
                                    felicitacion
                            );


            return ResponseEntity.ok(
                    nueva
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