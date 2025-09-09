package com.crm.system.dto;

import javax.validation.constraints.NotNull;

public class CreateGroupLessonRegistrationDto {
    @NotNull
    private Long groupLessonId;

    @NotNull
    private Long studentId;

    // Constructors
    public CreateGroupLessonRegistrationDto() {}

    // Getters and Setters
    public Long getGroupLessonId() {
        return groupLessonId;
    }

    public void setGroupLessonId(Long groupLessonId) {
        this.groupLessonId = groupLessonId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
}