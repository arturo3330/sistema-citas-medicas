package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Especialidad;
import com.citasmedicas.sistema_citas_medicas.entity.Medico;
import com.citasmedicas.sistema_citas_medicas.repository.EspecialidadRepository;
import com.citasmedicas.sistema_citas_medicas.repository.MedicoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class MedicoService {

    private final MedicoRepository medicoRepository;

    private final EspecialidadRepository especialidadRepository;

    private final ActividadService actividadService;


    public MedicoService(
            MedicoRepository medicoRepository,
            EspecialidadRepository especialidadRepository,
            ActividadService actividadService
    ) {

        this.medicoRepository =
                medicoRepository;

        this.especialidadRepository =
                especialidadRepository;

        this.actividadService =
                actividadService;
    }


    // ==========================================
    // LISTAR SOLO MÉDICOS ACTIVOS
    // ==========================================

    public List<Medico> listar() {

        return medicoRepository
                .findByEstadoTrue();
    }


    // ==========================================
    // BUSCAR POR ID
    // ==========================================

    public Optional<Medico> buscarPorId(
            Long id
    ) {

        return medicoRepository.findById(
                id
        );
    }


    // ==========================================
    // GUARDAR
    // ==========================================

    @Transactional
    public Medico guardar(
            Medico medico
    ) {

        validar(
                medico
        );


        Long idEspecialidad =
                medico
                        .getEspecialidad()
                        .getIdEspecialidad();


        Especialidad especialidad =
                especialidadRepository
                        .findById(
                                idEspecialidad
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Especialidad no encontrada"
                                )
                        );


        if (
                !Boolean.TRUE.equals(
                        especialidad.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "La especialidad seleccionada se encuentra desactivada"
            );
        }


        medico.setEspecialidad(
                especialidad
        );


        if (
                medico.getEstado() == null
        ) {

            medico.setEstado(
                    true
            );
        }


        Medico guardado =
                medicoRepository.save(
                        medico
                );


        actividadService.registrar(
                "MEDICO",
                "Nuevo médico registrado: "
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
    public Medico actualizar(
            Long id,
            Medico datos
    ) {

        Medico actual =
                medicoRepository
                        .findById(
                                id
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Médico no encontrado"
                                )
                        );


        if (
                !Boolean.TRUE.equals(
                        actual.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "El médico se encuentra desactivado"
            );
        }


        validar(
                datos
        );


        Long idEspecialidad =
                datos
                        .getEspecialidad()
                        .getIdEspecialidad();


        Especialidad especialidad =
                especialidadRepository
                        .findById(
                                idEspecialidad
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Especialidad no encontrada"
                                )
                        );


        if (
                !Boolean.TRUE.equals(
                        especialidad.getEstado()
                )
        ) {

            throw new RuntimeException(
                    "La especialidad seleccionada se encuentra desactivada"
            );
        }


        actual.setNombre(
                datos.getNombre()
        );


        actual.setCmp(
                datos.getCmp()
        );


        actual.setEspecialidad(
                especialidad
        );


        Medico actualizado =
                medicoRepository.save(
                        actual
                );


        actividadService.registrar(
                "MEDICO",
                "Médico actualizado: "
                        + actualizado.getNombre(),
                null,
                null
        );


        return actualizado;
    }


    // ==========================================
    // DESACTIVAR MÉDICO
    // ==========================================

    @Transactional
    public void eliminar(
            Long id
    ) {

        Medico medico =
                medicoRepository
                        .findById(
                                id
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
                    "El médico ya se encuentra desactivado"
            );
        }


        String nombre =
                medico.getNombre();


        medico.setEstado(
                false
        );


        medicoRepository.save(
                medico
        );


        actividadService.registrar(
                "MEDICO",
                "Médico desactivado: "
                        + nombre,
                null,
                null
        );
    }


    // ==========================================
    // VALIDACIONES
    // ==========================================

    private void validar(
            Medico medico
    ) {

        if (
                medico == null
        ) {

            throw new RuntimeException(
                    "Los datos del médico son obligatorios"
            );
        }


        if (
                medico.getNombre() == null
                        ||
                        medico
                                .getNombre()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "El nombre del médico es obligatorio"
            );
        }


        if (
                medico.getCmp() == null
                        ||
                        medico
                                .getCmp()
                                .isBlank()
        ) {

            throw new RuntimeException(
                    "El CMP del médico es obligatorio"
            );
        }


        if (
                medico.getEspecialidad() == null
                        ||
                        medico
                                .getEspecialidad()
                                .getIdEspecialidad() == null
        ) {

            throw new RuntimeException(
                    "Debe seleccionar una especialidad"
            );
        }
    }
}