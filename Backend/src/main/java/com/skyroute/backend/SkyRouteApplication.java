package com.skyroute.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
public class SkyRouteApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().load();

		System.setProperty("PORT", dotenv.get("PORT"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
		System.setProperty("FILE_UPLOAD_DIR", dotenv.get("FILE_UPLOAD_DIR"));
		System.setProperty("LOG_PATH", dotenv.get("LOG_PATH"));
		SpringApplication.run(SkyRouteApplication.class, args);

	}

}
