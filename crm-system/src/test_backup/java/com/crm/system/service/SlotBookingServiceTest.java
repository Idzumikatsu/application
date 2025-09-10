package com.crm.system.service;

import com.crm.system.dto.BookSlotDto;
import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.Lesson;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.AvailabilitySlotRepository;
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

class SlotBookingServiceTest {

    @Mock
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Mock
    private LessonRepository lessonRepository;

    @Mock
    private AvailabilitySlotService availabilitySlotService;

    @Mock
    private LessonService lessonService;

    @Mock
    private StudentService studentService;

    @Mock
    private UserService userService;

    @InjectMocks
    private SlotBookingService slotBookingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testBookSlotSuccess() {
        // Given
        Long slotId = 1L;
        Long studentId = 2L;

        BookSlotDto bookSlotDto = new BookSlotDto();
        bookSlotDto.setSlotId(slotId);
        bookSlotDto.setStudentId(studentId);
        bookSlotDto.setNotes("Test booking");

        User teacher = new User();
        teacher.setId(3L);
        teacher.setRole(UserRole.TEACHER);
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");

        Student student = new Student();
        student.setId(studentId);
        student.setFirstName("John");
        student.setLastName("Doe");

        AvailabilitySlot slot = new AvailabilitySlot(teacher, LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        slot.setId(slotId);
        slot.setStatus(AvailabilitySlot.SlotStatus.AVAILABLE);
        slot.setIsBooked(false);

        Lesson lesson = new Lesson(student, teacher, slot.getSlotDate(), slot.getSlotTime());
        lesson.setId(1L);

        when(availabilitySlotService.findById(slotId)).thenReturn(Optional.of(slot));
        when(studentService.findById(studentId)).thenReturn(Optional.of(student));
        when(lessonService.saveLesson(any(Lesson.class))).thenAnswer(invocation -> {
            Lesson l = invocation.getArgument(0);
            l.setId(1L);
            return l;
        });

        // When
        Lesson bookedLesson = slotBookingService.bookSlot(bookSlotDto);

        // Then
        assertNotNull(bookedLesson);
        assertEquals(studentId, bookedLesson.getStudent().getId());
        assertEquals(teacher.getId(), bookedLesson.getTeacher().getId());
        assertEquals(slot.getSlotDate(), bookedLesson.getScheduledDate());
        assertEquals(slot.getSlotTime(), bookedLesson.getScheduledTime());
        assertEquals("Test booking", bookedLesson.getNotes());
        assertEquals(Lesson.LessonStatus.SCHEDULED, bookedLesson.getStatus());

        // Verify slot was booked
        assertTrue(slot.getIsBooked());
        assertEquals(AvailabilitySlot.SlotStatus.BOOKED, slot.getStatus());

        verify(availabilitySlotService, times(1)).findById(slotId);
        verify(studentService, times(1)).findById(studentId);
        verify(lessonService, times(1)).saveLesson(any(Lesson.class));
        verify(availabilitySlotService, times(1)).updateAvailabilitySlot(slot);
    }

    @Test
    void testBookSlotFailureSlotNotFound() {
        // Given
        Long slotId = 1L;
        Long studentId = 2L;

        BookSlotDto bookSlotDto = new BookSlotDto();
        bookSlotDto.setSlotId(slotId);
        bookSlotDto.setStudentId(studentId);

        when(availabilitySlotService.findById(slotId)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            slotBookingService.bookSlot(bookSlotDto);
        });

        assertEquals("Availability slot not found with id: " + slotId, exception.getMessage());

        verify(availabilitySlotService, times(1)).findById(slotId);
        verify(studentService, never()).findById(anyLong());
        verify(lessonService, never()).saveLesson(any(Lesson.class));
        verify(availabilitySlotService, never()).updateAvailabilitySlot(any(AvailabilitySlot.class));
    }

