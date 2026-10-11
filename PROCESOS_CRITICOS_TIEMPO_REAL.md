# Makanitos - Procesos críticos en tiempo real

La sincronización usa WebSocket nativo. El servidor expone `/ws-tiempo-real` y envía mensajes con el formato `TIPO|ACCION|ID`. Los navegadores conectados reciben el evento y vuelven a consultar únicamente los datos de la pantalla correspondiente, sin recargar la página completa.

## Infraestructura común

- `build.gradle`: dependencia `spring-boot-starter-websocket`.
- `src/main/java/com/citasmedicas/sistema_citas_medicas/config/WebSocketConfig.java`: registra `/ws-tiempo-real`.
- `src/main/java/com/citasmedicas/sistema_citas_medicas/websocket/RealtimeWebSocketHandler.java`: mantiene las sesiones y difunde eventos.
- `src/main/java/com/citasmedicas/sistema_citas_medicas/service/RealtimeService.java`: servicio usado por los controladores para notificar cambios.
- `src/main/resources/static/js/realtime.js`: conexión WebSocket del navegador y suscripciones por tipo de evento.

## Proceso 1 - Reserva/cancelación de cita y ocupación/liberación del horario

**Desarrollo:**
- `service/CitaService.java`: método `reservar(...)` y método `eliminar(...)` (cancelación lógica).
- `repository/HorarioRepository.java`: método `buscarConBloqueo(...)` con `PESSIMISTIC_WRITE`; evita doble reserva real en BD.
- `controller/CitaController.java`: después de una operación correcta publica eventos `CITAS`, `HORARIOS` y, al reservar, `PAGOS`.
- `static/js/citas.js`: escucha `CITAS` y `HORARIOS`, ejecuta `listarCitas()` y `actualizarHorariosActuales()`.
- `static/js/reservar-cita.js`: escucha `HORARIOS` para actualizar horarios disponibles del paciente.

**Validación de negocio (no confundir con tiempo real):**
- `CitaService.reservar(...)`: horario DISPONIBLE, fecha futura, médico/especialidad activos, etc.

**Prueba con dos navegadores:** ambos muestran el mismo horario. En A se reserva. En B el horario desaparece y la cita aparece sin F5. Al cancelar, vuelve a aparecer el horario.

## Proceso 2 - Registro de pago y cambio de estado/saldo de la cita

**Desarrollo:**
- `service/PagoService.java`: método `registrarPago(...)` recalcula monto pagado, saldo y estado `SEPARADA`/`CONFIRMADA`.
- `controller/PagoController.java`: publica `PAGOS` y `CITAS` al terminar correctamente.
- `static/js/pagos.js`: escucha ambos eventos y ejecuta `cargarCitas()` + `listarPagos()`.
- `static/js/mis-pagos.js` y `static/js/mis-citas.js`: actualizan las vistas del paciente automáticamente.

**Validación de negocio:** monto > 0, máximo 2 decimales, no superar saldo, pago mínimo, método y número de operación.

**Prueba:** abrir Pagos en A y B. Registrar un abono en A. B actualiza recibo, saldo y estado sin F5.

## Proceso 3 - Mantenimiento de horarios

**Desarrollo:**
- `service/HorarioService.java`: `guardar(...)`, `actualizar(...)`, `eliminar(...)`.
- `controller/HorarioController.java`: publica `HORARIOS` después de crear, actualizar o eliminar.
- `static/js/horarios.js`: escucha `HORARIOS` y ejecuta `listar()`.
- `static/js/disponibilidad-medicos.js` y `static/js/reservar-cita.js`: también reaccionan a cambios de horario.

**Validación de negocio:** fechas permitidas, hora válida, médico activo, duplicados, política clínica y hora fin.

**Prueba:** abrir Horarios en A y B. Modificar la hora o eliminar un horario en A. La tabla de B cambia automáticamente.

## Proceso 4 - Mantenimiento de médicos

**Desarrollo:**
- `service/MedicoService.java`: `guardar(...)`, `actualizar(...)`, `eliminar(...)` (desactivación lógica).
- `controller/MedicoController.java`: publica `MEDICOS`; al desactivar también publica `HORARIOS`.
- `static/js/medicos.js`: escucha `MEDICOS`.
- `static/js/buscar-medico.js`: paciente ve cambios automáticamente.
- `static/js/horarios.js`: recarga la lista de médicos cuando cambia un médico.

**Validación de negocio:** datos del médico, especialidad existente/activa, estado, etc.

**Prueba:** abrir Médicos en A y B. Cambiar el nombre o desactivar un médico en A. B refleja el cambio sin F5; las pantallas dependientes también se actualizan.

## Proceso 5 - Mantenimiento de especialidades y costo de consulta

**Desarrollo:**
- `service/EspecialidadService.java`: `guardar(...)`, `actualizar(...)`, `eliminar(...)`.
- `controller/EspecialidadController.java`: publica `ESPECIALIDADES`; también `MEDICOS` cuando se desactiva una especialidad.
- `static/js/especialidades.js`: escucha `ESPECIALIDADES`.
- `static/js/especialidades-paciente.js`: actualiza la vista del paciente.
- `static/js/citas.js` y `static/js/medicos.js`: recargan selectores dependientes.

**Validación de negocio:** nombre, duración, costo, estado, rango de valores.

**Prueba:** abrir Especialidades en A y B. Cambiar costo/nombre en A. B cambia automáticamente sin F5; las pantallas que usan especialidades recargan sus opciones.

## Proceso adicional - Pacientes

- `service/PacienteService.java`: crear/actualizar/desactivar.
- `controller/PacienteController.java`: publica `PACIENTES`.
- `static/js/pacientes.js` y `static/js/citas.js`: actualizan tabla y selector de pacientes en tiempo real.

## Diferencia que deben explicar al docente

- **Validación:** impide guardar datos inválidos. Ejemplo: no aceptar un monto negativo.
- **Control de concurrencia:** protege la consistencia cuando dos usuarios actúan a la vez. Ejemplo: `PESSIMISTIC_WRITE` en la reserva del mismo horario.
- **Sincronización en tiempo real:** informa a los demás clientes que la BD cambió y actualiza sus vistas sin F5. Esto lo realiza WebSocket.
