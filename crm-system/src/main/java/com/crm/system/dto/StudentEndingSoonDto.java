package com.crm.system.dto;

import java.time.LocalDate;

public class StudentEndingSoonDto {
    private Long studentId;
    private String studentName;
    private String teacherName;
    private Integer remainingLessons;
    private Integer totalLessons;
    private LocalDate packageEndDate;

    // Constructors
    public StudentEndingSoonDto() {}

    public StudentEndingSoonDto(Long studentId, String studentName, String teacherName, 
                               Integer remainingLessons, Integer totalLessons, LocalDate packageEndDate) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.teacherName = teacherName;
        this.remainingLessons = remainingLessons;
        this.totalLessons = totalLessons;
        this.packageEndDate = packageEndDate;
    }

    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public Integer getRemainingLessons() {
        return remainingLessons;
    }

    public void setRemainingLessons(Integer remainingLessons) {
        this.remainingLessons = remainingLessons;
    }

    public Integer getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(Integer totalLessons) {
        this.totalLessons = totalLessons;
    }

    public LocalDate getPackageEndDate() {
        return packageEndDate;
    }

    public void setPackageEndDate(LocalDate packageEndDate) {
        this.packageEndDate = packageEndDate;
    }
}