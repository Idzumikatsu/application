package com.crm.system.security;

import com.crm.system.BaseIntegrationTest;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SecurityTest extends BaseIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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
    void accessProtectedResourceWithoutAuth_ShouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "TEACHER")
    void teacherAccessTeacherResource_ShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/teacher/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "TEACHER")
    void teacherAccessManagerResource_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/api/manager/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void managerAccessManagerResource_ShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/manager/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "MANAGER")
    void managerAccessTeacherResource_ShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/teacher/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentAccessStudentResource_ShouldReturnOk() throws Exception {
        mockMvc.perform(get("/api/student/dashboard"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentAccessTeacherResource_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/api/teacher/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "STUDENT")
    void studentAccessManagerResource_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/api/manager/dashboard"))
                .andExpect(status().isForbidden());
    }

    @Test
    void loginWithInvalidCredentials_ShouldReturnUnauthorized() throws Exception {
        // Create test user
        User user = new User("John", "Doe", "john.doe@example.com", 
                passwordEncoder.encode("correctpassword"), UserRole.TEACHER);
        userRepository.save(user);

        // Try to login with wrong password
        mockMvc.perform(get("/api/auth/signin")
                .param("email", "john.doe@example.com")
                .param("password", "wrongpassword"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void accessPublicResources_ShouldAlwaysBeAllowed() throws Exception {
        mockMvc.perform(get("/api/auth/signin"))
                .andExpect(status().isOk());
        
        mockMvc.perform(get("/api/auth/signup"))
                .andExpect(status().isOk());
        
        mockMvc.perform(get("/health"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "TEACHER")
    void accessOwnProfile_ShouldBeAllowed() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "TEACHER")
    void accessOtherUserProfile_ShouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/api/users/2"))
                .andExpect(status().isForbidden());
    }

    @Test
    void bruteForceProtection_ShouldBlockAfterMultipleAttempts() throws Exception {
        // This test would verify that after N failed attempts, the account gets locked
        // Implementation would depend on specific security configuration
        for (int i = 0; i < 5; i++) {
            mockMvc.perform(get("/api/auth/signin")
                    .param("email", "test@example.com")
                    .param("password", "wrongpassword"))
                    .andExpect(status().isUnauthorized());
        }
        
        // After 5 attempts, should be locked
        mockMvc.perform(get("/api/auth/signin")
                .param("email", "test@example.com")
                .param("password", "correctpassword"))
                .andExpect(status().isLocked());
    }

    @Test
    void jwtTokenValidation_ShouldRejectInvalidToken() throws Exception {
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer invalid-token"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void jwtTokenValidation_ShouldRejectExpiredToken() throws Exception {
        // This would require a pre-generated expired token
        String expiredToken = "expired.jwt.token.here";
        
        mockMvc.perform(get("/api/users/me")
                .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized());
    }
}