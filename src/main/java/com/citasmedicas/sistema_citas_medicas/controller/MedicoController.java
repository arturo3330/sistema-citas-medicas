package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.Medico;
import com.citasmedicas.sistema_citas_medicas.service.MedicoService;
import com.citasmedicas.sistema_citas_medicas.service.RealtimeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {

    private final MedicoService medicoService;

    private final RealtimeService realtimeService;


    public MedicoController(
            MedicoService medicoService,
            RealtimeService realtimeService
    ) {

        this.medicoService =
                medicoService;

        this.realtimeService =
                realtimeService;
    }


    // ==========================================
    // LISTAR SOLO ACTIVOS
    // ==========================================

    @GetMapping
    public List<Medico> listar() {

        return medicoService.listar();
    }


    // ==========================================
    // LISTAR TODOS
    // ==========================================

    @GetMapping("/todos")
    public List<Medico> listarTodos() {

        return medicoService.listarTodos();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(
            @PathVariable Long id
    ) {

        return medicoService
                .buscarPorId(id)
                .<ResponseEntity<?>>map(
                        ResponseEntity::ok
                )
                .orElseGet(() ->
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
            @RequestBody Medico medico
    ) {

        try {

            Medico guardado =
                    medicoService.guardar(
                            medico
                    );


            realtimeService.notificar(
                    "MEDICOS",
                    "CREADO",
                    guardado.getIdMedico()
            );

            return ResponseEntity.ok(
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
            @RequestBody Medico medico
    ) {

        try {

            Medico actualizado =
                    medicoService.actualizar(
                            id,
                            medico
                    );


            realtimeService.notificar(
                    "MEDICOS",
                    "ACTUALIZADO",
                    actualizado.getIdMedico()
            );

            return ResponseEntity.ok(
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
    // ELIMINAR
    // Lógicamente cambia estado a false
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id
    ) {

        try {

            medicoService.eliminar(
                    id
            );


            realtimeService.notificar(
                    "MEDICOS",
                    "DESACTIVADO",
                    id
            );

            realtimeService.notificar(
                    "HORARIOS",
                    "MEDICO_CAMBIO",
                    id
            );

            return ResponseEntity.ok(
                    "Médico eliminado correctamente"
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