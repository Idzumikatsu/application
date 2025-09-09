package com.crm.system.service;

import com.crm.system.model.LessonPackage;
import com.crm.system.model.Student;
import com.crm.system.repository.LessonPackageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class LessonPackageServiceTest {

    @Mock
    private LessonPackageRepository lessonPackageRepository;

    @InjectMocks
    private LessonPackageService lessonPackageService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateLessonPackage() {
        // Given
        Student student = new Student();
        student.setId(1L);

        Integer totalLessons = 10;

        LessonPackage lessonPackage = new LessonPackage(student, totalLessons);
        lessonPackage.setId(1L);

        when(lessonPackageRepository.save(any(LessonPackage.class))).thenReturn(lessonPackage);

        // When
        LessonPackage createdPackage = lessonPackageService.createLessonPackage(student, totalLessons);

        // Then
        assertNotNull(createdPackage);
        assertEquals(student.getId(), createdPackage.getStudent().getId());
        assertEquals(totalLessons, createdPackage.getTotalLessons());
        assertEquals(totalLessons, createdPackage.getRemainingLessons());
        assertEquals(0, createdPackage.getRemainingLessons().compareTo(totalLessons));

        verify(lessonPackageRepository, times(1)).save(any(LessonPackage.class));
    }

    @Test
    void testFindById() {
        // Given
        Long packageId = 1L;
        LessonPackage lessonPackage = new LessonPackage();
        lessonPackage.setId(packageId);

        when(lessonPackageRepository.findById(packageId)).thenReturn(Optional.of(lessonPackage));

        // When
        Optional<LessonPackage> foundPackage = lessonPackageService.findById(packageId);

        // Then
        assertTrue(foundPackage.isPresent());
        assertEquals(packageId, foundPackage.get().getId());

        verify(lessonPackageRepository, times(1)).findById(packageId);
    }

    @Test
    void testHasEnoughLessons() {
        // Given
        Long studentId = 1L;
        int lessonsNeeded = 5;

        LessonPackage package1 = new LessonPackage();
        package1.setRemainingLessons(3);

        LessonPackage package2 = new LessonPackage();
        package2.setRemainingLessons(4);

        when(lessonPackageRepository.findActivePackagesByStudentId(studentId))
                .thenReturn(Arrays.asList(package1, package2));

        // When
        boolean hasEnough = lessonPackageService.hasEnoughLessons(studentId, lessonsNeeded);

        // Then
        assertTrue(hasEnough);
    }

    @Test
    void testDeductLessonsSuccess() {
        // Given
        Long studentId = 1L;
        int lessonsToDeduct = 5;

        LessonPackage package1 = new LessonPackage();
        package1.setId(1L);
        package1.setRemainingLessons(3);

        LessonPackage package2 = new LessonPackage();
        package2.setId(2L);
        package2.setRemainingLessons(4);

        when(lessonPackageRepository.findActivePackagesByStudentId(studentId))
                .thenReturn(Arrays.asList(package1, package2));
        
        when(lessonPackageRepository.save(any(LessonPackage.class)))
                .thenAnswer(invocation -> invocation.getArguments()[0]);

        // When & Then
        assertDoesNotThrow(() -> lessonPackageService.deductLessons(studentId, lessonsToDeduct));
        
        // Verify deductions
        assertEquals(0, package1.getRemainingLessons().intValue()); // 3 - 3 = 0
        assertEquals(2, package2.getRemainingLessons().intValue()); // 4 - 2 = 2

        verify(lessonPackageRepository, times(2)).save(any(LessonPackage.class));
    }

    @Test
    void testDeductLessonsInsufficientLessons() {
        // Given
        Long studentId = 1L;
        int lessonsToDeduct = 10;

        LessonPackage package1 = new LessonPackage();
        package1.setId(1L);
        package1.setRemainingLessons(3);

        LessonPackage package2 = new LessonPackage();
        package2.setId(2L);
        package2.setRemainingLessons(4);

        when(lessonPackageRepository.findActivePackagesByStudentId(studentId))
                .thenReturn(Arrays.asList(package1, package2));

        // When & Then
        assertThrows(IllegalArgumentException.class, 
                     () -> lessonPackageService.deductLessons(studentId, lessonsToDeduct));
    }
}