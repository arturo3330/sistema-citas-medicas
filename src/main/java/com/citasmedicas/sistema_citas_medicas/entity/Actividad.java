package com.citasmedicas.sistema_citas_medicas.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "actividad")
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_actividad")
    private Long idActividad;


    @Column(
            nullable = false,
            length = 30
    )
    private String tipo;


    @Column(
            nullable = false,
            length = 255
    )
    private String descripcion;


    @Column(
            nullable = false
    )
    private LocalDateTime fecha;


    @Column(
            length = 100
    )
    private String usuario;


    @Column(
            length = 30
    )
    private String rol;


    public Long getIdActividad() {
        return idActividad;
    }


    public void setIdActividad(
            Long idActividad) {

        this.idActividad =
                idActividad;
    }


    public String getTipo() {
        return tipo;
    }


    public void setTipo(
            String tipo) {

        this.tipo =
                tipo;
    }


    public String getDescripcion() {
        return descripcion;
    }


    public void setDescripcion(
            String descripcion) {

        this.descripcion =
                descripcion;
    }


    public LocalDateTime getFecha() {
        return fecha;
    }


    public void setFecha(
            LocalDateTime fecha) {

        this.fecha =
                fecha;
    }


    public String getUsuario() {
        return usuario;
    }


    public void setUsuario(
            String usuario) {

        this.usuario =
                usuario;
    }


    public String getRol() {
        return rol;
    }


    public void setRol(
            String rol) {

        this.rol =
                rol;
    }
}