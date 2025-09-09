package com.crm.system.service;

import com.crm.system.model.GroupLesson;
import com.crm.system.model.User;
import com.crm.system.model.GroupLesson.GroupLessonStatus;
import com.crm.system.repository.GroupLessonRepository;
import com.crm.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class GroupLessonService {

    @Autowired
    private GroupLessonRepository groupLessonRepository;

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private GroupLessonRegistrationService groupLessonRegistrationService;

    public Optional<GroupLesson> findById(Long id) {
        return groupLessonRepository.findById(id);
    }

    public GroupLesson saveGroupLesson(GroupLesson groupLesson) {
        return groupLessonRepository.save(groupLesson);
    }

    public GroupLesson createGroupLesson(User teacher, String lessonTopic, LocalDate scheduledDate, LocalTime scheduledTime) {
        GroupLesson groupLesson = new GroupLesson(teacher, lessonTopic, scheduledDate, scheduledTime);
        return groupLessonRepository.save(groupLesson);
    }

    public GroupLesson createGroupLesson(User teacher, String lessonTopic, LocalDate scheduledDate, LocalTime scheduledTime, Integer durationMinutes) {
        GroupLesson groupLesson = new GroupLesson(teacher, lessonTopic, scheduledDate, scheduledTime, durationMinutes);
        return groupLessonRepository.save(groupLesson);
    }

    public List<GroupLesson> findByTeacherIdAndDate(Long teacherId, LocalDate date) {
        return groupLessonRepository.findByTeacherIdAndDate(teacherId, date);
    }

    public List<GroupLesson> findByTeacherIdAndDate(Long teacherId, LocalDate date) {
        return groupLessonRepository.findByTeacherIdAndDate(teacherId, date);
    }

    public Page<GroupLesson> findByTeacherIdAndStatusesAndDateRange(
            Long teacherId, List<GroupLessonStatus> statuses, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return groupLessonRepository.findByTeacherIdAndStatusesAndDateRange(
                teacherId, statuses, startDate, endDate, pageable);
    }

    public Page<GroupLesson> findByStatusAndFutureDate(GroupLessonStatus status, Pageable pageable) {
        return groupLessonRepository.findByStatusAndFutureDate(status, pageable);
    }

    public List<GroupLesson> findByDateRangeAndStatuses(LocalDate startDate, LocalDate endDate, List<GroupLessonStatus> statuses) {
        return groupLessonRepository.findByDateRangeAndStatuses(startDate, endDate, statuses);
    }

    public List<GroupLesson> findScheduledGroupLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.findScheduledGroupLessonsByTeacherId(teacherId);
    }

    public List<GroupLesson> findScheduledGroupLessonsByStudentId(Long studentId) {
        return groupLessonRepository.findScheduledGroupLessonsByStudentId(studentId);
    }

    public List<GroupLesson> findUpcomingLessonsByTeacherIdAndDateRange(Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRepository.findUpcomingLessonsByTeacherIdAndDateRange(teacherId, startDate, endDate);
    }

    public Page<GroupLesson> findByStatusesAndDateRange(List<GroupLessonStatus> statuses, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return groupLessonRepository.findByStatusesAndDateRange(statuses, startDate, endDate, pageable);
    }

    public Long countByTeacherIdAndStatuses(Long teacherId, List<GroupLessonStatus> statuses) {
        return groupLessonRepository.countByTeacherIdAndStatuses(teacherId, statuses);
    }

    public Long countByStatus(GroupLessonStatus status) {
        return groupLessonRepository.countByStatus(status);
    }

    public Optional<GroupLesson> findByIdAndTeacherId(Long id, Long teacherId) {
        return groupLessonRepository.findByIdAndTeacherId(id, teacherId);
    }

    public List<GroupLesson> findByTeacherAndStatus(User teacher, GroupLessonStatus status) {
        return groupLessonRepository.findByTeacherAndStatus(teacher, status);
    }

    public List<GroupLesson> findFullGroupLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.findFullGroupLessonsByTeacherId(teacherId);
    }

    public List<GroupLesson> findAvailableGroupLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.findAvailableGroupLessonsByTeacherId(teacherId);
    }

    public GroupLesson updateGroupLesson(GroupLesson groupLesson) {
        return groupLessonRepository.save(groupLesson);
    }

    public void deleteGroupLesson(Long id) {
        groupLessonRepository.deleteById(id);
    }

    public void confirmLesson(GroupLesson groupLesson) {
        groupLesson.confirmLesson();
        groupLessonRepository.save(groupLesson);
    }

    public void startLesson(GroupLesson groupLesson) {
        groupLesson.startLesson();
        groupLessonRepository.save(groupLesson);
    }

    public void completeLesson(GroupLesson groupLesson) {
        groupLesson.completeLesson();
        groupLessonRepository.save(groupLesson);
    }

    public void cancelLesson(GroupLesson groupLesson) {
        groupLesson.cancelLesson();
        groupLessonRepository.save(groupLesson);
    }

    public void postponeLesson(GroupLesson groupLesson) {
        groupLesson.postponeLesson();
        groupLessonRepository.save(groupLesson);
    }

    public boolean isLessonScheduled(GroupLesson groupLesson) {
        return groupLesson.isScheduled();
    }

    public boolean isLessonConfirmed(GroupLesson groupLesson) {
        return groupLesson.isConfirmed();
    }

    public boolean isLessonInProgress(GroupLesson groupLesson) {
        return groupLesson.isInProgress();
    }

    public boolean isLessonCompleted(GroupLesson groupLesson) {
        return groupLesson.isCompleted();
    }

    public boolean isLessonCancelled(GroupLesson groupLesson) {
        return groupLesson.isCancelled();
    }

    public boolean isLessonPostponed(GroupLesson groupLesson) {
        return groupLesson.isPostponed();
    }

    public boolean isLessonFull(GroupLesson groupLesson) {
        return groupLesson.isFull();
    }

    public boolean doesLessonHaveSpace(GroupLesson groupLesson) {
        return groupLesson.hasSpace();
    }

    public boolean isSlotAvailableForBooking(Long groupLessonId) {
        Optional<GroupLesson> groupLesson = findById(groupLessonId);
        return groupLesson.isPresent() && groupLesson.get().hasSpace() && 
               (groupLesson.get().isScheduled() || groupLesson.get().isConfirmed());
    }

    public int getAvailableSpaces(GroupLesson groupLesson) {
        return groupLesson.getAvailableSpaces();
    }

    public List<GroupLesson> findFutureAvailableLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.findFutureAvailableLessonsByTeacherId(teacherId);
    }

    public List<GroupLesson> findFutureBookedLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.findFutureBookedLessonsByTeacherId(teacherId);
    }

    public Long countAvailableSlotsByTeacherId(Long teacherId) {
        return groupLessonRepository.countAvailableSlotsByTeacherId(teacherId);
    }

    public Long countBookedSlotsByTeacherId(Long teacherId) {
        return groupLessonRepository.countBookedSlotsByTeacherId(teacherId);
    }

    public Optional<GroupLesson> findByTeacherIdAndDateTime(Long teacherId, LocalDate date, LocalTime time) {
        return groupLessonRepository.findByTeacherIdAndDateTime(teacherId, date, time);
    }

    public List<GroupLesson> findAvailableSlotsForTeacherInDateRange(Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRepository.findAvailableSlotsForTeacherInDateRange(teacherId, startDate, endDate);
    }

    public Page<GroupLesson> findAvailableSlotsByTeacherIdAndDateRange(
            Long teacherId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return groupLessonRepository.findAvailableSlotsByTeacherIdAndDateRange(
                teacherId, startDate, endDate, pageable);
    }

    public List<GroupLesson> findTeacherLessonsByDateRange(Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRepository.findTeacherLessonsByDateRange(teacherId, startDate, endDate);
    }

    public List<GroupLesson> findTeacherLessonsByDate(Long teacherId, LocalDate date) {
        return groupLessonRepository.findTeacherLessonsByDate(teacherId, date);
    }

    public List<GroupLesson> findCancelledLessonsByTeacherIdAndDateRange(Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRepository.findCancelledLessonsByTeacherIdAndDateRange(teacherId, startDate, endDate);
    }

    public List<GroupLesson> findCompletedLessonsByTeacherIdAndDateRange(Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRepository.findCompletedLessonsByTeacherIdAndDateRange(teacherId, startDate, endDate);
    }

    public List<GroupLesson> findPostponedLessonsByTeacherIdAndDateRange(Long teacherId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRepository.findPostponedLessonsByTeacherIdAndDateRange(teacherId, startDate, endDate);
    }

    public List<GroupLesson> findActiveLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.findActiveLessonsByTeacherId(teacherId);
    }

    public Page<GroupLesson> findFutureLessonsByTeacherId(Long teacherId, Pageable pageable) {
        return groupLessonRepository.findFutureLessonsByTeacherId(teacherId, pageable);
    }

    public List<GroupLesson> findPastIncompleteLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.findPastIncompleteLessonsByTeacherId(teacherId);
    }

    public List<GroupLesson> findPastCompletedLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.findPastCompletedLessonsByTeacherId(teacherId);
    }

    public List<GroupLesson> findPastCancelledLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.findPastCancelledLessonsByTeacherId(teacherId);
    }

    public List<GroupLesson> findPastMissedLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.findPastMissedLessonsByTeacherId(teacherId);
    }

    public List<GroupLessonRegistration> findGroupLessonRegistrationsByStudentIdAndDateRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        return groupLessonRegistrationService.findByStudentIdAndDateRange(studentId, startDate, endDate);
    }

    public Long countFutureActiveLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.countFutureActiveLessonsByTeacherId(teacherId);
    }

    public Long countPastCompletedLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.countPastCompletedLessonsByTeacherId(teacherId);
    }

    public Long countFutureCancelledLessonsByTeacherId(Long teacherId) {
        return groupLessonRepository.countFutureCancelledLessonsByTeacherId(teacherId);
    }

    public Long countAvailableSlotsByTeacherIdIncludingFuture(Long teacherId) {
        return groupLessonRepository.countAvailableSlotsByTeacherId(teacherId);
    }

    public Long countFullSlotsByTeacherIdIncludingFuture(Long teacherId) {
        return groupLessonRepository.countFullSlotsByTeacherId(teacherId);
    }
    
    public Page<GroupLesson> findByStudentIdAndDateRange(Long studentId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        return groupLessonRepository.findByStudentIdAndDateRange(studentId, startDate, endDate, pageable);
    }
}