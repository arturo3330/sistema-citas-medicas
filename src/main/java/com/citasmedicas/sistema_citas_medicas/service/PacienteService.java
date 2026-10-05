package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Paciente;
import com.citasmedicas.sistema_citas_medicas.repository.PacienteRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
public class PacienteService {

    private final PacienteRepository pacienteRepository;

    private final ActividadService actividadService;


    // ==========================================
    // PATRÓN DE CORREO
    // ==========================================

    private static final Pattern PATRON_CORREO =
            Pattern.compile(
                    "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
            );


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public PacienteService(
            PacienteRepository pacienteRepository,
            ActividadService actividadService
    ) {

        this.pacienteRepository =
                pacienteRepository;

        this.actividadService =
                actividadService;
    }


    // ==========================================
// LISTAR PACIENTES ACTIVOS
// ==========================================

    public List<Paciente> listar() {

        return pacienteRepository
                .findByEstadoTrue();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    public Optional<Paciente> buscarPorId(
            Long id
    ) {

        return pacienteRepository
                .findById(
                        id
                );
    }


    // ==========================================
    // BUSCAR POR DNI
    // ==========================================

    public Optional<Paciente> buscarPorDni(
            String dni
    ) {

        return pacienteRepository
                .findByDni(
                        dni
                );
    }


    // ==========================================
    // GUARDAR
    // ==========================================

    @Transactional
    public Paciente guardar(
            Paciente paciente
    ) {

        // ======================================
        // NORMALIZAR DATOS
        // ======================================

        normalizar(
                paciente
        );


        // ======================================
        // VALIDAR
        // ======================================

        validar(
                paciente
        );


        // ======================================
        // ESTADO POR DEFECTO
        // ======================================

        if (
                paciente.getEstado() == null
        ) {

            paciente.setEstado(
                    true
            );
        }


        // ======================================
        // GUARDAR
        // ======================================

        Paciente guardado =
                pacienteRepository
                        .save(
                                paciente
                        );


        // ======================================
        // REGISTRAR ACTIVIDAD
        // ======================================

        actividadService.registrar(
                "PACIENTE",
                "Nuevo paciente registrado: "
                        + guardado.getNombre(),
                null,
                null
        );


        return guardado;
    }


    // ==========================================
    // ACTUALIZAR
    // ==========================================

    @Transactional
    public Paciente actualizar(
            Long id,
            Paciente datos
    ) {

        Paciente actual =
                pacienteRepository
                        .findById(
                                id
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Paciente no encontrado"
                                )
                        );


        // ======================================
        // NORMALIZAR DATOS
        // ======================================

        normalizar(
                datos
        );


        // ======================================
        // VALIDAR
        // ======================================

        validar(
                datos
        );


        // ======================================
        // ACTUALIZAR CAMPOS
        // ======================================

        actual.setDni(
                datos.getDni()
        );


        actual.setNombre(
                datos.getNombre()
        );


        actual.setTelefono(
                datos.getTelefono()
        );


        actual.setCorreo(
                datos.getCorreo()
        );


        /*
         * No modificamos el estado aquí.
         *
         * De esa manera editar nombre, DNI,
         * teléfono o correo no reactiva ni
         * desactiva accidentalmente al paciente.
         */


        // ======================================
        // GUARDAR CAMBIOS
        // ======================================

        Paciente actualizado =
                pacienteRepository
                        .save(
                                actual
                        );


        // ======================================
        // REGISTRAR ACTIVIDAD
        // ======================================

        actividadService.registrar(
                "PACIENTE",
                "Paciente actualizado: "
                        + actualizado.getNombre(),
                null,
                null
        );


        return actualizado;
    }


    // ==========================================
    // ELIMINAR / DESACTIVAR
    // ==========================================

    @Transactional
    public void eliminar(
            Long id
    ) {

        Paciente paciente =
                pacienteRepository
                        .findById(
                                id
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Paciente no encontrado"
                                )
                        );


        // ======================================
        // YA ESTÁ DESACTIVADO
        // ======================================

        if (
                Boolean.FALSE.equals(
                        paciente.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "El paciente ya se encuentra desactivado"
            );
        }


