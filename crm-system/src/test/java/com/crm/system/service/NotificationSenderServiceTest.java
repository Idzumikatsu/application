package com.crm.system.service;

import com.crm.system.model.Notification;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class NotificationSenderServiceTest {

    @Mock
    private NotificationService notificationService;

    @Mock
    private TelegramBotService telegramBotService;

    @Mock
    private UserService userService;

    @Mock
    private StudentService studentService;

    @InjectMocks
    private NotificationSenderService notificationSenderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendNotificationToStudent() {
        // Given
        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setEmail("john.doe@example.com");
        student.setTelegramChatId(123456789L);

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setRecipientId(student.getId());
        notification.setRecipientType(Notification.RecipientType.STUDENT);
        notification.setNotificationType(notificationType);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(1);

        when(notificationService.saveNotification(any(Notification.class))).thenReturn(notification);

        // When
        notificationSenderService.sendNotificationToStudent(student, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, times(1)).sendMessage(
                eq(student.getTelegramChatId()),
                eq(student.getId()),
                eq(com.crm.system.model.TelegramMessage.RecipientType.STUDENT),
                eq(message),
                any(com.crm.system.model.TelegramMessage.MessageType.class)
        );
    }

    @Test
    void testSendNotificationToStudentWithoutTelegram() {
        // Given
        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setEmail("john.doe@example.com");
        // No Telegram chat ID

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setRecipientId(student.getId());
        notification.setRecipientType(Notification.RecipientType.STUDENT);
        notification.setNotificationType(notificationType);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(1);

        when(notificationService.saveNotification(any(Notification.class))).thenReturn(notification);

        // When
        notificationSenderService.sendNotificationToStudent(student, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, never()).sendMessage(anyLong(), anyLong(), any(), anyString(), any());
    }

    @Test
    void testSendNotificationToStudentExceptionHandling() {
        // Given
        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setEmail("john.doe@example.com");
        student.setTelegramChatId(123456789L);

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        when(notificationService.saveNotification(any(Notification.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When
        notificationSenderService.sendNotificationToStudent(student, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, never()).sendMessage(anyLong(), anyLong(), any(), anyString(), any());
    }

    @Test
    void testSendNotificationToTeacher() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");
        teacher.setEmail("jane.smith@example.com");
        teacher.setTelegramChatId(987654321L);

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setRecipientId(teacher.getId());
        notification.setRecipientType(Notification.RecipientType.TEACHER);
        notification.setNotificationType(notificationType);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(1);

        when(notificationService.saveNotification(any(Notification.class))).thenReturn(notification);

        // When
        notificationSenderService.sendNotificationToTeacher(teacher, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, times(1)).sendMessage(
                eq(teacher.getTelegramChatId()),
                eq(teacher.getId()),
                eq(com.crm.system.model.TelegramMessage.RecipientType.TEACHER),
                eq(message),
                any(com.crm.system.model.TelegramMessage.MessageType.class)
        );
    }

    @Test
    void testSendNotificationToTeacherWithoutTelegram() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");
        teacher.setEmail("jane.smith@example.com");
        // No Telegram chat ID

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setRecipientId(teacher.getId());
        notification.setRecipientType(Notification.RecipientType.TEACHER);
        notification.setNotificationType(notificationType);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(1);

        when(notificationService.saveNotification(any(Notification.class))).thenReturn(notification);

        // When
        notificationSenderService.sendNotificationToTeacher(teacher, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, never()).sendMessage(anyLong(), anyLong(), any(), anyString(), any());
    }

    @Test
    void testSendNotificationToTeacherExceptionHandling() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");
        teacher.setEmail("jane.smith@example.com");
        teacher.setTelegramChatId(987654321L);

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        when(notificationService.saveNotification(any(Notification.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When
        notificationSenderService.sendNotificationToTeacher(teacher, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, never()).sendMessage(anyLong(), anyLong(), any(), anyString(), any());
    }

    @Test
    void testSendNotificationToManager() {
        // Given
        User manager = new User();
        manager.setId(1L);
        manager.setRole(UserRole.MANAGER);
        manager.setFirstName("Bob");
        manager.setLastName("Johnson");
        manager.setEmail("bob.johnson@example.com");
        manager.setTelegramChatId(111222333L);

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setRecipientId(manager.getId());
        notification.setRecipientType(Notification.RecipientType.MANAGER);
        notification.setNotificationType(notificationType);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(1);

        when(notificationService.saveNotification(any(Notification.class))).thenReturn(notification);

        // When
        notificationSenderService.sendNotificationToManager(manager, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, times(1)).sendMessage(
                eq(manager.getTelegramChatId()),
                eq(manager.getId()),
                eq(com.crm.system.model.TelegramMessage.RecipientType.MANAGER),
                eq(message),
                any(com.crm.system.model.TelegramMessage.MessageType.class)
        );
    }

    @Test
    void testSendNotificationToManagerWithoutTelegram() {
        // Given
        User manager = new User();
        manager.setId(1L);
        manager.setRole(UserRole.MANAGER);
        manager.setFirstName("Bob");
        manager.setLastName("Johnson");
        manager.setEmail("bob.johnson@example.com");
        // No Telegram chat ID

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setRecipientId(manager.getId());
        notification.setRecipientType(Notification.RecipientType.MANAGER);
        notification.setNotificationType(notificationType);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(1);

        when(notificationService.saveNotification(any(Notification.class))).thenReturn(notification);

        // When
        notificationSenderService.sendNotificationToManager(manager, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, never()).sendMessage(anyLong(), anyLong(), any(), anyString(), any());
    }

    @Test
    void testSendNotificationToManagerExceptionHandling() {
        // Given
        User manager = new User();
        manager.setId(1L);
        manager.setRole(UserRole.MANAGER);
        manager.setFirstName("Bob");
        manager.setLastName("Johnson");
        manager.setEmail("bob.johnson@example.com");
        manager.setTelegramChatId(111222333L);

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        when(notificationService.saveNotification(any(Notification.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When
        notificationSenderService.sendNotificationToManager(manager, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, never()).sendMessage(anyLong(), anyLong(), any(), anyString(), any());
    }

    @Test
    void testSendNotificationToAdmin() {
        // Given
        User admin = new User();
        admin.setId(1L);
        admin.setRole(UserRole.ADMIN);
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@example.com");
        admin.setTelegramChatId(444555666L);

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setRecipientId(admin.getId());
        notification.setRecipientType(Notification.RecipientType.ADMIN);
        notification.setNotificationType(notificationType);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(1);

        when(notificationService.saveNotification(any(Notification.class))).thenReturn(notification);

        // When
        notificationSenderService.sendNotificationToAdmin(admin, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, times(1)).sendMessage(
                eq(admin.getTelegramChatId()),
                eq(admin.getId()),
                eq(com.crm.system.model.TelegramMessage.RecipientType.ADMIN),
                eq(message),
                any(com.crm.system.model.TelegramMessage.MessageType.class)
        );
    }

    @Test
    void testSendNotificationToAdminWithoutTelegram() {
        // Given
        User admin = new User();
        admin.setId(1L);
        admin.setRole(UserRole.ADMIN);
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@example.com");
        // No Telegram chat ID

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        Notification notification = new Notification();
        notification.setId(1L);
        notification.setRecipientId(admin.getId());
        notification.setRecipientType(Notification.RecipientType.ADMIN);
        notification.setNotificationType(notificationType);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setPriority(1);

        when(notificationService.saveNotification(any(Notification.class))).thenReturn(notification);

        // When
        notificationSenderService.sendNotificationToAdmin(admin, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, never()).sendMessage(anyLong(), anyLong(), any(), anyString(), any());
    }

    @Test
    void testSendNotificationToAdminExceptionHandling() {
        // Given
        User admin = new User();
        admin.setId(1L);
        admin.setRole(UserRole.ADMIN);
        admin.setFirstName("Admin");
        admin.setLastName("User");
        admin.setEmail("admin@example.com");
        admin.setTelegramChatId(444555666L);

        String title = "Test Notification";
        String message = "This is a test notification";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        when(notificationService.saveNotification(any(Notification.class)))
                .thenThrow(new RuntimeException("Database error"));

        // When
        notificationSenderService.sendNotificationToAdmin(admin, title, message, notificationType);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramBotService, never()).sendMessage(anyLong(), anyLong(), any(), anyString(), any());
    }

    @Test
    void testSendGroupLessonRegistrationNotification() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setEmail("john.doe@example.com");

        com.crm.system.model.GroupLesson lesson = new com.crm.system.model.GroupLesson(
                teacher, "English Conversation", java.time.LocalDate.now().plusDays(1), java.time.LocalTime.of(10, 0));
        lesson.setId(1L);

        when(studentService.findById(anyLong())).thenReturn(Optional.of(student));
        when(userService.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(notificationService.saveNotification(any(Notification.class))).thenReturn(new Notification());

        // When
        notificationSenderService.sendGroupLessonRegistrationNotification(lesson, student);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(studentService, times(1)).findById(anyLong());
        verify(userService, times(1)).findById(anyLong());
    }

    @Test
    void testSendGroupLessonUnregistrationNotification() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setEmail("john.doe@example.com");

        com.crm.system.model.GroupLesson lesson = new com.crm.system.model.GroupLesson(
                teacher, "English Conversation", java.time.LocalDate.now().plusDays(1), java.time.LocalTime.of(10, 0));
        lesson.setId(1L);

        String reason = "Student requested cancellation";

        when(studentService.findById(anyLong())).thenReturn(Optional.of(student));
        when(userService.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(notificationService.saveNotification(any(Notification.class))).thenReturn(new Notification());

        // When
        notificationSenderService.sendGroupLessonUnregistrationNotification(lesson, student, reason);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(studentService, times(1)).findById(anyLong());
        verify(userService, times(1)).findById(anyLong());
    }

    @Test
    void testSendNewRegistrationNotificationToTeacher() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setEmail("john.doe@example.com");

        com.crm.system.model.GroupLesson lesson = new com.crm.system.model.GroupLesson(
                teacher, "English Conversation", java.time.LocalDate.now().plusDays(1), java.time.LocalTime.of(10, 0));
        lesson.setId(1L);

        when(studentService.findById(anyLong())).thenReturn(Optional.of(student));
        when(userService.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(notificationService.saveNotification(any(Notification.class))).thenReturn(new Notification());

        // When
        notificationSenderService.sendNewRegistrationNotificationToTeacher(lesson, student);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(studentService, times(1)).findById(anyLong());
        verify(userService, times(1)).findById(anyLong());
    }

    @Test
    void testSendUnregistrationNotificationToTeacher() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
        student.setEmail("john.doe@example.com");

        com.crm.system.model.GroupLesson lesson = new com.crm.system.model.GroupLesson(
                teacher, "English Conversation", java.time.LocalDate.now().plusDays(1), java.time.LocalTime.of(10, 0));
        lesson.setId(1L);

        String reason = "Student requested cancellation";

        when(studentService.findById(anyLong())).thenReturn(Optional.of(student));
        when(userService.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(notificationService.saveNotification(any(Notification.class))).thenReturn(new Notification());

        // When
        notificationSenderService.sendUnregistrationNotificationToTeacher(lesson, student, reason);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(studentService, times(1)).findById(anyLong());
        verify(userService, times(1)).findById(anyLong());
    }

    @Test
    void testSendGroupLessonAlmostFullNotification() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        com.crm.system.model.GroupLesson lesson = new com.crm.system.model.GroupLesson(
                teacher, "English Conversation", java.time.LocalDate.now().plusDays(1), java.time.LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setMaxStudents(10);
        lesson.setCurrentStudents(8); // 80% capacity

        when(userService.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(notificationService.saveNotification(any(Notification.class))).thenReturn(new Notification());

        // When
        notificationSenderService.sendGroupLessonAlmostFullNotification(lesson);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(userService, times(1)).findById(anyLong());
    }

    @Test
    void testSendGroupLessonFullNotification() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        com.crm.system.model.GroupLesson lesson = new com.crm.system.model.GroupLesson(
                teacher, "English Conversation", java.time.LocalDate.now().plusDays(1), java.time.LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setMaxStudents(10);
        lesson.setCurrentStudents(10); // Full capacity

        when(userService.findById(anyLong())).thenReturn(Optional.of(teacher));
        when(notificationService.saveNotification(any(Notification.class))).thenReturn(new Notification());

        // When
        notificationSenderService.sendGroupLessonFullNotification(lesson);

        // Then
        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(userService, times(1)).findById(anyLong());
    }
}