package com.crm.system.controller;

import com.crm.system.dto.AvailabilitySlotDto;
import com.crm.system.model.AvailabilitySlot;
import com.crm.system.service.AvailabilitySlotService;
import com.crm.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/availability-slots")
public class AvailabilitySlotController {

    @Autowired
    private AvailabilitySlotService availabilitySlotService;

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<AvailabilitySlotDto> getAvailabilitySlotById(@PathVariable Long id) {
        AvailabilitySlot slot = availabilitySlotService.findById(id)
                .orElseThrow(() -> new RuntimeException("Availability slot not found with id: " + id));
        return ResponseEntity.ok(convertToDto(slot));
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