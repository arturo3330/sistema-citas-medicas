package com.citasmedicas.sistema_citas_medicas.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "recibo")
public class Recibo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_recibo")
    private Long idRecibo;

    @OneToOne
    @JoinColumn(name = "id_cita", nullable = false, unique = true)
    private Cita cita;

    @Column(name = "fecha_emision", nullable = false)
    private LocalDateTime fechaEmision;

    @Column(name = "monto_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoTotal;

    @Column(name = "monto_pagado", nullable = false, precision = 10, scale = 2)
    private BigDecimal montoPagado;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal saldo;

    @Column(name = "porcentaje_pagado", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentajePagado;

    @Column(name = "metodo_pago", length = 30)
    private String metodoPago;

    @Column(name = "numero_operacion", length = 100)
    private String numeroOperacion;

    @Column(nullable = false, length = 20)
    private String estado;

    public Long getIdRecibo() {
        return idRecibo;
    }

    public void setIdRecibo(Long idRecibo) {
        this.idRecibo = idRecibo;
    }

    public Cita getCita() {
        return cita;
    }

    public void setCita(Cita cita) {
        this.cita = cita;
    }

    public LocalDateTime getFechaEmision() {
        return fechaEmision;
    }

    public void setFechaEmision(LocalDateTime fechaEmision) {
        this.fechaEmision = fechaEmision;
    }

    public BigDecimal getMontoTotal() {
        return montoTotal;
    }

    public void setMontoTotal(BigDecimal montoTotal) {
        this.montoTotal = montoTotal;
    }

    public BigDecimal getMontoPagado() {
        return montoPagado;
    }

    public void setMontoPagado(BigDecimal montoPagado) {
        this.montoPagado = montoPagado;
    }

    public BigDecimal getSaldo() {
        return saldo;
    }

    public void setSaldo(BigDecimal saldo) {
        this.saldo = saldo;
    }

    public BigDecimal getPorcentajePagado() {
        return porcentajePagado;
    }

    public void setPorcentajePagado(BigDecimal porcentajePagado) {
        this.porcentajePagado = porcentajePagado;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getNumeroOperacion() {
        return numeroOperacion;
    }

    public void setNumeroOperacion(String numeroOperacion) {
        this.numeroOperacion = numeroOperacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
}