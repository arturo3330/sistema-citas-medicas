package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Actividad;
import com.citasmedicas.sistema_citas_medicas.repository.ActividadRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActividadService {

    private final ActividadRepository
            actividadRepository;


    public ActividadService(
            ActividadRepository actividadRepository) {

        this.actividadRepository =
                actividadRepository;
    }


    // ==========================================
    // ÚLTIMAS ACTIVIDADES
    // ==========================================

    public List<Actividad> listarRecientes() {

        return actividadRepository
                .findTop10ByOrderByFechaDesc();
    }


    // ==========================================
    // REGISTRAR ACTIVIDAD
    // ==========================================

    public Actividad registrar(
            String tipo,
            String descripcion,
            String usuario,
            String rol) {

        Actividad actividad =
                new Actividad();


        actividad.setTipo(
                tipo
        );


        actividad.setDescripcion(
                descripcion
        );


        actividad.setFecha(
                LocalDateTime.now()
        );


        actividad.setUsuario(
                usuario
        );


        actividad.setRol(
                rol
        );


        return actividadRepository
                .save(
                        actividad
                );
    }
}