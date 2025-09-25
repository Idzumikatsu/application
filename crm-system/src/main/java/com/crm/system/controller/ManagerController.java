package com.crm.system.controller;

import com.crm.system.dto.*;
import com.crm.system.model.*;
import com.crm.system.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/managers")
public class ManagerController {

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/managers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllManagers() {
        List<User> managers = userService.findByRole(UserRole.MANAGER);
        List<UserDto> managerDtos = managers.stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(managerDtos);
    }

    @PostMapping("/managers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createManager(@Valid @RequestBody UserDto userDto) {
        if (userService.existsByEmail(userDto.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageDto("Error: Email is already taken!"));
        }

        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userDto.getEmail())); // Temporary password
        user.setRole(UserRole.MANAGER);
        user.setIsActive(userDto.getIsActive() != null ? userDto.getIsActive() : true);

        User savedUser = userService.saveUser(user);

        return ResponseEntity.ok(new MessageDto("Manager created successfully!"));
    }

    @PutMapping("/managers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateManager(@PathVariable Long id, @Valid @RequestBody UserDto userDto) {
        User user = userService.getById(id);

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());
        user.setTelegramUsername(userDto.getTelegramUsername());
        user.setIsActive(userDto.getIsActive());

        userService.updateUser(user);

        return ResponseEntity.ok(new MessageDto("Manager updated successfully!"));
    }

    @DeleteMapping("/managers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteManager(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new MessageDto("Manager deleted successfully!"));
    }

    @PostMapping("/managers/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resetManagerPassword(@PathVariable Long id) {
        User user = userService.getById(id);
        // In a real application, you would send an email with a password reset link
        user.setPasswordHash(passwordEncoder.encode("temporary")); // Set temporary password
        userService.updateUser(user);
        return ResponseEntity.ok(new MessageDto("Password reset email sent!"));
    }

    //== Endpoints for viewing teacher data ==/
    @Autowired
    private AvailabilitySlotService availabilitySlotService;
    @Autowired
    private CalendarService calendarService;

    @GetMapping("/teachers/{teacherId}/availability")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
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
                .map(this::convertSlotToDto)
                .collect(Collectors.toList());
        Page<AvailabilitySlotDto> dtoPage = new PageImpl<>(slotDtos, pageable, slotPage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/teachers/{teacherId}/calendar")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<CalendarDayDto>> getTeacherCalendar(
            @PathVariable Long teacherId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {
        List<CalendarDayDto> calendar = calendarService.getTeacherCalendar(teacherId, startDate, endDate);
        return ResponseEntity.ok(calendar);
    }

    //== Lesson Management Endpoints for Manager ==/
    @Autowired
    private LessonService lessonService;
    @Autowired
    private StudentService studentService;

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
        return ResponseEntity.ok(convertLessonToDto(savedLesson));
    }

    @PutMapping("/lessons/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
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

        Lesson updatedLesson = lessonService.updateLesson(lesson);
        return ResponseEntity.ok(convertLessonToDto(updatedLesson));
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

    @PostMapping("/lessons/{id}/status")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LessonDto> changeLessonStatus(@PathVariable Long id, @RequestBody LessonStatusUpdateDto statusUpdate) {
        Lesson lesson = lessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
        // This is a simplified example. In a real app, the service would handle the logic
        // of changing status, checking rules, etc.
        lesson.setStatus(statusUpdate.getStatus());
        if (statusUpdate.getStatus() == Lesson.Status.CANCELLED) {
            lesson.setCancellationReason(statusUpdate.getReason());
            lesson.setCancelledBy(Lesson.CancelledBy.MANAGER);
        }
        Lesson updatedLesson = lessonService.updateLesson(lesson);
        return ResponseEntity.ok(convertLessonToDto(updatedLesson));
    }

    private UserDto convertToDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhone());
        userDto.setTelegramUsername(user.getTelegramUsername());
        userDto.setRole(user.getRole().name());
        userDto.setIsActive(user.getIsActive());
        return userDto;
    }

    private AvailabilitySlotDto convertSlotToDto(AvailabilitySlot slot) {
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

    private LessonDto convertLessonToDto(Lesson lesson) {
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