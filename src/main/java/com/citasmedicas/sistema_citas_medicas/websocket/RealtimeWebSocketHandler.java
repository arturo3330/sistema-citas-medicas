package com.citasmedicas.sistema_citas_medicas.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RealtimeWebSocketHandler extends TextWebSocketHandler {

    private final Set<WebSocketSession> sesiones =
            ConcurrentHashMap.newKeySet();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        sesiones.add(session);
    }

    @Override
    public void afterConnectionClosed(
            WebSocketSession session,
            CloseStatus status) {

        sesiones.remove(session);
    }

    @Override
    public void handleTransportError(
            WebSocketSession session,
            Throwable exception) {

        sesiones.remove(session);
    }

    public void enviarATodos(String mensaje) {

        TextMessage textMessage =
                new TextMessage(mensaje);

        for (WebSocketSession session : sesiones) {

            if (!session.isOpen()) {
                sesiones.remove(session);
                continue;
            }

            try {
                synchronized (session) {
                    session.sendMessage(textMessage);
                }
            } catch (IOException e) {
                sesiones.remove(session);
            }
        }
    }
}
