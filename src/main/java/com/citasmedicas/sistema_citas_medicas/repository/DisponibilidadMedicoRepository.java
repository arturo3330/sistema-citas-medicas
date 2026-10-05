package com.citasmedicas.sistema_citas_medicas.repository;

import com.citasmedicas.sistema_citas_medicas.entity.DisponibilidadMedico;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisponibilidadMedicoRepository
        extends JpaRepository<DisponibilidadMedico, Long> {

    List<DisponibilidadMedico>
    findByEstadoTrue();

    List<DisponibilidadMedico>
    findByMedicoIdMedicoAndEstadoTrue(
            Long idMedico
    );

    List<DisponibilidadMedico>
    findByDiaSemanaAndEstadoTrue(
            String diaSemana
    );
}