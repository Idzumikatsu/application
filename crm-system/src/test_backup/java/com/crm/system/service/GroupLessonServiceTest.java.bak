package com.crm.system.service;

import com.crm.system.model.GroupLesson;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.model.GroupLesson.GroupLessonStatus;
import com.crm.system.repository.GroupLessonRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class GroupLessonServiceTest {

    @Mock
    private GroupLessonRepository groupLessonRepository;

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private GroupLessonRegistrationService groupLessonRegistrationService;

    @InjectMocks
    private GroupLessonService groupLessonService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateGroupLesson() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        String lessonTopic = "English Grammar Basics";
        LocalDate scheduledDate = LocalDate.now().plusDays(1);
        LocalTime scheduledTime = LocalTime.of(10, 0);

        GroupLesson groupLesson = new GroupLesson(teacher, lessonTopic, scheduledDate, scheduledTime);
        groupLesson.setId(1L);
        groupLesson.setDurationMinutes(60);

        when(groupLessonRepository.save(any(GroupLesson.class))).thenReturn(groupLesson);

        // When
        GroupLesson createdGroupLesson = groupLessonService.createGroupLesson(teacher, lessonTopic, scheduledDate, scheduledTime);

        // Then
        assertNotNull(createdGroupLesson);
        assertEquals(teacher.getId(), createdGroupLesson.getTeacher().getId());
        assertEquals(lessonTopic, createdGroupLesson.getLessonTopic());
        assertEquals(scheduledDate, createdGroupLesson.getScheduledDate());
        assertEquals(scheduledTime, createdGroupLesson.getScheduledTime());
        assertEquals(60, createdGroupLesson.getDurationMinutes());
        assertEquals(GroupLessonStatus.SCHEDULED, createdGroupLesson.getStatus());
        assertEquals(0, createdGroupLesson.getCurrentStudents());

        verify(groupLessonRepository, times(1)).save(any(GroupLesson.class));
    }

    @Test
    void testCreateGroupLessonWithDuration() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        String lessonTopic = "English Grammar Basics";
        LocalDate scheduledDate = LocalDate.now().plusDays(1);
        LocalTime scheduledTime = LocalTime.of(10, 0);
        Integer durationMinutes = 90;

        GroupLesson groupLesson = new GroupLesson(teacher, lessonTopic, scheduledDate, scheduledTime, durationMinutes);
        groupLesson.setId(1L);
        groupLesson.setDurationMinutes(durationMinutes);

        when(groupLessonRepository.save(any(GroupLesson.class))).thenReturn(groupLesson);

        // When
        GroupLesson createdGroupLesson = groupLessonService.createGroupLesson(teacher, lessonTopic, scheduledDate, scheduledTime, durationMinutes);

        // Then
        assertNotNull(createdGroupLesson);
        assertEquals(teacher.getId(), createdGroupLesson.getTeacher().getId());
        assertEquals(lessonTopic, createdGroupLesson.getLessonTopic());
        assertEquals(scheduledDate, createdGroupLesson.getScheduledDate());
        assertEquals(scheduledTime, createdGroupLesson.getScheduledTime());
        assertEquals(durationMinutes, createdGroupLesson.getDurationMinutes());
        assertEquals(GroupLessonStatus.SCHEDULED, createdGroupLesson.getStatus());
        assertEquals(0, createdGroupLesson.getCurrentStudents());

        verify(groupLessonRepository, times(1)).save(any(GroupLesson.class));
    }

    @Test
    void testFindById() {
        // Given
        Long groupLessonId = 1L;
        GroupLesson groupLesson = new GroupLesson();
        groupLesson.setId(groupLessonId);

        when(groupLessonRepository.findById(groupLessonId)).thenReturn(Optional.of(groupLesson));

        // When
        Optional<GroupLesson> foundGroupLesson = groupLessonService.findById(groupLessonId);

        // Then
        assertTrue(foundGroupLesson.isPresent());
        assertEquals(groupLessonId, foundGroupLesson.get().getId());

        verify(groupLessonRepository, times(1)).findById(groupLessonId);
    }

    @Test
    void testConfirmLesson() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.SCHEDULED);

        when(groupLessonRepository.save(any(GroupLesson.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        groupLessonService.confirmLesson(groupLesson);

        // Then
        assertEquals(GroupLessonStatus.CONFIRMED, groupLesson.getStatus());

        verify(groupLessonRepository, times(1)).save(any(GroupLesson.class));
    }

    @Test
    void testStartLesson() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.CONFIRMED);

        when(groupLessonRepository.save(any(GroupLesson.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        groupLessonService.startLesson(groupLesson);

        // Then
        assertEquals(GroupLessonStatus.IN_PROGRESS, groupLesson.getStatus());

        verify(groupLessonRepository, times(1)).save(any(GroupLesson.class));
    }

    @Test
    void testCompleteLesson() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.IN_PROGRESS);

        when(groupLessonRepository.save(any(GroupLesson.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        groupLessonService.completeLesson(groupLesson);

        // Then
        assertEquals(GroupLessonStatus.COMPLETED, groupLesson.getStatus());

        verify(groupLessonRepository, times(1)).save(any(GroupLesson.class));
    }

    @Test
    void testCancelLesson() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.SCHEDULED);

        when(groupLessonRepository.save(any(GroupLesson.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        groupLessonService.cancelLesson(groupLesson);

        // Then
        assertEquals(GroupLessonStatus.CANCELLED, groupLesson.getStatus());

        verify(groupLessonRepository, times(1)).save(any(GroupLesson.class));
    }

    @Test
    void testPostponeLesson() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.SCHEDULED);

        when(groupLessonRepository.save(any(GroupLesson.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        groupLessonService.postponeLesson(groupLesson);

        // Then
        assertEquals(GroupLessonStatus.POSTPONED, groupLesson.getStatus());

        verify(groupLessonRepository, times(1)).save(any(GroupLesson.class));
    }

    @Test
    void testIsLessonScheduled() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.SCHEDULED);

        // When
        boolean isScheduled = groupLessonService.isLessonScheduled(groupLesson);

        // Then
        assertTrue(isScheduled);
    }

    @Test
    void testIsLessonConfirmed() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.CONFIRMED);

        // When
        boolean isConfirmed = groupLessonService.isLessonConfirmed(groupLesson);

        // Then
        assertTrue(isConfirmed);
    }

    @Test
    void testIsLessonInProgress() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.IN_PROGRESS);

        // When
        boolean isInProgress = groupLessonService.isLessonInProgress(groupLesson);

        // Then
        assertTrue(isInProgress);
    }

    @Test
    void testIsLessonCompleted() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.COMPLETED);

        // When
        boolean isCompleted = groupLessonService.isLessonCompleted(groupLesson);

        // Then
        assertTrue(isCompleted);
    }

    @Test
    void testIsLessonCancelled() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.CANCELLED);

        // When
        boolean isCancelled = groupLessonService.isLessonCancelled(groupLesson);

        // Then
        assertTrue(isCancelled);
    }

    @Test
    void testIsLessonPostponed() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setStatus(GroupLessonStatus.POSTPONED);

        // When
        boolean isPostponed = groupLessonService.isLessonPostponed(groupLesson);

        // Then
        assertTrue(isPostponed);
    }

    @Test
    void testIsLessonFull() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setMaxStudents(5);
        groupLesson.setCurrentStudents(5);

        // When
        boolean isFull = groupLessonService.isLessonFull(groupLesson);

        // Then
        assertTrue(isFull);
    }

    @Test
    void testDoesLessonHaveSpace() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(1L);
        groupLesson.setMaxStudents(5);
        groupLesson.setCurrentStudents(3);

        // When
        boolean hasSpace = groupLessonService.doesLessonHaveSpace(groupLesson);

        // Then
        assertTrue(hasSpace);
    }

    @Test
    void testIsSlotAvailableForBooking() {
        // Given
        Long groupLessonId = 1L;
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(groupLessonId);
        groupLesson.setStatus(GroupLessonStatus.SCHEDULED);
        groupLesson.setMaxStudents(5);
        groupLesson.setCurrentStudents(3);

        when(groupLessonRepository.findById(groupLessonId)).thenReturn(Optional.of(groupLesson));

        // When
        boolean isAvailable = groupLessonService.isSlotAvailableForBooking(groupLessonId);

        // Then
        assertTrue(isAvailable);
    }

    @Test
    void testIsSlotAvailableForBookingWhenFull() {
        // Given
        Long groupLessonId = 1L;
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(groupLessonId);
        groupLesson.setStatus(GroupLessonStatus.SCHEDULED);
        groupLesson.setMaxStudents(5);
        groupLesson.setCurrentStudents(5);

        when(groupLessonRepository.findById(groupLessonId)).thenReturn(Optional.of(groupLesson));

        // When
        boolean isAvailable = groupLessonService.isSlotAvailableForBooking(groupLessonId);

        // Then
        assertFalse(isAvailable);
    }

    @Test
    void testIsSlotAvailableForBookingWhenCancelled() {
        // Given
        Long groupLessonId = 1L;
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        GroupLesson groupLesson = new GroupLesson(teacher, "English Grammar", LocalDate.now(), LocalTime.of(10, 0));
        groupLesson.setId(groupLessonId);
        groupLesson.setStatus(GroupLessonStatus.CANCELLED);
        groupLesson.setMaxStudents(5);
        groupLesson.setCurrentStudents(3);

        when(groupLessonRepository.findById(groupLessonId)).thenReturn(Optional.of(groupLesson));

        // When
        boolean isAvailable = groupLessonService.isSlotAvailableForBooking(groupLessonId);

        // Then
        assertFalse(isAvailable);
    }
}