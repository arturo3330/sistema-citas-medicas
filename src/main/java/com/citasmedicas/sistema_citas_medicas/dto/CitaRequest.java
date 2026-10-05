package com.citasmedicas.sistema_citas_medicas.dto;

import java.math.BigDecimal;

public class CitaRequest {

    // ==========================================
    // DATOS DE LA CITA
    // ==========================================

    private Long idHorario;

    private Long idPaciente;


    // ==========================================
    // DATOS DEL PAGO INICIAL
    // ==========================================

    private BigDecimal monto;

    private String metodoPago;

    private String numeroOperacion;


    // ==========================================
    // CONSTRUCTOR
    // ==========================================

    public CitaRequest() {
    }


    // ==========================================
    // GET / SET - HORARIO
    // ==========================================

    public Long getIdHorario() {

        return idHorario;
    }


    public void setIdHorario(
            Long idHorario
    ) {

        this.idHorario =
                idHorario;
    }


    // ==========================================
    // GET / SET - PACIENTE
    // ==========================================

    public Long getIdPaciente() {

        return idPaciente;
    }


    public void setIdPaciente(
            Long idPaciente
    ) {

        this.idPaciente =
                idPaciente;
    }


    // ==========================================
    // GET / SET - MONTO
    // ==========================================

    public BigDecimal getMonto() {

        return monto;
    }


    public void setMonto(
            BigDecimal monto
    ) {

        this.monto =
                monto;
    }


    // ==========================================
    // GET / SET - MÉTODO DE PAGO
    // ==========================================

    public String getMetodoPago() {

        return metodoPago;
    }


    public void setMetodoPago(
            String metodoPago
    ) {

        this.metodoPago =
                metodoPago;
    }


    // ==========================================
    // GET / SET - NÚMERO DE OPERACIÓN
    // ==========================================

    public String getNumeroOperacion() {

        return numeroOperacion;
    }


    public void setNumeroOperacion(
            String numeroOperacion
    ) {

        this.numeroOperacion =
                numeroOperacion;
    }
}