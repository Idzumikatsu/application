package com.crm.system.dto;

import java.time.LocalDateTime;
import java.util.List;

public class DashboardStatsDto {
    private long totalStudents;
    private long totalTeachers;
    private long totalManagers;
    private long activeStudents;
    private long activeTeachers;
    private long lessonsToday;
    private long lessonsThisWeek;
    private List<StudentLessonSummaryDto> studentsEndingSoon;
    private LocalDateTime lastUpdated;

    // Constructors
    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalStudents, long totalTeachers, long totalManagers,
                           long activeStudents, long activeTeachers, long lessonsToday,
                           long lessonsThisWeek, List<StudentLessonSummaryDto> studentsEndingSoon) {
        this.totalStudents = totalStudents;
        this.totalTeachers = totalTeachers;
        this.totalManagers = totalManagers;
        this.activeStudents = activeStudents;
        this.activeTeachers = activeTeachers;
        this.lessonsToday = lessonsToday;
        this.lessonsThisWeek = lessonsThisWeek;
        this.studentsEndingSoon = studentsEndingSoon;
        this.lastUpdated = LocalDateTime.now();
    }

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

    public List<StudentLessonSummaryDto> getStudentsEndingSoon() {
        return studentsEndingSoon;
    }

    public void setStudentsEndingSoon(List<StudentLessonSummaryDto> studentsEndingSoon) {
        this.studentsEndingSoon = studentsEndingSoon;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}