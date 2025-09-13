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

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
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
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtTokenUtil.generateToken((org.springframework.security.core.userdetails.User) authentication.getPrincipal());

        org.springframework.security.core.userdetails.User userDetails = 
            (org.springframework.security.core.userdetails.User) authentication.getPrincipal();
        
        User user = userService.findByEmail(userDetails.getUsername()).orElseThrow(() -> 
            new RuntimeException("User not found"));

        return ResponseEntity.ok(new JwtResponseDto(
            jwt,
            user.getId(),
            user.getFirstName(),
            user.getLastName(),
            user.getEmail(),
            user.getRole().name()));
    }

    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        System.out.println("=== TEST ENDPOINT: Called successfully ===");
        System.err.println("=== ERROR LOG: AuthController.test worked ===");
        return ResponseEntity.ok("Test endpoint works!");
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupDto signUpDto) {
        if (userService.existsByEmail(signUpDto.getEmail())) {
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

        return ResponseEntity.ok(new MessageDto("User registered successfully!"));
    }
}
