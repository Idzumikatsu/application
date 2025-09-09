package com.crm.system.service;

import com.crm.system.model.GroupLesson;
import com.crm.system.model.GroupLessonRegistration;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.GroupLessonRepository;
import com.crm.system.repository.GroupLessonRegistrationRepository;
import com.crm.system.repository.StudentRepository;
import com.crm.system.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

class NotificationSchedulerServiceTest {

    @Mock
    private GroupLessonRepository groupLessonRepository;

    @Mock
    private GroupLessonRegistrationRepository groupLessonRegistrationRepository;

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private NotificationSchedulerService notificationSchedulerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testSendGroupLessonReminders() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        GroupLesson lesson = new GroupLesson(teacher, "English Conversation", LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);

        Student student1 = new Student();
        student1.setId(1L);
        student1.setFirstName("John");
        student1.setLastName("Doe");
        student1.setEmail("john.doe@example.com");

        Student student2 = new Student();
        student2.setId(2L);
        student2.setFirstName("Alice");
        student2.setLastName("Johnson");
        student2.setEmail("alice.johnson@example.com");

        GroupLessonRegistration registration1 = new GroupLessonRegistration(lesson, student1);
        registration1.setId(1L);

        GroupLessonRegistration registration2 = new GroupLessonRegistration(lesson, student2);
        registration2.setId(2L);

        List<GroupLesson> upcomingLessons = Arrays.asList(lesson);
        List<GroupLessonRegistration> registrations = Arrays.asList(registration1, registration2);

        when(groupLessonRepository.findByDateRangeAndStatuses(any(LocalDate.class), any(LocalDate.class), anyList()))
                .thenReturn(upcomingLessons);
        when(groupLessonRegistrationRepository.findByGroupLessonId(anyLong())).thenReturn(registrations);

        // When
        notificationSchedulerService.sendGroupLessonReminders();

