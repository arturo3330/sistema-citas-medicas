package com.citasmedicas.sistema_citas_medicas.repository;

import com.citasmedicas.sistema_citas_medicas.entity.Actividad;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActividadRepository
        extends JpaRepository<Actividad, Long> {

    List<Actividad>
    findTop10ByOrderByFechaDesc();
}