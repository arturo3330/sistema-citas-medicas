package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.dto.CitaRequest;
import com.citasmedicas.sistema_citas_medicas.entity.Cita;
import com.citasmedicas.sistema_citas_medicas.service.CitaService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citas")
@CrossOrigin(origins = "*")
public class CitaController {

    private final CitaService citaService;

    public CitaController(
            CitaService citaService) {

        this.citaService =
                citaService;
    }


    @GetMapping
    public List<Cita> listar() {

        return citaService.listar();
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(
            @PathVariable Long id) {

        return citaService
                .buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(
                        ResponseEntity
                                .notFound()
                                .build()
                );
    }


    @GetMapping("/paciente/{idPaciente}")
    public List<Cita> listarPorPaciente(
            @PathVariable Long idPaciente) {

        return citaService
                .listarPorPaciente(
                        idPaciente
                );
    }


    @PostMapping("/reservar")
    public ResponseEntity<?> reservar(
            @RequestBody CitaRequest request) {

        try {

            Cita cita =
                    citaService.reservarCita(
                            request.getIdHorario(),
                            request.getIdPaciente()
                    );

            return ResponseEntity.ok(
                    cita
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