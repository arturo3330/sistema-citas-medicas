package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Especialidad;
import com.citasmedicas.sistema_citas_medicas.repository.EspecialidadRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EspecialidadService {

    private final EspecialidadRepository especialidadRepository;

    public EspecialidadService(EspecialidadRepository especialidadRepository) {
        this.especialidadRepository = especialidadRepository;
    }

    public List<Especialidad> listar() {
        return especialidadRepository.findAll();
    }

    public Optional<Especialidad> buscarPorId(Long id) {
        return especialidadRepository.findById(id);
    }

    public Especialidad guardar(Especialidad especialidad) {
        return especialidadRepository.save(especialidad);
    }

    public void eliminar(Long id) {
        especialidadRepository.deleteById(id);
    }
}