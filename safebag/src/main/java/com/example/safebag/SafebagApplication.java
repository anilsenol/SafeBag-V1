package com.example.safebag;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.bind.annotation.CrossOrigin;

@SpringBootApplication
@EnableScheduling
@CrossOrigin(origins = "http://localhost:5173")
public class SafebagApplication {

	public static void main(String[] args) {
		SpringApplication.run(SafebagApplication.class, args);
	}

}
