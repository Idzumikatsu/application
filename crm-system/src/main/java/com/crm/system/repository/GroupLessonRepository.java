package com.crm.system.repository;

import com.crm.system.model.GroupLesson;
import com.crm.system.model.User;
import com.crm.system.model.GroupLesson.GroupLessonStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface GroupLessonRepository extends JpaRepository<GroupLesson, Long> {
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate = :date " +
           "ORDER BY gl.scheduledTime")
    List<GroupLesson> findByTeacherIdAndDate(
        @Param("teacherId") Long teacherId,
        @Param("date") LocalDate date
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status IN :statuses " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    Page<GroupLesson> findByTeacherIdAndStatusesAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("statuses") List<GroupLessonStatus> statuses,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.status = :status " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    Page<GroupLesson> findByStatusAndFutureDate(
        @Param("status") GroupLessonStatus status,
        Pageable pageable
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.scheduledDate >= :startDate " +
           "AND gl.scheduledDate <= :endDate " +
           "AND gl.status IN :statuses " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findByDateRangeAndStatuses(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("statuses") List<GroupLessonStatus> statuses
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status = 'SCHEDULED' " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findFutureScheduledLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status = 'CONFIRMED' " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findFutureConfirmedLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED') " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findUpcomingLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.status IN :statuses " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    Page<GroupLesson> findByStatusesAndDateRange(
        @Param("statuses") List<GroupLessonStatus> statuses,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    @Query("SELECT COUNT(gl) FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status IN :statuses")
    Long countByTeacherIdAndStatuses(
        @Param("teacherId") Long teacherId,
        @Param("statuses") List<GroupLessonStatus> statuses
    );
    
    @Query("SELECT COUNT(gl) FROM GroupLesson gl WHERE gl.status = :status")
    Long countByStatus(@Param("status") GroupLessonStatus status);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.id = :id AND gl.teacher.id = :teacherId")
    Optional<GroupLesson> findByIdAndTeacherId(@Param("id") Long id, @Param("teacherId") Long teacherId);
    
    List<GroupLesson> findByTeacherAndStatus(User teacher, GroupLessonStatus status);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.maxStudents IS NOT NULL " +
           "AND gl.currentStudents >= gl.maxStudents")
    List<GroupLesson> findFullGroupLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.maxStudents IS NOT NULL " +
           "AND gl.currentStudents < gl.maxStudents")
    List<GroupLesson> findAvailableGroupLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED') " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findFutureAvailableLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "AND gl.status = 'BOOKED' " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findFutureBookedLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED', 'BOOKED') " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findTeacherLessonsByDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate = :date " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED', 'BOOKED') " +
           "ORDER BY gl.scheduledTime")
    List<GroupLesson> findTeacherLessonsByDate(
        @Param("teacherId") Long teacherId,
        @Param("date") LocalDate date
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status = 'CANCELLED' " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findCancelledLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status = 'COMPLETED' " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findCompletedLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status = 'POSTPONED' " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findPostponedLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED', 'BOOKED', 'IN_PROGRESS') " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findActiveLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    Page<GroupLesson> findFutureLessonsByTeacherId(
        @Param("teacherId") Long teacherId,
        Pageable pageable
    );
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate < CURRENT_DATE " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED', 'BOOKED') " +
           "ORDER BY gl.scheduledDate DESC, gl.scheduledTime DESC")
    List<GroupLesson> findPastIncompleteLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate < CURRENT_DATE " +
           "AND gl.status = 'COMPLETED' " +
           "ORDER BY gl.scheduledDate DESC, gl.scheduledTime DESC")
    List<GroupLesson> findPastCompletedLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate < CURRENT_DATE " +
           "AND gl.status = 'CANCELLED' " +
           "ORDER BY gl.scheduledDate DESC, gl.scheduledTime DESC")
    List<GroupLesson> findPastCancelledLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate < CURRENT_DATE " +
           "AND gl.status = 'MISSED' " +
           "ORDER BY gl.scheduledDate DESC, gl.scheduledTime DESC")
    List<GroupLesson> findPastMissedLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate < CURRENT_DATE " +
           "AND gl.status = 'POSTPONED' " +
           "ORDER BY gl.scheduledDate DESC, gl.scheduledTime DESC")
    List<GroupLesson> findPastPostponedLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(gl) FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED', 'BOOKED')")
    Long countFutureActiveLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(gl) FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate < CURRENT_DATE " +
           "AND gl.status = 'COMPLETED'")
    Long countPastCompletedLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(gl) FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "AND gl.status = 'CANCELLED'")
    Long countFutureCancelledLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(gl) FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.maxStudents IS NOT NULL " +
           "AND gl.currentStudents < gl.maxStudents " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED')")
    Long countAvailableSlotsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(gl) FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.maxStudents IS NOT NULL " +
           "AND gl.currentStudents >= gl.maxStudents " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED', 'BOOKED')")
    Long countFullSlotsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT gl FROM GroupLesson gl JOIN gl.registrations r WHERE r.student.id = :studentId " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    Page<GroupLesson> findByStudentIdAndDateRange(
        @Param("studentId") Long studentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    @Query("SELECT gl FROM GroupLesson gl JOIN gl.registrations r WHERE r.student.id = :studentId " +
           "AND gl.status = 'SCHEDULED' " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findScheduledGroupLessonsByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status = 'SCHEDULED' " +
           "AND gl.scheduledDate >= CURRENT_DATE " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findScheduledGroupLessonsByTeacherId(@Param("teacherId") Long teacherId);
    @Query("SELECT gl FROM GroupLesson gl WHERE gl.id = :lessonId")
    Optional<GroupLesson> findByLessonId(@Param("lessonId") Long lessonId);

    @Query("SELECT COUNT(gl) FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.status = 'BOOKED'")
    Long countBookedSlotsByTeacherId(@Param("teacherId") Long teacherId);

    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate = :date " +
           "AND gl.scheduledTime = :time")
    Optional<GroupLesson> findByTeacherIdAndDateTime(
        @Param("teacherId") Long teacherId,
        @Param("date") LocalDate date,
        @Param("time") java.time.LocalTime time
    );

    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED') " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    List<GroupLesson> findAvailableSlotsForTeacherInDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "AND gl.status IN ('SCHEDULED', 'CONFIRMED') " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    Page<GroupLesson> findAvailableSlotsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );

    @Query("SELECT gl FROM GroupLesson gl WHERE gl.teacher.id = :teacherId " +
           "AND gl.scheduledDate >= :startDate AND gl.scheduledDate <= :endDate " +
           "ORDER BY gl.scheduledDate, gl.scheduledTime")
    Page<GroupLesson> findByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
}