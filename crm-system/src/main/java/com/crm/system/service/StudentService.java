package com.crm.system.service;

import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Optional<Student> findById(Long id) {
        return studentRepository.findById(id);
    }

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }

    public Student createStudent(String firstName, String lastName, String email, String phone,
                                 String telegramUsername, java.time.LocalDate dateOfBirth) {
        Student student = new Student(firstName, lastName, email, phone, telegramUsername, dateOfBirth);
        return studentRepository.save(student);
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Page<Student> findAll(Pageable pageable) {
        return studentRepository.findAll(pageable);
    }

    public Student updateStudent(Student student) {
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        studentRepository.deleteById(id);
    }

    public Boolean existsByEmail(String email) {
        return studentRepository.existsByEmail(email);
    }

    public Optional<Student> findByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    public Student findByTelegramChatId(Long chatId) {
        return studentRepository.findByTelegramChatId(chatId);
    }

    public boolean isStudentRegisteredWithTelegram(Long chatId) {
        return studentRepository.existsByTelegramChatId(chatId);
    }

    public List<Student> findByAssignedTeacher(User teacher) {
        return studentRepository.findByAssignedTeacher(teacher);
    }

    public Page<Student> findBySearchTerm(String searchTerm, Pageable pageable) {
        return studentRepository.findBySearchTerm(searchTerm, pageable);
    }

    public Page<Student> findUnassignedStudents(Pageable pageable) {
        return studentRepository.findUnassignedStudents(pageable);
    }
    
    public Student assignTeacherToStudent(Long studentId, Long teacherId) {
        Student student = findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        User teacher = userService.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Teacher not found with id: " + teacherId));
        
        student.setAssignedTeacher(teacher);
        return studentRepository.save(student);
    }
    
    public Student unassignTeacherFromStudent(Long studentId) {
        Student student = findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        student.setAssignedTeacher(null);
        return studentRepository.save(student);
    }
    
    @Autowired
    private UserService userService;
}