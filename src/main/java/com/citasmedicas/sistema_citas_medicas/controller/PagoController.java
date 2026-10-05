package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.dto.PagoRequest;
import com.citasmedicas.sistema_citas_medicas.entity.Recibo;
import com.citasmedicas.sistema_citas_medicas.service.PagoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pagos")
@CrossOrigin(origins = "*")
public class PagoController {

    private final PagoService pagoService;


    public PagoController(
            PagoService pagoService) {

        this.pagoService =
                pagoService;
    }


    // ==========================================
    // LISTAR RECIBOS / PAGOS
    // ==========================================

    @GetMapping
    public List<Recibo> listar() {

        return pagoService.listar();
    }


    // ==========================================
    // BUSCAR RECIBO POR CITA
    // ==========================================

    @GetMapping("/cita/{idCita}")
    public ResponseEntity<?> buscarPorCita(
            @PathVariable Long idCita) {

        try {

            return ResponseEntity.ok(
                    pagoService
                            .buscarPorCita(
                                    idCita
                            )
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
    // REGISTRAR PAGO
    // ==========================================

    @PostMapping
    public ResponseEntity<?> registrar(
            @RequestBody PagoRequest request) {

        try {

            Recibo recibo =
                    pagoService
                            .registrarPago(
                                    request
                            );


            return ResponseEntity.ok(
                    recibo
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