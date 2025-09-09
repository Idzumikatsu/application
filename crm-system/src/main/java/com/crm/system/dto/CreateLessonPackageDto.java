package com.crm.system.dto;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

public class CreateLessonPackageDto {
    @NotNull
    private Long studentId;

    @NotNull
    @Min(1)
    private Integer totalLessons;

    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Integer getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(Integer totalLessons) {
        this.totalLessons = totalLessons;
    }
}