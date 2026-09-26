package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.Horario;
import com.citasmedicas.sistema_citas_medicas.service.HorarioService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/horarios")
@CrossOrigin(origins = "*")
public class HorarioController {

    private final HorarioService horarioService;

    public HorarioController(HorarioService horarioService) {
        this.horarioService = horarioService;
    }

    @GetMapping
    public List<Horario> listar() {
        return horarioService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {

        return horarioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Horario guardar(@RequestBody Horario horario) {
        return horarioService.guardar(horario);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody Horario horario) {

        if (horarioService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        horario.setIdHorario(id);

        return ResponseEntity.ok(
                horarioService.guardar(horario)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {

        if (horarioService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        horarioService.eliminar(id);

        return ResponseEntity.ok("Horario eliminado");
    }
}