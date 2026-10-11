package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.Especialidad;
import com.citasmedicas.sistema_citas_medicas.service.EspecialidadService;
import com.citasmedicas.sistema_citas_medicas.service.RealtimeService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/especialidades")
@CrossOrigin(origins = "*")
public class EspecialidadController {

    private final EspecialidadService especialidadService;

    private final RealtimeService realtimeService;


    public EspecialidadController(
            EspecialidadService especialidadService,
            RealtimeService realtimeService
    ) {

        this.especialidadService =
                especialidadService;

        this.realtimeService =
                realtimeService;
    }


    // ==========================================
    // LISTAR SOLO ACTIVAS
    // Para reservas, médicos, horarios, etc.
    // ==========================================

    @GetMapping
    public List<Especialidad> listar() {

        return especialidadService.listar();
    }


    // ==========================================
    // LISTAR TODAS
    // Para mantenimiento
    // ==========================================

    @GetMapping("/todas")
    public List<Especialidad> listarTodas() {

        return especialidadService.listarTodas();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(
            @PathVariable Long id
    ) {

        return especialidadService
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
            @RequestBody Especialidad especialidad
    ) {

        try {

            Especialidad guardada =
                    especialidadService.guardar(
                            especialidad
                    );


            realtimeService.notificar(
                    "ESPECIALIDADES",
                    "CREADA",
                    guardada.getIdEspecialidad()
            );

            return ResponseEntity.ok(
                    guardada
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
            @RequestBody Especialidad especialidad
    ) {

        try {

            Especialidad actualizada =
                    especialidadService.actualizar(
                            id,
                            especialidad
                    );


            realtimeService.notificar(
                    "ESPECIALIDADES",
                    "ACTUALIZADA",
                    actualizada.getIdEspecialidad()
            );

            return ResponseEntity.ok(
                    actualizada
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
    // Eliminación lógica: estado = false
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id
    ) {

        try {

            especialidadService.eliminar(
                    id
            );


            realtimeService.notificar(
                    "ESPECIALIDADES",
                    "DESACTIVADA",
                    id
            );

            realtimeService.notificar(
                    "MEDICOS",
                    "ESPECIALIDAD_CAMBIO",
                    id
            );

            return ResponseEntity.ok(
                    "Especialidad eliminada correctamente"
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