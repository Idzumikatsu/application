package com.crm.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.crm.system", "com.test"})
public class CrmSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(CrmSystemApplication.class, args);
	}

}
