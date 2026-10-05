package com.citasmedicas.sistema_citas_medicas.controller;

import com.citasmedicas.sistema_citas_medicas.entity.Actividad;
import com.citasmedicas.sistema_citas_medicas.service.ActividadService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/actividades")
@CrossOrigin(origins = "*")
public class ActividadController {

    private final ActividadService
            actividadService;


    public ActividadController(
            ActividadService actividadService) {

        this.actividadService =
                actividadService;
    }


    // ==========================================
    // ÚLTIMAS 10 ACTIVIDADES
    // ==========================================

    @GetMapping("/recientes")
    public List<Actividad> recientes() {

        return actividadService
                .listarRecientes();
    }
}