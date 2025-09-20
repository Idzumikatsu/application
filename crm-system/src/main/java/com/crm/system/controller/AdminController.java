package com.crm.system.controller;

import com.crm.system.dto.*;
import com.crm.system.model.Lesson;
import com.crm.system.model.LessonPackage;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    UserService userService;

    @Autowired
    StudentService studentService;

    @Autowired
    LessonPackageService lessonPackageService;

    @Autowired
    SystemSettingsService systemSettingsService;

    @Autowired
    NotificationService notificationService;

    @Autowired
    EmailService emailService;

    @Autowired
    NotificationBroadcastService notificationBroadcastService;

    @Autowired
    DashboardService dashboardService;

    @Autowired
    ReportService reportService;

    @Autowired
    LessonService lessonService;

    @Autowired
    PasswordEncoder passwordEncoder;

    // Manager management endpoints
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

    // Teacher management endpoints (duplicated from TeacherController for admin access)
    // Note: These endpoints have been removed to avoid conflicts with TeacherController
    // Admins should use the TeacherController endpoints for teacher management

    // Student management endpoints for admin
    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<StudentDto>> getAllStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Student> studentPage;
        
        if (search != null && !search.isEmpty()) {
            studentPage = studentService.findBySearchTerm(search, pageable);
        } else {
            studentPage = studentService.findAll(pageable);
        }
        
        Page<StudentDto> studentDtos = studentPage.map(this::convertToStudentDto);
        return ResponseEntity.ok(studentDtos);
    }

    @PostMapping("/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createStudent(@Valid @RequestBody StudentDto studentDto) {
        if (studentService.existsByEmail(studentDto.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageDto("Error: Email is already taken!"));
        }

        Student student = new Student();
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setPhone(studentDto.getPhone());
        student.setTelegramUsername(studentDto.getTelegramUsername());
        student.setDateOfBirth(studentDto.getDateOfBirth());
        // Note: Student doesn't have setIsActive method, so we skip it

        Student savedStudent = studentService.saveStudent(student);

        return ResponseEntity.ok(new MessageDto("Student created successfully!"));
    }

    @PutMapping("/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDto studentDto) {
        Student student = studentService.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found"));
        
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setPhone(studentDto.getPhone());
        student.setTelegramUsername(studentDto.getTelegramUsername());
        student.setDateOfBirth(studentDto.getDateOfBirth());
        
        // Note: setIsActive method doesn't exist in Student model, so we'll skip it for now
        
        studentService.updateStudent(student);
        
        return ResponseEntity.ok(new MessageDto("Student updated successfully!"));
    }

    @DeleteMapping("/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(new MessageDto("Student deleted successfully!"));
    }

    @GetMapping("/students/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        Student student = studentService.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return ResponseEntity.ok(convertToStudentDto(student));
    }

    @PostMapping("/students/{studentId}/assign-teacher/{teacherId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDto> assignTeacherToStudent(@PathVariable Long studentId, @PathVariable Long teacherId) {
        Student student = studentService.assignTeacherToStudent(studentId, teacherId);
        return ResponseEntity.ok(convertToStudentDto(student));
    }

    @DeleteMapping("/students/{studentId}/unassign-teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<StudentDto> unassignTeacherFromStudent(@PathVariable Long studentId) {
        Student student = studentService.unassignTeacherFromStudent(studentId);
        return ResponseEntity.ok(convertToStudentDto(student));
    }

    // Lesson management endpoints for admin
    @GetMapping("/lessons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<LessonDto>> getAllLessons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String search) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessonPage = lessonService.getAllLessons(pageable); // Changed from findAllLessons to getAllLessons
        Page<LessonDto> lessonDtos = lessonPage.map(this::convertToLessonDto);
        return ResponseEntity.ok(lessonDtos);
    }

    @PostMapping("/lessons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LessonDto> createLesson(@Valid @RequestBody LessonDto lessonDto) {
        Student student = studentService.findById(lessonDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + lessonDto.getStudentId()));

        User teacher = userService.findById(lessonDto.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + lessonDto.getTeacherId()));

        Lesson lesson = new Lesson(student, teacher, lessonDto.getScheduledDate(), lessonDto.getScheduledTime());
        lesson.setDurationMinutes(lessonDto.getDurationMinutes());
        lesson.setNotes(lessonDto.getNotes());

        Lesson savedLesson = lessonService.saveLesson(lesson);
        return ResponseEntity.ok(convertToLessonDto(savedLesson));
    }

    @PutMapping("/lessons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
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
        return ResponseEntity.ok(convertToLessonDto(updatedLesson));
    }

    @DeleteMapping("/lessons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        if (!lessonService.findById(id).isPresent()) {
            throw new RuntimeException("Lesson not found with id: " + id);
        }
        lessonService.deleteLesson(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/lessons/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<LessonDto> getLessonById(@PathVariable Long id) {
        Lesson lesson = lessonService.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
        return ResponseEntity.ok(convertToLessonDto(lesson));
    }

    // System settings management endpoints
    @GetMapping("/system-settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SystemSettingsDto>> getAllSystemSettings() {
        List<com.crm.system.model.SystemSettings> settings = systemSettingsService.findAll();
        List<SystemSettingsDto> settingsDtos = settings.stream()
                .map(this::convertToSystemSettingsDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(settingsDtos);
    }

    @GetMapping("/system-settings/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSettingsDto> getSystemSettingByKey(@PathVariable String key) {
        com.crm.system.model.SystemSettings setting = systemSettingsService.findBySettingKey(key)
                .orElseThrow(() -> new RuntimeException("System setting not found with key: " + key));
        return ResponseEntity.ok(convertToSystemSettingsDto(setting));
    }

    @PostMapping("/system-settings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSettingsDto> createSystemSetting(@Valid @RequestBody SystemSettingsDto settingDto) {
        com.crm.system.model.SystemSettings setting = systemSettingsService.createSystemSettings(
                settingDto.getSettingKey(), settingDto.getSettingValue(), settingDto.getDescription());
        return ResponseEntity.ok(convertToSystemSettingsDto(setting));
    }

    @PutMapping("/system-settings/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSettingsDto> updateSystemSetting(@PathVariable String key, @Valid @RequestBody SystemSettingsDto settingDto) {
        com.crm.system.model.SystemSettings setting = systemSettingsService.findBySettingKey(key)
                .orElseThrow(() -> new RuntimeException("System setting not found with key: " + key));
        setting.setSettingValue(settingDto.getSettingValue());
        setting.setDescription(settingDto.getDescription());
        com.crm.system.model.SystemSettings updatedSetting = systemSettingsService.updateSystemSettings(setting);
        return ResponseEntity.ok(convertToSystemSettingsDto(updatedSetting));
    }

    @DeleteMapping("/system-settings/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> deleteSystemSetting(@PathVariable String key) {
        systemSettingsService.deleteBySettingKey(key);
        return ResponseEntity.ok(new MessageDto("System setting deleted successfully!"));
    }

    // Broadcast notification endpoints
    @PostMapping("/broadcast-notifications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendBroadcastNotification(@Valid @RequestBody BroadcastNotificationDto notificationDto) {
        notificationBroadcastService.broadcastToRecipientType(
                notificationDto.getRecipientType(),
                notificationDto.getNotificationType(),
                notificationDto.getTitle(),
                notificationDto.getMessage());
        return ResponseEntity.ok(new MessageDto("Broadcast notification sent successfully!"));
    }

    @PostMapping("/broadcast-notifications/filtered")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendFilteredBroadcastNotification(@Valid @RequestBody FilteredBroadcastNotificationDto notificationDto) {
        notificationBroadcastService.broadcastToFilteredRecipients(
                notificationDto.getRecipientIds(),
                notificationDto.getRecipientType(),
                notificationDto.getNotificationType(),
                notificationDto.getTitle(),
                notificationDto.getMessage());
        return ResponseEntity.ok(new MessageDto("Filtered broadcast notification sent successfully!"));
    }

    // Bulk email endpoints
    @PostMapping("/bulk-emails")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendBulkEmail(@Valid @RequestBody BulkEmailDto emailDto) {
        emailService.sendBulkEmail(
                emailDto.getRecipientEmails(),
                emailDto.getSubject(),
                emailDto.getMessage(),
                "System Administrator");
        return ResponseEntity.ok(new MessageDto("Bulk email sent successfully!"));
    }

    // Dashboard endpoints for admin statistics
    @GetMapping("/dashboard/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardDto> getAdminDashboardStats() {
        // Create a comprehensive dashboard DTO with all admin statistics
        AdminDashboardDto dashboardDto = new AdminDashboardDto();
        
        // Set user statistics
        dashboardDto.setTotalStudents(dashboardService.getTotalStudents());
        dashboardDto.setTotalTeachers(dashboardService.getTotalTeachers());
        dashboardDto.setTotalManagers(dashboardService.getTotalManagers());
        dashboardDto.setTotalAdmins(dashboardService.getTotalAdmins());
        dashboardDto.setActiveStudents(dashboardService.getTotalStudents()); // Using getTotalStudents as placeholder
        dashboardDto.setActiveTeachers(dashboardService.getTotalTeachers()); // Using getTotalTeachers as placeholder
        dashboardDto.setActiveManagers(dashboardService.getTotalManagers()); // Using getTotalManagers as placeholder
        dashboardDto.setActiveAdmins(dashboardService.getTotalAdmins()); // Using getTotalAdmins as placeholder
        
        // Set lesson statistics
        dashboardDto.setLessonsToday(0); // Placeholder
        dashboardDto.setLessonsThisWeek(0); // Placeholder
        dashboardDto.setLessonsThisMonth(0); // Placeholder
        dashboardDto.setTotalCompletedLessons(0); // Placeholder
        dashboardDto.setTotalCancelledLessons(0); // Placeholder
        dashboardDto.setTotalMissedLessons(0); // Placeholder
        dashboardDto.setTotalScheduledLessons(0); // Placeholder
        
        // Set lesson package statistics
        dashboardDto.setTotalLessonPackages(0); // Placeholder
        dashboardDto.setActiveLessonPackages(0); // Placeholder
        dashboardDto.setExpiredLessonPackages(0); // Placeholder
        
        // Set rate statistics
        dashboardDto.setLessonCompletionRate(0.0); // Placeholder
        dashboardDto.setLessonCancellationRate(0.0); // Placeholder
        
        // Set other statistics
        dashboardDto.setStudentsWithoutTeacher(0); // Placeholder
        dashboardDto.setPendingNotifications(0); // Placeholder
        dashboardDto.setFailedNotifications(0); // Placeholder
        
        // Set students ending soon
        dashboardDto.setStudentsEndingSoon(new ArrayList<>()); // Placeholder
        
        dashboardDto.setLastUpdated(java.time.LocalDateTime.now());
        
        return ResponseEntity.ok(dashboardDto);
    }

    @GetMapping("/dashboard/students-ending-soon")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<StudentEndingSoonDto>> getStudentsWithEndingPackages() {
        List<StudentEndingSoonDto> studentsEndingSoon = new ArrayList<>(); // Placeholder
        return ResponseEntity.ok(studentsEndingSoon);
    }

    // System overview endpoints
    @GetMapping("/overview")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSystemOverview() {
        // This endpoint will return system-wide statistics
        // For now, return a placeholder - will be enhanced with DashboardService data
        return ResponseEntity.ok(new MessageDto("System overview data - to be implemented with DashboardService"));
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

    private StudentDto convertToStudentDto(Student student) {
        StudentDto studentDto = new StudentDto();
        studentDto.setId(student.getId());
        studentDto.setFirstName(student.getFirstName());
        studentDto.setLastName(student.getLastName());
        studentDto.setEmail(student.getEmail());
        studentDto.setPhone(student.getPhone());
        studentDto.setTelegramUsername(student.getTelegramUsername());
        studentDto.setTelegramChatId(student.getTelegramChatId());
        studentDto.setDateOfBirth(student.getDateOfBirth());
        
        if (student.getAssignedTeacher() != null) {
            studentDto.setAssignedTeacherId(student.getAssignedTeacher().getId());
            studentDto.setAssignedTeacherName(student.getAssignedTeacher().getFirstName() + " " + 
                                            student.getAssignedTeacher().getLastName());
        }
        
        return studentDto;
    }

    private LessonPackageDto convertToLessonPackageDto(LessonPackage lessonPackage) {
        LessonPackageDto dto = new LessonPackageDto();
        dto.setId(lessonPackage.getId());
        dto.setStudentId(lessonPackage.getStudent().getId());
        dto.setStudentName(lessonPackage.getStudent().getFirstName() + " " + 
                          lessonPackage.getStudent().getLastName());
        dto.setTotalLessons(lessonPackage.getTotalLessons());
        dto.setRemainingLessons(lessonPackage.getRemainingLessons());
        dto.setCreatedAt(lessonPackage.getCreatedAt().toString());
        return dto;
    }

    private LessonDto convertToLessonDto(Lesson lesson) {
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

    private SystemSettingsDto convertToSystemSettingsDto(com.crm.system.model.SystemSettings systemSettings) {
        SystemSettingsDto dto = new SystemSettingsDto();
        dto.setId(systemSettings.getId());
        dto.setSettingKey(systemSettings.getSettingKey());
        dto.setSettingValue(systemSettings.getSettingValue());
        dto.setDescription(systemSettings.getDescription());
        dto.setCreatedAt(systemSettings.getCreatedAt());
        dto.setUpdatedAt(systemSettings.getUpdatedAt());
        return dto;
    }

    // DTO classes for request/response bodies
    public static class SystemSettingsDto {
        private Long id;
        private String settingKey;
        private String settingValue;
        private String description;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getSettingKey() { return settingKey; }
        public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

        public String getSettingValue() { return settingValue; }
        public void setSettingValue(String settingValue) { this.settingValue = settingValue; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }

        public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }

    public static class BroadcastNotificationDto {
        private com.crm.system.model.Notification.RecipientType recipientType;
        private com.crm.system.model.Notification.NotificationType notificationType;
        private String title;
        private String message;

        // Getters and setters
        public com.crm.system.model.Notification.RecipientType getRecipientType() { return recipientType; }
        public void setRecipientType(com.crm.system.model.Notification.RecipientType recipientType) { this.recipientType = recipientType; }

        public com.crm.system.model.Notification.NotificationType getNotificationType() { return notificationType; }
        public void setNotificationType(com.crm.system.model.Notification.NotificationType notificationType) { this.notificationType = notificationType; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class FilteredBroadcastNotificationDto {
        private List<Long> recipientIds;
        private com.crm.system.model.Notification.RecipientType recipientType;
        private com.crm.system.model.Notification.NotificationType notificationType;
        private String title;
        private String message;

        // Getters and setters
        public List<Long> getRecipientIds() { return recipientIds; }
        public void setRecipientIds(List<Long> recipientIds) { this.recipientIds = recipientIds; }

        public com.crm.system.model.Notification.RecipientType getRecipientType() { return recipientType; }
        public void setRecipientType(com.crm.system.model.Notification.RecipientType recipientType) { this.recipientType = recipientType; }

        public com.crm.system.model.Notification.NotificationType getNotificationType() { return notificationType; }
        public void setNotificationType(com.crm.system.model.Notification.NotificationType notificationType) { this.notificationType = notificationType; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    // Report endpoints for admin
    @GetMapping("/reports/students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> generateStudentsReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        java.time.LocalDateTime startDateTime = parseDateTime(startDate);
        java.time.LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generateStudentsReport(startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating students report: " + e.getMessage());
        }
    }

    @GetMapping("/reports/teachers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> generateTeachersReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        java.time.LocalDateTime startDateTime = parseDateTime(startDate);
        java.time.LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generateTeachersReport(startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating teachers report: " + e.getMessage());
        }
    }

    @GetMapping("/reports/lessons")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> generateLessonsReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        java.time.LocalDateTime startDateTime = parseDateTime(startDate);
        java.time.LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generateLessonsReport(startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating lessons report: " + e.getMessage());
        }
    }

    private java.time.LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.isEmpty()) {
            return null;
        }
        
        try {
            return java.time.LocalDateTime.parse(dateTimeStr, java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format. Expected ISO_LOCAL_DATE_TIME format.");
        }
    }

    private ResponseEntity<org.springframework.core.io.Resource> createExcelResponse(ExportReportDto exportDto) {
        org.springframework.core.io.ByteArrayResource resource = new org.springframework.core.io.ByteArrayResource(exportDto.getData());
        
        return org.springframework.http.ResponseEntity.ok()
                .contentType(org.springframework.http.MediaType.APPLICATION_OCTET_STREAM)
                .header(org.springframework.http.HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + exportDto.getFileName() + "\"")
                .body(resource);
    }

    public static class BulkEmailDto {
        private List<String> recipientEmails;
        private String subject;
        private String message;

        // Getters and setters
        public List<String> getRecipientEmails() { return recipientEmails; }
        public void setRecipientEmails(List<String> recipientEmails) { this.recipientEmails = recipientEmails; }

        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}