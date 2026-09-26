package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.Medico;
import com.citasmedicas.sistema_citas_medicas.service.MedicoService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicos")
@CrossOrigin(origins = "*")
public class MedicoController {

    private final MedicoService medicoService;

    public MedicoController(MedicoService medicoService) {
        this.medicoService = medicoService;
    }

    @GetMapping
    public List<Medico> listar() {
        return medicoService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {

        return medicoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Medico guardar(@RequestBody Medico medico) {
        return medicoService.guardar(medico);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody Medico medico) {

        if (medicoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        medico.setIdMedico(id);

        return ResponseEntity.ok(
                medicoService.guardar(medico)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {

        if (medicoService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        medicoService.eliminar(id);

        return ResponseEntity.ok("Médico eliminado");
    }
}