package com.crm.system.controller;

import com.crm.system.dto.LessonPackageDto;
import com.crm.system.dto.MessageDto;
import com.crm.system.dto.StudentDto;
import com.crm.system.dto.UserDto;
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
    public ResponseEntity<?> createManager(@RequestBody UserDto userDto) {
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
    public ResponseEntity<?> updateManager(@PathVariable Long id, @RequestBody UserDto userDto) {
        User user = userService.findById(id).orElseThrow(() -> new RuntimeException("Manager not found"));

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
        User user = userService.findById(id).orElseThrow(() -> new RuntimeException("Manager not found"));
        // In a real application, you would send an email with a password reset link
        user.setPasswordHash(passwordEncoder.encode("temporary")); // Set temporary password
        userService.updateUser(user);
        return ResponseEntity.ok(new MessageDto("Password reset email sent!"));
    }

    // Teacher management endpoints (duplicated from TeacherController for admin access)
    @GetMapping("/teachers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDto>> getAllTeachers() {
        System.out.println("=== AdminController: getAllTeachers called ===");
        List<User> teachers = userService.findByRole(UserRole.TEACHER);
        System.out.println("=== AdminController: Found " + teachers.size() + " teachers ===");
        List<UserDto> teacherDtos = teachers.stream().map(this::convertToDto).collect(Collectors.toList());
        System.out.println("=== AdminController: Converted to " + teacherDtos.size() + " DTOs ===");
        return ResponseEntity.ok(teacherDtos);
    }

    @PostMapping("/teachers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTeacher(@RequestBody UserDto userDto) {
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

        User savedUser = userService.saveUser(user);

        return ResponseEntity.ok(new MessageDto("Teacher created successfully!"));
    }

    @PutMapping("/teachers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateTeacher(@PathVariable Long id, @RequestBody UserDto userDto) {
        User user = userService.findById(id).orElseThrow(() -> new RuntimeException("Teacher not found"));

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());
        user.setTelegramUsername(userDto.getTelegramUsername());
        user.setIsActive(userDto.getIsActive());

        userService.updateUser(user);

        return ResponseEntity.ok(new MessageDto("Teacher updated successfully!"));
    }

    @DeleteMapping("/teachers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTeacher(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new MessageDto("Teacher deleted successfully!"));
    }

    @PostMapping("/teachers/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> resetTeacherPassword(@PathVariable Long id) {
        User user = userService.findById(id).orElseThrow(() -> new RuntimeException("Teacher not found"));
        // In a real application, you would send an email with a password reset link
        user.setPasswordHash(passwordEncoder.encode("temporary")); // Set temporary password
        userService.updateUser(user);
        return ResponseEntity.ok(new MessageDto("Password reset email sent!"));
    }

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

    // Lesson package management endpoints for admin
    @GetMapping("/students/{studentId}/lesson-packages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<LessonPackageDto>> getStudentLessonPackages(@PathVariable Long studentId) {
        List<LessonPackage> lessonPackages = lessonPackageService.findByStudentIdOrderByCreatedAtDesc(studentId);
        List<LessonPackageDto> lessonPackageDtos = lessonPackages.stream()
                .map(this::convertToLessonPackageDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(lessonPackageDtos);
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
    public ResponseEntity<SystemSettingsDto> createSystemSetting(@RequestBody SystemSettingsDto settingDto) {
        com.crm.system.model.SystemSettings setting = systemSettingsService.createSystemSettings(
                settingDto.getSettingKey(), settingDto.getSettingValue(), settingDto.getDescription());
        return ResponseEntity.ok(convertToSystemSettingsDto(setting));
    }

    @PutMapping("/system-settings/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSettingsDto> updateSystemSetting(@PathVariable String key, @RequestBody SystemSettingsDto settingDto) {
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
    public ResponseEntity<MessageDto> sendBroadcastNotification(@RequestBody BroadcastNotificationDto notificationDto) {
        notificationBroadcastService.broadcastToRecipientType(
                notificationDto.getRecipientType(),
                notificationDto.getNotificationType(),
                notificationDto.getTitle(),
                notificationDto.getMessage());
        return ResponseEntity.ok(new MessageDto("Broadcast notification sent successfully!"));
    }

    @PostMapping("/broadcast-notifications/filtered")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendFilteredBroadcastNotification(@RequestBody FilteredBroadcastNotificationDto notificationDto) {
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
    public ResponseEntity<MessageDto> sendBulkEmail(@RequestBody BulkEmailDto emailDto) {
        emailService.sendBulkEmail(
                emailDto.getRecipientEmails(),
                emailDto.getSubject(),
                emailDto.getMessage(),
                "System Administrator");
        return ResponseEntity.ok(new MessageDto("Bulk email sent successfully!"));
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