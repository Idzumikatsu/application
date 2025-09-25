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
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class TeacherController {

    @Autowired
    UserService userService;
    @Autowired
    PasswordEncoder passwordEncoder;
    @Autowired
    private AvailabilitySlotService availabilitySlotService;
    @Autowired
    private CalendarService calendarService;
    @Autowired
    private LessonService lessonService;
    @Autowired
    private StudentService studentService;
    @Autowired
    private TeacherNoteService teacherNoteService;


    // Manager-level operations for teachers
    @GetMapping("/managers/teachers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<UserDto>> getAllTeachersManager() {
        List<User> teachers = userService.findByRole(UserRole.TEACHER);
        return ResponseEntity.ok(teachers.stream().map(this::convertToUserDto).collect(Collectors.toList()));
    }

    @PostMapping("/managers/teachers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> createTeacherManager(@Valid @RequestBody UserDto userDto) {
        if (userService.existsByEmail(userDto.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageDto("Error: Email is already taken!"));
        }
        User user = new User();
        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userDto.getEmail())); // Temporary password
        user.setRole(UserRole.TEACHER);
        user.setIsActive(userDto.getIsActive() != null ? userDto.getIsActive() : true);
        user.setPhone(userDto.getPhone());
        user.setTelegramUsername(userDto.getTelegramUsername());
        userService.saveUser(user);
        return ResponseEntity.ok(new MessageDto("Teacher created successfully!"));
    }

    // Teacher self-management endpoints
    @GetMapping("/teachers/me")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<UserDto> getCurrentTeacher(Authentication authentication) {
        User teacher = getCurrentUser(authentication);
        return ResponseEntity.ok(convertToUserDto(teacher));
    }

    //== Availability Endpoints for Teacher ==/
    @GetMapping("/teachers/me/availability")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<Page<AvailabilitySlotDto>> getMyAvailabilitySlots(Authentication authentication, Pageable pageable) {
        User teacher = getCurrentUser(authentication);
        Page<AvailabilitySlot> slotPage = availabilitySlotService.findAvailableSlotsByTeacherIdAndDateRange(teacher.getId(), LocalDate.now(), null, pageable);
        return ResponseEntity.ok(slotPage.map(this::convertSlotToDto));
    }

    @PostMapping("/teachers/me/availability")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<AvailabilitySlotDto> createMyAvailabilitySlot(Authentication authentication, @Valid @RequestBody CreateAvailabilitySlotDto createDto) {
        User teacher = getCurrentUser(authentication);
        AvailabilitySlot slot = availabilitySlotService.createAvailabilitySlot(teacher, createDto.getSlotDate(), createDto.getSlotTime(), createDto.getDurationMinutes());
        return ResponseEntity.ok(convertSlotToDto(slot));
    }

    @DeleteMapping("/teachers/me/availability/{slotId}")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> deleteMyAvailabilitySlot(Authentication authentication, @PathVariable Long slotId) {
        User teacher = getCurrentUser(authentication);
        AvailabilitySlot slot = availabilitySlotService.findById(slotId).orElseThrow(() -> new RuntimeException("Slot not found"));
        if (!slot.getTeacher().getId().equals(teacher.getId())) {
            return ResponseEntity.status(403).body(new MessageDto("Forbidden"));
        }
        if (slot.getIsBooked()) {
            return ResponseEntity.badRequest().body(new MessageDto("Cannot delete a booked slot."));
        }
        availabilitySlotService.deleteAvailabilitySlot(slotId);
        return ResponseEntity.ok().build();
    }

    //== Calendar Endpoint for Teacher ==/
    @GetMapping("/teachers/me/calendar")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<CalendarDayDto>> getMyCalendar(Authentication authentication, @RequestParam LocalDate startDate, @RequestParam LocalDate endDate) {
        User teacher = getCurrentUser(authentication);
        List<CalendarDayDto> calendar = calendarService.getTeacherCalendar(teacher.getId(), startDate, endDate);
        return ResponseEntity.ok(calendar);
    }

    //== Lesson and Student Management for Teacher ==/
    @GetMapping("/teachers/me/lessons")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<LessonDto>> getMyScheduledLessons(Authentication authentication) {
        User teacher = getCurrentUser(authentication);
        List<Lesson> lessons = lessonService.findScheduledLessonsByTeacherId(teacher.getId());
        return ResponseEntity.ok(lessons.stream().map(this::convertLessonToDto).collect(Collectors.toList()));
    }

    @PostMapping("/teachers/me/lessons/{lessonId}/confirm")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> confirmLesson(Authentication authentication, @PathVariable Long lessonId) {
        User teacher = getCurrentUser(authentication);
        Lesson lesson = lessonService.findById(lessonId).orElseThrow(() -> new RuntimeException("Lesson not found"));
        if (!lesson.getTeacher().getId().equals(teacher.getId())) {
            return ResponseEntity.status(403).body(new MessageDto("Forbidden"));
        }
        lessonService.completeLesson(lesson);
        return ResponseEntity.ok(new MessageDto("Lesson confirmed successfully."));
    }

    @PostMapping("/teachers/me/lessons/{lessonId}/request-reschedule")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> requestReschedule(Authentication authentication, @PathVariable Long lessonId, @RequestBody RescheduleRequestDto requestDto) {
        User teacher = getCurrentUser(authentication);
        Lesson lesson = lessonService.findById(lessonId).orElseThrow(() -> new RuntimeException("Lesson not found"));
        if (!lesson.getTeacher().getId().equals(teacher.getId())) {
            return ResponseEntity.status(403).body(new MessageDto("Forbidden"));
        }
        // Here you would typically trigger a notification to the manager
        // For now, we just log it or save a state
        System.out.println("Teacher " + teacher.getLastName() + " requested reschedule for lesson " + lessonId + ". Reason: " + requestDto.getReason());
        return ResponseEntity.ok(new MessageDto("Reschedule request sent to manager."));
    }

    @GetMapping("/teachers/me/students")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<StudentDto>> getMyStudents(Authentication authentication) {
        User teacher = getCurrentUser(authentication);
        List<Student> students = studentService.findByAssignedTeacher(teacher);
        return ResponseEntity.ok(students.stream().map(this::convertStudentToDto).collect(Collectors.toList()));
    }

    @PostMapping("/teachers/me/students/{studentId}/notes")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<TeacherNoteDto> addNoteToStudent(Authentication authentication, @PathVariable Long studentId, @RequestBody NoteDto noteDto) {
        User teacher = getCurrentUser(authentication);
        Student student = studentService.findById(studentId).orElseThrow(() -> new RuntimeException("Student not found"));
        // Add check to ensure student is assigned to this teacher
        TeacherNote note = teacherNoteService.addNote(teacher, student, noteDto.getNote());
        return ResponseEntity.ok(convertNoteToDto(note));
    }

    @GetMapping("/teachers/me/students/{studentId}/notes")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<TeacherNoteDto>> getNotesForStudent(Authentication authentication, @PathVariable Long studentId) {
        User teacher = getCurrentUser(authentication);
        List<TeacherNote> notes = teacherNoteService.getNotesByTeacherAndStudent(teacher.getId(), studentId);
        return ResponseEntity.ok(notes.stream().map(this::convertNoteToDto).collect(Collectors.toList()));
    }

    //== Helper Methods ==/
    private User getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private UserDto convertToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhone(user.getPhone());
        dto.setTelegramUsername(user.getTelegramUsername());
        dto.setRole(user.getRole() != null ? user.getRole().toString() : null);
        dto.setIsActive(user.getIsActive());
        return dto;
    }
    
    private AvailabilitySlotDto convertSlotToDto(AvailabilitySlot slot) {
        AvailabilitySlotDto dto = new AvailabilitySlotDto();
        dto.setId(slot.getId());
        dto.setSlotDate(slot.getSlotDate());
        dto.setSlotTime(slot.getSlotTime());
        dto.setDurationMinutes(slot.getDurationMinutes());
        dto.setIsBooked(slot.getIsBooked());
        return dto;
    }
    
    private LessonDto convertLessonToDto(Lesson lesson) {
        LessonDto dto = new LessonDto();
        dto.setId(lesson.getId());
        dto.setStudentId(lesson.getStudent().getId());
        dto.setTeacherId(lesson.getTeacher().getId());
        dto.setScheduledDate(lesson.getScheduledDate());
        dto.setScheduledTime(lesson.getScheduledTime());
        dto.setStatus(lesson.getStatus());
        dto.setDurationMinutes(lesson.getDurationMinutes());
        dto.setCancellationReason(lesson.getCancellationReason());
        dto.setCancelledBy(lesson.getCancelledBy());
        dto.setNotes(lesson.getNotes());
        dto.setConfirmedByTeacher(lesson.getConfirmedByTeacher());
        return dto;
    }
    
    private StudentDto convertStudentToDto(Student student) {
        StudentDto dto = new StudentDto();
        dto.setId(student.getId());
        dto.setFirstName(student.getFirstName());
        dto.setLastName(student.getLastName());
        dto.setEmail(student.getEmail());
        dto.setPhone(student.getPhone());
        dto.setTelegramUsername(student.getTelegramUsername());
        dto.setAssignedTeacherId(student.getAssignedTeacher() != null ? student.getAssignedTeacher().getId() : null);
        return dto;
    }
    
    private TeacherNoteDto convertNoteToDto(TeacherNote note) {
        TeacherNoteDto dto = new TeacherNoteDto();
        dto.setId(note.getId());
        dto.setTeacherId(note.getTeacher().getId());
        dto.setStudentId(note.getStudent().getId());
        dto.setNote(note.getNote());
        dto.setCreatedAt(note.getCreatedAt());
        dto.setUpdatedAt(note.getUpdatedAt());
        return dto;
    }
}