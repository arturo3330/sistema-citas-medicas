// ==========================================
// TIEMPO REAL GLOBAL - MAKANITOS
// ==========================================

let socketTiempoReal = null;
let reconexionTiempoReal = null;
const suscriptoresTiempoReal = new Map();

function tiempoRealSuscribir(tipo, callback) {

    const clave = String(tipo || "").toUpperCase();

    if (!suscriptoresTiempoReal.has(clave)) {
        suscriptoresTiempoReal.set(clave, new Set());
    }

    suscriptoresTiempoReal.get(clave).add(callback);

    conectarTiempoReal();

    return () => {
        const grupo = suscriptoresTiempoReal.get(clave);
        if (grupo) {
            grupo.delete(callback);
        }
    };
}

function conectarTiempoReal() {

    if (
        socketTiempoReal &&
        (
            socketTiempoReal.readyState === WebSocket.OPEN ||
            socketTiempoReal.readyState === WebSocket.CONNECTING
        )
    ) {
        return;
    }

    const protocolo =
        window.location.protocol === "https:"
            ? "wss://"
            : "ws://";

    const url =
        protocolo
        + window.location.host
        + "/ws-tiempo-real";

    socketTiempoReal = new WebSocket(url);

    socketTiempoReal.onopen = () => {
        console.log("Tiempo real conectado");
    };

    socketTiempoReal.onmessage = event => {

        const partes = String(event.data || "").split("|");

        const mensaje = {
            tipo: (partes[0] || "").toUpperCase(),
            accion: partes[1] || "",
            id: partes[2] || ""
        };

        const grupo =
            suscriptoresTiempoReal.get(mensaje.tipo);

        if (!grupo) {
            return;
        }

        grupo.forEach(callback => {
            try {
                callback(mensaje);
            } catch (error) {
                console.error(
                    "Error al procesar evento en tiempo real:",
                    error
                );
            }
        });
    };

    socketTiempoReal.onclose = () => {

        socketTiempoReal = null;

        if (reconexionTiempoReal) {
            clearTimeout(reconexionTiempoReal);
        }

        reconexionTiempoReal = setTimeout(
            conectarTiempoReal,
            2000
        );
    };

    socketTiempoReal.onerror = () => {
        if (socketTiempoReal) {
            socketTiempoReal.close();
        }
    };
}
