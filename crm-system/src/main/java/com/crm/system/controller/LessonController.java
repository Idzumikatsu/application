package com.crm.system.controller;

import com.crm.system.dto.LessonDto;
import com.crm.system.model.Lesson;
import com.crm.system.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/lessons") // Generic endpoint for lesson details
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'TEACHER', 'MANAGER', 'ADMIN')")
    public ResponseEntity<LessonDto> getLessonById(@PathVariable Long id) {
        Lesson lesson = lessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
        // In a real app, you'd add a security check here to ensure the principal
        // is either the student or the teacher of this lesson, or a manager/admin.
        return ResponseEntity.ok(convertToDto(lesson));
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