package com.crm.system.repository;

import com.crm.system.model.Lesson;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    
    @Query("SELECT l FROM Lesson l WHERE l.teacher.id = :teacherId " +
           "AND l.scheduledDate >= :startDate AND l.scheduledDate <= :endDate " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    List<Lesson> findByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT l FROM Lesson l WHERE l.student.id = :studentId " +
           "AND l.scheduledDate >= :startDate AND l.scheduledDate <= :endDate " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    List<Lesson> findByStudentIdAndDateRange(
        @Param("studentId") Long studentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT l FROM Lesson l WHERE l.teacher.id = :teacherId " +
           "AND l.scheduledDate = :date " +
           "ORDER BY l.scheduledTime")
    List<Lesson> findByTeacherIdAndDate(
        @Param("teacherId") Long teacherId,
        @Param("date") LocalDate date
    );
    
    @Query("SELECT l FROM Lesson l WHERE l.student.id = :studentId " +
           "AND l.scheduledDate = :date " +
           "ORDER BY l.scheduledTime")
    List<Lesson> findByStudentIdAndDate(
        @Param("studentId") Long studentId,
        @Param("date") LocalDate date
    );
    
    @Query("SELECT l FROM Lesson l WHERE l.teacher.id = :teacherId " +
           "AND l.status = :status " +
           "AND l.scheduledDate >= CURRENT_DATE " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    Page<Lesson> findFutureLessonsByTeacherIdAndStatus(
        @Param("teacherId") Long teacherId,
        @Param("status") Lesson.LessonStatus status,
        Pageable pageable
    );
    
    @Query("SELECT l FROM Lesson l WHERE l.student.id = :studentId " +
           "AND l.status = :status " +
           "AND l.scheduledDate >= CURRENT_DATE " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    Page<Lesson> findFutureLessonsByStudentIdAndStatus(
        @Param("studentId") Long studentId,
        @Param("status") Lesson.LessonStatus status,
        Pageable pageable
    );
    
    @Query("SELECT l FROM Lesson l WHERE l.teacher.id = :teacherId " +
           "AND l.status IN :statuses " +
           "AND l.scheduledDate >= :startDate AND l.scheduledDate <= :endDate " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    List<Lesson> findByTeacherIdAndStatusesAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("statuses") List<Lesson.LessonStatus> statuses,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT l FROM Lesson l WHERE l.student.id = :studentId " +
           "AND l.status IN :statuses " +
           "AND l.scheduledDate >= :startDate AND l.scheduledDate <= :endDate " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    List<Lesson> findByStudentIdAndStatusesAndDateRange(
        @Param("studentId") Long studentId,
        @Param("statuses") List<Lesson.LessonStatus> statuses,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT l FROM Lesson l WHERE l.teacher.id = :teacherId " +
           "AND l.status = 'SCHEDULED' " +
           "AND l.scheduledDate >= CURRENT_DATE " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    List<Lesson> findScheduledLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT l FROM Lesson l WHERE l.student.id = :studentId " +
           "AND l.status = 'SCHEDULED' " +
           "AND l.scheduledDate >= CURRENT_DATE " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    List<Lesson> findScheduledLessonsByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT l FROM Lesson l WHERE l.teacher.id = :teacherId " +
           "AND l.status = 'COMPLETED' " +
           "AND l.scheduledDate >= :startDate AND l.scheduledDate <= :endDate " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    List<Lesson> findCompletedLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT l FROM Lesson l WHERE l.student.id = :studentId " +
           "AND l.status = 'COMPLETED' " +
           "AND l.scheduledDate >= :startDate AND l.scheduledDate <= :endDate " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    List<Lesson> findCompletedLessonsByStudentIdAndDateRange(
        @Param("studentId") Long studentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.teacher.id = :teacherId " +
           "AND l.status = 'SCHEDULED' " +
           "AND l.scheduledDate >= CURRENT_DATE")
    Long countScheduledLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.student.id = :studentId " +
           "AND l.status = 'SCHEDULED' " +
           "AND l.scheduledDate >= CURRENT_DATE")
    Long countScheduledLessonsByStudentId(@Param("studentId") Long studentId);
    
    List<Lesson> findByTeacherAndStatus(User teacher, Lesson.LessonStatus status);
    
    List<Lesson> findByStudentAndStatus(Student student, Lesson.LessonStatus status);
    
    @Query("SELECT l FROM Lesson l WHERE l.slot.id = :slotId")
    List<Lesson> findBySlotId(@Param("slotId") Long slotId);
    
    @Query("SELECT l FROM Lesson l WHERE l.scheduledDate >= :startDate AND l.scheduledDate <= :endDate " +
           "ORDER BY l.scheduledDate, l.scheduledTime")
    List<Lesson> findByDateRange(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("SELECT l FROM Lesson l WHERE l.scheduledDate = :date " +
           "AND l.status = 'COMPLETED' " +
           "AND l.attendanceConfirmed = false " +
           "AND FUNCTION('TIMESTAMPDIFF', HOUR, l.endTime, :currentTime) BETWEEN 0 AND 24 " +
           "ORDER BY l.scheduledTime")
    List<Lesson> findCompletedLessonsForAttendanceConfirmation(
        @Param("date") LocalDate date,
        @Param("currentTime") java.time.LocalDateTime currentTime
    );
    
    // Added for dashboard statistics
    long countByScheduledDate(LocalDate date);
    
    long countByScheduledDateBetween(LocalDate startDate, LocalDate endDate);
}