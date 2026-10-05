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
            CitaService citaService
    ) {

        this.citaService =
                citaService;
    }


    // ==========================================
    // LISTAR TODAS LAS CITAS
    // ==========================================

    @GetMapping
    public List<Cita> listar() {

        return citaService.listar();
    }


    // ==========================================
    // BUSCAR CITA POR ID
    // ==========================================

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(
            @PathVariable Long id
    ) {

        return citaService
                .buscarPorId(
                        id
                )
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
    // LISTAR CITAS DE UN PACIENTE
    // ==========================================

    @GetMapping("/paciente/{idPaciente}")
    public List<Cita> listarPorPaciente(
            @PathVariable Long idPaciente
    ) {

        return citaService
                .listarPorPaciente(
                        idPaciente
                );
    }


    // ==========================================
    // RESERVAR CITA + PAGO INICIAL
    // ==========================================

    @PostMapping("/reservar")
    public ResponseEntity<?> reservar(
            @RequestBody CitaRequest request
    ) {

        try {

            // ======================================
            // VALIDAR REQUEST
            // ======================================

            if (request == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Los datos de la reserva son obligatorios"
                        );
            }


            if (
                    request.getIdHorario() == null
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Debe seleccionar un horario"
                        );
            }


            if (
                    request.getIdPaciente() == null
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "No se encontró el paciente"
                        );
            }


            // ======================================
            // VALIDAR DATOS DEL PAGO
            // ======================================

            if (
                    request.getMonto() == null
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Debe ingresar el monto del pago"
                        );
            }


            if (
                    request.getMetodoPago() == null
                            ||
                            request
                                    .getMetodoPago()
                                    .isBlank()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Debe seleccionar un método de pago"
                        );
            }


            if (
                    request.getNumeroOperacion() == null
                            ||
                            request
                                    .getNumeroOperacion()
                                    .isBlank()
            ) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                "Debe ingresar el número de operación"
                        );
            }


            // ======================================
            // RESERVAR + REGISTRAR PAGO
            // ======================================

            Cita cita =
                    citaService.reservar(
                            request.getIdHorario(),
                            request.getIdPaciente(),
                            request.getMonto(),
                            request.getMetodoPago(),
                            request.getNumeroOperacion()
                    );


            // ======================================
            // RESPUESTA CORRECTA
            // ======================================

            return ResponseEntity.ok(
                    cita
            );


        } catch (RuntimeException e) {

            // ======================================
            // ERROR DE VALIDACIÓN / CONCURRENCIA
            // ======================================

            return ResponseEntity
                    .badRequest()
                    .body(
                            e.getMessage()
                    );
        }
    }


    // ==========================================
    // ELIMINAR / CANCELAR CITA
    // ==========================================

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(
            @PathVariable Long id
    ) {

        try {

            citaService.eliminar(
                    id
            );


            return ResponseEntity.ok(
                    "Cita eliminada correctamente"
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