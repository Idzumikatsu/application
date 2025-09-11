package com.crm.system.controller;

import com.crm.system.dto.BookSlotDto;
import com.crm.system.dto.LessonDto;
import com.crm.system.model.Lesson;
import com.crm.system.service.SlotBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class SlotBookingController {

    @Autowired
    private SlotBookingService slotBookingService;

    @PostMapping("/bookings")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LessonDto> bookSlot(@Valid @RequestBody BookSlotDto bookSlotDto) {
        Lesson lesson = slotBookingService.bookSlot(bookSlotDto);
        return ResponseEntity.ok(convertToDto(lesson));
    }

    @DeleteMapping("/bookings/slots/{slotId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long slotId) {
        if (!slotBookingService.isSlotAvailableForBooking(slotId)) {
            slotBookingService.cancelBooking(slotId);
            return ResponseEntity.ok().build();
        } else {
            throw new RuntimeException("Slot is not booked and cannot be cancelled");
        }
    }

    @GetMapping("/bookings/slots/{slotId}/available")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Boolean> isSlotAvailableForBooking(@PathVariable Long slotId) {
        boolean isAvailable = slotBookingService.isSlotAvailableForBooking(slotId);
        return ResponseEntity.ok(isAvailable);
    }

    @GetMapping("/bookings/slots/{slotId}/student/{studentId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Boolean> isSlotBookedByStudent(@PathVariable Long slotId, @PathVariable Long studentId) {
        boolean isBooked = slotBookingService.isSlotBookedByStudent(slotId, studentId);
        return ResponseEntity.ok(isBooked);
    }

    private LessonDto convertToDto(Lesson lesson) {
        LessonDto dto = new LessonDto();
        dto.setId(lesson.getId());
        dto.setStudentId(lesson.getStudent().getId());
        dto.setStudentName(lesson.getStudent().getFirstName() + " " + lesson.getStudent().getLastName());
        dto.setTeacherId(lesson.getTeacher().getId());
        dto.setTeacherName(lesson.getTeacher().getFirstName() + " " + lesson.getTeacher().getLastName());
        
        if (lesson.getSlot() != null) {
            dto.setSlotId(lesson.getSlot().getId());
        }
        
        dto.setScheduledDate(lesson.getScheduledDate());
        dto.setScheduledTime(lesson.getScheduledTime());
        dto.setDurationMinutes(lesson.getDurationMinutes());
        dto.setStatus(lesson.getStatus());
        dto.setCancellationReason(lesson.getCancellationReason());
        dto.setCancelledBy(lesson.getCancelledBy());
        dto.setNotes(lesson.getNotes());
        dto.setConfirmedByTeacher(lesson.getConfirmedByTeacher());
        
        if (lesson.getCreatedAt() != null) {
            dto.setCreatedAt(lesson.getCreatedAt().toString());
        }
        if (lesson.getUpdatedAt() != null) {
            dto.setUpdatedAt(lesson.getUpdatedAt().toString());
        }
        
        return dto;
    }
}