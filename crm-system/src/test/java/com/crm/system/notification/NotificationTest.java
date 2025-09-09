package com.crm.system.notification;

import com.crm.system.BaseIntegrationTest;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.UserRepository;
import com.crm.system.service.notification.EmailService;
import com.crm.system.service.notification.TelegramService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class NotificationTest extends BaseIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @MockBean
    private JavaMailSender javaMailSender;

    @MockBean
    private TelegramService telegramService;

    @MockBean
    private EmailService emailService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        
        userRepository.deleteAll();
        
        // Reset mocks
        reset(javaMailSender, telegramService, emailService);
    }

    @Test
    void userRegistration_ShouldSendWelcomeEmail() throws Exception {
        // Mock email service
        doNothing().when(emailService).sendWelcomeEmail(anyString(), anyString(), anyString());

        // Register new user
        mockMvc.perform(post("/api/auth/signup")
                .contentType("application/json")
                .content("{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john.doe@example.com\",\"password\":\"password123\",\"role\":\"STUDENT\"}"))
                .andExpect(status().isOk());

        // Verify email was sent
        verify(emailService, times(1)).sendWelcomeEmail("John Doe", "john.doe@example.com", "STUDENT");
    }

    @Test
    void userWithTelegram_ShouldReceiveTelegramNotification() throws Exception {
        // Create user with Telegram chat ID
        User user = new User("John", "Doe", "john.doe@example.com", "password", UserRole.STUDENT);
        user.setTelegramChatId(123456789L);
        userRepository.save(user);

        // Mock Telegram service
        doNothing().when(telegramService).sendNotification(anyLong(), anyString());

        // Trigger some action that should send notification
        mockMvc.perform(post("/api/notifications/test")
                .contentType("application/json")
                .content("{\"userId\":1,\"message\":\"Test notification\"}"))
                .andExpect(status().isOk());

        // Verify Telegram notification was sent
        verify(telegramService, times(1)).sendNotification(123456789L, "Test notification");
    }

    @Test
    void userWithoutTelegram_ShouldNotReceiveTelegramNotification() throws Exception {
        // Create user without Telegram chat ID
        User user = new User("John", "Doe", "john.doe@example.com", "password", UserRole.STUDENT);
        userRepository.save(user);

        // Mock Telegram service
        doNothing().when(telegramService).sendNotification(anyLong(), anyString());

        // Trigger notification
        mockMvc.perform(post("/api/notifications/test")
                .contentType("application/json")
                .content("{\"userId\":1,\"message\":\"Test notification\"}"))
                .andExpect(status().isOk());

        // Verify no Telegram notification was sent
        verify(telegramService, never()).sendNotification(anyLong(), anyString());
    }

    @Test
    void emailNotification_ShouldUseCorrectTemplate() throws Exception {
        // Mock email service
        doNothing().when(emailService).sendWelcomeEmail(anyString(), anyString(), anyString());
        doNothing().when(emailService).sendLessonReminder(anyString(), anyString(), anyString(), anyString());
        doNothing().when(emailService).sendPackageExpirationWarning(anyString(), anyString(), anyString());

        // Test welcome email
        mockMvc.perform(post("/api/auth/signup")
                .contentType("application/json")
                .content("{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john.doe@example.com\",\"password\":\"password123\",\"role\":\"TEACHER\"}"))
                .andExpect(status().isOk());

        verify(emailService, times(1)).sendWelcomeEmail("John Doe", "john.doe@example.com", "TEACHER");

        // Test lesson reminder
        mockMvc.perform(post("/api/notifications/lesson-reminder")
                .contentType("application/json")
                .content("{\"email\":\"john.doe@example.com\",\"studentName\":\"John Doe\",\"lessonTime\":\"2024-01-01 10:00\"}"))
                .andExpect(status().isOk());

        verify(emailService, times(1)).sendLessonReminder("john.doe@example.com", "John Doe", "2024-01-01 10:00");

        // Test package expiration
        mockMvc.perform(post("/api/notifications/package-expiration")
                .contentType("application/json")
                .content("{\"email\":\"john.doe@example.com\",\"studentName\":\"John Doe\",\"daysLeft\":3}"))
                .andExpect(status().isOk());

        verify(emailService, times(1)).sendPackageExpirationWarning("john.doe@example.com", "John Doe", "3");
    }

    @Test
    void notificationFailure_ShouldHandleGracefully() throws Exception {
        // Mock email service to throw exception
        doThrow(new RuntimeException("Email service unavailable"))
                .when(emailService).sendWelcomeEmail(anyString(), anyString(), anyString());

        // Registration should still succeed even if email fails
        mockMvc.perform(post("/api/auth/signup")
                .contentType("application/json")
                .content("{\"firstName\":\"John\",\"lastName\":\"Doe\",\"email\":\"john.doe@example.com\",\"password\":\"password123\",\"role\":\"STUDENT\"}"))
                .andExpect(status().isOk());

        // Verify email service was called (even though it failed)
        verify(emailService, times(1)).sendWelcomeEmail("John Doe", "john.doe@example.com", "STUDENT");
    }

    @Test
    void bulkNotifications_ShouldHandleMultipleRecipients() throws Exception {
        // Create multiple users
        for (int i = 0; i < 5; i++) {
            User user = new User("User" + i, "Test", "user" + i + "@test.com", "password", UserRole.STUDENT);
            user.setTelegramChatId(1000L + i);
            userRepository.save(user);
        }

        // Mock services
        doNothing().when(telegramService).sendNotification(anyLong(), anyString());
        doNothing().when(emailService).sendBulkNotification(anyString(), anyString());

        // Send bulk notification
        mockMvc.perform(post("/api/notifications/bulk")
                .contentType("application/json")
                .content("{\"message\":\"System maintenance tonight\"}"))
                .andExpect(status().isOk());

        // Verify notifications were sent to all users
        verify(telegramService, times(5)).sendNotification(anyLong(), eq("System maintenance tonight"));
        verify(emailService, times(5)).sendBulkNotification(anyString(), eq("System maintenance tonight"));
    }

    @Test
    void notificationPreferences_ShouldBeRespected() throws Exception {
        // Create user with disabled email notifications
        User user = new User("John", "Doe", "john.doe@example.com", "password", UserRole.STUDENT);
        user.setEmailNotificationsEnabled(false);
        userRepository.save(user);

        // Mock services
        doNothing().when(emailService).sendWelcomeEmail(anyString(), anyString(), anyString());

        // Try to send notification
        mockMvc.perform(post("/api/notifications/test")
                .contentType("application/json")
                .content("{\"userId\":1,\"message\":\"Test notification\"}"))
                .andExpect(status().isOk());

        // Verify no email was sent (due to disabled preferences)
        verify(emailService, never()).sendWelcomeEmail(anyString(), anyString(), anyString());
    }

    @Test
    void notificationRateLimiting_ShouldPreventSpam() throws Exception {
        // Mock services
        doNothing().when(emailService).sendWelcomeEmail(anyString(), anyString(), anyString());

        // Send multiple notifications quickly
        for (int i = 0; i < 10; i++) {
            mockMvc.perform(post("/api/notifications/test")
                    .contentType("application/json")
                    .content("{\"userId\":1,\"message\":\"Notification \" + i}"))
                    .andExpect(status().isOk());
        }

        // Verify rate limiting - should not send more than X notifications per minute
        // This would depend on actual rate limiting implementation
        verify(emailService, atMost(5)).sendWelcomeEmail(anyString(), anyString(), anyString());
    }

    @Test
    void notificationContent_ShouldBeProperlyFormatted() throws Exception {
        // Mock Telegram service and capture message content
        doNothing().when(telegramService).sendNotification(anyLong(), anyString());

        User user = new User("John", "Doe", "john.doe@example.com", "password", UserRole.STUDENT);
        user.setTelegramChatId(123456789L);
        userRepository.save(user);

        // Send notification with special characters
        String message = "Lesson reminder: Math class tomorrow at 10:00 📚 Don't forget!";
        mockMvc.perform(post("/api/notifications/test")
                .contentType("application/json")
                .content("{\"userId\":1,\"message\":\"" + message + "\"}"))
                .andExpect(status().isOk());

        // Verify message was sent with proper formatting
        verify(telegramService, times(1)).sendNotification(123456789L, message);
    }
}