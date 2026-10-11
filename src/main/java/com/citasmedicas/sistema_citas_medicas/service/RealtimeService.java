package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.websocket.RealtimeWebSocketHandler;
import org.springframework.stereotype.Service;

@Service
public class RealtimeService {

    private final RealtimeWebSocketHandler handler;

    public RealtimeService(
            RealtimeWebSocketHandler handler) {

        this.handler = handler;
    }

    public void notificar(
            String tipo,
            String accion,
            Object id) {

        String mensaje =
                limpiar(tipo)
                        + "|"
                        + limpiar(accion)
                        + "|"
                        + (id == null ? "" : limpiar(String.valueOf(id)));

        handler.enviarATodos(mensaje);
    }

    private String limpiar(String valor) {

        if (valor == null) {
            return "";
        }

        return valor
                .replace("|", "_")
                .replace("\n", " ")
                .replace("\r", " ");
    }
}
