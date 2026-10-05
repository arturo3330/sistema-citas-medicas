package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Especialidad;
import com.citasmedicas.sistema_citas_medicas.repository.EspecialidadRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Service
public class EspecialidadService {

    private static final BigDecimal COSTO_MAXIMO =
            new BigDecimal("999999.99");


    private final EspecialidadRepository especialidadRepository;

    private final ActividadService actividadService;


    public EspecialidadService(
            EspecialidadRepository especialidadRepository,
            ActividadService actividadService
    ) {

        this.especialidadRepository =
                especialidadRepository;

        this.actividadService =
                actividadService;
    }


    // ==========================================
    // LISTAR SOLO ESPECIALIDADES ACTIVAS
    // Para reservas, médicos, horarios, etc.
    // ==========================================

    public List<Especialidad> listar() {

        return especialidadRepository
                .findByEstadoTrue();
    }


    // ==========================================
    // LISTAR TODAS LAS ESPECIALIDADES
    // Para mantenimiento
    // ==========================================

    public List<Especialidad> listarTodas() {

        return especialidadRepository
                .findAll();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    public Optional<Especialidad> buscarPorId(
            Long id
    ) {

        return especialidadRepository
                .findById(
                        id
                );
    }


    // ==========================================
    // GUARDAR
    // ==========================================

    @Transactional
    public Especialidad guardar(
            Especialidad especialidad
    ) {

        normalizar(
                especialidad
        );


        validar(
                especialidad
        );


        if (
                especialidad.getEstado() == null
        ) {

            especialidad.setEstado(
                    true
            );
        }


        Especialidad guardada =
                especialidadRepository
                        .save(
                                especialidad
                        );


        actividadService.registrar(
                "ESPECIALIDAD",
                "Nueva especialidad registrada: "
                        + guardada.getNombre(),
                null,
                null
        );


        return guardada;
    }


    // ==========================================
    // ACTUALIZAR
    // ==========================================

    @Transactional
    public Especialidad actualizar(
            Long id,
            Especialidad datos
    ) {

        Especialidad actual =
                especialidadRepository
                        .findById(
                                id
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Especialidad no encontrada"
                                )
                        );


        normalizar(
                datos
        );


        validar(
                datos
        );


        // ======================================
        // ACTUALIZAR DATOS
        // ======================================

        actual.setNombre(
                datos.getNombre()
        );


        actual.setTiempoAtencionMinutos(
                datos.getTiempoAtencionMinutos()
        );


        actual.setCostoConsulta(
                datos.getCostoConsulta()
        );


        // ======================================
        // ACTUALIZAR ESTADO
        // ======================================

        if (
                datos.getEstado() != null
        ) {

            actual.setEstado(
                    datos.getEstado()
            );
        }


        Especialidad actualizada =
                especialidadRepository
                        .save(
                                actual
                        );


        actividadService.registrar(
                "ESPECIALIDAD",
                "Especialidad actualizada: "
                        + actualizada.getNombre(),
                null,
                null
        );


        return actualizada;
    }


    // ==========================================
    // ELIMINAR
    // Eliminación lógica
    // ==========================================

    @Transactional
    public void eliminar(
            Long id
    ) {

        Especialidad especialidad =
                especialidadRepository
                        .findById(
                                id
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Especialidad no encontrada"
                                )
                        );


        if (
                !Boolean.TRUE.equals(
                        especialidad.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "La especialidad ya se encuentra inactiva"
            );
        }


        String nombre =
                especialidad.getNombre();


        // ======================================
        // ELIMINACIÓN LÓGICA
        // ======================================

        especialidad.setEstado(
                false
        );


        especialidadRepository.save(
                especialidad
        );


        actividadService.registrar(
                "ESPECIALIDAD",
                "Especialidad eliminada: "
                        + nombre,
                null,
                null
        );
    }


    // ==========================================
    // NORMALIZAR
    // ==========================================

    private void normalizar(
            Especialidad especialidad
    ) {

        if (
                especialidad == null
        ) {

            return;
        }


        if (
                especialidad.getNombre() != null
        ) {

            especialidad.setNombre(
                    especialidad
                            .getNombre()
                            .trim()
            );
        }
    }


    // ==========================================
    // VALIDACIONES
    // ==========================================

    private void validar(
            Especialidad especialidad
    ) {

        if (
                especialidad == null
        ) {

            throw new RuntimeException(
                    "Los datos de la especialidad son obligatorios"
            );
        }


        // ======================================
        // NOMBRE
        // ======================================

        if (
                especialidad.getNombre() == null
                        ||
                        especialidad
                                .getNombre()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "El nombre de la especialidad es obligatorio"
            );
        }


        // ======================================
        // DURACIÓN
        // ======================================

        Integer duracion =
                especialidad
                        .getTiempoAtencionMinutos();


        if (
                duracion == null
        ) {

            throw new RuntimeException(
                    "Debe seleccionar la duración de la consulta"
            );
        }


        if (
                duracion != 30
                        &&
                        duracion != 60
        ) {

            throw new RuntimeException(
                    "La duración de la consulta debe ser de 30 minutos o 1 hora"
            );
        }


        // ======================================
        // COSTO
        // ======================================

        BigDecimal costo =
                especialidad
                        .getCostoConsulta();


        if (
                costo == null
                        ||
                        costo.compareTo(
                                BigDecimal.ZERO
                        ) <= 0
        ) {

            throw new RuntimeException(
                    "El costo de consulta debe ser mayor que cero"
            );
        }


        // ======================================
        // COSTO MÁXIMO
        // ======================================

        if (
                costo.compareTo(
                        COSTO_MAXIMO
                ) > 0
        ) {

            throw new RuntimeException(
                    "El costo máximo permitido es S/ 999999.99"
            );
        }


        // ======================================
        // MÁXIMO 2 DECIMALES
        // ======================================

        if (
                costo.scale() > 2
        ) {

            throw new RuntimeException(
                    "El costo de consulta debe tener como máximo 2 decimales"
            );
        }
    }
}