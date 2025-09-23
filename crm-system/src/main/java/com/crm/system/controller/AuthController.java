package com.crm.system.controller;

import com.crm.system.dto.JwtResponseDto;
import com.crm.system.dto.LoginDto;
import com.crm.system.dto.MessageDto;
import com.crm.system.dto.SignupDto;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.security.JwtTokenUtil;
import com.crm.system.security.UserDetailsServiceImpl;
import com.crm.system.service.UserService;
import jakarta.validation.Valid;
import java.util.Map;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
    private final UserDetailsServiceImpl userDetailsService;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          JwtTokenUtil jwtTokenUtil,
                          UserDetailsServiceImpl userDetailsService) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtTokenUtil = jwtTokenUtil;
        this.userDetailsService = userDetailsService;
    }

    @PostMapping("/auth/signin")
    public ResponseEntity<?> authenticateUserSignin(@Valid @RequestBody LoginDto loginDto) {
        System.out.println("=== AuthController: /auth/signin endpoint called ===");
        System.out.println("=== AuthController: /auth/signin payload - email: " + loginDto.getEmail() + ", password: " + loginDto.getPassword() + " ===");
        return authenticateUser(loginDto);
    }

    @PostMapping("/auth/login")
    public ResponseEntity<?> authenticateUserLogin(@Valid @RequestBody LoginDto loginDto) {
        System.out.println("=== AuthController: /auth/login endpoint called ===");
        System.out.println("=== AuthController: /auth/login payload - email: " + loginDto.getEmail() + ", password: " + loginDto.getPassword() + " ===");
        return authenticateUser(loginDto);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUserRootLogin(@Valid @RequestBody LoginDto loginDto) {
        System.out.println("=== AuthController: /login endpoint called ===");
        System.out.println("=== AuthController: /login payload - email: " + loginDto.getEmail() + ", password: " + loginDto.getPassword() + " ===");
        return authenticateUser(loginDto);
    }

    private ResponseEntity<?> authenticateUser(LoginDto loginDto) {
        System.out.println("=== authenticateUser called with email: " + loginDto.getEmail() + " ===");
        logger.info("Authentication attempt for email: {}", loginDto.getEmail());

        try {
            System.out.println("=== Attempting authentication for email: " + loginDto.getEmail() + " ===");
            // Check if user exists in database
            Optional<User> userOptional = userService.findByEmail(loginDto.getEmail());
            if (userOptional.isEmpty()) {
                logger.warn("User not found in database: {}", loginDto.getEmail());
                System.out.println("=== User not found in database: " + loginDto.getEmail() + " ===");
                return ResponseEntity.badRequest().body(new MessageDto("Error: User not found"));
            }

            User user = userOptional.get();
            logger.info("User found in database: {} (ID: {}, Active: {}, Role: {})",
                       user.getEmail(), user.getId(), user.getIsActive(), user.getRole());

            if (user.getIsActive() == null || !user.getIsActive()) {
                logger.warn("User account is inactive: {}", loginDto.getEmail());
                System.out.println("=== User account is inactive: " + loginDto.getEmail() + " ===");
                return ResponseEntity.badRequest().body(new MessageDto("Error: Account is inactive"));
            }

            // Log raw password info (masked for security)
            String maskedPassword = loginDto.getPassword().replaceAll(".", "*");
            logger.info("Raw password length: {}, masked: {}", loginDto.getPassword().length(), maskedPassword.substring(0, Math.min(3, maskedPassword.length())) + "...");

            logger.info("Attempting Spring Security authentication for user: {}", loginDto.getEmail());
            System.out.println("=== Before authentication manager call ===");
            Authentication authentication;
            try {
                System.out.println("=== Creating UsernamePasswordAuthenticationToken ===");
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword());
                System.out.println("=== Calling authenticationManager.authenticate ===");
                authentication = authenticationManager.authenticate(authToken);
                logger.info("Password match successful for user: {}", loginDto.getEmail());
                System.out.println("=== Password match successful ===");
            } catch (org.springframework.security.authentication.BadCredentialsException e) {
                logger.error("Password mismatch for user: {}. Raw password length: {}, Encoded hash length: {}",
                             loginDto.getEmail(), loginDto.getPassword().length(), user.getPasswordHash().length());
                System.out.println("=== Password mismatch for email: " + loginDto.getEmail() + " ===");
                System.out.println("=== BadCredentialsException message: " + e.getMessage() + " ===");
                e.printStackTrace();
                return ResponseEntity.badRequest().body(new MessageDto("Error: Invalid password"));
            } catch (Exception e) {
                System.out.println("=== General exception during authentication for email: " + loginDto.getEmail() + " ===");
                System.out.println("=== Exception type: " + e.getClass().getSimpleName() + " ===");
                System.out.println("=== Exception message: " + e.getMessage() + " ===");
                e.printStackTrace();
                logger.error("General exception during authentication for user: {}", loginDto.getEmail(), e);
                return ResponseEntity.badRequest().body(new MessageDto("Error: Authentication failed - " + e.getMessage()));
            }
            System.out.println("=== After authentication manager call - success ===");

            System.out.println("=== Authentication successful for email: " + loginDto.getEmail() + " ===");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            System.out.println("=== JWT token generation started ===");
            String jwt = jwtTokenUtil.generateToken(userDetails);
            System.out.println("=== JWT token generated successfully for user: " + user.getEmail() + " ===");

            User authenticatedUser = userService.findByEmail(userDetails.getUsername()).orElseThrow(() ->
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
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            System.out.println("=== BadCredentialsException for email: " + loginDto.getEmail() + ", error: " + e.getMessage() + " ===");
            logger.error("Bad credentials for email: {} - {}", loginDto.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(new MessageDto("Error: Invalid credentials"));
        } catch (Exception e) {
            System.out.println("=== Authentication failed for email: " + loginDto.getEmail() + ", error: " + e.getMessage() + " ===");
            logger.error("Authentication failed for email: {} - Exception type: {}, Message: {}",
                        loginDto.getEmail(), e.getClass().getSimpleName(), e.getMessage(), e);
            return ResponseEntity.badRequest().body(new MessageDto("Error: Authentication failed"));
        }
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<MessageDto> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(new MessageDto("Logout successful"));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        
        if (refreshToken == null) {
            return ResponseEntity.badRequest().body(new MessageDto("Error: Refresh token is required"));
        }

        try {
            String email = jwtTokenUtil.getEmailFromToken(refreshToken);
            UserDetails userDetails = userDetailsService.loadUserByUsername(email);
            
            if (jwtTokenUtil.validateRefreshToken(refreshToken, userDetails)) {
                String newToken = jwtTokenUtil.generateToken(userDetails);
                String newRefreshToken = jwtTokenUtil.generateRefreshToken(userDetails);
                
                Map<String, Object> response = Map.of(
                    "token", newToken,
                    "refreshToken", newRefreshToken,
                    "tokenType", "Bearer",
                    "expiresIn", jwtTokenUtil.getExpirationSeconds()
                );
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(new MessageDto("Error: Invalid refresh token"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageDto("Error: Invalid refresh token"));
        }
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

    @GetMapping("/auth/test-direct-auth")
    public ResponseEntity<?> testDirectAuth() {
        System.out.println("=== Test direct auth endpoint called ===");
        try {
            System.out.println("=== Creating authentication token ===");
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken("admin@englishschool.com", "admin123");
            
            System.out.println("=== Calling authentication manager ===");
            Authentication authentication = authenticationManager.authenticate(authToken);
            
            System.out.println("=== Authentication successful ===");
            System.out.println("=== Principal: " + authentication.getPrincipal() + " ===");
            System.out.println("=== Authenticated: " + authentication.isAuthenticated() + " ===");
            
            return ResponseEntity.ok("Authentication successful: " + authentication.isAuthenticated());
        } catch (Exception e) {
            System.out.println("=== Authentication failed ===");
            System.out.println("=== Exception: " + e.getClass().getSimpleName() + " - " + e.getMessage() + " ===");
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Authentication failed: " + e.getMessage());
        }
    }

    @GetMapping("/auth/test-unsecured")
    public ResponseEntity<String> testUnsecured() {
        System.out.println("=== Test unsecured endpoint called ===");
        return ResponseEntity.ok("Unsecured endpoint works!");
    }
}
