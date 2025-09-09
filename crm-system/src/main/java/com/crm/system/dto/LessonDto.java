package com.crm.system.dto;

import com.crm.system.model.Lesson;

import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;

public class LessonDto {
    private Long id;

    @NotNull
    private Long studentId;
    
    private String studentName;

    @NotNull
    private Long teacherId;
    
    private String teacherName;

    private Long slotId;

    @NotNull
    private LocalDate scheduledDate;

    @NotNull
    private LocalTime scheduledTime;

    private Integer durationMinutes = 60;

    private Lesson.LessonStatus status = Lesson.LessonStatus.SCHEDULED;

    private String cancellationReason;

    private Lesson.CancelledBy cancelledBy;

    private String notes;

    private Boolean confirmedByTeacher = false;

    private String createdAt;
    
    private String updatedAt;

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

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public LocalDate getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(LocalDate scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public LocalTime getScheduledTime() {
        return scheduledTime;
    }

    public void setScheduledTime(LocalTime scheduledTime) {
        this.scheduledTime = scheduledTime;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Lesson.LessonStatus getStatus() {
        return status;
    }

    public void setStatus(Lesson.LessonStatus status) {
        this.status = status;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public Lesson.CancelledBy getCancelledBy() {
        return cancelledBy;
    }

    public void setCancelledBy(Lesson.CancelledBy cancelledBy) {
        this.cancelledBy = cancelledBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Boolean getConfirmedByTeacher() {
        return confirmedByTeacher;
    }

    public void setConfirmedByTeacher(Boolean confirmedByTeacher) {
        this.confirmedByTeacher = confirmedByTeacher;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }
}