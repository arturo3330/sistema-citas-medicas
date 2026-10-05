package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.Horario;
import com.citasmedicas.sistema_citas_medicas.service.HorarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    private final HorarioService horarioService;


    public HorarioController(
            HorarioService horarioService) {

        this.horarioService =
                horarioService;
    }


    // ==========================================
    // LISTAR TODOS
    // ==========================================

    @GetMapping
    public List<Horario> listar() {

        return horarioService
                .listar();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(
            @PathVariable Long id) {

        return horarioService
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
    // DISPONIBLES POR ESPECIALIDAD
    // Solo horarios futuros
    // ==========================================

    @GetMapping(
            "/disponibles/especialidad/{idEspecialidad}"
    )
    public List<Horario> disponiblesPorEspecialidad(
            @PathVariable Long idEspecialidad) {

        return horarioService
                .listarDisponiblesPorEspecialidad(
                        idEspecialidad
                );
    }


    // ==========================================
    // DISPONIBLES POR MÉDICO
    // Solo horarios futuros
    // ==========================================

    @GetMapping(
            "/disponibles/medico/{idMedico}"
    )
    public List<Horario> disponiblesPorMedico(
            @PathVariable Long idMedico) {

        return horarioService
                .listarDisponiblesPorMedico(
                        idMedico
                );
    }


    // ==========================================
    // DISPONIBLES POR MÉDICO Y FECHA
    // Solo horarios futuros
    // ==========================================

    @GetMapping(
            "/disponibles/medico/{idMedico}/fecha/{fecha}"
    )
    public List<Horario> disponiblesPorMedicoYFecha(
            @PathVariable Long idMedico,
            @PathVariable LocalDate fecha) {

        return horarioService
                .listarDisponiblesPorMedicoYFecha(
                        idMedico,
                        fecha
                );
    }


    // ==========================================
    // GUARDAR
    // ==========================================

    @PostMapping
    public ResponseEntity<?> guardar(
            @RequestBody Horario horario) {

        try {

            Horario nuevo =
                    horarioService
                            .guardar(
                                    horario
                            );


            return ResponseEntity.ok(
                    nuevo
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
            @RequestBody Horario horario) {

        try {

            Horario actualizado =
                    horarioService
                            .actualizar(
                                    id,
                                    horario
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
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id) {

        try {

            horarioService
                    .eliminar(
                            id
                    );


            return ResponseEntity.ok(
                    "Horario eliminado correctamente"
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