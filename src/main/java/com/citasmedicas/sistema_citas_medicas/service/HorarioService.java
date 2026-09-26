package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Horario;
import com.citasmedicas.sistema_citas_medicas.repository.HorarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class HorarioService {

    private final HorarioRepository horarioRepository;

    public HorarioService(HorarioRepository horarioRepository) {
        this.horarioRepository = horarioRepository;
    }

    public List<Horario> listar() {
        return horarioRepository.findAll();
    }

    public Optional<Horario> buscarPorId(Long id) {
        return horarioRepository.findById(id);
    }

    public Horario guardar(Horario horario) {

        if (horario.getEstado() == null) {
            horario.setEstado("DISPONIBLE");
        }

        return horarioRepository.save(horario);
    }

    public void eliminar(Long id) {
        horarioRepository.deleteById(id);
    }
}