package com.crm.system.service;

import com.crm.system.model.Lesson;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.LessonRepository;
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

class LessonServiceTest {

    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private LessonService lessonService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateLesson() {
        // Given
        Student student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        LocalDate scheduledDate = LocalDate.now().plusDays(1);
        LocalTime scheduledTime = LocalTime.of(10, 0);

        Lesson lesson = new Lesson(student, teacher, scheduledDate, scheduledTime);
        lesson.setId(1L);
        lesson.setDurationMinutes(60);

        when(lessonRepository.save(any(Lesson.class))).thenReturn(lesson);

        // When
        Lesson createdLesson = lessonService.createLesson(student, teacher, scheduledDate, scheduledTime);

        // Then
        assertNotNull(createdLesson);
        assertEquals(student.getId(), createdLesson.getStudent().getId());
        assertEquals(teacher.getId(), createdLesson.getTeacher().getId());
        assertEquals(scheduledDate, createdLesson.getScheduledDate());
        assertEquals(scheduledTime, createdLesson.getScheduledTime());
        assertEquals(60, createdLesson.getDurationMinutes());
        assertEquals(Lesson.LessonStatus.SCHEDULED, createdLesson.getStatus());
        assertFalse(createdLesson.getConfirmedByTeacher());

        verify(lessonRepository, times(1)).save(any(Lesson.class));
    }

    @Test
    void testFindById() {
        // Given
        Long lessonId = 1L;
        Lesson lesson = new Lesson();
        lesson.setId(lessonId);

        when(lessonRepository.findById(lessonId)).thenReturn(Optional.of(lesson));

        // When
        Optional<Lesson> foundLesson = lessonService.findById(lessonId);

        // Then
        assertTrue(foundLesson.isPresent());
        assertEquals(lessonId, foundLesson.get().getId());

        verify(lessonRepository, times(1)).findById(lessonId);
    }

    @Test
    void testCompleteLesson() {
        // Given
        Student student = new Student();
        student.setId(1L);

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);

        Lesson lesson = new Lesson(student, teacher, LocalDate.now(), LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setStatus(Lesson.LessonStatus.SCHEDULED);

        when(lessonRepository.save(any(Lesson.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        lessonService.completeLesson(lesson);

        // Then
        assertEquals(Lesson.LessonStatus.COMPLETED, lesson.getStatus());
        assertTrue(lesson.getConfirmedByTeacher());

        verify(lessonRepository, times(1)).save(any(Lesson.class));
    }

    @Test
    void testCancelLesson() {
        // Given
        Student student = new Student();
        student.setId(1L);

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);

        Lesson lesson = new Lesson(student, teacher, LocalDate.now(), LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setStatus(Lesson.LessonStatus.SCHEDULED);

        String cancellationReason = "Student requested cancellation";
        Lesson.CancelledBy cancelledBy = Lesson.CancelledBy.STUDENT;

        when(lessonRepository.save(any(Lesson.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        lessonService.cancelLesson(lesson, cancelledBy, cancellationReason);

        // Then
        assertEquals(Lesson.LessonStatus.CANCELLED, lesson.getStatus());
        assertEquals(cancelledBy, lesson.getCancelledBy());
        assertEquals(cancellationReason, lesson.getCancellationReason());

        verify(lessonRepository, times(1)).save(any(Lesson.class));
    }

    @Test
    void testMarkAsMissed() {
        // Given
        Student student = new Student();
        student.setId(1L);

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);

        Lesson lesson = new Lesson(student, teacher, LocalDate.now(), LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setStatus(Lesson.LessonStatus.SCHEDULED);

        when(lessonRepository.save(any(Lesson.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        lessonService.markAsMissed(lesson);

        // Then
        assertEquals(Lesson.LessonStatus.MISSED, lesson.getStatus());

        verify(lessonRepository, times(1)).save(any(Lesson.class));
    }

    @Test
    void testIsLessonScheduled() {
        // Given
        Student student = new Student();
        student.setId(1L);

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);

        Lesson lesson = new Lesson(student, teacher, LocalDate.now(), LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setStatus(Lesson.LessonStatus.SCHEDULED);

        // When
        boolean isScheduled = lessonService.isLessonScheduled(lesson);

        // Then
        assertTrue(isScheduled);
    }

    @Test
    void testIsLessonCompleted() {
        // Given
        Student student = new Student();
        student.setId(1L);

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);

        Lesson lesson = new Lesson(student, teacher, LocalDate.now(), LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setStatus(Lesson.LessonStatus.COMPLETED);

        // When
        boolean isCompleted = lessonService.isLessonCompleted(lesson);

        // Then
        assertTrue(isCompleted);
    }

    @Test
    void testIsLessonCancelled() {
        // Given
        Student student = new Student();
        student.setId(1L);

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);

        Lesson lesson = new Lesson(student, teacher, LocalDate.now(), LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setStatus(Lesson.LessonStatus.CANCELLED);

        // When
        boolean isCancelled = lessonService.isLessonCancelled(lesson);

        // Then
        assertTrue(isCancelled);
    }

    @Test
    void testIsLessonMissed() {
        // Given
        Student student = new Student();
        student.setId(1L);

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);

        Lesson lesson = new Lesson(student, teacher, LocalDate.now(), LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setStatus(Lesson.LessonStatus.MISSED);

        // When
        boolean isMissed = lessonService.isLessonMissed(lesson);

        // Then
        assertTrue(isMissed);
    }
}