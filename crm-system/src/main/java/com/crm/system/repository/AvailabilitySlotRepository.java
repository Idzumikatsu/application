package com.crm.system.repository;

import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.User;
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
public interface AvailabilitySlotRepository extends JpaRepository<AvailabilitySlot, Long> {
    
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.teacher.id = :teacherId " +
           "AND a.slotDate >= :startDate AND a.slotDate <= :endDate " +
           "ORDER BY a.slotDate, a.slotTime")
    List<AvailabilitySlot> findByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.teacher.id = :teacherId " +
           "AND a.slotDate = :date " +
           "ORDER BY a.slotTime")
    List<AvailabilitySlot> findByTeacherIdAndDate(
        @Param("teacherId") Long teacherId,
        @Param("date") LocalDate date
    );
    
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.teacher.id = :teacherId " +
           "AND a.status = 'AVAILABLE' " +
           "AND a.slotDate >= :startDate AND a.slotDate <= :endDate " +
           "ORDER BY a.slotDate, a.slotTime")
    Page<AvailabilitySlot> findAvailableSlotsByTeacherIdAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        Pageable pageable
    );
    
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.teacher.id = :teacherId " +
           "AND a.status IN :statuses " +
           "AND a.slotDate >= :startDate AND a.slotDate <= :endDate " +
           "ORDER BY a.slotDate, a.slotTime")
    List<AvailabilitySlot> findByTeacherIdAndStatusesAndDateRange(
        @Param("teacherId") Long teacherId,
        @Param("statuses") List<AvailabilitySlot.SlotStatus> statuses,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.teacher.id = :teacherId " +
           "AND a.status = 'AVAILABLE' " +
           "AND a.slotDate >= CURRENT_DATE " +
           "ORDER BY a.slotDate, a.slotTime")
    List<AvailabilitySlot> findFutureAvailableSlotsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.teacher.id = :teacherId " +
           "AND a.status = 'BOOKED' " +
           "AND a.slotDate >= CURRENT_DATE " +
           "ORDER BY a.slotDate, a.slotTime")
    List<AvailabilitySlot> findFutureBookedSlotsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(a) FROM AvailabilitySlot a WHERE a.teacher.id = :teacherId " +
           "AND a.status = 'AVAILABLE' " +
           "AND a.slotDate >= CURRENT_DATE")
    Long countAvailableSlotsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT COUNT(a) FROM AvailabilitySlot a WHERE a.teacher.id = :teacherId " +
           "AND a.status = 'BOOKED' " +
           "AND a.slotDate >= CURRENT_DATE")
    Long countBookedSlotsByTeacherId(@Param("teacherId") Long teacherId);
    
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.teacher.id = :teacherId " +
           "AND a.slotDate = :date AND a.slotTime = :time")
    Optional<AvailabilitySlot> findByTeacherIdAndDateTime(
        @Param("teacherId") Long teacherId,
        @Param("date") LocalDate date,
        @Param("time") LocalTime time
    );
    
    List<AvailabilitySlot> findByTeacherAndStatus(User teacher, AvailabilitySlot.SlotStatus status);
    
    @Query("SELECT a FROM AvailabilitySlot a WHERE a.teacher.id = :teacherId " +
           "AND a.slotDate >= :startDate AND a.slotDate <= :endDate " +
           "AND a.status = 'AVAILABLE'")
    List<AvailabilitySlot> findAvailableSlotsForTeacherInDateRange(
        @Param("teacherId") Long teacherId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}