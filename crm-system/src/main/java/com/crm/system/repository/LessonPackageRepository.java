package com.crm.system.repository;

import com.crm.system.model.LessonPackage;
import com.crm.system.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LessonPackageRepository extends JpaRepository<LessonPackage, Long> {
    List<LessonPackage> findByStudent(Student student);
    
    @Query("SELECT lp FROM LessonPackage lp WHERE lp.student.id = :studentId ORDER BY lp.createdAt DESC")
    List<LessonPackage> findByStudentIdOrderByCreatedAtDesc(@Param("studentId") Long studentId);
    
    @Query("SELECT lp FROM LessonPackage lp WHERE lp.student.id = :studentId AND lp.remainingLessons > 0")
    List<LessonPackage> findActivePackagesByStudentId(@Param("studentId") Long studentId);

    @Query("SELECT lp FROM LessonPackage lp WHERE lp.remainingLessons <= :threshold AND lp.remainingLessons > 0")
    List<LessonPackage> findByRemainingLessonsLessThanEqualAndRemainingLessonsGreaterThan(@Param("threshold") int threshold);

    @Query("SELECT lp FROM LessonPackage lp WHERE lp.remainingLessons = 0")
    List<LessonPackage> findByRemainingLessons();

    @Query("SELECT lp FROM LessonPackage lp WHERE lp.remainingLessons > 0")
    List<LessonPackage> findByRemainingLessonsGreaterThan(@Param("remainingLessons") int remainingLessons);

    @Query("SELECT lp FROM LessonPackage lp WHERE lp.remainingLessons <= :threshold AND lp.remainingLessons > 0")
    List<LessonPackage> findPackagesWithLowRemainingLessons(@Param("threshold") int threshold);

    @Query("SELECT lp FROM LessonPackage lp WHERE lp.createdAt < :expirationThreshold AND lp.remainingLessons > 0")
    List<LessonPackage> findExpiredPackages(@Param("expirationThreshold") LocalDateTime expirationThreshold);
}