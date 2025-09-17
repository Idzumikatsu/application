package com.crm.system.controller;

import com.crm.system.dto.JwtResponseDto;
import com.crm.system.dto.LoginDto;
import com.crm.system.dto.MessageDto;
import com.crm.system.dto.SignupDto;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.security.JwtTokenUtil;
import com.crm.system.service.UserService;
import jakarta.validation.Valid;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          JwtTokenUtil jwtTokenUtil) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    @PostMapping({"/auth/signin", "/auth/login", "/login"})
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginDto loginDto) {
        logger.info("Authentication attempt for email: {}", loginDto.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtTokenUtil.generateToken(userDetails);

            User user = userService.findByEmail(userDetails.getUsername()).orElseThrow(() ->
                    new RuntimeException("User not found"));

            logger.info("Authentication successful for user: {}", user.getEmail());

            return ResponseEntity.ok(new JwtResponseDto(
                    jwt,
                    user.getId(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getEmail(),
                    user.getRole().name(),
                    jwtTokenUtil.getExpirationSeconds()));
        } catch (Exception e) {
            logger.error("Authentication failed for email: {}", loginDto.getEmail(), e);
            return ResponseEntity.badRequest().body(new MessageDto("Error: Authentication failed"));
        }
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<MessageDto> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageDto("Logout successful"));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refreshToken(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageDto("Error: Unauthorized"));
        }
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.ok(Map.of(
                "token", jwt,
                "expiresIn", jwtTokenUtil.getExpirationSeconds()));
    }

    @GetMapping("/auth/validate")
    public ResponseEntity<?> validateToken(Authentication authentication) {
        boolean valid = authentication != null && authentication.isAuthenticated();
        return ResponseEntity.ok(Map.of("valid", valid));
    }

    @PostMapping("/auth/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupDto signUpDto) {
        logger.info("Signup attempt for email: {}", signUpDto.getEmail());

        try {
            if (userService.existsByEmail(signUpDto.getEmail())) {
                logger.warn("Email is already taken: {}", signUpDto.getEmail());
                return ResponseEntity.badRequest().body(new MessageDto("Error: Email is already taken!"));
            }

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

    @GetMapping("/auth/test")
    public ResponseEntity<?> testEndpoint() {
        logger.info("Test endpoint called");
        return ResponseEntity.ok("Test endpoint works!");
    }

    @GetMapping("/auth/public")
    public ResponseEntity<String> publicEndpoint() {
        logger.info("Public endpoint called");
        return ResponseEntity.ok("Public endpoint works!");
    }
}
