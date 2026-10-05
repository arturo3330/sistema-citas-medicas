package com.citasmedicas.sistema_citas_medicas.repository;

import com.citasmedicas.sistema_citas_medicas.entity.PoliticaClinica;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PoliticaClinicaRepository
        extends JpaRepository<PoliticaClinica, Long> {

    Optional<PoliticaClinica> findFirstByEstadoTrue();
}