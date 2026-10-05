package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Especialidad;
import com.citasmedicas.sistema_citas_medicas.entity.Horario;
import com.citasmedicas.sistema_citas_medicas.entity.Medico;
import com.citasmedicas.sistema_citas_medicas.entity.PoliticaClinica;

import com.citasmedicas.sistema_citas_medicas.repository.HorarioRepository;
import com.citasmedicas.sistema_citas_medicas.repository.MedicoRepository;

import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;

import java.util.List;
import java.util.Optional;

@Service
public class HorarioService {

    private static final ZoneId ZONA_PERU =
            ZoneId.of("America/Lima");


    private final HorarioRepository horarioRepository;

    private final MedicoRepository medicoRepository;

    private final PoliticaClinicaService politicaClinicaService;


    public HorarioService(
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
    // LISTAR TODOS
    // ==========================================

    public List<Horario> listar() {

        return horarioRepository.findAll();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    public Optional<Horario> buscarPorId(
            Long id) {

        return horarioRepository.findById(
                id
        );
    }


    // ==========================================
    // DISPONIBLES POR ESPECIALIDAD
    // SOLO FUTUROS
    // ==========================================

    public List<Horario> listarDisponiblesPorEspecialidad(
            Long idEspecialidad) {

        LocalDate fechaActual =
                LocalDate.now(
                        ZONA_PERU
                );


        LocalTime horaActual =
                LocalTime.now(
                        ZONA_PERU
                );


        return horarioRepository
                .buscarDisponiblesFuturosPorEspecialidad(
                        "DISPONIBLE",
                        idEspecialidad,
                        fechaActual,
                        horaActual
                );
    }


    // ==========================================
    // DISPONIBLES POR MÉDICO
    // SOLO FUTUROS
    // ==========================================

    public List<Horario> listarDisponiblesPorMedico(
            Long idMedico) {

        LocalDate fechaActual =
                LocalDate.now(
                        ZONA_PERU
                );


        LocalTime horaActual =
                LocalTime.now(
                        ZONA_PERU
                );


        return horarioRepository
                .buscarDisponiblesFuturosPorMedico(
                        "DISPONIBLE",
                        idMedico,
                        fechaActual,
                        horaActual
                );
    }


    // ==========================================
    // DISPONIBLES POR MÉDICO Y FECHA
    // SOLO FUTUROS
    // ==========================================

    public List<Horario> listarDisponiblesPorMedicoYFecha(
            Long idMedico,
            LocalDate fecha) {

        LocalDate fechaActual =
                LocalDate.now(
                        ZONA_PERU
                );


        LocalTime horaActual =
                LocalTime.now(
                        ZONA_PERU
                );


        return horarioRepository
                .buscarDisponiblesFuturosPorMedicoYFecha(
                        "DISPONIBLE",
                        idMedico,
                        fecha,
                        fechaActual,
                        horaActual
                );
    }


    // ==========================================
    // GUARDAR
    // ==========================================

    public Horario guardar(
            Horario horario) {

        validarDatosBasicos(
                horario
        );


        // ======================================
        // POLÍTICA ACTIVA
        // ======================================

        PoliticaClinica politica =
                obtenerPoliticaValida();


        // ======================================
        // MÉDICO
        // ======================================

        Long idMedico =
                horario
                        .getMedico()
                        .getIdMedico();


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


        validarMedico(
                medico
        );


        horario.setMedico(
                medico
        );


        // ======================================
        // VALIDACIONES
        // ======================================

        validarFecha(
                horario.getFecha(),
                politica
        );


        validarHora(
                horario.getHora(),
                politica
        );


        validarFechaHoraActual(
                horario.getFecha(),
                horario.getHora()
        );


        validarDuplicado(
                horario
        );


        // ======================================
        // CALCULAR HORA FIN
        // ======================================

        calcularHoraFin(
                horario,
                medico,
                politica
        );


        // ======================================
        // CALCULAR DÍA
        // ======================================

        calcularDiaSemana(
                horario
        );


        // ======================================
        // ESTADO POR DEFECTO
        // ======================================

        if (
                horario.getEstado() == null
                        ||
                        horario
                                .getEstado()
                                .isBlank()
        ) {

            horario.setEstado(
                    "DISPONIBLE"
            );
        }


        return horarioRepository.save(
                horario
        );
    }


    // ==========================================
    // ACTUALIZAR
    // ==========================================

    public Horario actualizar(
            Long id,
            Horario datos) {

        Horario actual =
                horarioRepository
                        .findById(
                                id
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Horario no encontrado"
                                )
                        );


        validarDatosBasicos(
                datos
        );


        PoliticaClinica politica =
                obtenerPoliticaValida();


        // ======================================
        // MÉDICO
        // ======================================

        Long idMedico =
                datos
                        .getMedico()
                        .getIdMedico();


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


        validarMedico(
                medico
        );


        // ======================================
        // VALIDACIONES
        // ======================================

        validarFecha(
                datos.getFecha(),
                politica
        );


        validarHora(
                datos.getHora(),
                politica
        );


        validarFechaHoraActual(
                datos.getFecha(),
                datos.getHora()
        );


        validarDuplicadoActualizacion(
                id,
                datos
        );


        // ======================================
        // ACTUALIZAR DATOS
        // ======================================

        actual.setMedico(
                medico
        );


        actual.setFecha(
                datos.getFecha()
        );


        actual.setHora(
                datos.getHora()
        );


        if (
                datos.getEstado() != null
                        &&
                        !datos
                                .getEstado()
                                .isBlank()
        ) {

            actual.setEstado(
                    datos.getEstado()
            );
        }


        // ======================================
        // RECALCULAR HORA FIN
        // ======================================

        calcularHoraFin(
                actual,
                medico,
                politica
        );


        // ======================================
        // RECALCULAR DÍA
        // ======================================

        calcularDiaSemana(
                actual
        );


        return horarioRepository.save(
                actual
        );
    }


    // ==========================================
    // ELIMINAR
    // ==========================================

    public void eliminar(
            Long id) {

        Horario horario =
                horarioRepository
                        .findById(
                                id
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Horario no encontrado"
                                )
                        );


        horarioRepository.delete(
                horario
        );
    }


