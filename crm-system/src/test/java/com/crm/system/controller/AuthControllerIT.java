package com.crm.system.controller;

import com.crm.system.BaseIntegrationTest;
import com.crm.system.dto.LoginDto;
import com.crm.system.dto.SignupDto;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class AuthControllerIT extends BaseIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        
        userRepository.deleteAll();
    }

    @Test
    void signup_WithValidData_ShouldCreateUser() throws Exception {
        // Arrange
        SignupDto signupDto = new SignupDto();
        signupDto.setFirstName("John");
        signupDto.setLastName("Doe");
        signupDto.setEmail("john.doe@example.com");
        signupDto.setPassword("password123");
        signupDto.setRole("TEACHER");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered successfully!"));

        // Verify user was created in database
        User savedUser = userRepository.findByEmail("john.doe@example.com").orElse(null);
        assertNotNull(savedUser);
        assertEquals("John", savedUser.getFirstName());
        assertEquals("Doe", savedUser.getLastName());
        assertEquals(UserRole.TEACHER, savedUser.getRole());
    }

    @Test
    void signup_WithExistingEmail_ShouldReturnBadRequest() throws Exception {
        // Arrange - create existing user
        User existingUser = new User("Existing", "User", "existing@example.com", 
                passwordEncoder.encode("password"), UserRole.TEACHER);
        userRepository.save(existingUser);

        SignupDto signupDto = new SignupDto();
        signupDto.setFirstName("John");
        signupDto.setLastName("Doe");
        signupDto.setEmail("existing@example.com");
        signupDto.setPassword("password123");
        signupDto.setRole("TEACHER");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupDto)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Error: Email is already taken!"));
    }

    @Test
    void signin_WithValidCredentials_ShouldReturnJwtToken() throws Exception {
        // Arrange - create user first
        User user = new User("John", "Doe", "john.doe@example.com", 
                passwordEncoder.encode("password123"), UserRole.TEACHER);
        userRepository.save(user);

        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("john.doe@example.com");
        loginDto.setPassword("password123");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.id").value(user.getId()))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.role").value("TEACHER"));
    }

    @Test
    void signin_WithInvalidCredentials_ShouldReturnUnauthorized() throws Exception {
        // Arrange
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("nonexistent@example.com");
        loginDto.setPassword("wrongpassword");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void signin_WithWrongPassword_ShouldReturnUnauthorized() throws Exception {
        // Arrange - create user first
        User user = new User("John", "Doe", "john.doe@example.com", 
                passwordEncoder.encode("correctpassword"), UserRole.TEACHER);
        userRepository.save(user);

        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("john.doe@example.com");
        loginDto.setPassword("wrongpassword");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signin")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void signup_WithInvalidRole_ShouldReturnBadRequest() throws Exception {
        // Arrange
        SignupDto signupDto = new SignupDto();
        signupDto.setFirstName("John");
        signupDto.setLastName("Doe");
        signupDto.setEmail("john.doe@example.com");
        signupDto.setPassword("password123");
        signupDto.setRole("INVALID_ROLE");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupDto)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signup_WithInvalidEmail_ShouldReturnBadRequest() throws Exception {
        // Arrange
        SignupDto signupDto = new SignupDto();
        signupDto.setFirstName("John");
        signupDto.setLastName("Doe");
        signupDto.setEmail("invalid-email");
        signupDto.setPassword("password123");
        signupDto.setRole("TEACHER");

        // Act & Assert
        mockMvc.perform(post("/api/auth/signup")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(signupDto)))
                .andExpect(status().isBadRequest());
    }
}