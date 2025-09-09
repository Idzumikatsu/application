package com.crm.system.service;

import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.AvailabilitySlotRepository;
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

class AvailabilitySlotServiceTest {

    @Mock
    private AvailabilitySlotRepository availabilitySlotRepository;

    @InjectMocks
    private AvailabilitySlotService availabilitySlotService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateAvailabilitySlot() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        LocalDate date = LocalDate.now().plusDays(1);
        LocalTime time = LocalTime.of(10, 0);
        Integer durationMinutes = 60;

        AvailabilitySlot slot = new AvailabilitySlot(teacher, date, time, durationMinutes);
        slot.setId(1L);

        when(availabilitySlotRepository.save(any(AvailabilitySlot.class))).thenReturn(slot);

        // When
        AvailabilitySlot createdSlot = availabilitySlotService.createAvailabilitySlot(teacher, date, time, durationMinutes);

        // Then
        assertNotNull(createdSlot);
        assertEquals(teacher.getId(), createdSlot.getTeacher().getId());
        assertEquals(date, createdSlot.getSlotDate());
        assertEquals(time, createdSlot.getSlotTime());
        assertEquals(durationMinutes, createdSlot.getDurationMinutes());
        assertEquals(AvailabilitySlot.SlotStatus.AVAILABLE, createdSlot.getStatus());
        assertFalse(createdSlot.getIsBooked());

        verify(availabilitySlotRepository, times(1)).save(any(AvailabilitySlot.class));
    }

    @Test
    void testFindById() {
        // Given
        Long slotId = 1L;
        AvailabilitySlot slot = new AvailabilitySlot();
        slot.setId(slotId);

        when(availabilitySlotRepository.findById(slotId)).thenReturn(Optional.of(slot));

        // When
        Optional<AvailabilitySlot> foundSlot = availabilitySlotService.findById(slotId);

        // Then
        assertTrue(foundSlot.isPresent());
        assertEquals(slotId, foundSlot.get().getId());

        verify(availabilitySlotRepository, times(1)).findById(slotId);
    }

    @Test
    void testBookSlot() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, LocalDate.now(), LocalTime.of(10, 0));
        slot.setId(1L);

        when(availabilitySlotRepository.save(any(AvailabilitySlot.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        availabilitySlotService.bookSlot(slot);

        // Then
        assertTrue(slot.getIsBooked());
        assertEquals(AvailabilitySlot.SlotStatus.BOOKED, slot.getStatus());

        verify(availabilitySlotRepository, times(1)).save(any(AvailabilitySlot.class));
    }

    @Test
    void testCancelBooking() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, LocalDate.now(), LocalTime.of(10, 0));
        slot.setId(1L);
        slot.bookSlot(); // Сначала забронируем слот

        when(availabilitySlotRepository.save(any(AvailabilitySlot.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        availabilitySlotService.cancelBooking(slot);

        // Then
        assertFalse(slot.getIsBooked());
        assertEquals(AvailabilitySlot.SlotStatus.AVAILABLE, slot.getStatus());

        verify(availabilitySlotRepository, times(1)).save(any(AvailabilitySlot.class));
    }

    @Test
    void testBlockSlot() {
        // Given
        User teacher = new User();
        teacher.setId(1L);
        teacher.setRole(UserRole.TEACHER);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, LocalDate.now(), LocalTime.of(10, 0));
        slot.setId(1L);

        when(availabilitySlotRepository.save(any(AvailabilitySlot.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        availabilitySlotService.blockSlot(slot);

        // Then
        assertFalse(slot.getIsBooked());
        assertEquals(AvailabilitySlot.SlotStatus.BLOCKED, slot.getStatus());

        verify(availabilitySlotRepository, times(1)).save(any(AvailabilitySlot.class));
    }

    @Test
    void testIsSlotAvailable() {
        // Given
        Long teacherId = 1L;
        LocalDate date = LocalDate.now();
        LocalTime time = LocalTime.of(10, 0);

        User teacher = new User();
        teacher.setId(teacherId);
        teacher.setRole(UserRole.TEACHER);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, date, time);
        slot.setId(1L);

        when(availabilitySlotRepository.findByTeacherIdAndDateTime(teacherId, date, time))
                .thenReturn(Optional.of(slot));

        // When
        boolean isAvailable = availabilitySlotService.isSlotAvailable(teacherId, date, time);

        // Then
        assertTrue(isAvailable);
    }

    @Test
    void testIsSlotAvailableWhenSlotIsBooked() {
        // Given
        Long teacherId = 1L;
        LocalDate date = LocalDate.now();
        LocalTime time = LocalTime.of(10, 0);

        User teacher = new User();
        teacher.setId(teacherId);
        teacher.setRole(UserRole.TEACHER);

        AvailabilitySlot slot = new AvailabilitySlot(teacher, date, time);
        slot.setId(1L);
        slot.bookSlot(); // Забронируем слот

        when(availabilitySlotRepository.findByTeacherIdAndDateTime(teacherId, date, time))
                .thenReturn(Optional.of(slot));

        // When
        boolean isAvailable = availabilitySlotService.isSlotAvailable(teacherId, date, time);

        // Then
        assertFalse(isAvailable);
    }
}