    // ==========================================
    // VALIDAR MÉDICO
    // ==========================================

    private void validarMedico(
            Medico medico) {

        if (
                medico == null
        ) {

            throw new RuntimeException(
                    "Médico no encontrado"
            );
        }


        if (
                !Boolean.TRUE.equals(
                        medico.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "El médico seleccionado se encuentra inactivo"
            );
        }


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


        if (
                politica.getDiasAnticipacion() == null
                        ||
                        politica.getDiasAnticipacion() < 1
        ) {

            throw new RuntimeException(
                    "La política clínica tiene un número de días de anticipación no válido"
            );
        }


        if (
                politica.getHoraInicioManana() == null
                        ||
                        politica.getHoraFinManana() == null
                        ||
                        politica.getHoraInicioTarde() == null
                        ||
                        politica.getHoraFinTarde() == null
        ) {

            throw new RuntimeException(
                    "La política clínica no tiene horarios de atención completos"
            );
        }


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
    // VALIDACIONES BÁSICAS
    // ==========================================

    private void validarDatosBasicos(
            Horario horario) {

        if (
                horario == null
        ) {

            throw new RuntimeException(
                    "Los datos del horario son obligatorios"
            );
        }


        if (
                horario.getMedico() == null
                        ||
                        horario
                                .getMedico()
                                .getIdMedico()
                                == null
        ) {

            throw new RuntimeException(
                    "Debe seleccionar un médico"
            );
        }


        if (
                horario.getFecha() == null
        ) {

            throw new RuntimeException(
                    "La fecha es obligatoria"
            );
        }


        if (
                horario.getHora() == null
        ) {

            throw new RuntimeException(
                    "La hora es obligatoria"
            );
        }
    }


    // ==========================================
    // VALIDAR FECHA
    // ==========================================

    private void validarFecha(
            LocalDate fecha,
            PoliticaClinica politica) {

        LocalDate hoy =
                LocalDate.now(
                        ZONA_PERU
                );


        LocalDate limite =
                hoy.plusDays(
                        politica
                                .getDiasAnticipacion()
                );


        if (
                fecha.isBefore(
                        hoy
                )
        ) {

            throw new RuntimeException(
                    "No se pueden registrar horarios en fechas pasadas"
            );
        }


        if (
                fecha.isAfter(
                        limite
                )
        ) {

            throw new RuntimeException(
                    "Solo se pueden registrar horarios hasta "
                            + politica
                            .getDiasAnticipacion()
                            + " días de anticipación"
            );
        }
    }


    // ==========================================
    // VALIDAR HORA
    // ==========================================

    private void validarHora(
            LocalTime hora,
            PoliticaClinica politica) {

        LocalTime inicioManana =
                politica.getHoraInicioManana();


        LocalTime finManana =
                politica.getHoraFinManana();


        LocalTime inicioTarde =
                politica.getHoraInicioTarde();


        LocalTime finTarde =
                politica.getHoraFinTarde();


        boolean turnoManana =
                !hora.isBefore(
                        inicioManana
                )
                        &&
                        hora.isBefore(
                                finManana
                        );


        boolean turnoTarde =
                !hora.isBefore(
                        inicioTarde
                )
                        &&
                        hora.isBefore(
                                finTarde
                        );


        if (
                !turnoManana
                        &&
                        !turnoTarde
        ) {

            throw new RuntimeException(
                    "La hora debe estar dentro del horario de atención: "
                            + formatearHora(
                            inicioManana
                    )
                            + " a "
                            + formatearHora(
                            finManana
                    )
                            + " o "
                            + formatearHora(
                            inicioTarde
                    )
                            + " a "
                            + formatearHora(
                            finTarde
                    )
            );
        }
    }


    // ==========================================
    // VALIDAR FECHA Y HORA ACTUAL
    // ==========================================

    private void validarFechaHoraActual(
            LocalDate fecha,
            LocalTime hora) {

        LocalDateTime fechaHora =
                LocalDateTime.of(
                        fecha,
                        hora
                );


        LocalDateTime ahora =
                LocalDateTime.now(
                        ZONA_PERU
                );


        if (
                !fechaHora.isAfter(
                        ahora
                )
        ) {

            throw new RuntimeException(
                    "No se puede registrar un horario en una fecha u hora pasada"
            );
        }
    }


    // ==========================================
    // VALIDAR DUPLICADO
    // ==========================================

    private void validarDuplicado(
            Horario horario) {

        boolean existe =
                horarioRepository
                        .existsByMedicoIdMedicoAndFechaAndHora(
                                horario
                                        .getMedico()
                                        .getIdMedico(),

                                horario
                                        .getFecha(),

                                horario
                                        .getHora()
                        );


        if (
                existe
        ) {

            throw new RuntimeException(
                    "El médico ya tiene un horario registrado en esa fecha y hora"
            );
        }
    }


    // ==========================================
    // VALIDAR DUPLICADO AL ACTUALIZAR
    // ==========================================

    private void validarDuplicadoActualizacion(
            Long idHorario,
            Horario horario) {

        boolean existe =
                horarioRepository
                        .existsByMedicoIdMedicoAndFechaAndHora(
                                horario
                                        .getMedico()
                                        .getIdMedico(),

                                horario
                                        .getFecha(),

                                horario
                                        .getHora()
                        );


        if (
                !existe
        ) {

            return;
        }


        Optional<Horario> actual =
                horarioRepository
                        .findById(
                                idHorario
                        );


        if (
                actual.isPresent()
        ) {

            Horario h =
                    actual.get();


            boolean mismoHorario =

                    h.getMedico()
                            .getIdMedico()
                            .equals(
                                    horario
                                            .getMedico()
                                            .getIdMedico()
                            )

                            &&

                            h.getFecha()
                                    .equals(
                                            horario
                                                    .getFecha()
                                    )

                            &&

                            h.getHora()
                                    .equals(
                                            horario
                                                    .getHora()
                                    );


            if (
                    mismoHorario
            ) {

                return;
            }
        }


        throw new RuntimeException(
                "El médico ya tiene un horario registrado en esa fecha y hora"
        );
    }


    // ==========================================
    // CALCULAR HORA FINAL
    // ==========================================

    private void calcularHoraFin(
            Horario horario,
            Medico medico,
            PoliticaClinica politica) {

        Especialidad especialidad =
                medico.getEspecialidad();


        if (
                especialidad == null
        ) {

            throw new RuntimeException(
                    "El médico no tiene una especialidad asignada"
            );
        }


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


        LocalTime horaFin =
                horario
                        .getHora()
                        .plusMinutes(
                                duracion
                        );


        validarHoraFin(
                horario.getHora(),
                horaFin,
                politica
        );


        horario.setHoraFin(
                horaFin
        );
    }


    // ==========================================
    // VALIDAR HORA FINAL
    // ==========================================

    private void validarHoraFin(
            LocalTime horaInicio,
            LocalTime horaFin,
            PoliticaClinica politica) {

        LocalTime inicioManana =
                politica.getHoraInicioManana();


        LocalTime finManana =
                politica.getHoraFinManana();


        LocalTime inicioTarde =
                politica.getHoraInicioTarde();


        LocalTime finTarde =
                politica.getHoraFinTarde();


        boolean iniciaManana =
                !horaInicio.isBefore(
                        inicioManana
                )
                        &&
                        horaInicio.isBefore(
                                finManana
                        );


        boolean iniciaTarde =
                !horaInicio.isBefore(
                        inicioTarde
                )
                        &&
                        horaInicio.isBefore(
                                finTarde
                        );


        if (
                iniciaManana
        ) {

            if (
                    horaFin.isAfter(
                            finManana
                    )
            ) {

                throw new RuntimeException(
                        "La consulta terminaría después del cierre del turno de mañana"
                );
            }


            return;
        }


        if (
                iniciaTarde
        ) {

            if (
                    horaFin.isAfter(
                            finTarde
                    )
            ) {

                throw new RuntimeException(
                        "La consulta terminaría después del cierre del turno de tarde"
                );
            }


            return;
        }


        throw new RuntimeException(
                "La consulta está fuera del horario permitido por la política clínica"
        );
    }


    // ==========================================
    // CALCULAR DÍA DE LA SEMANA
    // ==========================================

    private void calcularDiaSemana(
            Horario horario) {

        DayOfWeek dia =
                horario
                        .getFecha()
                        .getDayOfWeek();


        String nombreDia;


        switch (
                dia
        ) {

            case MONDAY:

                nombreDia =
                        "LUNES";

                break;


            case TUESDAY:

                nombreDia =
                        "MARTES";

                break;


            case WEDNESDAY:

                nombreDia =
                        "MIERCOLES";

                break;


            case THURSDAY:

                nombreDia =
                        "JUEVES";

                break;


            case FRIDAY:

                nombreDia =
                        "VIERNES";

                break;


            case SATURDAY:

                nombreDia =
                        "SABADO";

                break;


            case SUNDAY:

                nombreDia =
                        "DOMINGO";

                break;


            default:

                nombreDia =
                        "";
        }


        horario.setDiaSemana(
                nombreDia
        );
    }


    // ==========================================
    // FORMATEAR HORA
    // ==========================================

    private String formatearHora(
            LocalTime hora) {

        return String.format(
                "%02d:%02d",
                hora.getHour(),
                hora.getMinute()
        );
    }
}