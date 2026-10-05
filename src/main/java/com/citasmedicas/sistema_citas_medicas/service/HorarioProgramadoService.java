package com.citasmedicas.sistema_citas_medicas.service;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class HorarioProgramadoService {

    private final HorarioAutomaticoService
            horarioAutomaticoService;


    public HorarioProgramadoService(
            HorarioAutomaticoService horarioAutomaticoService) {

        this.horarioAutomaticoService =
                horarioAutomaticoService;
    }


    // ==========================================
    // AL INICIAR LA APLICACIÓN
    // ==========================================

    @EventListener(ApplicationReadyEvent.class)
    public void generarAlIniciar() {

        try {

            int cantidad =
                    horarioAutomaticoService
                            .generarProximosDias();

            System.out.println(
                    "Generación automática inicial: "
                            + cantidad
                            + " horarios nuevos."
            );

        } catch (Exception e) {

            System.err.println(
                    "No se pudieron generar horarios al iniciar: "
                            + e.getMessage()
            );
        }
    }


    // ==========================================
    // GENERACIÓN AUTOMÁTICA DIARIA
    // ==========================================

    /*
     * Todos los días a las 00:05.
     *
     * Como el generador comprueba si los horarios
     * ya existen, no crea duplicados.
     */
    @Scheduled(
            cron = "0 5 0 * * *",
            zone = "America/Lima"
    )
    public void generarDiariamente() {

        try {

            int cantidad =
                    horarioAutomaticoService
                            .generarProximosDias();

            System.out.println(
                    "Generación automática diaria: "
                            + cantidad
                            + " horarios nuevos."
            );

        } catch (Exception e) {

            System.err.println(
                    "Error en generación automática diaria: "
                            + e.getMessage()
            );
        }
    }
}