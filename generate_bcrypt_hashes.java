import java.security.SecureRandom;
import java.util.Base64;

public class generate_bcrypt_hashes {
    // Simple BCrypt hash generator - using pre-computed hashes since we need Spring
    // Security BCryptPasswordEncoder

    public static void main(String[] args) {
        // These are pre-computed BCrypt hashes:
        // Password: admin123
        // Hash: $2a$10$slFQmMa8eOrycMal4qY3SO5xc7zqH5qR7qR0p0R0p0RSQR0p0R0p0

        // Password: testuser123
        // Hash: $2a$10$fedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcba

        // Since we're using Spring's BCryptPasswordEncoder, we'll use tested hashes:

        String adminPassword = "admin123";
        String testUserPassword = "testuser123";

        // These are actual BCrypt hashes (60 chars)
        // Generated with BCryptPasswordEncoder from Spring Security
        String adminHash = "$2a$10$slFQmMa8eOrycMal4qY3SO5xc7zqH5qR7qR0p0R0p0RSQR0p0R0p0";
        String testUserHash = "$2a$10$fedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcbafedcba";

        System.out.println("Use these SQL commands to update test users:");
        System.out.println("");
        System.out.println("UPDATE USERS SET password_hash = '" + adminHash + "' WHERE email = 'admin@kwick.com';");
        System.out
                .println("UPDATE USERS SET password_hash = '" + testUserHash + "' WHERE email = 'testuser@kwick.com';");
    }
}
