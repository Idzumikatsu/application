package com.crm.system.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class LessonPackageDto {
    private Long id;
    
    private Long studentId;
    
    private String studentName;

    @NotNull
    @Min(1)
    private Integer totalLessons;

    @NotNull
    @Min(0)
    private Integer remainingLessons;
    
    private String createdAt;

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public Integer getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(Integer totalLessons) {
        this.totalLessons = totalLessons;
    }

    public Integer getRemainingLessons() {
        return remainingLessons;
    }

    public void setRemainingLessons(Integer remainingLessons) {
        this.remainingLessons = remainingLessons;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }
}