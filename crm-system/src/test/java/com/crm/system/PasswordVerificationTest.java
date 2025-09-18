package com.crm.system;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordVerificationTest {

    public static void main(String[] args) {
        String password = "admin123";
        String hashFromDb = "$2b$10$ew4OlrgjbXRkKpRyw05K8.3MITbr2YkDKMHY35nSXEoiAKfB3kwLO";

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        boolean matches = encoder.matches(password, hashFromDb);

        System.out.println("Password 'admin123' matches hash: " + matches);
        if (!matches) {
            System.out.println("Creating new hash for admin123: " + encoder.encode("admin123"));
        }
    }
}
