package com.citasmedicas.sistema_citas_medicas.repository;

import com.citasmedicas.sistema_citas_medicas.entity.Horario;

import jakarta.persistence.LockModeType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface HorarioRepository
        extends JpaRepository<Horario, Long> {


    // ==========================================
    // VALIDAR HORARIO DUPLICADO
    // ==========================================

    boolean existsByMedicoIdMedicoAndFechaAndHora(
            Long idMedico,
            LocalDate fecha,
            LocalTime hora
    );


    // ==========================================
    // CONTAR HORARIOS POR MÉDICO Y FECHA
    // ==========================================

    long countByMedicoIdMedicoAndFecha(
            Long idMedico,
            LocalDate fecha
    );


    // ==========================================
    // VALIDAR SI YA EXISTE HORARIO EN UN TURNO
    // ==========================================

    boolean existsByMedicoIdMedicoAndFechaAndHoraGreaterThanEqualAndHoraLessThan(
            Long idMedico,
            LocalDate fecha,
            LocalTime horaInicio,
            LocalTime horaFin
    );


    // ==========================================
    // HORARIOS DISPONIBLES POR ESPECIALIDAD
    // ==========================================

    List<Horario>
    findByEstadoAndMedicoEspecialidadIdEspecialidad(
            String estado,
            Long idEspecialidad
    );


    // ==========================================
    // HORARIOS DISPONIBLES POR MÉDICO
    // ==========================================

    List<Horario>
    findByEstadoAndMedicoIdMedico(
            String estado,
            Long idMedico
    );


    // ==========================================
    // HORARIOS DISPONIBLES POR MÉDICO Y FECHA
    // ==========================================

    List<Horario>
    findByEstadoAndMedicoIdMedicoAndFecha(
            String estado,
            Long idMedico,
            LocalDate fecha
    );


    // ==========================================
    // HORARIOS FUTUROS DISPONIBLES POR MÉDICO
    // ==========================================

    @Query("""
            SELECT h
            FROM Horario h
            WHERE h.estado = :estado
              AND h.medico.idMedico = :idMedico
              AND h.horaFin IS NOT NULL
              AND h.diaSemana IS NOT NULL
              AND (
                    h.fecha > :fechaActual
                    OR
                    (
                        h.fecha = :fechaActual
                        AND h.hora > :horaActual
                    )
                  )
            ORDER BY h.fecha ASC, h.hora ASC
            """)
    List<Horario> buscarDisponiblesFuturosPorMedico(
            @Param("estado")
            String estado,

            @Param("idMedico")
            Long idMedico,

            @Param("fechaActual")
            LocalDate fechaActual,

            @Param("horaActual")
            LocalTime horaActual
    );


    // ==========================================
    // HORARIOS FUTUROS POR ESPECIALIDAD
    // ==========================================

    @Query("""
            SELECT h
            FROM Horario h
            WHERE h.estado = :estado
              AND h.medico.especialidad.idEspecialidad = :idEspecialidad
              AND h.horaFin IS NOT NULL
              AND h.diaSemana IS NOT NULL
              AND (
                    h.fecha > :fechaActual
                    OR
                    (
                        h.fecha = :fechaActual
                        AND h.hora > :horaActual
                    )
                  )
            ORDER BY h.fecha ASC, h.hora ASC
            """)
    List<Horario> buscarDisponiblesFuturosPorEspecialidad(
            @Param("estado")
            String estado,

            @Param("idEspecialidad")
            Long idEspecialidad,

            @Param("fechaActual")
            LocalDate fechaActual,

            @Param("horaActual")
            LocalTime horaActual
    );


    // ==========================================
    // HORARIOS FUTUROS POR MÉDICO Y FECHA
    // ==========================================

    @Query("""
            SELECT h
            FROM Horario h
            WHERE h.estado = :estado
              AND h.medico.idMedico = :idMedico
              AND h.fecha = :fecha
              AND h.horaFin IS NOT NULL
              AND h.diaSemana IS NOT NULL
              AND (
                    :fecha > :fechaActual
                    OR
                    (
                        :fecha = :fechaActual
                        AND h.hora > :horaActual
                    )
                  )
            ORDER BY h.hora ASC
            """)
    List<Horario> buscarDisponiblesFuturosPorMedicoYFecha(
            @Param("estado")
            String estado,

            @Param("idMedico")
            Long idMedico,

            @Param("fecha")
            LocalDate fecha,

            @Param("fechaActual")
            LocalDate fechaActual,

            @Param("horaActual")
            LocalTime horaActual
    );


    // ==========================================
    // BLOQUEO PESIMISTA
    // ==========================================

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
            SELECT h
            FROM Horario h
            WHERE h.idHorario = :idHorario
            """)
    Optional<Horario> buscarConBloqueo(
            @Param("idHorario")
            Long idHorario
    );
}