    @Test
    void testBookSlotFailureSlotNotAvailable() {
        // Given
        Long slotId = 1L;
        Long studentId = 2L;

        BookSlotDto bookSlotDto = new BookSlotDto();
        bookSlotDto.setSlotId(slotId);
        bookSlotDto.setStudentId(studentId);

        User teacher = new User();
        teacher.setId(3L);
        teacher.setRole(UserRole.TEACHER);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        slot.setId(slotId);
        slot.bookSlot(); // Забронируем слот

        when(availabilitySlotService.findById(slotId)).thenReturn(Optional.of(slot));

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            slotBookingService.bookSlot(bookSlotDto);
        });

        assertEquals("Slot is not available for booking", exception.getMessage());

        verify(availabilitySlotService, times(1)).findById(slotId);
        verify(studentService, never()).findById(anyLong());
        verify(lessonService, never()).saveLesson(any(Lesson.class));
        verify(availabilitySlotService, never()).updateAvailabilitySlot(any(AvailabilitySlot.class));
    }

    @Test
    void testCancelBooking() {
        // Given
        Long slotId = 1L;

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        slot.setId(slotId);
        slot.bookSlot(); // Забронируем слот

        Lesson lesson = new Lesson(new Student(), teacher, LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setSlot(slot);

        when(availabilitySlotService.findById(slotId)).thenReturn(Optional.of(slot));
        when(lessonRepository.findBySlotId(slotId)).thenReturn(java.util.Collections.singletonList(lesson));
        when(lessonService.updateLesson(any(Lesson.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        slotBookingService.cancelBooking(slotId);

        // Then
        assertFalse(slot.getIsBooked());
        assertEquals(AvailabilitySlot.SlotStatus.AVAILABLE, slot.getStatus());

        assertEquals(Lesson.LessonStatus.CANCELLED, lesson.getStatus());
        assertEquals(Lesson.CancelledBy.MANAGER, lesson.getCancelledBy());
        assertEquals("Slot booking cancelled", lesson.getCancellationReason());

        verify(availabilitySlotService, times(1)).findById(slotId);
        verify(lessonRepository, times(1)).findBySlotId(slotId);
        verify(lessonService, times(1)).updateLesson(lesson);
        verify(availabilitySlotService, times(1)).updateAvailabilitySlot(slot);
    }

    @Test
    void testIsSlotAvailableForBookingTrue() {
        // Given
        Long slotId = 1L;

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        slot.setId(slotId);
        slot.setStatus(AvailabilitySlot.SlotStatus.AVAILABLE);
        slot.setIsBooked(false);

        when(availabilitySlotService.findById(slotId)).thenReturn(Optional.of(slot));

        // When
        boolean isAvailable = slotBookingService.isSlotAvailableForBooking(slotId);

        // Then
        assertTrue(isAvailable);

        verify(availabilitySlotService, times(1)).findById(slotId);
    }

    @Test
    void testIsSlotAvailableForBookingFalse() {
        // Given
        Long slotId = 1L;

        User teacher = new User();
        teacher.setId(2L);
        teacher.setRole(UserRole.TEACHER);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        slot.setId(slotId);
        slot.bookSlot(); // Забронируем слот

        when(availabilitySlotService.findById(slotId)).thenReturn(Optional.of(slot));

        // When
        boolean isAvailable = slotBookingService.isSlotAvailableForBooking(slotId);

        // Then
        assertFalse(isAvailable);

        verify(availabilitySlotService, times(1)).findById(slotId);
    }

    @Test
    void testIsSlotBookedByStudentTrue() {
        // Given
        Long slotId = 1L;
        Long studentId = 2L;

        User teacher = new User();
        teacher.setId(3L);
        teacher.setRole(UserRole.TEACHER);

        Student student = new Student();
        student.setId(studentId);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        slot.setId(slotId);
        slot.bookSlot(); // Забронируем слот

        Lesson lesson = new Lesson(student, teacher, LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        lesson.setId(1L);
        lesson.setSlot(slot);

        when(availabilitySlotService.findById(slotId)).thenReturn(Optional.of(slot));
        when(lessonRepository.findBySlotId(slotId)).thenReturn(java.util.Collections.singletonList(lesson));

        // When
        boolean isBooked = slotBookingService.isSlotBookedByStudent(slotId, studentId);

        // Then
        assertTrue(isBooked);

        verify(availabilitySlotService, times(1)).findById(slotId);
        verify(lessonRepository, times(1)).findBySlotId(slotId);
    }

    @Test
    void testIsSlotBookedByStudentFalse() {
        // Given
        Long slotId = 1L;
        Long studentId = 2L;

        User teacher = new User();
        teacher.setId(3L);
        teacher.setRole(UserRole.TEACHER);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, LocalDate.now().plusDays(1), LocalTime.of(10, 0));
        slot.setId(slotId);
        slot.setStatus(AvailabilitySlot.SlotStatus.AVAILABLE);
        slot.setIsBooked(false);

        when(availabilitySlotService.findById(slotId)).thenReturn(Optional.of(slot));

        // When
        boolean isBooked = slotBookingService.isSlotBookedByStudent(slotId, studentId);

        // Then
        assertFalse(isBooked);

        verify(availabilitySlotService, times(1)).findById(slotId);
        verify(lessonRepository, never()).findBySlotId(anyLong());
    }
}