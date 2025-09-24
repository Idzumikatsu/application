package com.crm.system.controller;

import com.crm.system.dto.MessageDto;
import com.crm.system.dto.UserDto;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class TeacherController {

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    // Manager-level operations for teachers
    @GetMapping("/managers/teachers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<UserDto>> getAllTeachersManager() {
        System.out.println("=== TeacherController: getAllTeachers called ===");
        List<User> teachers = userService.findByRole(UserRole.TEACHER);
        System.out.println("=== TeacherController: Found " + teachers.size() + " teachers ===");
        List<UserDto> teacherDtos = teachers.stream().map(this::convertToDto).collect(Collectors.toList());
        System.out.println("=== TeacherController: Converted to " + teacherDtos.size() + " DTOs ===");
        return ResponseEntity.ok(teacherDtos);
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

        User savedUser = userService.saveUser(user);

        return ResponseEntity.ok(new MessageDto("Teacher created successfully!"));
    }

    @PutMapping("/managers/teachers/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> updateTeacherManager(@PathVariable Long id, @Valid @RequestBody UserDto userDto) {
        User user = userService.getById(id);

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setEmail(userDto.getEmail());
        user.setPhone(userDto.getPhone());
        user.setTelegramUsername(userDto.getTelegramUsername());
        user.setIsActive(userDto.getIsActive());

        userService.updateUser(user);

        return ResponseEntity.ok(new MessageDto("Teacher updated successfully!"));
    }

    @DeleteMapping("/managers/teachers/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTeacherManager(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(new MessageDto("Teacher deleted successfully!"));
    }

    @PostMapping("/managers/teachers/{id}/reset-password")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> resetTeacherPasswordManager(@PathVariable Long id) {
        User user = userService.getById(id);
        // In a real application, you would send an email with a password reset link
        user.setPasswordHash(passwordEncoder.encode("temporary")); // Set temporary password
        userService.updateUser(user);
        return ResponseEntity.ok(new MessageDto("Password reset email sent!"));
    }

    // Teacher self-management endpoints
    @GetMapping("/teachers/me")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<UserDto> getCurrentTeacher(Authentication authentication) {
        String email = authentication.getName();
        User teacher = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found with email: " + email));
        return ResponseEntity.ok(convertToDto(teacher));
    }

    @PutMapping("/teachers/me")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<UserDto> updateCurrentTeacher(Authentication authentication, @Valid @RequestBody UserDto userDto) {
        String email = authentication.getName();
        User teacher = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Teacher not found with email: " + email));

        teacher.setFirstName(userDto.getFirstName());
        teacher.setLastName(userDto.getLastName());
        teacher.setEmail(userDto.getEmail());
        teacher.setPhone(userDto.getPhone());
        teacher.setTelegramUsername(userDto.getTelegramUsername());

        User updatedTeacher = userService.updateUser(teacher);
        return ResponseEntity.ok(convertToDto(updatedTeacher));
    }

    @GetMapping("/teachers/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or (hasRole('TEACHER') and #id == authentication.principal.id)")
    public ResponseEntity<UserDto> getTeacherById(@PathVariable Long id) {
        User teacher = userService.getById(id);
        return ResponseEntity.ok(convertToDto(teacher));
    }

    @GetMapping("/teachers")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<List<UserDto>> getTeachersForTeacher() {
        // Teachers can see a list of other teachers
        List<User> teachers = userService.findByRole(UserRole.TEACHER);
        List<UserDto> teacherDtos = teachers.stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(teacherDtos);
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
}