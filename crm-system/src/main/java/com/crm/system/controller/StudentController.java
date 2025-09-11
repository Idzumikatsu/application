package com.crm.system.controller;

import com.crm.system.dto.StudentDto;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.service.StudentService;
import com.crm.system.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/managers")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserService userService;

    @GetMapping("/students")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
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
        
        Page<StudentDto> studentDtos = studentPage.map(this::convertToDto);
        return ResponseEntity.ok(studentDtos);
    }

    @GetMapping("/students/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<StudentDto> getStudentById(@PathVariable Long id) {
        Student student = studentService.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));
        return ResponseEntity.ok(convertToDto(student));
    }

    @PostMapping("/students")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<StudentDto> createStudent(@Valid @RequestBody StudentDto studentDto) {
        if (studentService.existsByEmail(studentDto.getEmail())) {
            throw new RuntimeException("Student already exists with email: " + studentDto.getEmail());
        }

        Student student = new Student();
        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setPhone(studentDto.getPhone());
        student.setTelegramUsername(studentDto.getTelegramUsername());
        student.setDateOfBirth(studentDto.getDateOfBirth());

        if (studentDto.getAssignedTeacherId() != null) {
            User teacher = userService.findById(studentDto.getAssignedTeacherId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + studentDto.getAssignedTeacherId()));
            student.setAssignedTeacher(teacher);
        }

        Student savedStudent = studentService.saveStudent(student);
        return ResponseEntity.ok(convertToDto(savedStudent));
    }

    @PutMapping("/students/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<StudentDto> updateStudent(@PathVariable Long id, @Valid @RequestBody StudentDto studentDto) {
        Student student = studentService.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + id));

        student.setFirstName(studentDto.getFirstName());
        student.setLastName(studentDto.getLastName());
        student.setEmail(studentDto.getEmail());
        student.setPhone(studentDto.getPhone());
        student.setTelegramUsername(studentDto.getTelegramUsername());
        student.setDateOfBirth(studentDto.getDateOfBirth());

        if (studentDto.getAssignedTeacherId() != null) {
            User teacher = userService.findById(studentDto.getAssignedTeacherId())
                    .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + studentDto.getAssignedTeacherId()));
            student.setAssignedTeacher(teacher);
        } else {
            student.setAssignedTeacher(null);
        }

        Student updatedStudent = studentService.updateStudent(student);
        return ResponseEntity.ok(convertToDto(updatedStudent));
    }

    @DeleteMapping("/students/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        if (!studentService.findById(id).isPresent()) {
            throw new RuntimeException("Student not found with id: " + id);
        }
        studentService.deleteStudent(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/students/unassigned")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<StudentDto>> getUnassignedStudents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Student> studentPage = studentService.findUnassignedStudents(pageable);
        Page<StudentDto> studentDtos = studentPage.map(this::convertToDto);
        return ResponseEntity.ok(studentDtos);
    }

    @PostMapping("/students/{studentId}/assign-teacher/{teacherId}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<StudentDto> assignTeacherToStudent(@PathVariable Long studentId, @PathVariable Long teacherId) {
        Student student = studentService.assignTeacherToStudent(studentId, teacherId);
        return ResponseEntity.ok(convertToDto(student));
    }

    @DeleteMapping("/students/{studentId}/unassign-teacher")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<StudentDto> unassignTeacherFromStudent(@PathVariable Long studentId) {
        Student student = studentService.unassignTeacherFromStudent(studentId);
        return ResponseEntity.ok(convertToDto(student));
    }

    private StudentDto convertToDto(Student student) {
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
}