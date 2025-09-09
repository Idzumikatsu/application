package com.crm.system.repository;

import com.crm.system.model.GroupLesson;
import com.crm.system.model.GroupLessonRegistration;
import com.crm.system.model.Student;
import com.crm.system.model.GroupLessonRegistration.RegistrationStatus;
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
public interface GroupLessonRegistrationRepository extends JpaRepository<GroupLessonRegistration, Long> {
    
    List<GroupLessonRegistration> findByStudentId(Long studentId);
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findByStudentIdAndDateRange(
        @Param("studentId") Long studentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.scheduledDate = :date " +
           "ORDER BY glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findByStudentIdAndDate(
        @Param("studentId") Long studentId,
        @Param("date") LocalDate date
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.registrationStatus IN :statuses " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    Page<GroupLessonRegistration> findByStudentIdAndStatusesAndDateRange(
        @Param("studentId") Long studentId,
        @Param("statuses") List<RegistrationStatus> statuses,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.id = :groupLessonId " +
           "ORDER BY glr.registeredAt")
    List<GroupLessonRegistration> findByGroupLessonId(@Param("groupLessonId") Long groupLessonId);
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.id = :groupLessonId " +
           "AND glr.registrationStatus IN :statuses " +
           "ORDER BY glr.registeredAt")
    List<GroupLessonRegistration> findByGroupLessonIdAndStatuses(
        @Param("groupLessonId") Long groupLessonId,
        @Param("statuses") List<RegistrationStatus> statuses
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.id = :groupLessonId")
    Optional<GroupLessonRegistration> findByStudentIdAndGroupLessonId(
        @Param("studentId") Long studentId,
        @Param("groupLessonId") Long groupLessonId
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.status IN :lessonStatuses " +
           "AND glr.registrationStatus IN :registrationStatuses " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    Page<GroupLessonRegistration> findByStudentIdAndLessonStatusesAndRegistrationStatusesAndDateRange(
        @Param("studentId") Long studentId,
        @Param("lessonStatuses") List<com.crm.system.model.GroupLesson.GroupLessonStatus> lessonStatuses,
        @Param("registrationStatuses") List<RegistrationStatus> registrationStatuses,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.registrationStatus = 'REGISTERED' " +
           "AND glr.groupLesson.scheduledDate >= CURRENT_DATE " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findFutureRegisteredLessonsByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.registrationStatus = 'ATTENDED' " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findAttendedLessonsByStudentIdAndDateRange(
        @Param("studentId") Long studentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT COUNT(glr) FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.registrationStatus = :status")
    Long countByStudentIdAndRegistrationStatus(
        @Param("studentId") Long studentId,
        @Param("status") RegistrationStatus status
    );
    
    @Query("SELECT COUNT(glr) FROM GroupLessonRegistration glr WHERE glr.groupLesson.id = :groupLessonId " +
           "AND glr.registrationStatus = 'REGISTERED'")
    Long countRegisteredStudentsByGroupLessonId(@Param("groupLessonId") Long groupLessonId);
    
    @Query("SELECT COUNT(glr) FROM GroupLessonRegistration glr WHERE glr.groupLesson.id = :groupLessonId " +
           "AND glr.registrationStatus IN :statuses")
    Long countByGroupLessonIdAndRegistrationStatuses(
        @Param("groupLessonId") Long groupLessonId,
        @Param("statuses") List<RegistrationStatus> statuses
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.scheduledDate >= CURRENT_DATE " +
           "AND glr.groupLesson.scheduledDate <= :endDate " +
           "AND glr.registrationStatus IN :statuses " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    Page<GroupLessonRegistration> findUpcomingRegistrationsByStudentIdAndStatuses(
        @Param("studentId") Long studentId,
        @Param("endDate") LocalDate endDate,
        @Param("statuses") List<RegistrationStatus> statuses,
        Pageable pageable
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.scheduledDate >= CURRENT_DATE " +
           "AND glr.groupLesson.scheduledDate <= :endDate " +
           "AND glr.registrationStatus = 'REGISTERED' " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findUpcomingRegisteredLessonsByStudentIdAndDateRange(
        @Param("studentId") Long studentId,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= CURRENT_DATE " +
           "AND glr.groupLesson.scheduledDate <= :endDate " +
           "AND glr.registrationStatus = 'REGISTERED' " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findUpcomingRegisteredLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "AND glr.registrationStatus IN :statuses " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    Page<GroupLessonRegistration> findRegistrationsByTeacherIdAndStatusesAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("statuses") List<RegistrationStatus> statuses,
        Pageable pageable
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "AND glr.registrationStatus = 'REGISTERED' " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findRegisteredLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "AND glr.registrationStatus = 'ATTENDED' " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findAttendedLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "AND glr.registrationStatus = 'MISSED' " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findMissedLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "AND glr.registrationStatus = 'CANCELLED' " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findCancelledLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= CURRENT_DATE " +
           "AND glr.registrationStatus = 'REGISTERED' " +
           "AND glr.groupLesson.maxStudents IS NOT NULL " +
           "AND glr.groupLesson.currentStudents >= glr.groupLesson.maxStudents " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findRegistrationsForFullGroupLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= CURRENT_DATE " +
           "AND glr.registrationStatus = 'REGISTERED' " +
           "AND glr.groupLesson.maxStudents IS NOT NULL " +
           "AND glr.groupLesson.currentStudents < glr.groupLesson.maxStudents " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findRegistrationsForAvailableGroupLessonsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= CURRENT_DATE " +
           "AND glr.registrationStatus IN ('REGISTERED', 'ATTENDED') " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findActiveRegistrationsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.scheduledDate >= CURRENT_DATE " +
           "AND glr.registrationStatus IN ('REGISTERED', 'ATTENDED') " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findActiveRegistrationsByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate < CURRENT_DATE " +
           "AND glr.registrationStatus = 'REGISTERED' " +
           "ORDER BY glr.groupLesson.scheduledDate DESC, glr.groupLesson.scheduledTime DESC")
    List<GroupLessonRegistration> findPastUncompletedRegistrationsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.scheduledDate < CURRENT_DATE " +
           "AND glr.registrationStatus = 'REGISTERED' " +
           "ORDER BY glr.groupLesson.scheduledDate DESC, glr.groupLesson.scheduledTime DESC")
    List<GroupLessonRegistration> findPastUncompletedRegistrationsByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "AND glr.groupLesson.status IN ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS') " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findRegistrationsForActiveLessonsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "AND glr.groupLesson.status IN ('SCHEDULED', 'CONFIRMED', 'IN_PROGRESS') " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findRegistrationsForActiveLessonsByStudentIdAndDateRange(
        @Param("studentId") Long studentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.id = :groupLessonId " +
           "AND glr.student.id = :studentId " +
           "AND glr.registrationStatus = 'REGISTERED'")
    Optional<GroupLessonRegistration> findActiveRegistrationByGroupLessonIdAndStudentId(
        @Param("groupLessonId") Long groupLessonId,
        @Param("studentId") Long studentId
    );
    
    List<GroupLessonRegistration> findByGroupLessonAndRegistrationStatus(
        GroupLesson groupLesson, 
        RegistrationStatus registrationStatus
    );
    
    List<GroupLessonRegistration> findByStudentAndRegistrationStatus(
        Student student, 
        RegistrationStatus registrationStatus
    );
    
    @Query("SELECT glr FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= :startDate AND glr.groupLesson.scheduledDate <= :endDate " +
           "ORDER BY glr.groupLesson.scheduledDate, glr.groupLesson.scheduledTime")
    List<GroupLessonRegistration> findByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT COUNT(glr) FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate >= CURRENT_DATE " +
           "AND glr.registrationStatus = 'REGISTERED'")
    Long countActiveRegistrationsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(glr) FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.scheduledDate >= CURRENT_DATE " +
           "AND glr.registrationStatus = 'REGISTERED'")
    Long countActiveRegistrationsByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(glr) FROM GroupLessonRegistration glr WHERE glr.groupLesson.teacher.id = :teacherId " +
           "AND glr.groupLesson.scheduledDate < CURRENT_DATE " +
           "AND glr.registrationStatus = 'REGISTERED'")
    Long countPastUncompletedRegistrationsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(glr) FROM GroupLessonRegistration glr WHERE glr.student.id = :studentId " +
           "AND glr.groupLesson.scheduledDate < CURRENT_DATE " +
           "AND glr.registrationStatus = 'REGISTERED'")
    Long countPastUncompletedRegistrationsByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT COUNT(glr) FROM GroupLessonRegistration glr WHERE glr.groupLesson.id = :groupLessonId " +
           "AND glr.registrationStatus = 'REGISTERED'")
    Long countRegisteredStudentsByGroupLessonIdIncludingWaitingList(@Param("groupLessonId") Long groupLessonId);
    
    @Query("SELECT COUNT(glr) FROM GroupLessonRegistration glr WHERE glr.groupLesson.id = :groupLessonId " +
           "AND glr.registrationStatus IN ('REGISTERED', 'ATTENDED')")
    Long countActiveRegistrationsByGroupLessonId(@Param("groupLessonId") Long groupLessonId);
}