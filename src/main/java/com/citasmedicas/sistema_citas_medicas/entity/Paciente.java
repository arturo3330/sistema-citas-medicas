package com.citasmedicas.sistema_citas_medicas.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "paciente")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_paciente")
    private Long idPaciente;

    @Column(length = 8, unique = true)
    private String dni;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 20)
    private String telefono;

    @Column(length = 100)
    private String correo;

    @Column(nullable = false)
    private Boolean estado = true;


    public Paciente() {
    }


    public Long getIdPaciente() {
        return idPaciente;
    }


    public void setIdPaciente(Long idPaciente) {
        this.idPaciente = idPaciente;
    }


    public String getDni() {
        return dni;
    }


    public void setDni(String dni) {
        this.dni = dni;
    }


    public String getNombre() {
        return nombre;
    }


    public void setNombre(String nombre) {
        this.nombre = nombre;
    }


    public String getTelefono() {
        return telefono;
    }


    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }


    public String getCorreo() {
        return correo;
    }


    public void setCorreo(String correo) {
        this.correo = correo;
    }


    public Boolean getEstado() {
        return estado;
    }


    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}