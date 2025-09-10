package com.crm.system.service;

import com.crm.system.model.Notification;
import com.crm.system.model.User;
import com.crm.system.model.Student;
import com.crm.system.model.Notification.RecipientType;
import com.crm.system.model.Notification.NotificationType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class EmailServiceTest {

    @Mock
    private JavaMailSender mailSender;

    @Mock
    private TemplateEngine templateEngine;

    @Mock
    private UserService userService;

    @Mock
    private StudentService studentService;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private EmailService emailService;

    @Mock
    private MimeMessage mimeMessage;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        
        // Настройка значений по умолчанию
        emailService.senderName = "CRM English School";
        emailService.senderAddress = "noreply@crm-english-school.com";
        emailService.maxRetryAttempts = 3;
        emailService.retryDelayMs = 100;
    }

    @Test
    void testSendEmailSuccess() throws MessagingException {
        // Given
        String recipientEmail = "test@example.com";
        String subject = "Test Subject";
        String templateName = "test-template";
        Map<String, Object> variables = new HashMap<>();
        variables.put("testKey", "testValue");

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq(templateName), any(Context.class))).thenReturn("<html>Test Content</html>");

        // When
        boolean result = emailService.sendEmail(recipientEmail, subject, templateName, variables);

        // Then
        assertTrue(result);
        verify(mailSender).createMimeMessage();
        verify(templateEngine).process(eq(templateName), any(Context.class));
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void testSendEmailMessagingException() throws MessagingException {
        // Given
        String recipientEmail = "test@example.com";
        String subject = "Test Subject";
        String templateName = "test-template";
        Map<String, Object> variables = new HashMap<>();

        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(eq(templateName), any(Context.class))).thenReturn("<html>Test Content</html>");
        doThrow(new MessagingException("SMTP error")).when(mailSender).send(mimeMessage);

        // When
        boolean result = emailService.sendEmail(recipientEmail, subject, templateName, variables);

        // Then
        assertFalse(result);
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
    }

    @Test
    void testSendNotificationEmailSuccess() throws ExecutionException, InterruptedException {
        // Given
        Notification notification = createNotification();
        User user = createUser();

        when(userService.findById(1L)).thenReturn(user);
        when(mailSender.createMimeMessage()).thenReturn(mimeMessage);
        when(templateEngine.process(anyString(), any(Context.class))).thenReturn("<html>Test Content</html>");
        when(notificationService.updateNotification(any(Notification.class))).thenReturn(notification);

        // When
        CompletableFuture<Boolean> future = emailService.sendNotificationEmail(notification);
        boolean result = future.get();

        // Then
        assertTrue(result);
        verify(userService).findById(1L);
        verify(mailSender).createMimeMessage();
        verify(mailSender).send(mimeMessage);
        verify(notificationService).updateNotification(any(Notification.class));
    }

    @Test
    void testSendNotificationEmailNoRecipientEmail() throws ExecutionException, InterruptedException {
        // Given
        Notification notification = createNotification();
        notification.setRecipientId(999L); // Несуществующий ID

        when(userService.findById(999L)).thenReturn(null);

        // When
        CompletableFuture<Boolean> future = emailService.sendNotificationEmail(notification);
        boolean result = future.get();

        // Then
        assertFalse(result);
        verify(userService).findById(999L);
        verify(mailSender, never()).createMimeMessage();
        verify(mailSender, never()).send(any(MimeMessage.class));
    }

    @Test
    void testGetRecipientEmailForStudent() {
        // Given
        Student student = new Student();
        student.setEmail("student@example.com");
        
        when(studentService.findById(1L)).thenReturn(student);

        // When
        String result = emailService.getRecipientEmail(1L, RecipientType.STUDENT);

        // Then
        assertEquals("student@example.com", result);
        verify(studentService).findById(1L);
    }

    @Test
    void testGetRecipientEmailForTeacher() {
        // Given
        User user = new User();
        user.setEmail("teacher@example.com");
        
        when(userService.findById(1L)).thenReturn(user);

        // When
        String result = emailService.getRecipientEmail(1L, RecipientType.TEACHER);

        // Then
        assertEquals("teacher@example.com", result);
        verify(userService).findById(1L);
    }

    @Test
    void testGetRecipientEmailNotFound() {
        // Given
        when(userService.findById(999L)).thenReturn(null);

        // When
        String result = emailService.getRecipientEmail(999L, RecipientType.TEACHER);

        // Then
        assertNull(result);
        verify(userService).findById(999L);
    }

    @Test
    void testGetTemplateNameForLessonScheduled() {
        // When
        String result = emailService.getTemplateName(NotificationType.LESSON_SCHEDULED);

        // Then
        assertEquals("lesson-scheduled", result);
    }

    @Test
    void testGetTemplateNameForPaymentDue() {
        // When
        String result = emailService.getTemplateName(NotificationType.PAYMENT_DUE);

        // Then
        assertEquals("payment-due", result);
    }

    @Test
    void testGetTemplateNameForSystemMessage() {
        // When
        String result = emailService.getTemplateName(NotificationType.SYSTEM_MESSAGE);

        // Then
        assertEquals("system-message", result);
    }

    @Test
    void testGetTemplateNameForDefault() {
        // When
        String result = emailService.getTemplateName(null);

        // Then
        assertEquals("default-notification", result);
    }

    @Test
    void testCreateTemplateVariables() {
        // Given
        Notification notification = createNotification();

        // When
        Map<String, Object> variables = emailService.createTemplateVariables(notification);

        // Then
        assertNotNull(variables);
        assertEquals(notification, variables.get("notification"));
        assertNotNull(variables.get("recipientName"));
        assertNotNull(variables.get("currentYear"));
        assertEquals("CRM English School", variables.get("schoolName"));
    }

    @Test
    void testGetRecipientNameForStudent() {
        // Given
        Student student = new Student();
        student.setFirstName("John");
        student.setLastName("Doe");
        
        when(studentService.findById(1L)).thenReturn(student);

        // When
        String result = emailService.getRecipientName(1L, RecipientType.STUDENT);

        // Then
        assertEquals("John Doe", result);
        verify(studentService).findById(1L);
    }

    @Test
    void testGetRecipientNameForTeacher() {
        // Given
        User user = new User();
        user.setFirstName("Jane");
        user.setLastName("Smith");
        
        when(userService.findById(1L)).thenReturn(user);

        // When
        String result = emailService.getRecipientName(1L, RecipientType.TEACHER);

        // Then
        assertEquals("Jane Smith", result);
        verify(userService).findById(1L);
    }

    @Test
    void testGetRecipientNameNotFound() {
        // Given
        when(userService.findById(999L)).thenReturn(null);

        // When
        String result = emailService.getRecipientName(999L, RecipientType.TEACHER);

        // Then
        assertEquals("User", result);
        verify(userService).findById(999L);
    }

    private Notification createNotification() {
        Notification notification = new Notification();
        notification.setRecipientId(1L);
        notification.setRecipientType(RecipientType.TEACHER);
        notification.setNotificationType(NotificationType.SYSTEM_MESSAGE);
        notification.setTitle("Test Notification");
        notification.setMessage("Test message content");
        notification.setPriority(1);
        return notification;
    }

    private User createUser() {
        User user = new User();
        user.setId(1L);
        user.setEmail("test@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        return user;
    }
}