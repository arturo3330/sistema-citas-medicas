package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.Paciente;
import com.citasmedicas.sistema_citas_medicas.service.PacienteService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
@CrossOrigin(origins = "*")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @GetMapping
    public List<Paciente> listar() {
        return pacienteService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {

        return pacienteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<?> buscarPorDni(@PathVariable String dni) {

        return pacienteService.buscarPorDni(dni)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Paciente guardar(@RequestBody Paciente paciente) {
        return pacienteService.guardar(paciente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody Paciente paciente) {

        if (pacienteService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        paciente.setIdPaciente(id);

        return ResponseEntity.ok(
                pacienteService.guardar(paciente)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {

        if (pacienteService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        pacienteService.eliminar(id);

        return ResponseEntity.ok("Paciente eliminado");
    }
}