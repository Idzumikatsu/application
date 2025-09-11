package com.crm.system.controller;

import com.crm.system.dto.LessonDto;
import com.crm.system.model.Lesson;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.service.LessonService;
import com.crm.system.service.StudentService;
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
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserService userService;

    @GetMapping("/teachers/{teacherId}/lessons")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<LessonDto>> getTeacherLessons(
            @PathVariable Long teacherId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = endDate != null ? endDate : start.plusWeeks(1);

        List<Lesson> lessons = lessonService.findByTeacherIdAndDateRange(teacherId, start, end);
        List<LessonDto> lessonDtos = lessons.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Pageable pageable = PageRequest.of(page, size);
        Page<LessonDto> lessonPage = new PageImpl<>(lessonDtos, pageable, lessonDtos.size());

        return ResponseEntity.ok(lessonPage);
    }

    @GetMapping("/students/{studentId}/lessons")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<LessonDto>> getStudentLessons(
            @PathVariable Long studentId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Student student = studentService.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = endDate != null ? endDate : start.plusWeeks(1);

        List<Lesson> lessons = lessonService.findByStudentIdAndDateRange(studentId, start, end);
        List<LessonDto> lessonDtos = lessons.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Pageable pageable = PageRequest.of(page, size);
        Page<LessonDto> lessonPage = new PageImpl<>(lessonDtos, pageable, lessonDtos.size());

        return ResponseEntity.ok(lessonPage);
    }

    @GetMapping("/lessons/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LessonDto> getLessonById(@PathVariable Long id) {
        Lesson lesson = lessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
        return ResponseEntity.ok(convertToDto(lesson));
    }

    @PostMapping("/lessons")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LessonDto> createLesson(@Valid @RequestBody LessonDto lessonDto) {
        Student student = studentService.findById(lessonDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + lessonDto.getStudentId()));

        User teacher = userService.findById(lessonDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + lessonDto.getTeacherId()));

        Lesson lesson = new Lesson(student, teacher, lessonDto.getScheduledDate(), lessonDto.getScheduledTime());
        lesson.setDurationMinutes(lessonDto.getDurationMinutes());
        lesson.setNotes(lessonDto.getNotes());

        Lesson savedLesson = lessonService.saveLesson(lesson);
        return ResponseEntity.ok(convertToDto(savedLesson));
    }

    @PutMapping("/lessons/{id}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LessonDto> updateLesson(@PathVariable Long id, @Valid @RequestBody LessonDto lessonDto) {
        Lesson lesson = lessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        Student student = studentService.findById(lessonDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + lessonDto.getStudentId()));

        User teacher = userService.findById(lessonDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + lessonDto.getTeacherId()));

        lesson.setStudent(student);
        lesson.setTeacher(teacher);
        lesson.setScheduledDate(lessonDto.getScheduledDate());
        lesson.setScheduledTime(lessonDto.getScheduledTime());
        lesson.setDurationMinutes(lessonDto.getDurationMinutes());
        lesson.setStatus(lessonDto.getStatus());
        lesson.setNotes(lessonDto.getNotes());
        lesson.setConfirmedByTeacher(lessonDto.getConfirmedByTeacher());

        Lesson updatedLesson = lessonService.updateLesson(lesson);
        return ResponseEntity.ok(convertToDto(updatedLesson));
    }

    @DeleteMapping("/lessons/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        if (!lessonService.findById(id).isPresent()) {
            throw new RuntimeException("Lesson not found with id: " + id);
        }
        lessonService.deleteLesson(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/lessons/{id}/complete")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<LessonDto> completeLesson(@PathVariable Long id) {
        Lesson lesson = lessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        lessonService.completeLesson(lesson);
        return ResponseEntity.ok(convertToDto(lesson));
    }

    @PostMapping("/lessons/{id}/cancel")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LessonDto> cancelLesson(
            @PathVariable Long id,
            @RequestParam String reason,
            @RequestParam Lesson.CancelledBy cancelledBy) {

        Lesson lesson = lessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        lessonService.cancelLesson(lesson, cancelledBy, reason);
        return ResponseEntity.ok(convertToDto(lesson));
    }

    @PostMapping("/lessons/{id}/mark-as-missed")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LessonDto> markLessonAsMissed(@PathVariable Long id) {
        Lesson lesson = lessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        lessonService.markAsMissed(lesson);
        return ResponseEntity.ok(convertToDto(lesson));
    }

    @GetMapping("/teachers/{teacherId}/lessons/scheduled")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<LessonDto>> getScheduledLessonsForTeacher(@PathVariable Long teacherId) {
        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        List<Lesson> lessons = lessonService.findScheduledLessonsByTeacherId(teacherId);
        List<LessonDto> lessonDtos = lessons.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(lessonDtos);
    }

    @GetMapping("/students/{studentId}/lessons/scheduled")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<LessonDto>> getScheduledLessonsForStudent(@PathVariable Long studentId) {
        Student student = studentService.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        List<Lesson> lessons = lessonService.findScheduledLessonsByStudentId(studentId);
        List<LessonDto> lessonDtos = lessons.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(lessonDtos);
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