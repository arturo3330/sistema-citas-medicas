package com.citasmedicas.sistema_citas_medicas.dto;

public class CambioClaveRequest {

    private String username;
    private String claveActual;
    private String claveNueva;

    public CambioClaveRequest() {
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getClaveActual() {
        return claveActual;
    }

    public void setClaveActual(String claveActual) {
        this.claveActual = claveActual;
    }

    public String getClaveNueva() {
        return claveNueva;
    }

    public void setClaveNueva(String claveNueva) {
        this.claveNueva = claveNueva;
    }
}