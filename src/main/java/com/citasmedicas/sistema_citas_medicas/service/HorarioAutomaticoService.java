package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Especialidad;
import com.citasmedicas.sistema_citas_medicas.entity.Horario;
import com.citasmedicas.sistema_citas_medicas.entity.Medico;
import com.citasmedicas.sistema_citas_medicas.entity.PoliticaClinica;

import com.citasmedicas.sistema_citas_medicas.repository.HorarioRepository;
import com.citasmedicas.sistema_citas_medicas.repository.MedicoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;

@Service
public class HorarioAutomaticoService {

    private static final ZoneId ZONA_PERU =
            ZoneId.of("America/Lima");


    private static final int MAX_HORARIOS_DIA =
            2;


    private final HorarioRepository horarioRepository;

    private final MedicoRepository medicoRepository;

    private final PoliticaClinicaService politicaClinicaService;


    public HorarioAutomaticoService(
            HorarioRepository horarioRepository,
            MedicoRepository medicoRepository,
            PoliticaClinicaService politicaClinicaService) {

        this.horarioRepository =
                horarioRepository;

        this.medicoRepository =
                medicoRepository;

        this.politicaClinicaService =
                politicaClinicaService;
    }


    // ==========================================
    // GENERAR PARA TODOS LOS MÉDICOS ACTIVOS
    // ==========================================

    @Transactional
    public int generarProximosDias() {

        int totalGenerados =
                0;


        for (
                Medico medico
                : medicoRepository.findAll()
        ) {

            if (
                    !Boolean.TRUE.equals(
                            medico.getEstado()
                    )
            ) {

                continue;
            }


            if (
                    medico.getEspecialidad()
                            == null
            ) {

                continue;
            }


            if (
                    !Boolean.TRUE.equals(
                            medico
                                    .getEspecialidad()
                                    .getEstado()
                    )
            ) {

                continue;
            }


            try {

                totalGenerados +=
                        generarParaMedico(
                                medico.getIdMedico()
                        );


            } catch (RuntimeException e) {

                System.out.println(
                        "No se pudieron generar horarios para el médico "
                                + medico.getNombre()
                                + ": "
                                + e.getMessage()
                );
            }
        }


        return totalGenerados;
    }


    // ==========================================
    // GENERAR PARA UN MÉDICO
    // ==========================================

    @Transactional
    public int generarParaMedico(
            Long idMedico) {

        if (
                idMedico == null
        ) {

            throw new RuntimeException(
                    "Debe seleccionar un médico"
            );
        }


        // ======================================
        // MÉDICO
        // ======================================

        Medico medico =
                medicoRepository
                        .findById(
                                idMedico
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Médico no encontrado"
                                )
                        );


        if (
                !Boolean.TRUE.equals(
                        medico.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "El médico seleccionado se encuentra inactivo"
            );
        }


        // ======================================
        // ESPECIALIDAD
        // ======================================

        Especialidad especialidad =
                medico.getEspecialidad();


        if (
                especialidad == null
        ) {

            throw new RuntimeException(
                    "El médico no tiene una especialidad asignada"
            );
        }


        if (
                !Boolean.TRUE.equals(
                        especialidad.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "La especialidad del médico se encuentra inactiva"
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
                        ||
                        (
                                duracion != 30
                                        &&
                                        duracion != 60
                        )
        ) {

            throw new RuntimeException(
                    "La duración de la especialidad debe ser de 30 minutos o 1 hora"
            );
        }


        // ======================================
        // POLÍTICA
        // ======================================

        PoliticaClinica politica =
                obtenerPoliticaValida();


        int diasAnticipacion =
                politica
                        .getDiasAnticipacion();


        LocalDate hoy =
                LocalDate.now(
                        ZONA_PERU
                );


        int cantidadGenerada =
                0;


        // ======================================
        // GENERAR POR DÍA
        // ======================================

        for (
                int i = 0;
                i <= diasAnticipacion;
                i++
        ) {

            LocalDate fecha =
                    hoy.plusDays(i);


            // ==================================
            // MÁXIMO DOS POR DÍA
            // ==================================

            long cantidadExistente =
                    horarioRepository
                            .countByMedicoIdMedicoAndFecha(
                                    medico.getIdMedico(),
                                    fecha
                            );


            if (
                    cantidadExistente
                            >= MAX_HORARIOS_DIA
            ) {

                continue;
            }


            // ==================================
            // HORARIO DE MAÑANA
            // ==================================

            boolean existeManana =
                    horarioRepository
                            .existsByMedicoIdMedicoAndFechaAndHoraGreaterThanEqualAndHoraLessThan(
                                    medico.getIdMedico(),
                                    fecha,
                                    politica
                                            .getHoraInicioManana(),
                                    politica
                                            .getHoraFinManana()
                            );


            if (
                    !existeManana
                            &&
                            cantidadExistente
                                    < MAX_HORARIOS_DIA
            ) {

                int generado =
                        generarPrimerHorarioValido(
                                medico,
                                fecha,
                                politica
                                        .getHoraInicioManana(),
                                politica
                                        .getHoraFinManana(),
                                duracion
                        );


                cantidadGenerada +=
                        generado;


                cantidadExistente +=
                        generado;
            }


            // ==================================
            // HORARIO DE TARDE
            // ==================================

            boolean existeTarde =
                    horarioRepository
                            .existsByMedicoIdMedicoAndFechaAndHoraGreaterThanEqualAndHoraLessThan(
                                    medico.getIdMedico(),
                                    fecha,
                                    politica
                                            .getHoraInicioTarde(),
                                    politica
                                            .getHoraFinTarde()
                            );


            if (
                    !existeTarde
                            &&
                            cantidadExistente
                                    < MAX_HORARIOS_DIA
            ) {

                int generado =
                        generarPrimerHorarioValido(
                                medico,
                                fecha,
                                politica
                                        .getHoraInicioTarde(),
                                politica
                                        .getHoraFinTarde(),
                                duracion
                        );


                cantidadGenerada +=
                        generado;
            }
        }


        return cantidadGenerada;
    }


