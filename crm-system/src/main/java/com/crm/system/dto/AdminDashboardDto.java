package com.crm.system.dto;

import java.time.LocalDateTime;
import java.util.List;

public class AdminDashboardDto {
    private long totalStudents;
    private long totalTeachers;
    private long totalManagers;
    private long totalAdmins;
    private long activeStudents;
    private long activeTeachers;
    private long activeManagers;
    private long activeAdmins;
    private long lessonsToday;
    private long lessonsThisWeek;
    private long lessonsThisMonth;
    private long totalCompletedLessons;
    private long totalCancelledLessons;
    private long totalMissedLessons;
    private long totalScheduledLessons;
    private long totalLessonPackages;
    private long activeLessonPackages;
    private long expiredLessonPackages;
    private double lessonCompletionRate;
    private double lessonCancellationRate;
    private long studentsWithoutTeacher;
    private long pendingNotifications;
    private long failedNotifications;
    private List<StudentEndingSoonDto> studentsEndingSoon;
    private LocalDateTime lastUpdated;

    // Constructors
    public AdminDashboardDto() {}

    // Getters and Setters
    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalTeachers() {
        return totalTeachers;
    }

    public void setTotalTeachers(long totalTeachers) {
        this.totalTeachers = totalTeachers;
    }

    public long getTotalManagers() {
        return totalManagers;
    }

    public void setTotalManagers(long totalManagers) {
        this.totalManagers = totalManagers;
    }

    public long getTotalAdmins() {
        return totalAdmins;
    }

    public void setTotalAdmins(long totalAdmins) {
        this.totalAdmins = totalAdmins;
    }

    public long getActiveStudents() {
        return activeStudents;
    }

    public void setActiveStudents(long activeStudents) {
        this.activeStudents = activeStudents;
    }

    public long getActiveTeachers() {
        return activeTeachers;
    }

    public void setActiveTeachers(long activeTeachers) {
        this.activeTeachers = activeTeachers;
    }

    public long getActiveManagers() {
        return activeManagers;
    }

    public void setActiveManagers(long activeManagers) {
        this.activeManagers = activeManagers;
    }

    public long getActiveAdmins() {
        return activeAdmins;
    }

    public void setActiveAdmins(long activeAdmins) {
        this.activeAdmins = activeAdmins;
    }

    public long getLessonsToday() {
        return lessonsToday;
    }

    public void setLessonsToday(long lessonsToday) {
        this.lessonsToday = lessonsToday;
    }

    public long getLessonsThisWeek() {
        return lessonsThisWeek;
    }

    public void setLessonsThisWeek(long lessonsThisWeek) {
        this.lessonsThisWeek = lessonsThisWeek;
    }

    public long getLessonsThisMonth() {
        return lessonsThisMonth;
    }

    public void setLessonsThisMonth(long lessonsThisMonth) {
        this.lessonsThisMonth = lessonsThisMonth;
    }

    public long getTotalCompletedLessons() {
        return totalCompletedLessons;
    }

    public void setTotalCompletedLessons(long totalCompletedLessons) {
        this.totalCompletedLessons = totalCompletedLessons;
    }

    public long getTotalCancelledLessons() {
        return totalCancelledLessons;
    }

    public void setTotalCancelledLessons(long totalCancelledLessons) {
        this.totalCancelledLessons = totalCancelledLessons;
    }

    public long getTotalMissedLessons() {
        return totalMissedLessons;
    }

    public void setTotalMissedLessons(long totalMissedLessons) {
        this.totalMissedLessons = totalMissedLessons;
    }

    public long getTotalScheduledLessons() {
        return totalScheduledLessons;
    }

    public void setTotalScheduledLessons(long totalScheduledLessons) {
        this.totalScheduledLessons = totalScheduledLessons;
    }

    public long getTotalLessonPackages() {
        return totalLessonPackages;
    }

    public void setTotalLessonPackages(long totalLessonPackages) {
        this.totalLessonPackages = totalLessonPackages;
    }

    public long getActiveLessonPackages() {
        return activeLessonPackages;
    }

    public void setActiveLessonPackages(long activeLessonPackages) {
        this.activeLessonPackages = activeLessonPackages;
    }

    public long getExpiredLessonPackages() {
        return expiredLessonPackages;
    }

    public void setExpiredLessonPackages(long expiredLessonPackages) {
        this.expiredLessonPackages = expiredLessonPackages;
    }

    public double getLessonCompletionRate() {
        return lessonCompletionRate;
    }

    public void setLessonCompletionRate(double lessonCompletionRate) {
        this.lessonCompletionRate = lessonCompletionRate;
    }

    public double getLessonCancellationRate() {
        return lessonCancellationRate;
    }

    public void setLessonCancellationRate(double lessonCancellationRate) {
        this.lessonCancellationRate = lessonCancellationRate;
    }

    public long getStudentsWithoutTeacher() {
        return studentsWithoutTeacher;
    }

    public void setStudentsWithoutTeacher(long studentsWithoutTeacher) {
        this.studentsWithoutTeacher = studentsWithoutTeacher;
    }

    public long getPendingNotifications() {
        return pendingNotifications;
    }

    public void setPendingNotifications(long pendingNotifications) {
        this.pendingNotifications = pendingNotifications;
    }

    public long getFailedNotifications() {
        return failedNotifications;
    }

    public void setFailedNotifications(long failedNotifications) {
        this.failedNotifications = failedNotifications;
    }

    public List<StudentEndingSoonDto> getStudentsEndingSoon() {
        return studentsEndingSoon;
    }

    public void setStudentsEndingSoon(List<StudentEndingSoonDto> studentsEndingSoon) {
        this.studentsEndingSoon = studentsEndingSoon;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}