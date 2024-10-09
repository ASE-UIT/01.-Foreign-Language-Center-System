package com.prj.projectweb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ProjectWebApplication {

    public static void main(String[] args) {
        SpringApplication.run(ProjectWebApplication.class, args);
    }

}
