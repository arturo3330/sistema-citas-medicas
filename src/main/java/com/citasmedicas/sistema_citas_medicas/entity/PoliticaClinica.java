package com.citasmedicas.sistema_citas_medicas.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "politica_clinica")
public class PoliticaClinica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_politica")
    private Long idPolitica;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(name = "dias_anticipacion", nullable = false)
    private Integer diasAnticipacion;

    @Column(name = "hora_inicio_manana", nullable = false)
    private LocalTime horaInicioManana;

    @Column(name = "hora_fin_manana", nullable = false)
    private LocalTime horaFinManana;

    @Column(name = "hora_inicio_tarde", nullable = false)
    private LocalTime horaInicioTarde;

    @Column(name = "hora_fin_tarde", nullable = false)
    private LocalTime horaFinTarde;

    @Column(name = "porcentaje_pago_minimo", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentajePagoMinimo;

    @Column(name = "horas_limite_cancelacion", nullable = false)
    private Integer horasLimiteCancelacion;

    @Column(nullable = false)
    private Boolean estado;

    public Long getIdPolitica() {
        return idPolitica;
    }

    public void setIdPolitica(Long idPolitica) {
        this.idPolitica = idPolitica;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Integer getDiasAnticipacion() {
        return diasAnticipacion;
    }

    public void setDiasAnticipacion(Integer diasAnticipacion) {
        this.diasAnticipacion = diasAnticipacion;
    }

    public LocalTime getHoraInicioManana() {
        return horaInicioManana;
    }

    public void setHoraInicioManana(LocalTime horaInicioManana) {
        this.horaInicioManana = horaInicioManana;
    }

    public LocalTime getHoraFinManana() {
        return horaFinManana;
    }

    public void setHoraFinManana(LocalTime horaFinManana) {
        this.horaFinManana = horaFinManana;
    }

    public LocalTime getHoraInicioTarde() {
        return horaInicioTarde;
    }

    public void setHoraInicioTarde(LocalTime horaInicioTarde) {
        this.horaInicioTarde = horaInicioTarde;
    }

    public LocalTime getHoraFinTarde() {
        return horaFinTarde;
    }

    public void setHoraFinTarde(LocalTime horaFinTarde) {
        this.horaFinTarde = horaFinTarde;
    }

    public BigDecimal getPorcentajePagoMinimo() {
        return porcentajePagoMinimo;
    }

    public void setPorcentajePagoMinimo(BigDecimal porcentajePagoMinimo) {
        this.porcentajePagoMinimo = porcentajePagoMinimo;
    }

    public Integer getHorasLimiteCancelacion() {
        return horasLimiteCancelacion;
    }

    public void setHorasLimiteCancelacion(Integer horasLimiteCancelacion) {
        this.horasLimiteCancelacion = horasLimiteCancelacion;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}