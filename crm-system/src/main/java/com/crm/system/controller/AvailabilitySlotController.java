package com.crm.system.controller;

import com.crm.system.dto.AvailabilitySlotDto;
import com.crm.system.dto.CreateAvailabilitySlotDto;
import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.User;
import com.crm.system.service.AvailabilitySlotService;
import com.crm.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class AvailabilitySlotController {

    @Autowired
    private AvailabilitySlotService availabilitySlotService;

    @Autowired
    private UserService userService;

    @GetMapping("/teachers/{teacherId}/availability")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<AvailabilitySlotDto>> getTeacherAvailabilitySlots(
            @PathVariable Long teacherId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = endDate != null ? endDate : start.plusWeeks(1);

        Pageable pageable = PageRequest.of(page, size);
        Page<AvailabilitySlot> slotPage = availabilitySlotService.findAvailableSlotsByTeacherIdAndDateRange(
                teacherId, start, end, pageable);

        List<AvailabilitySlotDto> slotDtos = slotPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<AvailabilitySlotDto> dtoPage = new PageImpl<>(slotDtos, pageable, slotPage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @PostMapping("/teachers/availability")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<AvailabilitySlotDto> createAvailabilitySlot(
            @Valid @RequestBody CreateAvailabilitySlotDto createDto) {

        User teacher = userService.findById(createDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + createDto.getTeacherId()));

        AvailabilitySlot slot = availabilitySlotService.createAvailabilitySlot(
                teacher,
                createDto.getSlotDate(),
                createDto.getSlotTime(),
                createDto.getDurationMinutes()
        );

        return ResponseEntity.ok(convertToDto(slot));
    }

    @GetMapping("/availability-slots/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<AvailabilitySlotDto> getAvailabilitySlotById(@PathVariable Long id) {
        AvailabilitySlot slot = availabilitySlotService.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability slot not found with id: " + id));
        return ResponseEntity.ok(convertToDto(slot));
    }

    @PutMapping("/availability-slots/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<AvailabilitySlotDto> updateAvailabilitySlot(
            @PathVariable Long id,
            @Valid @RequestBody CreateAvailabilitySlotDto updateDto) {

        AvailabilitySlot slot = availabilitySlotService.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability slot not found with id: " + id));

        User teacher = userService.findById(updateDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + updateDto.getTeacherId()));

        slot.setTeacher(teacher);
        slot.setSlotDate(updateDto.getSlotDate());
        slot.setSlotTime(updateDto.getSlotTime());
        slot.setDurationMinutes(updateDto.getDurationMinutes());

        AvailabilitySlot updatedSlot = availabilitySlotService.updateAvailabilitySlot(slot);
        return ResponseEntity.ok(convertToDto(updatedSlot));
    }

    @DeleteMapping("/availability-slots/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAvailabilitySlot(@PathVariable Long id) {
        if (!availabilitySlotService.findById(id).isPresent()) {
            throw new RuntimeException("Availability slot not found with id: " + id);
        }
        availabilitySlotService.deleteAvailabilitySlot(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/teachers/{teacherId}/availability/future-available")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<AvailabilitySlotDto>> getFutureAvailableSlots(@PathVariable Long teacherId) {
        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        List<AvailabilitySlot> slots = availabilitySlotService.findFutureAvailableSlotsByTeacherId(teacherId);
        List<AvailabilitySlotDto> slotDtos = slots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(slotDtos);
    }

    @GetMapping("/teachers/{teacherId}/availability/future-booked")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<AvailabilitySlotDto>> getFutureBookedSlots(@PathVariable Long teacherId) {
        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        List<AvailabilitySlot> slots = availabilitySlotService.findFutureBookedSlotsByTeacherId(teacherId);
        List<AvailabilitySlotDto> slotDtos = slots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(slotDtos);
    }

    @GetMapping("/teachers/{teacherId}/availability/date/{date}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<AvailabilitySlotDto>> getSlotsByDate(
            @PathVariable Long teacherId,
            @PathVariable String date) {

        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        LocalDate slotDate = LocalDate.parse(date);
        List<AvailabilitySlot> slots = availabilitySlotService.findByTeacherIdAndDate(teacherId, slotDate);
        List<AvailabilitySlotDto> slotDtos = slots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(slotDtos);
    }

    private AvailabilitySlotDto convertToDto(AvailabilitySlot slot) {
        AvailabilitySlotDto dto = new AvailabilitySlotDto();
        dto.setId(slot.getId());
        dto.setTeacherId(slot.getTeacher().getId());
        dto.setTeacherName(slot.getTeacher().getFirstName() + " " + slot.getTeacher().getLastName());
        dto.setSlotDate(slot.getSlotDate());
        dto.setSlotTime(slot.getSlotTime());
        dto.setDurationMinutes(slot.getDurationMinutes());
        dto.setIsBooked(slot.getIsBooked());
        dto.setStatus(slot.getStatus());
        if (slot.getCreatedAt() != null) {
            dto.setCreatedAt(slot.getCreatedAt().toString());
        }
        if (slot.getUpdatedAt() != null) {
            dto.setUpdatedAt(slot.getUpdatedAt().toString());
        }
        return dto;
    }
}