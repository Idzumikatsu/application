package com.crm.system.controller;

import com.crm.system.dto.CreateLessonPackageDto;
import com.crm.system.dto.LessonPackageDto;
import com.crm.system.model.LessonPackage;
import com.crm.system.model.Student;
import com.crm.system.service.LessonPackageService;
import com.crm.system.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/managers")
public class LessonPackageController {

    @Autowired
    private LessonPackageService lessonPackageService;

    @Autowired
    private StudentService studentService;

    @GetMapping("/students/{studentId}/lesson-packages")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<LessonPackageDto>> getLessonPackagesByStudent(@PathVariable Long studentId) {
        Student student = studentService.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        
        List<LessonPackage> lessonPackages = lessonPackageService.findByStudentIdOrderByCreatedAtDesc(studentId);
        List<LessonPackageDto> lessonPackageDtos = lessonPackages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(lessonPackageDtos);
    }

    @PostMapping("/lesson-packages")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LessonPackageDto> createLessonPackage(@Valid @RequestBody CreateLessonPackageDto createDto) {
        Student student = studentService.findById(createDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + createDto.getStudentId()));
        
        LessonPackage lessonPackage = lessonPackageService.createLessonPackage(student, createDto.getTotalLessons());
        return ResponseEntity.ok(convertToDto(lessonPackage));
    }

    @PutMapping("/lesson-packages/{id}/deduct")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LessonPackageDto> deductLessons(@PathVariable Long id, @RequestParam int lessons) {
        LessonPackage lessonPackage = lessonPackageService.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson package not found with id: " + id));
        
        lessonPackage.deductLessons(lessons);
        LessonPackage updatedPackage = lessonPackageService.updateLessonPackage(lessonPackage);
        return ResponseEntity.ok(convertToDto(updatedPackage));
    }

    @PutMapping("/lesson-packages/{id}/add")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<LessonPackageDto> addLessons(@PathVariable Long id, @RequestParam int lessons) {
        LessonPackage lessonPackage = lessonPackageService.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson package not found with id: " + id));
        
        lessonPackage.addLessons(lessons);
        LessonPackage updatedPackage = lessonPackageService.updateLessonPackage(lessonPackage);
        return ResponseEntity.ok(convertToDto(updatedPackage));
    }

    @DeleteMapping("/lesson-packages/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteLessonPackage(@PathVariable Long id) {
        if (!lessonPackageService.findById(id).isPresent()) {
            throw new RuntimeException("Lesson package not found with id: " + id);
        }
        lessonPackageService.deleteLessonPackage(id);
        return ResponseEntity.ok().build();
    }

    private LessonPackageDto convertToDto(LessonPackage lessonPackage) {
        LessonPackageDto dto = new LessonPackageDto();
        dto.setId(lessonPackage.getId());
        dto.setStudentId(lessonPackage.getStudent().getId());
        dto.setStudentName(lessonPackage.getStudent().getFirstName() + " " + 
                          lessonPackage.getStudent().getLastName());
        dto.setTotalLessons(lessonPackage.getTotalLessons());
        dto.setRemainingLessons(lessonPackage.getRemainingLessons());
        if (lessonPackage.getCreatedAt() != null) {
            dto.setCreatedAt(lessonPackage.getCreatedAt().toString());
        }
        return dto;
    }
}