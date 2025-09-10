package com.crm.system.service;

import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private UserService userService;

    @InjectMocks
    private StudentService studentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateStudent() {
        // Given
        String firstName = "John";
        String lastName = "Doe";
        String email = "john.doe@example.com";
        String phone = "+1234567890";
        String telegramUsername = "johndoe";
        LocalDate dateOfBirth = LocalDate.of(1990, 1, 1);

        Student student = new Student(firstName, lastName, email, phone, telegramUsername, dateOfBirth);
        student.setId(1L);

        when(studentRepository.save(any(Student.class))).thenReturn(student);

        // When
        Student createdStudent = studentService.createStudent(firstName, lastName, email, phone, telegramUsername, dateOfBirth);

        // Then
        assertNotNull(createdStudent);
        assertEquals(firstName, createdStudent.getFirstName());
        assertEquals(lastName, createdStudent.getLastName());
        assertEquals(email, createdStudent.getEmail());
        assertEquals(phone, createdStudent.getPhone());
        assertEquals(telegramUsername, createdStudent.getTelegramUsername());
        assertEquals(dateOfBirth, createdStudent.getDateOfBirth());

        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void testFindById() {
        // Given
        Long studentId = 1L;
        Student student = new Student();
        student.setId(studentId);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));

        // When
        Optional<Student> foundStudent = studentService.findById(studentId);

        // Then
        assertTrue(foundStudent.isPresent());
        assertEquals(studentId, foundStudent.get().getId());

        verify(studentRepository, times(1)).findById(studentId);
    }

    @Test
    void testExistsByEmail() {
        // Given
        String email = "john.doe@example.com";

        when(studentRepository.existsByEmail(email)).thenReturn(true);

        // When
        Boolean exists = studentService.existsByEmail(email);

        // Then
        assertTrue(exists);

        verify(studentRepository, times(1)).existsByEmail(email);
    }

    @Test
    void testAssignTeacherToStudent() {
        // Given
        Long studentId = 1L;
        Long teacherId = 2L;

        Student student = new Student();
        student.setId(studentId);

        User teacher = new User();
        teacher.setId(teacherId);
        teacher.setRole(UserRole.TEACHER);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(userService.findById(teacherId)).thenReturn(Optional.of(teacher));
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        Student updatedStudent = studentService.assignTeacherToStudent(studentId, teacherId);

        // Then
        assertNotNull(updatedStudent);
        assertEquals(teacherId, updatedStudent.getAssignedTeacher().getId());

        verify(studentRepository, times(1)).findById(studentId);
        verify(userService, times(1)).findById(teacherId);
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void testUnassignTeacherFromStudent() {
        // Given
        Long studentId = 1L;

        Student student = new Student();
        student.setId(studentId);
        student.setAssignedTeacher(new User());

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArguments()[0]);

        // When
        Student updatedStudent = studentService.unassignTeacherFromStudent(studentId);

        // Then
        assertNotNull(updatedStudent);
        assertNull(updatedStudent.getAssignedTeacher());

        verify(studentRepository, times(1)).findById(studentId);
        verify(studentRepository, times(1)).save(any(Student.class));
    }
}