package com.citasmedicas.sistema_citas_medicas.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "felicitacion")
public class Felicitacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_felicitacion")
    private Long idFelicitacion;


    @Column(
            nullable = false,
            length = 500
    )
    private String experiencia;


    @Column(
            nullable = false,
            length = 100
    )
    private String area;


    @Column(
            length = 120
    )
    private String personal;


    @Column(
            nullable = false,
            length = 150
    )
    private String paciente;


    @Column(
            nullable = false
    )
    private Integer puntuacion;


    @Column(
            name = "fecha_registro",
            nullable = false
    )
    private LocalDateTime fechaRegistro;


    @Column(
            nullable = false
    )
    private Boolean estado;


    public Felicitacion() {
    }


    public Long getIdFelicitacion() {
        return idFelicitacion;
    }


    public void setIdFelicitacion(
            Long idFelicitacion) {

        this.idFelicitacion =
                idFelicitacion;
    }


    public String getExperiencia() {
        return experiencia;
    }


    public void setExperiencia(
            String experiencia) {

        this.experiencia =
                experiencia;
    }


    public String getArea() {
        return area;
    }


    public void setArea(
            String area) {

        this.area =
                area;
    }


    public String getPersonal() {
        return personal;
    }


    public void setPersonal(
            String personal) {

        this.personal =
                personal;
    }


    public String getPaciente() {
        return paciente;
    }


    public void setPaciente(
            String paciente) {

        this.paciente =
                paciente;
    }


    public Integer getPuntuacion() {
        return puntuacion;
    }


    public void setPuntuacion(
            Integer puntuacion) {

        this.puntuacion =
                puntuacion;
    }


    public LocalDateTime getFechaRegistro() {
        return fechaRegistro;
    }


    public void setFechaRegistro(
            LocalDateTime fechaRegistro) {

        this.fechaRegistro =
                fechaRegistro;
    }


    public Boolean getEstado() {
        return estado;
    }


    public void setEstado(
            Boolean estado) {

        this.estado =
                estado;
    }
}