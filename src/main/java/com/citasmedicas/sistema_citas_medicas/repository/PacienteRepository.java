package com.citasmedicas.sistema_citas_medicas.repository;

import com.citasmedicas.sistema_citas_medicas.entity.Paciente;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PacienteRepository
        extends JpaRepository<Paciente, Long> {

    // ==========================================
    // BUSCAR POR DNI
    // ==========================================

    Optional<Paciente> findByDni(
            String dni
    );


    // ==========================================
    // LISTAR SOLO PACIENTES ACTIVOS
    // ==========================================

    List<Paciente> findByEstadoTrue();
}