        String nombre =
                paciente.getNombre();


        // ======================================
        // DESACTIVACIÓN LÓGICA
        // ======================================

        paciente.setEstado(
                false
        );


        pacienteRepository.save(
                paciente
        );


        // ======================================
        // REGISTRAR ACTIVIDAD
        // ======================================

        actividadService.registrar(
                "PACIENTE",
                "Paciente desactivado: "
                        + nombre,
                null,
                null
        );
    }


    // ==========================================
    // NORMALIZAR DATOS
    // ==========================================

    private void normalizar(
            Paciente paciente
    ) {

        if (
                paciente == null
        ) {

            return;
        }


        // ======================================
        // DNI
        // ======================================

        if (
                paciente.getDni() != null
        ) {

            paciente.setDni(
                    paciente
                            .getDni()
                            .trim()
            );
        }


        // ======================================
        // NOMBRE
        // ======================================

        if (
                paciente.getNombre() != null
        ) {

            paciente.setNombre(
                    paciente
                            .getNombre()
                            .trim()
            );
        }


        // ======================================
        // TELÉFONO
        // ======================================

        if (
                paciente.getTelefono() != null
        ) {

            String telefono =
                    paciente
                            .getTelefono()
                            .trim();


            paciente.setTelefono(
                    telefono.isEmpty()
                            ? null
                            : telefono
            );
        }


        // ======================================
        // CORREO
        // ======================================

        if (
                paciente.getCorreo() != null
        ) {

            String correo =
                    paciente
                            .getCorreo()
                            .trim();


            paciente.setCorreo(
                    correo.isEmpty()
                            ? null
                            : correo
            );
        }
    }


    // ==========================================
    // VALIDACIONES
    // ==========================================

    private void validar(
            Paciente paciente
    ) {

        // ======================================
        // PACIENTE
        // ======================================

        if (
                paciente == null
        ) {

            throw new RuntimeException(
                    "Los datos del paciente son obligatorios"
            );
        }


        // ======================================
        // DNI OBLIGATORIO
        // ======================================

        if (
                paciente.getDni() == null
                        ||
                        paciente
                                .getDni()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "El DNI del paciente es obligatorio"
            );
        }


        // ======================================
        // DNI SOLO NÚMEROS
        // ======================================

        if (
                !paciente
                        .getDni()
                        .matches("\\d+")
        ) {

            throw new RuntimeException(
                    "El DNI solo puede contener números"
            );
        }


        // ======================================
        // DNI EXACTAMENTE 8 DÍGITOS
        // ======================================

        if (
                paciente
                        .getDni()
                        .length()
                        != 8
        ) {

            throw new RuntimeException(
                    "El DNI debe tener exactamente 8 dígitos"
            );
        }


        // ======================================
        // NOMBRE
        // ======================================

        if (
                paciente.getNombre() == null
                        ||
                        paciente
                                .getNombre()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "El nombre del paciente es obligatorio"
            );
        }


        // ======================================
        // TELÉFONO
        // ======================================

        if (
                paciente.getTelefono() != null
                        &&
                        !paciente
                                .getTelefono()
                                .isBlank()
        ) {

            // ==================================
            // SOLO NÚMEROS
            // ==================================

            if (
                    !paciente
                            .getTelefono()
                            .matches("\\d+")
            ) {

                throw new RuntimeException(
                        "El teléfono solo puede contener números"
                );
            }


            // ==================================
            // MÁXIMO 10 DÍGITOS
            // ==================================

            if (
                    paciente
                            .getTelefono()
                            .length()
                            > 10
            ) {

                throw new RuntimeException(
                        "El teléfono debe tener como máximo 10 dígitos"
                );
            }
        }


        // ======================================
        // CORREO
        // ======================================

        if (
                paciente.getCorreo() != null
                        &&
                        !paciente
                                .getCorreo()
                                .isBlank()
                        &&
                        !PATRON_CORREO
                                .matcher(
                                        paciente.getCorreo()
                                )
                                .matches()
        ) {

            throw new RuntimeException(
                    "El correo electrónico no es válido"
            );
        }
    }
}