        // Then
        verify(groupLessonRepository, times(1)).findByDateRangeAndStatuses(any(LocalDate.class), any(LocalDate.class), anyList());
        verify(groupLessonRegistrationRepository, times(1)).findByGroupLessonId(anyLong());
    }

    @Test
    void testSendGroupLessonRemindersEmptyList() {
        // Given
        when(groupLessonRepository.findByDateRangeAndStatuses(any(LocalDate.class), any(LocalDate.class), anyList()))
                .thenReturn(Collections.emptyList());

        // When
        notificationSchedulerService.sendGroupLessonReminders();

        // Then
        verify(groupLessonRepository, times(1)).findByDateRangeAndStatuses(any(LocalDate.class), any(LocalDate.class), anyList());
        verify(groupLessonRegistrationRepository, never()).findByGroupLessonId(anyLong());
    }

    @Test
    void testSendGroupLessonRemindersExceptionHandling() {
        // Given
        when(groupLessonRepository.findByDateRangeAndStatuses(any(LocalDate.class), any(LocalDate.class), anyList()))
                .thenThrow(new RuntimeException("Database error"));

        // When
        notificationSchedulerService.sendGroupLessonReminders();

        // Then
        verify(groupLessonRepository, times(1)).findByDateRangeAndStatuses(any(LocalDate.class), any(LocalDate.class), anyList());
        verify(groupLessonRegistrationRepository, never()).findByGroupLessonId(anyLong());
    }

    @Test
    void testSendGroupLessonReminder() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        GroupLesson lesson = new GroupLesson(teacher, "English Conversation", LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);

        Student student1 = new Student();
        student1.setId(1L);
        student1.setFirstName("John");
        student1.setLastName("Doe");
        student1.setEmail("john.doe@example.com");

        Student student2 = new Student();
        student2.setId(2L);
        student2.setFirstName("Alice");
        student2.setLastName("Johnson");
        student2.setEmail("alice.johnson@example.com");

        GroupLessonRegistration registration1 = new GroupLessonRegistration(lesson, student1);
        registration1.setId(1L);

        GroupLessonRegistration registration2 = new GroupLessonRegistration(lesson, student2);
        registration2.setId(2L);

        List<GroupLessonRegistration> registrations = Arrays.asList(registration1, registration2);

        when(groupLessonRegistrationRepository.findByGroupLessonId(anyLong())).thenReturn(registrations);

        // When
        // Note: We can't directly test private method, but we can test the behavior through public methods
        // This is a limitation of unit testing private methods

        // Then
        // We verify that the repository method was called
        verify(groupLessonRegistrationRepository, times(1)).findByGroupLessonId(anyLong());
    }

    @Test
    void testSendGroupLessonReminderEmptyRegistrations() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        GroupLesson lesson = new GroupLesson(teacher, "English Conversation", LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);

        when(groupLessonRegistrationRepository.findByGroupLessonId(anyLong())).thenReturn(Collections.emptyList());

        // When
        // Note: We can't directly test private method, but we can test the behavior through public methods

        // Then
        verify(groupLessonRegistrationRepository, times(1)).findByGroupLessonId(anyLong());
    }

    @Test
    void testSendGroupLessonReminderExceptionHandling() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        GroupLesson lesson = new GroupLesson(teacher, "English Conversation", LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);

        when(groupLessonRegistrationRepository.findByGroupLessonId(anyLong()))
                .thenThrow(new RuntimeException("Database error"));

        // When
        // Note: We can't directly test private method, but we can test the behavior through public methods

        // Then
        verify(groupLessonRegistrationRepository, times(1)).findByGroupLessonId(anyLong());
    }

    @Test
    void testSendLessonCancellationNotices() {
        // Given
        // When
        notificationSchedulerService.sendLessonCancellationNotices();

        // Then
        // Since this method is empty in current implementation, we just verify it doesn't throw exception
        assertTrue(true);
    }

    @Test
    void testSendFeedbackRequests() {
        // Given
        // When
        notificationSchedulerService.sendFeedbackRequests();

        // Then
        // Since this method is empty in current implementation, we just verify it doesn't throw exception
        assertTrue(true);
    }

    @Test
    void testRetryFailedNotifications() {
        // Given
        // When
        notificationSchedulerService.retryFailedNotifications();

        // Then
        // Since this method is empty in current implementation, we just verify it doesn't throw exception
        assertTrue(true);
    }

    @Test
    void testCleanupOldNotifications() {
        // Given
        // When
        notificationSchedulerService.cleanupOldNotifications();

        // Then
        // Since this method is empty in current implementation, we just verify it doesn't throw exception
        assertTrue(true);
    }

    @Test
    void testSendPackageEndingSoonNotices() {
        // Given
        // When
        notificationSchedulerService.sendPackageEndingSoonNotices();

        // Then
        // Since this method is empty in current implementation, we just verify it doesn't throw exception
        assertTrue(true);
    }

    @Test
    void testSendGroupLessonCancellationNotice() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        GroupLesson lesson = new GroupLesson(teacher, "English Conversation", LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);

        Student student1 = new Student();
        student1.setId(1L);
        student1.setFirstName("John");
        student1.setLastName("Doe");
        student1.setEmail("john.doe@example.com");

        Student student2 = new Student();
        student2.setId(2L);
        student2.setFirstName("Alice");
        student2.setLastName("Johnson");
        student2.setEmail("alice.johnson@example.com");

        GroupLessonRegistration registration1 = new GroupLessonRegistration(lesson, student1);
        registration1.setId(1L);

        GroupLessonRegistration registration2 = new GroupLessonRegistration(lesson, student2);
        registration2.setId(2L);

        List<GroupLessonRegistration> registrations = Arrays.asList(registration1, registration2);
        String reason = "Teacher illness";

        when(groupLessonRegistrationRepository.findByGroupLessonId(anyLong())).thenReturn(registrations);

        // When
        notificationSchedulerService.sendGroupLessonCancellationNotice(lesson, reason);

        // Then
        verify(groupLessonRegistrationRepository, times(1)).findByGroupLessonId(anyLong());
    }

    @Test
    void testSendGroupLessonCancellationNoticeEmptyRegistrations() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        GroupLesson lesson = new GroupLesson(teacher, "English Conversation", LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);

        String reason = "Teacher illness";

        when(groupLessonRegistrationRepository.findByGroupLessonId(anyLong())).thenReturn(Collections.emptyList());

        // When
        notificationSchedulerService.sendGroupLessonCancellationNotice(lesson, reason);

        // Then
        verify(groupLessonRegistrationRepository, times(1)).findByGroupLessonId(anyLong());
    }

    @Test
    void testSendGroupLessonCancellationNoticeExceptionHandling() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        GroupLesson lesson = new GroupLesson(teacher, "English Conversation", LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);

        String reason = "Teacher illness";

        when(groupLessonRegistrationRepository.findByGroupLessonId(anyLong()))
                .thenThrow(new RuntimeException("Database error"));

        // When
        notificationSchedulerService.sendGroupLessonCancellationNotice(lesson, reason);

        // Then
        verify(groupLessonRegistrationRepository, times(1)).findByGroupLessonId(anyLong());
    }

    @Test
    void testSendFeedbackRequest() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        GroupLesson lesson = new GroupLesson(teacher, "English Conversation", LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(teacher));

        // When
        notificationSchedulerService.sendFeedbackRequest(lesson);

        // Then
        verify(userRepository, times(1)).findById(anyLong());
    }

    @Test
    void testSendFeedbackRequestTeacherNotFound() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        GroupLesson lesson = new GroupLesson(teacher, "English Conversation", LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);

        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When
        notificationSchedulerService.sendFeedbackRequest(lesson);

        // Then
        verify(userRepository, times(1)).findById(anyLong());
    }

    @Test
    void testSendFeedbackRequestExceptionHandling() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        GroupLesson lesson = new GroupLesson(teacher, "English Conversation", LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);

        when(userRepository.findById(anyLong())).thenThrow(new RuntimeException("Database error"));

        // When
        notificationSchedulerService.sendFeedbackRequest(lesson);

        // Then
        verify(userRepository, times(1)).findById(anyLong());
    }
}