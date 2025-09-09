package com.crm.system.service;

import com.crm.system.model.GroupLesson;
import com.crm.system.model.GroupLessonRegistration;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.model.GroupLessonRegistration.RegistrationStatus;
import com.crm.system.repository.GroupLessonRegistrationRepository;
import com.crm.system.repository.GroupLessonRepository;
import com.crm.system.repository.StudentRepository;
import com.crm.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class GroupLessonRegistrationService {

    @Autowired
    private GroupLessonRegistrationRepository groupLessonRegistrationRepository;

    @Autowired
    private GroupLessonRepository groupLessonRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private UserRepository userRepository;

    public Optional<GroupLessonRegistration> findById(Long id) {
        return groupLessonRegistrationRepository.findById(id);
    }

    public GroupLessonRegistration saveGroupLessonRegistration(GroupLessonRegistration registration) {
        return groupLessonRegistrationRepository.save(registration);
    }

    public GroupLessonRegistration createRegistration(GroupLesson groupLesson, Student student) {
        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        return groupLessonRegistrationRepository.save(registration);
    }

    public List<GroupLessonRegistration> findByStudentIdAndDateRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRegistrationRepository.findByStudentIdAndDateRange(studentId, startDate, endDate);
    }

    public List<GroupLessonRegistration> findByStudentId(Long studentId) {
        return groupLessonRegistrationRepository.findByStudentId(studentId);
    }

    public List<GroupLessonRegistration> findByStudentIdAndDate(Long studentId, LocalDate date) {
        return groupLessonRegistrationRepository.findByStudentIdAndDate(studentId, date);
    }

    public Page<GroupLessonRegistration> findByStudentIdAndStatusesAndDateRange(
            Long studentId, List<RegistrationStatus> statuses, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return groupLessonRegistrationRepository.findByStudentIdAndStatusesAndDateRange(
                studentId, statuses, startDate, endDate, pageable);
    }

    public List<GroupLessonRegistration> findByGroupLessonId(Long groupLessonId) {
        return groupLessonRegistrationRepository.findByGroupLessonId(groupLessonId);
    }

    public List<GroupLessonRegistration> findByGroupLessonIdAndStatuses(Long groupLessonId, List<RegistrationStatus> statuses) {
        return groupLessonRegistrationRepository.findByGroupLessonIdAndStatuses(groupLessonId, statuses);
    }

    public Optional<GroupLessonRegistration> findByStudentIdAndGroupLessonId(Long studentId, Long groupLessonId) {
        return groupLessonRegistrationRepository.findByStudentIdAndGroupLessonId(studentId, groupLessonId);
    }

    public Page<GroupLessonRegistration> findByStudentIdAndLessonStatusesAndRegistrationStatusesAndDateRange(
            Long studentId,
            List<com.crm.system.model.GroupLesson.GroupLessonStatus> lessonStatuses,
            List<RegistrationStatus> registrationStatuses,
            LocalDate startDate,
            LocalDate endDate,
            Pageable pageable) {
        return groupLessonRegistrationRepository.findByStudentIdAndLessonStatusesAndRegistrationStatusesAndDateRange(
                studentId, lessonStatuses, registrationStatuses, startDate, endDate, pageable);
    }

    public List<GroupLessonRegistration> findFutureRegisteredLessonsByStudentId(Long studentId) {
        return groupLessonRegistrationRepository.findFutureRegisteredLessonsByStudentId(studentId);
    }

    public List<GroupLessonRegistration> findAttendedLessonsByStudentIdAndDateRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRegistrationRepository.findAttendedLessonsByStudentIdAndDateRange(studentId, startDate, endDate);
    }

    public Long countByStudentIdAndRegistrationStatus(Long studentId, RegistrationStatus status) {
        return groupLessonRegistrationRepository.countByStudentIdAndRegistrationStatus(studentId, status);
    }

    public Long countRegisteredStudentsByGroupLessonId(Long groupLessonId) {
        return groupLessonRegistrationRepository.countRegisteredStudentsByGroupLessonId(groupLessonId);
    }

    public Long countByGroupLessonIdAndRegistrationStatuses(Long groupLessonId, List<RegistrationStatus> statuses) {
        return groupLessonRegistrationRepository.countByGroupLessonIdAndRegistrationStatuses(groupLessonId, statuses);
    }

    public Page<GroupLessonRegistration> findUpcomingRegistrationsByStudentIdAndStatuses(
            Long studentId, LocalDate endDate, List<RegistrationStatus> statuses, Pageable pageable) {
        return groupLessonRegistrationRepository.findUpcomingRegistrationsByStudentIdAndStatuses(
                studentId, endDate, statuses, pageable);
    }

    public Optional<GroupLessonRegistration> findActiveRegistrationByGroupLessonIdAndStudentId(Long groupLessonId, Long studentId) {
        return groupLessonRegistrationRepository.findActiveRegistrationByGroupLessonIdAndStudentId(groupLessonId, studentId);
    }

    public List<GroupLessonRegistration> findByGroupLessonAndRegistrationStatus(
            GroupLesson groupLesson, RegistrationStatus registrationStatus) {
        return groupLessonRegistrationRepository.findByGroupLessonAndRegistrationStatus(groupLesson, registrationStatus);
    }

    public List<GroupLessonRegistration> findByStudentAndRegistrationStatus(
            Student student, RegistrationStatus registrationStatus) {
        return groupLessonRegistrationRepository.findByStudentAndRegistrationStatus(student, registrationStatus);
    }

    public List<GroupLessonRegistration> findByTeacherIdAndDateRange(Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRegistrationRepository.findByTeacherIdAndDateRange(teacherId, startDate, endDate);
    }

    public GroupLessonRegistration updateGroupLessonRegistration(GroupLessonRegistration registration) {
        return groupLessonRegistrationRepository.save(registration);
    }

    public void deleteGroupLessonRegistration(Long id) {
        groupLessonRegistrationRepository.deleteById(id);
    }

    public void markAsAttended(GroupLessonRegistration registration) {
        registration.markAsAttended();
        groupLessonRegistrationRepository.save(registration);
    }

    public void markAsMissed(GroupLessonRegistration registration) {
        registration.markAsMissed();
        groupLessonRegistrationRepository.save(registration);
    }

    public void cancelRegistration(GroupLessonRegistration registration, String reason) {
        registration.cancelRegistration(reason);
        groupLessonRegistrationRepository.save(registration);
    }

    public boolean isRegistrationActive(GroupLessonRegistration registration) {
        return registration.isRegistered();
    }

    public boolean hasRegistrationAttended(GroupLessonRegistration registration) {
        return registration.hasAttended();
    }

    public boolean hasRegistrationMissed(GroupLessonRegistration registration) {
        return registration.hasMissed();
    }

    public boolean isRegistrationCancelled(GroupLessonRegistration registration) {
        return registration.isCancelled();
    }

    public GroupLessonRegistration bookSlot(GroupLesson groupLesson, Student student) {
        // Проверяем, что слот доступен для бронирования
        if (!groupLessonService.isSlotAvailableForBooking(groupLesson.getId())) {
            throw new RuntimeException("Slot is not available for booking");
        }

        // Проверяем, что студент еще не зарегистрирован на этот слот
        Optional<GroupLessonRegistration> existingRegistration = 
            groupLessonRegistrationRepository.findByStudentIdAndGroupLessonId(student.getId(), groupLesson.getId());
        
        if (existingRegistration.isPresent()) {
            throw new RuntimeException("Student is already registered for this slot");
        }

        // Создаем регистрацию
        GroupLessonRegistration registration = new GroupLessonRegistration(groupLesson, student);
        GroupLessonRegistration savedRegistration = groupLessonRegistrationRepository.save(registration);
        
        // Обновляем слот (увеличиваем счетчик студентов)
        groupLesson.incrementStudentCount();
        groupLessonRepository.save(groupLesson);
        
        return savedRegistration;
    }

    public void cancelBooking(Long registrationId) {
        GroupLessonRegistration registration = groupLessonRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + registrationId));
        
        // Отменяем регистрацию
        registration.cancelRegistration("Cancelled by user");
        groupLessonRegistrationRepository.save(registration);

        // Обновляем слот (освобождаем место)
        GroupLesson groupLesson = registration.getGroupLesson();
        groupLesson.decrementStudentCount();
        groupLessonRepository.save(groupLesson);
    }

    public void cancelBooking(Long registrationId, String reason) {
        GroupLessonRegistration registration = groupLessonRegistrationRepository.findById(registrationId)
                .orElseThrow(() -> new RuntimeException("Registration not found with id: " + registrationId));
        
        // Отменяем регистрацию
        registration.cancelRegistration(reason);
        groupLessonRegistrationRepository.save(registration);

        // Обновляем слот (освобождаем место)
        GroupLesson groupLesson = registration.getGroupLesson();
        groupLesson.decrementStudentCount();
        groupLessonRepository.save(groupLesson);
    }

    public void cancelBooking(GroupLessonRegistration registration, String reason) {
        // Отменяем регистрацию
        registration.cancelRegistration(reason);
        groupLessonRegistrationRepository.save(registration);

        // Обновляем слот (освобождаем место)
        GroupLesson groupLesson = registration.getGroupLesson();
        groupLesson.decrementStudentCount();
        groupLessonRepository.save(groupLesson);
    }

    public boolean isSlotBookedByStudent(Long groupLessonId, Long studentId) {
        Optional<GroupLessonRegistration> registration = 
            groupLessonRegistrationRepository.findByStudentIdAndGroupLessonId(studentId, groupLessonId);
        return registration.isPresent() && registration.get().isRegistered();
    }

    public List<GroupLessonRegistration> findFutureRegistrationsByStudentId(Long studentId) {
        return groupLessonRegistrationRepository.findFutureRegisteredLessonsByStudentId(studentId);
    }

    public List<GroupLessonRegistration> findPastRegistrationsByStudentId(Long studentId) {
        return groupLessonRegistrationRepository.findAttendedLessonsByStudentIdAndDateRange(
            studentId, LocalDate.MIN, LocalDate.now().minusDays(1));
    }

    public List<GroupLessonRegistration> findRegistrationsByTeacherId(Long teacherId) {
        return groupLessonRegistrationRepository.findByTeacherIdAndDateRange(
            teacherId, LocalDate.now(), LocalDate.now().plusYears(1));
    }

    public List<GroupLessonRegistration> findRegistrationsByGroupLessonId(Long groupLessonId) {
        return groupLessonRegistrationRepository.findByGroupLessonId(groupLessonId);
    }

    public List<GroupLessonRegistration> findActiveRegistrationsByStudentId(Long studentId) {
        return groupLessonRegistrationRepository.findActiveRegistrationsByStudentId(studentId);
    }

    public List<GroupLessonRegistration> findActiveRegistrationsByTeacherId(Long teacherId) {
        return groupLessonRegistrationRepository.findActiveRegistrationsByTeacherId(teacherId);
    }

    public List<GroupLessonRegistration> findPastUncompletedRegistrationsByStudentId(Long studentId) {
        return groupLessonRegistrationRepository.findPastUncompletedRegistrationsByStudentId(studentId);
    }

    public List<GroupLessonRegistration> findPastUncompletedRegistrationsByTeacherId(Long teacherId) {
        return groupLessonRegistrationRepository.findPastUncompletedRegistrationsByTeacherId(teacherId);
    }

    public List<GroupLessonRegistration> findRegistrationsForActiveLessonsByStudentIdAndDateRange(
            Long studentId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRegistrationRepository.findRegistrationsForActiveLessonsByStudentIdAndDateRange(
                studentId, startDate, endDate);
    }

    public List<GroupLessonRegistration> findRegistrationsForActiveLessonsByTeacherIdAndDateRange(
            Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRegistrationRepository.findRegistrationsForActiveLessonsByTeacherIdAndDateRange(
                teacherId, startDate, endDate);
    }

    public Long countActiveRegistrationsByStudentId(Long studentId) {
        return groupLessonRegistrationRepository.countActiveRegistrationsByStudentId(studentId);
    }

    public Long countActiveRegistrationsByTeacherId(Long teacherId) {
        return groupLessonRegistrationRepository.countActiveRegistrationsByTeacherId(teacherId);
    }

    public Long countPastUncompletedRegistrationsByStudentId(Long studentId) {
        return groupLessonRegistrationRepository.countPastUncompletedRegistrationsByStudentId(studentId);
    }

    public Long countPastUncompletedRegistrationsByTeacherId(Long teacherId) {
        return groupLessonRegistrationRepository.countPastUncompletedRegistrationsByTeacherId(teacherId);
    }

    public Long countRegisteredStudentsByGroupLessonIdIncludingWaitingList(Long groupLessonId) {
        return groupLessonRegistrationRepository.countRegisteredStudentsByGroupLessonIdIncludingWaitingList(groupLessonId);
    }

    public Long countActiveRegistrationsByGroupLessonId(Long groupLessonId) {
        return groupLessonRegistrationRepository.countActiveRegistrationsByGroupLessonId(groupLessonId);
    }

    public Page<GroupLessonRegistration> findRegistrationsByTeacherIdAndStatusesAndDateRange(
            Long teacherId, List<RegistrationStatus> statuses, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return groupLessonRegistrationRepository.findRegistrationsByTeacherIdAndStatusesAndDateRange(
                teacherId, statuses, startDate, endDate, pageable);
    }

    public List<GroupLessonRegistration> findRegisteredLessonsByTeacherIdAndDateRange(
            Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRegistrationRepository.findRegisteredLessonsByTeacherIdAndDateRange(
                teacherId, startDate, endDate);
    }

    public List<GroupLessonRegistration> findAttendedLessonsByTeacherIdAndDateRange(
            Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRegistrationRepository.findAttendedLessonsByTeacherIdAndDateRange(
                teacherId, startDate, endDate);
    }

    public List<GroupLessonRegistration> findMissedLessonsByTeacherIdAndDateRange(
            Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRegistrationRepository.findMissedLessonsByTeacherIdAndDateRange(
                teacherId, startDate, endDate);
    }

    public List<GroupLessonRegistration> findCancelledLessonsByTeacherIdAndDateRange(
            Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRegistrationRepository.findCancelledLessonsByTeacherIdAndDateRange(
                teacherId, startDate, endDate);
    }

    public List<GroupLessonRegistration> findRegistrationsForFullGroupLessonsByTeacherId(Long teacherId) {
        return groupLessonRegistrationRepository.findRegistrationsForFullGroupLessonsByTeacherId(teacherId);
    }

    public List<GroupLessonRegistration> findRegistrationsForAvailableGroupLessonsByTeacherId(Long teacherId) {
        return groupLessonRegistrationRepository.findRegistrationsForAvailableGroupLessonsByTeacherId(teacherId);
    }
}