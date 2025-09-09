package com.crm.system.dto;

import javax.validation.constraints.NotNull;

public class BookSlotDto {
    @NotNull
    private Long slotId;

    @NotNull
    private Long studentId;

    private String notes;

    // Getters and Setters
    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}