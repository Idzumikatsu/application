package com.crm.system.controller;

import com.crm.system.dto.JwtResponseDto;
import com.crm.system.dto.LoginDto;
import com.crm.system.dto.MessageDto;
import com.crm.system.dto.SignupDto;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.security.JwtTokenUtil;
import com.crm.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtTokenUtil jwtTokenUtil;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDto loginDto) {
        logger.info("Authentication attempt for email: {}", loginDto.getEmail());
        
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtTokenUtil.generateToken((org.springframework.security.core.userdetails.User) authentication.getPrincipal());

            org.springframework.security.core.userdetails.User userDetails = 
                (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
            
            User user = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> 
                new RuntimeException("User not found"));

            logger.info("Authentication successful for user: {}", user.getEmail());
            
            return ResponseEntity.ok(new JwtResponseDto(
                jwt,
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getRole().name()));
        } catch (Exception e) {
            logger.error("Authentication failed for email: {}", loginDto.getEmail(), e);
            return ResponseEntity.badRequest().body(new MessageDto("Error: Authentication failed"));
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        logger.info("Test endpoint called");
        System.out.println("=== TEST ENDPOINT: Called successfully ===");
        System.err.println("=== ERROR LOG: AuthController.test worked ===");
        return ResponseEntity.ok("Test endpoint works!");
    }

    @GetMapping("/test2")
    public ResponseEntity<String> testEndpoint2() {
        logger.info("Test2 endpoint called");
        return ResponseEntity.ok("Test2 endpoint works!");
    }

    @GetMapping("/public")
    public ResponseEntity<String> publicEndpoint() {
        logger.info("Public endpoint called");
        return ResponseEntity.ok("Public endpoint works!");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupDto signUpDto) {
        logger.info("Signup attempt for email: {}", signUpDto.getEmail());
        
        try {
            if (userService.existsByEmail(signUpDto.getEmail())) {
                logger.warn("Email is already taken: {}", signUpDto.getEmail());
                return ResponseEntity.badRequest().body(new MessageDto("Error: Email is already taken!"));
            }

            // Create new user's account
            User user = userService.createUser(
                signUpDto.getFirstName(),
                signUpDto.getLastName(),
                signUpDto.getEmail(),
                signUpDto.getPassword(),
                UserRole.valueOf(signUpDto.getRole().toUpperCase())
            );
            
            logger.info("User registered successfully: {}", user.getEmail());

            return ResponseEntity.ok(new MessageDto("User registered successfully!"));
        } catch (Exception e) {
            logger.error("Error during signup for email: {}", signUpDto.getEmail(), e);
            return ResponseEntity.badRequest().body(new MessageDto("Error: Registration failed"));
        }
    }
}
