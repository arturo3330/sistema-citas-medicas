package com.citasmedicas.sistema_citas_medicas.entity;

import jakarta.persistence.*;

import java.time.LocalTime;

@Entity
@Table(
        name = "disponibilidad_medico",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "id_medico",
                                "dia_semana",
                                "hora_inicio",
                                "hora_fin"
                        }
                )
        }
)
public class DisponibilidadMedico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_disponibilidad")
    private Long idDisponibilidad;

    @ManyToOne
    @JoinColumn(
            name = "id_medico",
            nullable = false
    )
    private Medico medico;

    @Column(
            name = "dia_semana",
            nullable = false,
            length = 15
    )
    private String diaSemana;

    @Column(
            name = "hora_inicio",
            nullable = false
    )
    private LocalTime horaInicio;

    @Column(
            name = "hora_fin",
            nullable = false
    )
    private LocalTime horaFin;

    @Column(nullable = false)
    private Boolean estado;

    public Long getIdDisponibilidad() {
        return idDisponibilidad;
    }

    public void setIdDisponibilidad(
            Long idDisponibilidad) {
        this.idDisponibilidad = idDisponibilidad;
    }

    public Medico getMedico() {
        return medico;
    }

    public void setMedico(
            Medico medico) {
        this.medico = medico;
    }

    public String getDiaSemana() {
        return diaSemana;
    }

    public void setDiaSemana(
            String diaSemana) {
        this.diaSemana = diaSemana;
    }

    public LocalTime getHoraInicio() {
        return horaInicio;
    }

    public void setHoraInicio(
            LocalTime horaInicio) {
        this.horaInicio = horaInicio;
    }

    public LocalTime getHoraFin() {
        return horaFin;
    }

    public void setHoraFin(
            LocalTime horaFin) {
        this.horaFin = horaFin;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(
            Boolean estado) {
        this.estado = estado;
    }
}