package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.dto.PagoRequest;
import com.citasmedicas.sistema_citas_medicas.entity.Cita;
import com.citasmedicas.sistema_citas_medicas.entity.Especialidad;
import com.citasmedicas.sistema_citas_medicas.entity.Horario;
import com.citasmedicas.sistema_citas_medicas.entity.Medico;
import com.citasmedicas.sistema_citas_medicas.entity.Paciente;

import com.citasmedicas.sistema_citas_medicas.repository.CitaRepository;
import com.citasmedicas.sistema_citas_medicas.repository.HorarioRepository;
import com.citasmedicas.sistema_citas_medicas.repository.PacienteRepository;
import com.citasmedicas.sistema_citas_medicas.repository.ReciboRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    private final CitaRepository citaRepository;

    private final HorarioRepository horarioRepository;

    private final PacienteRepository pacienteRepository;

    private final ReciboRepository reciboRepository;

    private final ActividadService actividadService;

    private final PagoService pagoService;


    public CitaService(
            CitaRepository citaRepository,
            HorarioRepository horarioRepository,
            PacienteRepository pacienteRepository,
            ReciboRepository reciboRepository,
            ActividadService actividadService,
            PagoService pagoService
    ) {

        this.citaRepository =
                citaRepository;

        this.horarioRepository =
                horarioRepository;

        this.pacienteRepository =
                pacienteRepository;

        this.reciboRepository =
                reciboRepository;

        this.actividadService =
                actividadService;

        this.pagoService =
                pagoService;
    }


    // ==========================================
    // LISTAR TODAS LAS CITAS
    // ==========================================

    public List<Cita> listar() {

        return citaRepository.findAll();
    }


    // ==========================================
    // BUSCAR CITA POR ID
    // ==========================================

    public Optional<Cita> buscarPorId(
            Long id
    ) {

        return citaRepository.findById(
                id
        );
    }


    // ==========================================
    // LISTAR CITAS POR PACIENTE
    // ==========================================

    public List<Cita> listarPorPaciente(
            Long idPaciente
    ) {

        return citaRepository
                .findByPacienteIdPaciente(
                        idPaciente
                );
    }


    // ==========================================
    // RESERVAR CITA + PAGO INICIAL
    // ==========================================

    @Transactional
    public Cita reservar(
            Long idHorario,
            Long idPaciente,
            BigDecimal monto,
            String metodoPago,
            String numeroOperacion
    ) {

        // ======================================
        // VALIDAR DATOS RECIBIDOS
        // ======================================

        if (idHorario == null) {

            throw new RuntimeException(
                    "Debe seleccionar un horario"
            );
        }


        if (idPaciente == null) {

            throw new RuntimeException(
                    "Paciente no válido"
            );
        }


        if (monto == null) {

            throw new RuntimeException(
                    "Debe ingresar el monto del pago"
            );
        }


        if (
                metodoPago == null
                        ||
                        metodoPago.isBlank()
        ) {

            throw new RuntimeException(
                    "Debe seleccionar un método de pago"
            );
        }


        if (
                numeroOperacion == null
                        ||
                        numeroOperacion.isBlank()
        ) {

            throw new RuntimeException(
                    "Debe ingresar el número de operación"
            );
        }


        // ======================================
        // BLOQUEAR HORARIO
        // ======================================

        /*
         * El horario se obtiene usando
         * PESSIMISTIC_WRITE.
         *
         * Si dos pacientes intentan reservar
         * exactamente el mismo horario,
         * solo uno podrá continuar.
         */
        Horario horario =
                horarioRepository
                        .buscarConBloqueo(
                                idHorario
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Horario no encontrado"
                                )
                        );


        // ======================================
        // VALIDAR ESTADO DEL HORARIO
        // ======================================

        if (
                horario.getEstado() == null
                        ||
                        !horario
                                .getEstado()
                                .equalsIgnoreCase(
                                        "DISPONIBLE"
                                )
        ) {

            throw new RuntimeException(
                    "Horario ya ocupado"
            );
        }


        // ======================================
        // VALIDAR FECHA Y HORA
        // ======================================

        if (
                horario.getFecha() == null
                        ||
                        horario.getHora() == null
        ) {

            throw new RuntimeException(
                    "El horario seleccionado no tiene una fecha u hora válida"
            );
        }


        LocalDateTime fechaHoraCita =
                LocalDateTime.of(
                        horario.getFecha(),
                        horario.getHora()
                );


        if (
                fechaHoraCita.isBefore(
                        LocalDateTime.now()
                )
        ) {

            throw new RuntimeException(
                    "No se puede reservar un horario que ya pasó"
            );
        }


        // ======================================
        // BUSCAR PACIENTE
        // ======================================

        Paciente paciente =
                pacienteRepository
                        .findById(
                                idPaciente
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Paciente no encontrado"
                                )
                        );


        // ======================================
        // OBTENER MÉDICO
        // ======================================

        Medico medico =
                horario.getMedico();


        if (medico == null) {

            throw new RuntimeException(
                    "El horario no tiene un médico asociado"
            );
        }


        if (
                !Boolean.TRUE.equals(
                        medico.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "El médico seleccionado no se encuentra activo"
            );
        }


        // ======================================
        // OBTENER ESPECIALIDAD
        // ======================================

        Especialidad especialidad =
                medico.getEspecialidad();


        if (especialidad == null) {

            throw new RuntimeException(
                    "El médico no tiene una especialidad asociada"
            );
        }


        if (
                !Boolean.TRUE.equals(
                        especialidad.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "La especialidad seleccionada no se encuentra activa"
            );
        }


        // ======================================
        // OBTENER COSTO
        // ======================================

        BigDecimal costoConsulta =
                especialidad
                        .getCostoConsulta();


        if (
                costoConsulta == null
        ) {

            throw new RuntimeException(
                    "La especialidad no tiene un costo de consulta configurado"
            );
        }


        if (
                costoConsulta.compareTo(
                        BigDecimal.ZERO
                ) <= 0
        ) {

            throw new RuntimeException(
                    "El costo de consulta debe ser mayor que cero"
            );
        }


        // ======================================
        // CREAR CITA
        // ======================================

        Cita cita =
                new Cita();


        cita.setHorario(
                horario
        );


        cita.setPaciente(
                paciente
        );


        cita.setFechaRegistro(
                LocalDateTime.now()
        );


        /*
         * Inicialmente queda pendiente.
         *
         * PagoService cambiará el estado a:
         *
         * SEPARADA
         * o
         * CONFIRMADA
         *
         * dependiendo del monto pagado.
         */
        cita.setEstado(
                "PENDIENTE_PAGO"
        );


        // ======================================
        // MONTOS INICIALES
        // ======================================

        cita.setMontoTotal(
                costoConsulta
        );


        cita.setMontoPagado(
                BigDecimal.ZERO
        );


        cita.setSaldo(
                costoConsulta
        );


        // ======================================
        // RESERVAR HORARIO
        // ======================================

        horario.setEstado(
                "RESERVADO"
        );


        horarioRepository.save(
                horario
        );


        // ======================================
        // GUARDAR CITA
        // ======================================

        Cita citaGuardada =
                citaRepository.save(
                        cita
                );


        /*
         * Forzamos que la cita tenga su ID
         * antes de crear el PagoRequest.
         */
        citaRepository.flush();


        // ======================================
        // PREPARAR PAGO
        // ======================================

        PagoRequest pagoRequest =
                new PagoRequest();


        pagoRequest.setIdCita(
                citaGuardada.getIdCita()
        );


        pagoRequest.setMonto(
                monto
        );


        pagoRequest.setMetodoPago(
                metodoPago
        );


        pagoRequest.setNumeroOperacion(
                numeroOperacion
        );


        // ======================================
        // REGISTRAR PAGO
        // ======================================

        /*
         * PagoService valida:
         *
         * - monto mayor a cero
         * - máximo permitido
         * - máximo 2 decimales
         * - no superar saldo
         * - porcentaje mínimo
         * - método de pago
         * - número de operación
         *
         * Si cualquiera falla, lanza excepción.
         *
         * Como estamos dentro de esta misma
         * transacción, Spring hará ROLLBACK.
         */
        pagoService.registrarPago(
                pagoRequest
        );


        // ======================================
        // REGISTRAR ACTIVIDAD DE LA CITA
        // ======================================

        String descripcion =
                "Nueva cita reservada para "
                        + paciente.getNombre()
                        + " con "
                        + medico.getNombre();


        actividadService.registrar(
                "CITA",
                descripcion,
                null,
                null
        );


        // ======================================
        // DEVOLVER CITA ACTUALIZADA
        // ======================================

        return citaRepository
                .findById(
                        citaGuardada.getIdCita()
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "No se pudo recuperar la cita registrada"
                        )
                );
    }


    // ==========================================
    // ELIMINAR CITA
    // ==========================================

    @Transactional
    public void eliminar(
            Long id
    ) {

        Cita cita =
                citaRepository
                        .findById(
                                id
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cita no encontrada"
                                )
                        );


        // ======================================
        // VALIDAR SI YA TIENE RECIBO
        // ======================================

        boolean tieneRecibo =
                reciboRepository
                        .findByCitaIdCita(
                                id
                        )
                        .isPresent();


        if (tieneRecibo) {

            throw new RuntimeException(
                    "No se puede eliminar la cita porque ya tiene pagos registrados"
            );
        }


        // ======================================
        // LIBERAR HORARIO
        // ======================================

        Horario horario =
                cita.getHorario();


        if (horario != null) {

            horario.setEstado(
                    "DISPONIBLE"
            );


            horarioRepository.save(
                    horario
            );
        }


        // ======================================
        // NOMBRE DEL PACIENTE
        // ======================================

        String nombrePaciente =
                cita.getPaciente() != null
                        ? cita
                        .getPaciente()
                        .getNombre()
                        : "paciente";


        // ======================================
        // ELIMINAR
        // ======================================

        citaRepository.delete(
                cita
        );


        // ======================================
        // REGISTRAR ACTIVIDAD
        // ======================================

        actividadService.registrar(
                "CITA",
                "Cita eliminada de "
                        + nombrePaciente,
                null,
                null
        );
    }
}