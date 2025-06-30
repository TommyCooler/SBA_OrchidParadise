package com.sba.main;


import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.sba.pojo")
@ComponentScan(basePackages = "com.sba.controller, com.sba.service, com.sba.config")
@EnableJpaRepositories(basePackages = "com.sba.repository")
public class OrchidApplication implements CommandLineRunner {

	public static void main(String[] args) {
		SpringApplication.run(OrchidApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// This method can be used to execute code after the application has started.

	}
}