    // ==========================================
    // GENERAR PRIMER HORARIO VÁLIDO DEL TURNO
    // ==========================================

    private int generarPrimerHorarioValido(
            Medico medico,
            LocalDate fecha,
            LocalTime inicio,
            LocalTime fin,
            int duracion) {

        if (
                inicio == null
                        ||
                        fin == null
                        ||
                        !inicio.isBefore(fin)
        ) {

            return 0;
        }


        LocalTime horaActual =
                inicio;


        LocalDateTime ahora =
                LocalDateTime.now(
                        ZONA_PERU
                );


        while (
                horaActual.isBefore(fin)
        ) {

            LocalTime horaFin =
                    horaActual.plusMinutes(
                            duracion
                    );


            // ==================================
            // NO SALIR DEL TURNO
            // ==================================

            if (
                    horaFin.isAfter(fin)
            ) {

                return 0;
            }


            LocalDateTime fechaHora =
                    LocalDateTime.of(
                            fecha,
                            horaActual
                    );


            // ==================================
            // SOLO FUTUROS
            // ==================================

            if (
                    fechaHora.isAfter(
                            ahora
                    )
            ) {

                boolean existe =
                        horarioRepository
                                .existsByMedicoIdMedicoAndFechaAndHora(
                                        medico.getIdMedico(),
                                        fecha,
                                        horaActual
                                );


                if (
                        !existe
                ) {

                    Horario horario =
                            new Horario();


                    horario.setMedico(
                            medico
                    );


                    horario.setFecha(
                            fecha
                    );


                    horario.setHora(
                            horaActual
                    );


                    horario.setHoraFin(
                            horaFin
                    );


                    horario.setDiaSemana(
                            obtenerDiaSemana(
                                    fecha
                            )
                    );


                    horario.setEstado(
                            "DISPONIBLE"
                    );


                    horarioRepository.save(
                            horario
                    );


                    /*
                     * IMPORTANTE:
                     * Solo generamos UNO
                     * dentro de este turno.
                     */

                    return 1;
                }
            }


            /*
             * Si el primero ya pasó, buscamos
             * el siguiente bloque lógico.
             *
             * 30 min:
             * 08:00 → 08:30 → 09:00...
             *
             * 60 min:
             * 08:00 → 09:00 → 10:00...
             */

            horaActual =
                    horaActual.plusMinutes(
                            duracion
                    );
        }


        return 0;
    }


    // ==========================================
    // OBTENER POLÍTICA ACTIVA
    // ==========================================

    private PoliticaClinica obtenerPoliticaValida() {

        PoliticaClinica politica =
                politicaClinicaService
                        .obtenerPoliticaActiva();


        if (
                politica == null
        ) {

            throw new RuntimeException(
                    "No existe una política clínica activa"
            );
        }


        // ======================================
        // DÍAS
        // ======================================

        if (
                politica
                        .getDiasAnticipacion()
                        == null
                        ||
                        politica
                                .getDiasAnticipacion()
                                < 1
        ) {

            throw new RuntimeException(
                    "La política clínica tiene un número de días de anticipación no válido"
            );
        }


        // ======================================
        // TURNOS COMPLETOS
        // ======================================

        if (
                politica
                        .getHoraInicioManana()
                        == null
                        ||
                        politica
                                .getHoraFinManana()
                                == null
                        ||
                        politica
                                .getHoraInicioTarde()
                                == null
                        ||
                        politica
                                .getHoraFinTarde()
                                == null
        ) {

            throw new RuntimeException(
                    "La política clínica no tiene horarios de atención completos"
            );
        }


        // ======================================
        // MAÑANA
        // ======================================

        if (
                !politica
                        .getHoraInicioManana()
                        .isBefore(
                                politica
                                        .getHoraFinManana()
                        )
        ) {

            throw new RuntimeException(
                    "El turno de mañana de la política clínica no es válido"
            );
        }


        // ======================================
        // TARDE
        // ======================================

        if (
                !politica
                        .getHoraInicioTarde()
                        .isBefore(
                                politica
                                        .getHoraFinTarde()
                        )
        ) {

            throw new RuntimeException(
                    "El turno de tarde de la política clínica no es válido"
            );
        }


        // ======================================
        // EVITAR SUPERPOSICIÓN
        // ======================================

        if (
                politica
                        .getHoraFinManana()
                        .isAfter(
                                politica
                                        .getHoraInicioTarde()
                        )
        ) {

            throw new RuntimeException(
                    "Los turnos de atención de la política clínica se superponen"
            );
        }


        return politica;
    }


    // ==========================================
    // DÍA DE LA SEMANA
    // ==========================================

    private String obtenerDiaSemana(
            LocalDate fecha) {

        DayOfWeek dia =
                fecha.getDayOfWeek();


        return switch (
                dia
                ) {

            case MONDAY ->
                    "LUNES";

            case TUESDAY ->
                    "MARTES";

            case WEDNESDAY ->
                    "MIERCOLES";

            case THURSDAY ->
                    "JUEVES";

            case FRIDAY ->
                    "VIERNES";

            case SATURDAY ->
                    "SABADO";

            case SUNDAY ->
                    "DOMINGO";
        };
    }
}