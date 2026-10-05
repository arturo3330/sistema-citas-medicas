package com.citasmedicas.sistema_citas_medicas.repository;

import com.citasmedicas.sistema_citas_medicas.entity.Felicitacion;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FelicitacionRepository
        extends JpaRepository<Felicitacion, Long> {

    List<Felicitacion>
    findTop4ByEstadoTrueOrderByFechaRegistroDesc();
}