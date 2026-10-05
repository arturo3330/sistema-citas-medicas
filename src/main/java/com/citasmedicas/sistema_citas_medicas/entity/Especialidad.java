package com.citasmedicas.sistema_citas_medicas.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "especialidad")
public class Especialidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_especialidad")
    private Long idEspecialidad;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "tiempo_atencion_minutos", nullable = false)
    private Integer tiempoAtencionMinutos;

    @Column(name = "costo_consulta", nullable = false, precision = 10, scale = 2)
    private BigDecimal costoConsulta;

    @Column(nullable = false)
    private Boolean estado;

    public Long getIdEspecialidad() {
        return idEspecialidad;
    }

    public void setIdEspecialidad(Long idEspecialidad) {
        this.idEspecialidad = idEspecialidad;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getTiempoAtencionMinutos() {
        return tiempoAtencionMinutos;
    }

    public void setTiempoAtencionMinutos(Integer tiempoAtencionMinutos) {
        this.tiempoAtencionMinutos = tiempoAtencionMinutos;
    }

    public BigDecimal getCostoConsulta() {
        return costoConsulta;
    }

    public void setCostoConsulta(BigDecimal costoConsulta) {
        this.costoConsulta = costoConsulta;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}