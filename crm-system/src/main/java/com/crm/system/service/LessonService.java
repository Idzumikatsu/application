package com.crm.system.service;

import com.crm.system.model.Lesson;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    public Optional<Lesson> findById(Long id) {
        return lessonRepository.findById(id);
    }

    public Lesson saveLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public Lesson createLesson(Student student, User teacher, LocalDate scheduledDate, LocalTime scheduledTime) {
        Lesson lesson = new Lesson(student, teacher, scheduledDate, scheduledTime);
        return lessonRepository.save(lesson);
    }

    public List<Lesson> findByTeacherIdAndDateRange(Long teacherId, LocalDate startDate, LocalDate endDate) {
        return lessonRepository.findByTeacherIdAndDateRange(teacherId, startDate, endDate);
    }

    public List<Lesson> findByStudentIdAndDateRange(Long studentId, LocalDate startDate, LocalDate endDate) {
        return lessonRepository.findByStudentIdAndDateRange(studentId, startDate, endDate);
    }

    public List<Lesson> findByTeacherIdAndDate(Long teacherId, LocalDate date) {
        return lessonRepository.findByTeacherIdAndDate(teacherId, date);
    }

    public List<Lesson> findByStudentIdAndDate(Long studentId, LocalDate date) {
        return lessonRepository.findByStudentIdAndDate(studentId, date);
    }

    public Page<Lesson> findFutureLessonsByTeacherIdAndStatus(
            Long teacherId, Lesson.LessonStatus status, Pageable pageable) {
        return lessonRepository.findFutureLessonsByTeacherIdAndStatus(teacherId, status, pageable);
    }

    public Page<Lesson> findFutureLessonsByStudentIdAndStatus(
            Long studentId, Lesson.LessonStatus status, Pageable pageable) {
        return lessonRepository.findFutureLessonsByStudentIdAndStatus(studentId, status, pageable);
    }

    public List<Lesson> findScheduledLessonsByTeacherId(Long teacherId) {
        return lessonRepository.findScheduledLessonsByTeacherId(teacherId);
    }

    public List<Lesson> findScheduledLessonsByStudentId(Long studentId) {
        return lessonRepository.findScheduledLessonsByStudentId(studentId);
    }

    public List<Lesson> findCompletedLessonsByTeacherIdAndDateRange(
            Long teacherId, LocalDate startDate, LocalDate endDate) {
        return lessonRepository.findCompletedLessonsByTeacherIdAndDateRange(teacherId, startDate, endDate);
    }

    public List<Lesson> findCompletedLessonsByStudentIdAndDateRange(
            Long studentId, LocalDate startDate, LocalDate endDate) {
        return lessonRepository.findCompletedLessonsByStudentIdAndDateRange(studentId, startDate, endDate);
    }

    public Long countScheduledLessonsByTeacherId(Long teacherId) {
        return lessonRepository.countScheduledLessonsByTeacherId(teacherId);
    }

    public Long countScheduledLessonsByStudentId(Long studentId) {
        return lessonRepository.countScheduledLessonsByStudentId(studentId);
    }

    public Lesson updateLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }

    public void completeLesson(Lesson lesson) {
        lesson.completeLesson();
        lessonRepository.save(lesson);
    }

    public void cancelLesson(Lesson lesson, Lesson.CancelledBy cancelledBy, String reason) {
        lesson.cancelLesson(cancelledBy, reason);
        lessonRepository.save(lesson);
    }

    public void markAsMissed(Lesson lesson) {
        lesson.markAsMissed();
        lessonRepository.save(lesson);
    }

    public boolean isLessonScheduled(Lesson lesson) {
        return lesson.isScheduled();
    }

    public boolean isLessonCompleted(Lesson lesson) {
        return lesson.isCompleted();
    }

    public boolean isLessonCancelled(Lesson lesson) {
        return lesson.isCancelled();
    }

    public boolean isLessonMissed(Lesson lesson) {
        return lesson.isMissed();
    }
    public List<Lesson> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return lessonRepository.findByDateRange(startDate, endDate);
    }

    public List<Lesson> findCompletedLessonsForAttendanceConfirmation(LocalDate date, LocalDateTime currentTime) {
        return lessonRepository.findCompletedLessonsForAttendanceConfirmation(date, currentTime);
    }

    public boolean confirmAttendance(Long lessonId) {
        Optional<Lesson> lessonOpt = lessonRepository.findById(lessonId);
        if (lessonOpt.isPresent()) {
            Lesson lesson = lessonOpt.get();
            lesson.confirmAttendance();
            lessonRepository.save(lesson);
            return true;
        }
        return false;
    }
}