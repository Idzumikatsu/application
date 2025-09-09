package com.crm.system.service;

import com.crm.system.model.Notification;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.model.TelegramMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class NotificationBroadcastServiceTest {

    @Mock
    private NotificationService notificationService;

    @Mock
    private TelegramNotificationService telegramNotificationService;

    @Mock
    private EmailService emailService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationBroadcastService notificationBroadcastService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testBroadcastSystemNotificationToAllUsers() {
        // Given
        User user1 = createUser(1L, UserRole.TEACHER, "teacher@example.com", 123456789L);
        User user2 = createUser(2L, UserRole.STUDENT, "student@example.com", 987654321L);
        User user3 = createUser(3L, UserRole.MANAGER, "manager@example.com", null); // No Telegram

        List<User> allUsers = Arrays.asList(user1, user2, user3);

        when(userRepository.findAll()).thenReturn(allUsers);
        when(notificationService.saveNotification(any(Notification.class))).thenReturn(new Notification());

        String title = "System Update";
        String message = "System will be down for maintenance tomorrow";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        // When
        BroadcastResult result = notificationBroadcastService.broadcastSystemNotification(
            title, message, notificationType, null);

        // Then
        assertNotNull(result);
        assertEquals(3, result.getTotalRecipients());
        assertEquals(2, result.getSuccessfulNotifications()); // Only users with Telegram
        assertEquals(1, result.getFailedNotifications()); // User without Telegram

        verify(notificationService, times(3)).saveNotification(any(Notification.class));
        verify(telegramNotificationService, times(2)).sendNotification(
            anyLong(), anyLong(), any(), anyString(), any());
        verify(emailService, times(3)).sendNotificationEmail(any(Notification.class));
    }

    @Test
    void testBroadcastTelegramMessageToAllUsers() {
        // Given
        User user1 = createUser(1L, UserRole.TEACHER, "teacher@example.com", 123456789L);
        User user2 = createUser(2L, UserRole.STUDENT, "student@example.com", 987654321L);
        User user3 = createUser(3L, UserRole.MANAGER, "manager@example.com", null); // No Telegram

        List<User> allUsers = Arrays.asList(user1, user2, user3);

        when(userRepository.findAll()).thenReturn(allUsers);

        String message = "Important announcement for all users";
        TelegramMessage.MessageType messageType = TelegramMessage.MessageType.SYSTEM_NOTIFICATION;

        // When
        BroadcastResult result = notificationBroadcastService.broadcastTelegramMessage(
            message, messageType, null);

        // Then
        assertNotNull(result);
        assertEquals(3, result.getTotalRecipients());
        assertEquals(2, result.getSuccessfulNotifications()); // Only users with Telegram
        assertEquals(1, result.getFailedNotifications()); // User without Telegram

        verify(telegramNotificationService, times(2)).sendNotification(
            anyLong(), anyLong(), any(), eq(message), eq(messageType));
    }

    @Test
    void testBroadcastWithUserTypeFilter() {
        // Given
        User teacher1 = createUser(1L, UserRole.TEACHER, "teacher1@example.com", 123456789L);
        User teacher2 = createUser(2L, UserRole.TEACHER, "teacher2@example.com", 987654321L);
        User student = createUser(3L, UserRole.STUDENT, "student@example.com", 555555555L);

        List<User> teachers = Arrays.asList(teacher1, teacher2);

        when(userRepository.findByRoleAndIsActive(eq(UserRole.TEACHER), eq(true))).thenReturn(teachers);
        when(notificationService.saveNotification(any(Notification.class))).thenReturn(new Notification());

        RecipientFilter filter = new RecipientFilter();
        filter.setUserTypes(Arrays.asList(UserRole.TEACHER));

        String title = "Teacher Meeting";
        String message = "Important meeting for all teachers";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        // When
        BroadcastResult result = notificationBroadcastService.broadcastSystemNotification(
            title, message, notificationType, filter);

        // Then
        assertNotNull(result);
        assertEquals(2, result.getTotalRecipients());
        assertEquals(2, result.getSuccessfulNotifications());
        assertEquals(0, result.getFailedNotifications());

        verify(notificationService, times(2)).saveNotification(any(Notification.class));
        verify(telegramNotificationService, times(2)).sendNotification(
            anyLong(), anyLong(), any(), anyString(), any());
        verify(emailService, times(2)).sendNotificationEmail(any(Notification.class));
    }

    @Test
    void testBroadcastWithRegistrationDateFilter() {
        // Given
        User user1 = createUser(1L, UserRole.TEACHER, "teacher1@example.com", 123456789L);
        User user2 = createUser(2L, UserRole.STUDENT, "student@example.com", 987654321L);
        User user3 = createUser(3L, UserRole.MANAGER, "manager@example.com", 555555555L);

        List<User> allUsers = Arrays.asList(user1, user2, user3);

        when(userRepository.findAll()).thenReturn(allUsers);
        when(notificationService.saveNotification(any(Notification.class))).thenReturn(new Notification());

        RecipientFilter filter = new RecipientFilter();
        filter.setRegistrationDateFrom(LocalDate.of(2024, 1, 1));
        filter.setRegistrationDateTo(LocalDate.of(2024, 12, 31));

        String title = "Welcome Message";
        String message = "Welcome to our platform!";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        // When
        BroadcastResult result = notificationBroadcastService.broadcastSystemNotification(
            title, message, notificationType, filter);

        // Then
        assertNotNull(result);
        // All users should be included since we're filtering in memory
        assertEquals(3, result.getTotalRecipients());
        assertEquals(3, result.getSuccessfulNotifications());
        assertEquals(0, result.getFailedNotifications());

        verify(notificationService, times(3)).saveNotification(any(Notification.class));
        verify(telegramNotificationService, times(3)).sendNotification(
            anyLong(), anyLong(), any(), anyString(), any());
    }

    @Test
    void testBroadcastWithEmptyRecipients() {
        // Given
        when(userRepository.findAll()).thenReturn(Arrays.asList());

        String title = "Test Notification";
        String message = "This should not be sent";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        // When
        BroadcastResult result = notificationBroadcastService.broadcastSystemNotification(
            title, message, notificationType, null);

        // Then
        assertNotNull(result);
        assertEquals(0, result.getTotalRecipients());
        assertEquals(0, result.getSuccessfulNotifications());
        assertEquals(0, result.getFailedNotifications());

        verify(notificationService, never()).saveNotification(any(Notification.class));
        verify(telegramNotificationService, never()).sendNotification(
            anyLong(), anyLong(), any(), anyString(), any());
        verify(emailService, never()).sendNotificationEmail(any(Notification.class));
    }

    @Test
    void testBroadcastWithNotificationServiceException() {
        // Given
        User user = createUser(1L, UserRole.TEACHER, "teacher@example.com", 123456789L);

        when(userRepository.findAll()).thenReturn(Arrays.asList(user));
        when(notificationService.saveNotification(any(Notification.class)))
            .thenThrow(new RuntimeException("Database error"));

        String title = "Test Notification";
        String message = "This should fail";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        // When
        BroadcastResult result = notificationBroadcastService.broadcastSystemNotification(
            title, message, notificationType, null);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalRecipients());
        assertEquals(0, result.getSuccessfulNotifications());
        assertEquals(1, result.getFailedNotifications());

        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramNotificationService, never()).sendNotification(
            anyLong(), anyLong(), any(), anyString(), any());
    }

    @Test
    void testBroadcastWithTelegramServiceException() {
        // Given
        User user = createUser(1L, UserRole.TEACHER, "teacher@example.com", 123456789L);

        when(userRepository.findAll()).thenReturn(Arrays.asList(user));
        when(notificationService.saveNotification(any(Notification.class))).thenReturn(new Notification());
        doThrow(new RuntimeException("Telegram API error")).when(telegramNotificationService)
            .sendNotification(anyLong(), anyLong(), any(), anyString(), any());

        String title = "Test Notification";
        String message = "This should fail";
        Notification.NotificationType notificationType = Notification.NotificationType.SYSTEM_MESSAGE;

        // When
        BroadcastResult result = notificationBroadcastService.broadcastSystemNotification(
            title, message, notificationType, null);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getTotalRecipients());
        assertEquals(0, result.getSuccessfulNotifications());
        assertEquals(1, result.getFailedNotifications());

        verify(notificationService, times(1)).saveNotification(any(Notification.class));
        verify(telegramNotificationService, times(1)).sendNotification(
            anyLong(), anyLong(), any(), anyString(), any());
    }

    private User createUser(Long id, UserRole role, String email, Long telegramChatId) {
        User user = new User();
        user.setId(id);
        user.setRole(role);
        user.setEmail(email);
        user.setTelegramChatId(telegramChatId);
        user.setIsActive(true);
        return user;
    }
}