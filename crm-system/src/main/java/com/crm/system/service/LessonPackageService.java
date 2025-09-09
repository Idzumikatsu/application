package com.crm.system.service;

import com.crm.system.model.LessonPackage;
import com.crm.system.model.Student;
import com.crm.system.repository.LessonPackageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LessonPackageService {

    @Autowired
    private LessonPackageRepository lessonPackageRepository;

    public Optional<LessonPackage> findById(Long id) {
        return lessonPackageRepository.findById(id);
    }

    public LessonPackage saveLessonPackage(LessonPackage lessonPackage) {
        return lessonPackageRepository.save(lessonPackage);
    }

    public LessonPackage createLessonPackage(Student student, Integer totalLessons) {
        LessonPackage lessonPackage = new LessonPackage(student, totalLessons);
        return lessonPackageRepository.save(lessonPackage);
    }

    public List<LessonPackage> findByStudent(Student student) {
        return lessonPackageRepository.findByStudent(student);
    }

    public List<LessonPackage> findByStudentIdOrderByCreatedAtDesc(Long studentId) {
        return lessonPackageRepository.findByStudentIdOrderByCreatedAtDesc(studentId);
    }

    public List<LessonPackage> findActivePackagesByStudentId(Long studentId) {
        return lessonPackageRepository.findActivePackagesByStudentId(studentId);
    }

    public LessonPackage updateLessonPackage(LessonPackage lessonPackage) {
        return lessonPackageRepository.save(lessonPackage);
    }

    public void deleteLessonPackage(Long id) {
        lessonPackageRepository.deleteById(id);
    }

    public boolean hasEnoughLessons(Long studentId, int lessonsNeeded) {
        List<LessonPackage> activePackages = findActivePackagesByStudentId(studentId);
        int totalRemaining = activePackages.stream()
                .mapToInt(LessonPackage::getRemainingLessons)
                .sum();
        return totalRemaining >= lessonsNeeded;
    }

    public void deductLessons(Long studentId, int lessonsToDeduct) {
        List<LessonPackage> activePackages = findActivePackagesByStudentId(studentId);
        int remainingToDeduct = lessonsToDeduct;
        
        for (LessonPackage pkg : activePackages) {
            if (remainingToDeduct <= 0) break;
            
            int availableInPackage = pkg.getRemainingLessons();
            if (availableInPackage > 0) {
                int deductFromThisPackage = Math.min(availableInPackage, remainingToDeduct);
                pkg.deductLessons(deductFromThisPackage);
                lessonPackageRepository.save(pkg);
                remainingToDeduct -= deductFromThisPackage;
            }
        }
        
        if (remainingToDeduct > 0) {
            throw new IllegalArgumentException("Not enough lessons available for deduction");
        }
    }

    public List<LessonPackage> findPackagesWithLowRemainingLessons(int threshold) {
        return lessonPackageRepository.findPackagesWithLowRemainingLessons(threshold);
    }

    public List<LessonPackage> findExpiredPackages() {
        return lessonPackageRepository.findExpiredPackages(LocalDateTime.now());
    }

    public List<LessonPackage> findAllActivePackages() {
        return lessonPackageRepository.findByRemainingLessonsGreaterThan(0);
    }
}