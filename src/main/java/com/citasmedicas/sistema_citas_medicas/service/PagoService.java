package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.dto.PagoRequest;
import com.citasmedicas.sistema_citas_medicas.entity.Cita;
import com.citasmedicas.sistema_citas_medicas.entity.PoliticaClinica;
import com.citasmedicas.sistema_citas_medicas.entity.Recibo;

import com.citasmedicas.sistema_citas_medicas.repository.CitaRepository;
import com.citasmedicas.sistema_citas_medicas.repository.ReciboRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class PagoService {

    private static final BigDecimal MONTO_MAXIMO =
            new BigDecimal("999999.99");

    private static final int MAX_CIFRAS_OPERACION =
            3;

    private static final ZoneId ZONA_PERU =
            ZoneId.of("America/Lima");


    private final CitaRepository citaRepository;

    private final ReciboRepository reciboRepository;

    private final PoliticaClinicaService politicaClinicaService;

    private final ActividadService actividadService;


    public PagoService(
            CitaRepository citaRepository,
            ReciboRepository reciboRepository,
            PoliticaClinicaService politicaClinicaService,
            ActividadService actividadService) {

        this.citaRepository =
                citaRepository;

        this.reciboRepository =
                reciboRepository;

        this.politicaClinicaService =
                politicaClinicaService;

        this.actividadService =
                actividadService;
    }


    // ==========================================
    // LISTAR RECIBOS
    // ==========================================

    public List<Recibo> listar() {

        return reciboRepository
                .findAll();
    }


    // ==========================================
    // BUSCAR RECIBO POR CITA
    // ==========================================

    public Recibo buscarPorCita(
            Long idCita) {

        return reciboRepository
                .findByCitaIdCita(
                        idCita
                )
                .orElseThrow(() ->
                        new RuntimeException(
                                "La cita todavía no tiene un recibo"
                        )
                );
    }


    // ==========================================
    // REGISTRAR PAGO
    // ==========================================

    @Transactional
    public Recibo registrarPago(
            PagoRequest request) {

        validarRequest(
                request
        );


        // ======================================
        // NORMALIZAR DATOS
        // ======================================

        request.setMetodoPago(
                request
                        .getMetodoPago()
                        .trim()
                        .toUpperCase()
        );


        request.setNumeroOperacion(
                request
                        .getNumeroOperacion()
                        .trim()
        );


        // ======================================
        // BUSCAR CITA
        // ======================================

        Cita cita =
                citaRepository
                        .findById(
                                request.getIdCita()
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Cita no encontrada"
                                )
                        );


        // ======================================
        // VALIDAR ESTADO
        // ======================================

        if (
                "ANULADA".equalsIgnoreCase(
                        cita.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "No se puede pagar una cita anulada"
            );
        }


        if (
                "PERDIDA".equalsIgnoreCase(
                        cita.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "No se puede pagar una cita perdida"
            );
        }


        // ======================================
        // MONTOS DE LA CITA
        // ======================================

        BigDecimal total =
                cita.getMontoTotal();


        BigDecimal pagadoActual =
                cita.getMontoPagado();


        if (
                total == null
        ) {

            throw new RuntimeException(
                    "La cita no tiene un monto total válido"
            );
        }


        if (
                total.compareTo(
                        BigDecimal.ZERO
                ) <= 0
        ) {

            throw new RuntimeException(
                    "La cita no tiene un monto válido para pago"
            );
        }


        if (
                pagadoActual == null
        ) {

            pagadoActual =
                    BigDecimal.ZERO;
        }


        // ======================================
        // CITA YA PAGADA
        // ======================================

        if (
                pagadoActual.compareTo(
                        total
                ) >= 0
        ) {

            throw new RuntimeException(
                    "La cita ya se encuentra pagada completamente"
            );
        }


        BigDecimal montoNuevo =
                request
                        .getMonto()
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        );


        BigDecimal saldoActual =
                total.subtract(
                        pagadoActual
                );


        // ======================================
        // NO EXCEDER SALDO
        // ======================================

        if (
                montoNuevo.compareTo(
                        saldoActual
                ) > 0
        ) {

            throw new RuntimeException(
                    "El monto ingresado supera el saldo pendiente de S/ "
                            + saldoActual
                            .setScale(
                                    2,
                                    RoundingMode.HALF_UP
                            )
                            .toPlainString()
            );
        }


        // ======================================
        // POLÍTICA DE PAGO
        // ======================================

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


        BigDecimal porcentajeMinimo =
                politica
                        .getPorcentajePagoMinimo();


        if (
                porcentajeMinimo == null
        ) {

            throw new RuntimeException(
                    "La política no tiene un porcentaje mínimo configurado"
            );
        }


        // ======================================
        // PRIMER PAGO
        // ======================================

        if (
                pagadoActual.compareTo(
                        BigDecimal.ZERO
                ) == 0
        ) {

            BigDecimal montoMinimo =
                    total
                            .multiply(
                                    porcentajeMinimo
                            )
                            .divide(
                                    new BigDecimal("100"),
                                    2,
                                    RoundingMode.HALF_UP
                            );


            if (
                    montoNuevo.compareTo(
                            montoMinimo
                    ) < 0
            ) {

                throw new RuntimeException(
                        "Para separar la cita debe pagar como mínimo el "
                                + porcentajeMinimo
                                .stripTrailingZeros()
                                .toPlainString()
                                + "%, equivalente a S/ "
                                + montoMinimo
                                .setScale(
                                        2,
                                        RoundingMode.HALF_UP
                                )
                                .toPlainString()
                );
            }
        }


        // ======================================
        // ACTUALIZAR MONTOS
        // ======================================

        BigDecimal nuevoPagado =
                pagadoActual.add(
                        montoNuevo
                );


        BigDecimal nuevoSaldo =
                total.subtract(
                        nuevoPagado
                );


        BigDecimal porcentajePagado =
                nuevoPagado
                        .multiply(
                                new BigDecimal("100")
                        )
                        .divide(
                                total,
                                2,
                                RoundingMode.HALF_UP
                        );


        cita.setMontoPagado(
                nuevoPagado
        );


        cita.setSaldo(
                nuevoSaldo
        );


        // ======================================
        // ESTADO DE LA CITA
        // ======================================

        if (
                nuevoSaldo.compareTo(
                        BigDecimal.ZERO
                ) == 0
        ) {

            cita.setEstado(
                    "CONFIRMADA"
            );

        } else {

            cita.setEstado(
                    "SEPARADA"
            );
        }


        citaRepository.save(
                cita
        );


        // ======================================
        // CREAR O ACTUALIZAR RECIBO
        // ======================================

        Recibo recibo =
                reciboRepository
                        .findByCitaIdCita(
                                cita.getIdCita()
                        )
                        .orElseGet(
                                Recibo::new
                        );


        recibo.setCita(
                cita
        );


        recibo.setFechaEmision(
                LocalDateTime.now(
                        ZONA_PERU
                )
        );


        recibo.setMontoTotal(
                total
        );


        recibo.setMontoPagado(
                nuevoPagado
        );


        recibo.setSaldo(
                nuevoSaldo
        );


        recibo.setPorcentajePagado(
                porcentajePagado
        );


        recibo.setMetodoPago(
                request.getMetodoPago()
        );


        recibo.setNumeroOperacion(
                request.getNumeroOperacion()
        );


        // ======================================
        // ESTADO DEL RECIBO
        // ======================================

        if (
                nuevoSaldo.compareTo(
                        BigDecimal.ZERO
                ) == 0
        ) {

            recibo.setEstado(
                    "PAGADO"
            );

        } else {

            recibo.setEstado(
                    "PARCIAL"
            );
        }


        Recibo reciboGuardado =
                reciboRepository
                        .save(
                                recibo
                        );


        // ======================================
        // REGISTRAR ACTIVIDAD
        // ======================================

        String descripcion =
                "Pago registrado para la cita #"
                        + cita.getIdCita()
                        + " por S/ "
                        + montoNuevo
                        .setScale(
                                2,
                                RoundingMode.HALF_UP
                        )
                        .toPlainString();


        actividadService.registrar(
                "PAGO",
                descripcion,
                null,
                null
        );


        return reciboGuardado;
    }


    // ==========================================
    // VALIDAR REQUEST
    // ==========================================

    private void validarRequest(
            PagoRequest request) {

        // ======================================
        // REQUEST
        // ======================================

        if (
                request == null
        ) {

            throw new RuntimeException(
                    "Los datos del pago son obligatorios"
            );
        }


        // ======================================
        // CITA
        // ======================================

        if (
                request.getIdCita() == null
        ) {

            throw new RuntimeException(
                    "Debe seleccionar una cita"
            );
        }


        // ======================================
        // MONTO
        // ======================================

        BigDecimal monto =
                request.getMonto();


        if (
                monto == null
                        ||
                        monto.compareTo(
                                BigDecimal.ZERO
                        ) <= 0
        ) {

            throw new RuntimeException(
                    "El monto del pago debe ser mayor que cero"
            );
        }


        // ======================================
        // MONTO MÁXIMO
        // ======================================

        if (
                monto.compareTo(
                        MONTO_MAXIMO
                ) > 0
        ) {

            throw new RuntimeException(
                    "El monto máximo permitido es S/ 999999.99"
            );
        }


        // ======================================
        // MÁXIMO 2 DECIMALES
        // ======================================

        if (
                monto.scale() > 2
        ) {

            throw new RuntimeException(
                    "El monto debe tener como máximo 2 decimales"
            );
        }


        // ======================================
        // MÉTODO DE PAGO
        // ======================================

        if (
                request.getMetodoPago() == null
                        ||
                        request
                                .getMetodoPago()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "Debe seleccionar un método de pago"
            );
        }


        // ======================================
        // VALIDAR MÉTODO PERMITIDO
        // ======================================

        String metodo =
                request
                        .getMetodoPago()
                        .trim()
                        .toUpperCase();


        if (
                !metodo.equals("EFECTIVO")
                        &&
                        !metodo.equals("YAPE")
                        &&
                        !metodo.equals("PLIN")
                        &&
                        !metodo.equals("TRANSFERENCIA")
                        &&
                        !metodo.equals("TARJETA")
        ) {

            throw new RuntimeException(
                    "El método de pago seleccionado no es válido"
            );
        }


        // ======================================
        // NÚMERO DE OPERACIÓN
        // ======================================

        if (
                request.getNumeroOperacion() == null
                        ||
                        request
                                .getNumeroOperacion()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "Debe ingresar el número de operación"
            );
        }


        String numeroOperacion =
                request
                        .getNumeroOperacion()
                        .trim();


        // ======================================
        // SOLO NÚMEROS
        // ======================================

        if (
                !numeroOperacion.matches(
                        "\\d+"
                )
        ) {

            throw new RuntimeException(
                    "El número de operación solo puede contener números"
            );
        }


        // ======================================
        // MÁXIMO 3 CIFRAS
        // ======================================

        if (
                numeroOperacion.length()
                        > MAX_CIFRAS_OPERACION
        ) {

            throw new RuntimeException(
                    "El número de operación debe tener como máximo 3 cifras"
            );
        }
    }
}