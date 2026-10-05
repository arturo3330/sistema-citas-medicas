package com.citasmedicas.sistema_citas_medicas.repository;

import com.citasmedicas.sistema_citas_medicas.entity.Recibo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReciboRepository
        extends JpaRepository<Recibo, Long> {

    Optional<Recibo> findByCitaIdCita(
            Long idCita
    );
}