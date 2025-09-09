package com.crm.system.controller;

import com.crm.system.dto.MessageDto;
import com.crm.system.dto.UserDto;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
public class TeacherController {

    @Autowired
    UserService userService;

    @Autowired
    PasswordEncoder passwordEncoder;

    @GetMapping("/teachers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<UserDto>> getAllTeachers() {
        List<User> teachers = userService.findByRole(UserRole.TEACHER);
        List<UserDto> teacherDtos = teachers.stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(teacherDtos);
    }

    @PostMapping("/teachers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
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
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> resetTeacherPassword(@PathVariable Long id) {
        User user = userService.findById(id).orElseThrow(() -> new RuntimeException("Teacher not found"));
        // In a real application, you would send an email with a password reset link
        user.setPasswordHash(passwordEncoder.encode("temporary")); // Set temporary password
        userService.updateUser(user);
        return ResponseEntity.ok(new MessageDto("Password reset email sent!"));
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