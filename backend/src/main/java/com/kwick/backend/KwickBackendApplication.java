package com.kwick.backend;

import com.kwick.backend.model.User;
import com.kwick.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
public class KwickBackendApplication {

	private static final Logger logger = LoggerFactory.getLogger(KwickBackendApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(KwickBackendApplication.class, args);
	}

	/**
	 * Create default admin user on startup if none exists
	 */
	@Bean
	CommandLineRunner initAdminUser(UserRepository userRepository) {
		return args -> {
			// Check if admin user already exists
			var existingAdmin = userRepository.findByEmail("admin@kwick.in");
			if (existingAdmin.isEmpty()) {
				// Create default admin
				BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
				User admin = new User();
				admin.setEmail("admin@kwick.in");
				admin.setName("Admin");
				admin.setPhone("+919000000000");
				admin.setPasswordHash(encoder.encode("admin123"));
				admin.setRole("admin");
				admin.setKycStatus("approved");
				userRepository.save(admin);
				logger.info("✓ Created default admin user: admin@kwick.in / admin123");
			} else {
				// Ensure existing user has admin role
				User admin = existingAdmin.get();
				if (!"admin".equalsIgnoreCase(admin.getRole())) {
					admin.setRole("admin");
					userRepository.save(admin);
					logger.info("✓ Promoted existing user admin@kwick.in to admin role");
				} else {
					logger.info("✓ Admin user already exists: admin@kwick.in");
				}
			}
		};
	}
}
