package com.citasmedicas.sistema_citas_medicas.repository;

import com.citasmedicas.sistema_citas_medicas.entity.Cita;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CitaRepository
        extends JpaRepository<Cita, Long> {

    Optional<Cita> findByHorarioIdHorario(
            Long idHorario
    );

    List<Cita> findByPacienteIdPaciente(
            Long idPaciente
    );
}