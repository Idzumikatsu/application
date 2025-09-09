package com.crm.system.service;

import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.User;
import com.crm.system.repository.AvailabilitySlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class AvailabilitySlotService {

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    public Optional<AvailabilitySlot> findById(Long id) {
        return availabilitySlotRepository.findById(id);
    }

    public AvailabilitySlot saveAvailabilitySlot(AvailabilitySlot slot) {
        return availabilitySlotRepository.save(slot);
    }

    public AvailabilitySlot createAvailabilitySlot(User teacher, LocalDate date, LocalTime time) {
        AvailabilitySlot slot = new AvailabilitySlot(teacher, date, time);
        return availabilitySlotRepository.save(slot);
    }

    public AvailabilitySlot createAvailabilitySlot(User teacher, LocalDate date, LocalTime time, Integer durationMinutes) {
        AvailabilitySlot slot = new AvailabilitySlot(teacher, date, time, durationMinutes);
        return availabilitySlotRepository.save(slot);
    }

    public List<AvailabilitySlot> findByTeacherIdAndDateRange(Long teacherId, LocalDate startDate, LocalDate endDate) {
        return availabilitySlotRepository.findByTeacherIdAndDateRange(teacherId, startDate, endDate);
    }

    public List<AvailabilitySlot> findByTeacherIdAndDate(Long teacherId, LocalDate date) {
        return availabilitySlotRepository.findByTeacherIdAndDate(teacherId, date);
    }

    public Page<AvailabilitySlot> findAvailableSlotsByTeacherIdAndDateRange(
            Long teacherId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return availabilitySlotRepository.findAvailableSlotsByTeacherIdAndDateRange(
                teacherId, startDate, endDate, pageable);
    }

    public List<AvailabilitySlot> findFutureAvailableSlotsByTeacherId(Long teacherId) {
        return availabilitySlotRepository.findFutureAvailableSlotsByTeacherId(teacherId);
    }

    public List<AvailabilitySlot> findFutureBookedSlotsByTeacherId(Long teacherId) {
        return availabilitySlotRepository.findFutureBookedSlotsByTeacherId(teacherId);
    }

    public Long countAvailableSlotsByTeacherId(Long teacherId) {
        return availabilitySlotRepository.countAvailableSlotsByTeacherId(teacherId);
    }

    public Long countBookedSlotsByTeacherId(Long teacherId) {
        return availabilitySlotRepository.countBookedSlotsByTeacherId(teacherId);
    }

    public Optional<AvailabilitySlot> findByTeacherIdAndDateTime(Long teacherId, LocalDate date, LocalTime time) {
        return availabilitySlotRepository.findByTeacherIdAndDateTime(teacherId, date, time);
    }

    public List<AvailabilitySlot> findAvailableSlotsForTeacherInDateRange(Long teacherId, LocalDate startDate, LocalDate endDate) {
        return availabilitySlotRepository.findAvailableSlotsForTeacherInDateRange(teacherId, startDate, endDate);
    }

    public AvailabilitySlot updateAvailabilitySlot(AvailabilitySlot slot) {
        return availabilitySlotRepository.save(slot);
    }

    public void deleteAvailabilitySlot(Long id) {
        availabilitySlotRepository.deleteById(id);
    }

    public void bookSlot(AvailabilitySlot slot) {
        slot.bookSlot();
        availabilitySlotRepository.save(slot);
    }

    public void cancelBooking(AvailabilitySlot slot) {
        slot.cancelBooking();
        availabilitySlotRepository.save(slot);
    }

    public void blockSlot(AvailabilitySlot slot) {
        slot.blockSlot();
        availabilitySlotRepository.save(slot);
    }

    public boolean isSlotAvailable(Long teacherId, LocalDate date, LocalTime time) {
        Optional<AvailabilitySlot> slot = findByTeacherIdAndDateTime(teacherId, date, time);
        return slot.isPresent() && slot.get().isAvailable();
    }
}