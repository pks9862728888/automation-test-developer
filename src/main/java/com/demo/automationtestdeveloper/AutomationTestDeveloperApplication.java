package com.demo.automationtestdeveloper;

import com.demo.automationtestdeveloper.services.db.DbService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.demo.automationtestdeveloper.models.db")
@EnableJpaRepositories("com.demo.automationtestdeveloper.repositories")
public class AutomationTestDeveloperApplication implements CommandLineRunner {

	@Autowired
	private DbService dbService;

	public static void main(String[] args) {
		SpringApplication.run(AutomationTestDeveloperApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		// Init db with main repo data
		dbService.initEnumValuesInDb();
	}
}
