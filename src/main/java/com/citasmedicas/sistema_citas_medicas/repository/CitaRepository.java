package com.citasmedicas.sistema_citas_medicas.repository;

import com.citasmedicas.sistema_citas_medicas.entity.Cita;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitaRepository
        extends JpaRepository<Cita, Long> {

    List<Cita> findByPacienteIdPaciente(
            Long idPaciente
    );
}