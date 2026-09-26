package com.citasmedicas.sistema_citas_medicas.service;

import com.citasmedicas.sistema_citas_medicas.entity.Cita;
import com.citasmedicas.sistema_citas_medicas.entity.Horario;
import com.citasmedicas.sistema_citas_medicas.entity.Paciente;

import com.citasmedicas.sistema_citas_medicas.repository.CitaRepository;
import com.citasmedicas.sistema_citas_medicas.repository.HorarioRepository;
import com.citasmedicas.sistema_citas_medicas.repository.PacienteRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CitaService {

    private final CitaRepository citaRepository;

    private final HorarioRepository horarioRepository;

    private final PacienteRepository pacienteRepository;


    public CitaService(
            CitaRepository citaRepository,
            HorarioRepository horarioRepository,
            PacienteRepository pacienteRepository) {

        this.citaRepository =
                citaRepository;

        this.horarioRepository =
                horarioRepository;

        this.pacienteRepository =
                pacienteRepository;
    }


    public List<Cita> listar() {

        return citaRepository.findAll();
    }


    public Optional<Cita> buscarPorId(Long id) {

        return citaRepository.findById(id);
    }


    public List<Cita> listarPorPaciente(
            Long idPaciente) {

        return citaRepository
                .findByPacienteIdPaciente(
                        idPaciente
                );
    }


    @Transactional
    public Cita reservarCita(
            Long idHorario,
            Long idPaciente) {

        /*
         * Esta consulta obtiene el horario
         * usando PESSIMISTIC_WRITE.
         */
        Horario horario =
                horarioRepository
                        .buscarConBloqueo(idHorario)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Horario no encontrado"
                                )
                        );


        if (
                !"DISPONIBLE"
                        .equalsIgnoreCase(
                                horario.getEstado()
                        )
        ) {

            throw new RuntimeException(
                    "Horario ya ocupado"
            );
        }


        Paciente paciente =
                pacienteRepository
                        .findById(idPaciente)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Paciente no encontrado"
                                )
                        );


        horario.setEstado(
                "RESERVADO"
        );

        horarioRepository.save(
                horario
        );


        Cita cita =
                new Cita();

        cita.setHorario(
                horario
        );

        cita.setPaciente(
                paciente
        );

        cita.setFechaRegistro(
                LocalDateTime.now()
        );

        cita.setEstado(
                "CONFIRMADA"
        );


        return citaRepository.save(
                cita
        );
    }
}