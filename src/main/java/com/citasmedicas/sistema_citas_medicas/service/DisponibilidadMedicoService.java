package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.DisponibilidadMedico;
import com.citasmedicas.sistema_citas_medicas.entity.Medico;
import com.citasmedicas.sistema_citas_medicas.repository.DisponibilidadMedicoRepository;
import com.citasmedicas.sistema_citas_medicas.repository.MedicoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class DisponibilidadMedicoService {

    private final DisponibilidadMedicoRepository disponibilidadRepository;

    private final MedicoRepository medicoRepository;


    public DisponibilidadMedicoService(
            DisponibilidadMedicoRepository disponibilidadRepository,
            MedicoRepository medicoRepository) {

        this.disponibilidadRepository =
                disponibilidadRepository;

        this.medicoRepository =
                medicoRepository;
    }


    // ==========================================
    // LISTAR
    // ==========================================

    public List<DisponibilidadMedico> listar() {

        return disponibilidadRepository.findAll();
    }


    // ==========================================
    // GUARDAR
    // ==========================================

    @Transactional
    public DisponibilidadMedico guardar(
            DisponibilidadMedico disponibilidad) {

        validarDatosBasicos(
                disponibilidad
        );


        Long idMedico =
                disponibilidad
                        .getMedico()
                        .getIdMedico();


        Medico medico =
                buscarMedicoValido(
                        idMedico
                );


        String dia =
                normalizarDia(
                        disponibilidad
                                .getDiaSemana()
                );


        LocalTime inicio =
                disponibilidad
                        .getHoraInicio();


        LocalTime fin =
                disponibilidad
                        .getHoraFin();


        // ======================================
        // VALIDAR SOLAPAMIENTO
        // ======================================

        validarSolapamiento(
                null,
                idMedico,
                dia,
                inicio,
                fin
        );


        disponibilidad.setMedico(
                medico
        );


        disponibilidad.setDiaSemana(
                dia
        );


        if (
                disponibilidad.getEstado()
                        == null
        ) {

            disponibilidad.setEstado(
                    true
            );
        }


        return disponibilidadRepository
                .save(
                        disponibilidad
                );
    }


    // ==========================================
    // ACTUALIZAR
    // ==========================================

    @Transactional
    public DisponibilidadMedico actualizar(
            Long id,
            DisponibilidadMedico datos) {

        DisponibilidadMedico actual =
                disponibilidadRepository
                        .findById(
                                id
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Disponibilidad no encontrada"
                                )
                        );


        validarDatosBasicos(
                datos
        );


        Long idMedico =
                datos
                        .getMedico()
                        .getIdMedico();


        Medico medico =
                buscarMedicoValido(
                        idMedico
                );


        String dia =
                normalizarDia(
                        datos
                                .getDiaSemana()
                );


        LocalTime inicio =
                datos
                        .getHoraInicio();


        LocalTime fin =
                datos
                        .getHoraFin();


        // ======================================
        // VALIDAR SOLAPAMIENTO
        // IGNORANDO EL REGISTRO ACTUAL
        // ======================================

        validarSolapamiento(
                id,
                idMedico,
                dia,
                inicio,
                fin
        );


        actual.setMedico(
                medico
        );


        actual.setDiaSemana(
                dia
        );


        actual.setHoraInicio(
                inicio
        );


        actual.setHoraFin(
                fin
        );


        if (
                datos.getEstado()
                        == null
        ) {

            actual.setEstado(
                    true
            );

        } else {

            actual.setEstado(
                    datos.getEstado()
            );
        }


        return disponibilidadRepository
                .save(
                        actual
                );
    }


    // ==========================================
    // ELIMINAR
    // ==========================================

    @Transactional
    public void eliminar(
            Long id) {

        DisponibilidadMedico disponibilidad =
                disponibilidadRepository
                        .findById(
                                id
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Disponibilidad no encontrada"
                                )
                        );


        disponibilidadRepository
                .delete(
                        disponibilidad
                );
    }


    // ==========================================
    // VALIDACIONES BÁSICAS
    // ==========================================

    private void validarDatosBasicos(
            DisponibilidadMedico disponibilidad) {

        if (
                disponibilidad == null
        ) {

            throw new RuntimeException(
                    "Los datos son obligatorios"
            );
        }


        if (
                disponibilidad.getMedico()
                        == null
                        ||
                        disponibilidad
                                .getMedico()
                                .getIdMedico()
                                == null
        ) {

            throw new RuntimeException(
                    "Debe seleccionar un médico"
            );
        }


        if (
                disponibilidad.getDiaSemana()
                        == null
                        ||
                        disponibilidad
                                .getDiaSemana()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "Debe seleccionar un día"
            );
        }


        validarDia(
                disponibilidad
                        .getDiaSemana()
        );


        LocalTime inicio =
                disponibilidad
                        .getHoraInicio();


        LocalTime fin =
                disponibilidad
                        .getHoraFin();


        if (
                inicio == null
                        ||
                        fin == null
        ) {

            throw new RuntimeException(
                    "Debe indicar hora de inicio y hora de fin"
            );
        }


        if (
                !inicio.isBefore(
                        fin
                )
        ) {

            throw new RuntimeException(
                    "La hora de inicio debe ser menor que la hora de fin"
            );
        }
    }


    // ==========================================
    // BUSCAR MÉDICO VÁLIDO
    // ==========================================

    private Medico buscarMedicoValido(
            Long idMedico) {

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


        if (
                !Boolean.TRUE.equals(
                        medico.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "No se puede registrar disponibilidad para un médico inactivo"
            );
        }


        if (
                medico.getEspecialidad()
                        == null
        ) {

            throw new RuntimeException(
                    "El médico no tiene una especialidad asociada"
            );
        }


        if (
                !Boolean.TRUE.equals(
                        medico
                                .getEspecialidad()
                                .getEstado()
                )
        ) {

            throw new RuntimeException(
                    "La especialidad del médico no se encuentra activa"
            );
        }


        return medico;
    }


    // ==========================================
    // VALIDAR SOLAPAMIENTOS
    // ==========================================

    private void validarSolapamiento(
            Long idActual,
            Long idMedico,
            String dia,
            LocalTime inicio,
            LocalTime fin) {

        List<DisponibilidadMedico> disponibilidades =
                disponibilidadRepository
                        .findAll();


        for (
                DisponibilidadMedico existente
                :
                disponibilidades
        ) {

            // ----------------------------------
            // IGNORAR REGISTRO QUE SE EDITA
            // ----------------------------------

            if (
                    idActual != null
                            &&
                            existente.getIdDisponibilidad()
                                    != null
                            &&
                            existente
                                    .getIdDisponibilidad()
                                    .equals(
                                            idActual
                                    )
            ) {

                continue;
            }


            // ----------------------------------
            // IGNORAR OTROS MÉDICOS
            // ----------------------------------

            if (
                    existente.getMedico()
                            == null
                            ||
                            existente
                                    .getMedico()
                                    .getIdMedico()
                                    == null
                            ||
                            !existente
                                    .getMedico()
                                    .getIdMedico()
                                    .equals(
                                            idMedico
                                    )
            ) {

                continue;
            }


            // ----------------------------------
            // IGNORAR OTROS DÍAS
            // ----------------------------------

            String diaExistente =
                    normalizarDia(
                            existente
                                    .getDiaSemana()
                    );


            if (
                    !diaExistente.equals(
                            dia
                    )
            ) {

                continue;
            }


            // ----------------------------------
            // IGNORAR DISPONIBILIDADES INACTIVAS
            // ----------------------------------

            if (
                    Boolean.FALSE.equals(
                            existente
                                    .getEstado()
                    )
            ) {

                continue;
            }


            LocalTime inicioExistente =
                    existente
                            .getHoraInicio();


            LocalTime finExistente =
                    existente
                            .getHoraFin();


            if (
                    inicioExistente == null
                            ||
                            finExistente == null
            ) {

                continue;
            }


            /*
             * Dos intervalos se solapan si:
             *
             * inicioNuevo < finExistente
             * &&
             * finNuevo > inicioExistente
             */
            boolean solapamiento =
                    inicio.isBefore(
                            finExistente
                    )
                            &&
                            fin.isAfter(
                                    inicioExistente
                            );


            if (
                    solapamiento
            ) {

                throw new RuntimeException(
                        "La disponibilidad se superpone con otro horario del mismo médico"
                );
            }
        }
    }


    // ==========================================
    // NORMALIZAR DÍA
    // ==========================================

    private String normalizarDia(
            String dia) {

        if (dia == null) {

            return "";
        }


        return dia
                .trim()
                .toUpperCase();
    }


    // ==========================================
    // VALIDAR DÍA
    // ==========================================

    private void validarDia(
            String dia) {

        String valor =
                normalizarDia(
                        dia
                );


        boolean valido =
                valor.equals(
                        "LUNES"
                )
                        ||
                        valor.equals(
                                "MARTES"
                        )
                        ||
                        valor.equals(
                                "MIERCOLES"
                        )
                        ||
                        valor.equals(
                                "JUEVES"
                        )
                        ||
                        valor.equals(
                                "VIERNES"
                        )
                        ||
                        valor.equals(
                                "SABADO"
                        )
                        ||
                        valor.equals(
                                "DOMINGO"
                        );


        if (!valido) {

            throw new RuntimeException(
                    "Día de la semana no válido"
            );
        }
    }
}