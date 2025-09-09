package com.crm.system.controller;

import com.crm.system.dto.GroupLessonRegistrationDto;
import com.crm.system.dto.BookSlotDto;
import com.crm.system.model.GroupLesson;
import com.crm.system.model.GroupLessonRegistration;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.service.GroupLessonRegistrationService;
import com.crm.system.service.GroupLessonService;
import com.crm.system.service.StudentService;
import com.crm.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class GroupLessonRegistrationController {

    @Autowired
    private GroupLessonRegistrationService groupLessonRegistrationService;

    @Autowired
    private GroupLessonService groupLessonService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserService userService;

    @PostMapping("/bookings")
    @PreAuthorize("hasRole('STUDENT') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<GroupLessonRegistrationDto> bookSlot(@Valid @RequestBody BookSlotDto bookSlotDto) {
        GroupLesson groupLesson = groupLessonService.findById(bookSlotDto.getSlotId())
                .orElseThrow(() -> new RuntimeException("Group lesson not found with id: " + bookSlotDto.getSlotId()));

        Student student = studentService.findById(bookSlotDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + bookSlotDto.getStudentId()));

        // Проверяем, что слот доступен для бронирования
        if (!groupLessonService.isSlotAvailableForBooking(groupLesson.getId())) {
            throw new RuntimeException("Slot is not available for booking");
        }

        // Проверяем, что студент еще не зарегистрирован на этот слот
        if (groupLessonRegistrationService.isSlotBookedByStudent(groupLesson.getId(), student.getId())) {
            throw new RuntimeException("Student is already registered for this slot");
        }

        GroupLessonRegistration registration = groupLessonRegistrationService.bookSlot(groupLesson, student);
        return ResponseEntity.ok(convertToDto(registration));
    }

    @DeleteMapping("/bookings/slots/{slotId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<?> cancelBooking(@PathVariable Long slotId, @RequestParam Long studentId) {
        // Проверяем, что студент зарегистрирован на этот слот
        GroupLessonRegistration registration = groupLessonRegistrationService.findByStudentIdAndGroupLessonId(studentId, slotId)
                .orElseThrow(() -> new RuntimeException("Student is not registered for this slot"));
        
        if (registration.isCancelled()) {
            throw new RuntimeException("Registration is already cancelled");
        }

        groupLessonRegistrationService.cancelBooking(registration.getId(), "Cancelled by user");
        return ResponseEntity.ok().build();
    }

    @GetMapping("/bookings/slots/{slotId}/available")
    @PreAuthorize("hasRole('STUDENT') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Boolean> isSlotAvailableForBooking(@PathVariable Long slotId) {
        boolean isAvailable = groupLessonService.isSlotAvailableForBooking(slotId);
        return ResponseEntity.ok(isAvailable);
    }

    @GetMapping("/bookings/slots/{slotId}/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Boolean> isSlotBookedByStudent(@PathVariable Long slotId, @PathVariable Long studentId) {
        boolean isBooked = groupLessonRegistrationService.isSlotBookedByStudent(slotId, studentId);
        return ResponseEntity.ok(isBooked);
    }

    @GetMapping("/students/{studentId}/registrations")
    @PreAuthorize("hasRole('STUDENT') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<Page<GroupLessonRegistrationDto>> getStudentRegistrations(
            @PathVariable Long studentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        Student student = studentService.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        LocalDate start = startDate != null ? startDate : LocalDate.now();
        LocalDate end = endDate != null ? endDate : start.plusWeeks(1);

        Pageable pageable = PageRequest.of(page, size);
        Page<GroupLessonRegistration> registrationPage = groupLessonRegistrationService.findByStudentIdAndDateRange(
                studentId, start, end, pageable);

        Page<GroupLessonRegistrationDto> registrationDtos = registrationPage.map(this::convertToDto);
        return ResponseEntity.ok(registrationDtos);
    }

    @GetMapping("/group-lessons/{groupLessonId}/registrations/all")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<GroupLessonRegistrationDto>> getAllGroupLessonRegistrations(@PathVariable Long groupLessonId) {
        GroupLesson groupLesson = groupLessonService.findById(groupLessonId)
                .orElseThrow(() -> new RuntimeException("Group lesson not found with id: " + groupLessonId));

        List<GroupLessonRegistration> registrations = groupLessonRegistrationService.findByGroupLessonId(groupLessonId);
        List<GroupLessonRegistrationDto> registrationDtos = registrations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(registrationDtos);
    }

    @GetMapping("/registrations/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<GroupLessonRegistrationDto> getRegistrationById(@PathVariable Long id) {
        GroupLessonRegistration registration = groupLessonRegistrationService.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
        return ResponseEntity.ok(convertToDto(registration));
    }

    @PostMapping("/registrations/{id}/attend")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<GroupLessonRegistrationDto> markRegistrationAsAttended(@PathVariable Long id) {
        GroupLessonRegistration registration = groupLessonRegistrationService.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));

        groupLessonRegistrationService.markAsAttended(registration);
        return ResponseEntity.ok(convertToDto(registration));
    }

    @PostMapping("/registrations/{id}/miss")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<GroupLessonRegistrationDto> markRegistrationAsMissed(@PathVariable Long id) {
        GroupLessonRegistration registration = groupLessonRegistrationService.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));

        groupLessonRegistrationService.markAsMissed(registration);
        return ResponseEntity.ok(convertToDto(registration));
    }

    @PostMapping("/registrations/{id}/cancel")
    @PreAuthorize("hasRole('STUDENT') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<GroupLessonRegistrationDto> cancelRegistration(
            @PathVariable Long id,
            @RequestParam String reason) {

        GroupLessonRegistration registration = groupLessonRegistrationService.findById(id)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));

        groupLessonRegistrationService.cancelRegistration(registration, reason);
        return ResponseEntity.ok(convertToDto(registration));
    }

    @GetMapping("/students/{studentId}/registrations/all")
    @PreAuthorize("hasRole('STUDENT') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<GroupLessonRegistrationDto>> getAllStudentRegistrations(@PathVariable Long studentId) {
        Student student = studentService.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        List<GroupLessonRegistration> registrations = groupLessonRegistrationService.findByStudentId(studentId);
        List<GroupLessonRegistrationDto> registrationDtos = registrations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(registrationDtos);
    }

    @GetMapping("/students/{studentId}/registrations/past")
    @PreAuthorize("hasRole('STUDENT') or hasRole('MANAGER') or hasRole('ADMIN') or hasRole('TEACHER')")
    public ResponseEntity<List<GroupLessonRegistrationDto>> getPastRegistrations(
            @PathVariable Long studentId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        Student student = studentService.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        List<GroupLessonRegistration> registrations = groupLessonRegistrationService.findAttendedLessonsByStudentIdAndDateRange(
                studentId, startDate, endDate);
        List<GroupLessonRegistrationDto> registrationDtos = registrations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(registrationDtos);
    }

    @GetMapping("/teachers/{teacherId}/registrations")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<GroupLessonRegistrationDto>> getTeacherRegistrations(@PathVariable Long teacherId) {
        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));

        List<GroupLessonRegistration> registrations = groupLessonRegistrationService.findByTeacherIdAndDateRange(
                teacherId, LocalDate.now(), LocalDate.now().plusYears(1));
        List<GroupLessonRegistrationDto> registrationDtos = registrations.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(registrationDtos);
    }

    private GroupLessonRegistrationDto convertToDto(GroupLessonRegistration registration) {
        GroupLessonRegistrationDto dto = new GroupLessonRegistrationDto();
        dto.setId(registration.getId());
        dto.setGroupLessonId(registration.getGroupLesson().getId());
        dto.setGroupLessonTopic(registration.getGroupLesson().getLessonTopic());
        dto.setStudentId(registration.getStudent().getId());
        dto.setStudentName(registration.getStudent().getFirstName() + " " + registration.getStudent().getLastName());
        dto.setStudentEmail(registration.getStudent().getEmail());
        dto.setRegistrationStatus(registration.getRegistrationStatus());
        dto.setRegisteredAt(registration.getRegisteredAt());
        dto.setAttended(registration.getAttended());
        dto.setAttendanceConfirmedAt(registration.getAttendanceConfirmedAt());
        dto.setCancellationReason(registration.getCancellationReason());
        if (registration.getCreatedAt() != null) {
            dto.setCreatedAt(registration.getCreatedAt().toString());
        }
        if (registration.getUpdatedAt() != null) {
            dto.setUpdatedAt(registration.getUpdatedAt().toString());
        }
        return dto;
    }
}