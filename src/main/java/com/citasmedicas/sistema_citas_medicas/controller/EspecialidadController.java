package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.Especialidad;
import com.citasmedicas.sistema_citas_medicas.service.EspecialidadService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/especialidades")
@CrossOrigin(origins = "*")
public class EspecialidadController {

    private final EspecialidadService especialidadService;

    public EspecialidadController(EspecialidadService especialidadService) {
        this.especialidadService = especialidadService;
    }

    @GetMapping
    public List<Especialidad> listar() {
        return especialidadService.listar();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> buscar(@PathVariable Long id) {

        return especialidadService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Especialidad guardar(@RequestBody Especialidad especialidad) {
        return especialidadService.guardar(especialidad);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Long id,
            @RequestBody Especialidad especialidad) {

        if (especialidadService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        especialidad.setIdEspecialidad(id);

        return ResponseEntity.ok(
                especialidadService.guardar(especialidad)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {

        if (especialidadService.buscarPorId(id).isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        especialidadService.eliminar(id);

        return ResponseEntity.ok("Especialidad eliminada");
    }
}