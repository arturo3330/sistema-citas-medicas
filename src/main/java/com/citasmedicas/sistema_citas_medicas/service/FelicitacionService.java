package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Felicitacion;
import com.citasmedicas.sistema_citas_medicas.repository.FelicitacionRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FelicitacionService {

    private final FelicitacionRepository felicitacionRepository;


    public FelicitacionService(
            FelicitacionRepository felicitacionRepository) {

        this.felicitacionRepository =
                felicitacionRepository;
    }


    // ==========================================
    // LISTAR ÚLTIMAS FELICITACIONES ACTIVAS
    // ==========================================

    public List<Felicitacion> listarUltimas() {

        return felicitacionRepository
                .findTop4ByEstadoTrueOrderByFechaRegistroDesc();
    }


    // ==========================================
    // GUARDAR FELICITACIÓN
    // ==========================================

    @Transactional
    public Felicitacion guardar(
            Felicitacion felicitacion) {

        validar(
                felicitacion
        );


        felicitacion.setExperiencia(
                felicitacion
                        .getExperiencia()
                        .trim()
        );


        felicitacion.setArea(
                felicitacion
                        .getArea()
                        .trim()
        );


        if (
                felicitacion.getPersonal() != null
                        &&
                        !felicitacion
                                .getPersonal()
                                .isBlank()
        ) {

            felicitacion.setPersonal(
                    felicitacion
                            .getPersonal()
                            .trim()
            );

        } else {

            felicitacion.setPersonal(
                    null
            );
        }


        felicitacion.setPaciente(
                felicitacion
                        .getPaciente()
                        .trim()
        );


        felicitacion.setFechaRegistro(
                LocalDateTime.now()
        );


        felicitacion.setEstado(
                true
        );


        return felicitacionRepository
                .save(
                        felicitacion
                );
    }


    // ==========================================
    // VALIDACIONES
    // ==========================================

    private void validar(
            Felicitacion felicitacion) {

        if (
                felicitacion == null
        ) {

            throw new RuntimeException(
                    "Los datos de la felicitación son obligatorios"
            );
        }


        if (
                felicitacion.getExperiencia() == null
                        ||
                        felicitacion
                                .getExperiencia()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "Debe escribir su experiencia"
            );
        }


        if (
                felicitacion
                        .getExperiencia()
                        .trim()
                        .length()
                        > 500
        ) {

            throw new RuntimeException(
                    "La experiencia no puede superar los 500 caracteres"
            );
        }


        if (
                felicitacion.getArea() == null
                        ||
                        felicitacion
                                .getArea()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "Debe seleccionar un área"
            );
        }


        if (
                felicitacion
                        .getArea()
                        .trim()
                        .length()
                        > 100
        ) {

            throw new RuntimeException(
                    "El área no puede superar los 100 caracteres"
            );
        }


        if (
                felicitacion.getPersonal() != null
                        &&
                        felicitacion
                                .getPersonal()
                                .trim()
                                .length()
                                > 120
        ) {

            throw new RuntimeException(
                    "El nombre del personal no puede superar los 120 caracteres"
            );
        }


        if (
                felicitacion.getPaciente() == null
                        ||
                        felicitacion
                                .getPaciente()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "Debe indicar sus nombres y apellidos"
            );
        }


        if (
                felicitacion
                        .getPaciente()
                        .trim()
                        .length()
                        > 150
        ) {

            throw new RuntimeException(
                    "El nombre del paciente no puede superar los 150 caracteres"
            );
        }


        if (
                felicitacion.getPuntuacion() == null
        ) {

            throw new RuntimeException(
                    "Debe seleccionar una calificación"
            );
        }


        if (
                felicitacion.getPuntuacion() < 1
                        ||
                        felicitacion.getPuntuacion() > 5
        ) {

            throw new RuntimeException(
                    "La calificación debe estar entre 1 y 5"
            );
        }
    }
}