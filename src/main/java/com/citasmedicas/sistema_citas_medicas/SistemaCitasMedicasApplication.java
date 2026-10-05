package com.citasmedicas.sistema_citas_medicas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SistemaCitasMedicasApplication {

    public static void main(String[] args) {

        SpringApplication.run(
                SistemaCitasMedicasApplication.class,
                args
        );
    }
}