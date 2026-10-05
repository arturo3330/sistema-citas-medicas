package com.citasmedicas.sistema_citas_medicas.dto;

import java.math.BigDecimal;

public class PagoRequest {

    private Long idCita;

    private BigDecimal monto;

    private String metodoPago;

    private String numeroOperacion;


    public Long getIdCita() {
        return idCita;
    }

    public void setIdCita(Long idCita) {
        this.idCita = idCita;
    }


    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }


    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(
            String metodoPago) {

        this.metodoPago =
                metodoPago;
    }


    public String getNumeroOperacion() {
        return numeroOperacion;
    }

    public void setNumeroOperacion(
            String numeroOperacion) {

        this.numeroOperacion =
                numeroOperacion;
    }
}