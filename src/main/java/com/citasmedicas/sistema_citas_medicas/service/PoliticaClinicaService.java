package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.PoliticaClinica;
import com.citasmedicas.sistema_citas_medicas.repository.PoliticaClinicaRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalTime;

@Service
public class PoliticaClinicaService {

    private final PoliticaClinicaRepository politicaRepository;

    public PoliticaClinicaService(
            PoliticaClinicaRepository politicaRepository) {

        this.politicaRepository = politicaRepository;
    }

    public PoliticaClinica obtenerPoliticaActiva() {

        return politicaRepository
                .findFirstByEstadoTrue()
                .orElseThrow(() ->
                        new RuntimeException(
                                "No existe una política activa de la clínica"
                        )
                );
    }

    public PoliticaClinica actualizar(
            Long id,
            PoliticaClinica datos) {

        PoliticaClinica actual =
                politicaRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Política no encontrada"
                                )
                        );

        validar(datos);

        actual.setNombre(
                datos.getNombre()
        );

        actual.setDiasAnticipacion(
                datos.getDiasAnticipacion()
        );

        actual.setHoraInicioManana(
                datos.getHoraInicioManana()
        );

        actual.setHoraFinManana(
                datos.getHoraFinManana()
        );

        actual.setHoraInicioTarde(
                datos.getHoraInicioTarde()
        );

        actual.setHoraFinTarde(
                datos.getHoraFinTarde()
        );

        actual.setPorcentajePagoMinimo(
                datos.getPorcentajePagoMinimo()
        );

        actual.setHorasLimiteCancelacion(
                datos.getHorasLimiteCancelacion()
        );

        actual.setEstado(true);

        return politicaRepository.save(actual);
    }

    private void validar(
            PoliticaClinica politica) {

        if (politica.getNombre() == null
                || politica.getNombre().isBlank()) {

            throw new RuntimeException(
                    "El nombre de la política es obligatorio"
            );
        }


        if (politica.getDiasAnticipacion() == null
                || politica.getDiasAnticipacion() <= 0
                || politica.getDiasAnticipacion() > 30) {

            throw new RuntimeException(
                    "Los días de anticipación deben estar entre 1 y 30"
            );
        }


        if (politica.getHoraInicioManana() == null
                || politica.getHoraFinManana() == null
                || politica.getHoraInicioTarde() == null
                || politica.getHoraFinTarde() == null) {

            throw new RuntimeException(
                    "Debe indicar todos los horarios de atención"
            );
        }


        if (!politica
                .getHoraInicioManana()
                .isBefore(
                        politica.getHoraFinManana()
                )) {

            throw new RuntimeException(
                    "El turno de mañana tiene un horario inválido"
            );
        }


        if (!politica
                .getHoraInicioTarde()
                .isBefore(
                        politica.getHoraFinTarde()
                )) {

            throw new RuntimeException(
                    "El turno de tarde tiene un horario inválido"
            );
        }


        if (!politica
                .getHoraFinManana()
                .isBefore(
                        politica.getHoraInicioTarde()
                )) {

            throw new RuntimeException(
                    "Los turnos de mañana y tarde no pueden superponerse"
            );
        }


        BigDecimal porcentaje =
                politica.getPorcentajePagoMinimo();

        if (porcentaje == null
                || porcentaje.compareTo(
                BigDecimal.ZERO
        ) < 0
                || porcentaje.compareTo(
                new BigDecimal("100")
        ) > 0) {

            throw new RuntimeException(
                    "El porcentaje mínimo de pago debe estar entre 0 y 100"
            );
        }


        if (politica
                .getHorasLimiteCancelacion() == null
                || politica
                .getHorasLimiteCancelacion() < 0) {

            throw new RuntimeException(
                    "Las horas límite de cancelación no son válidas"
            );
        }
    }
}