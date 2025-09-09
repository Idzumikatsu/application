package com.crm.system.dto;

import com.crm.system.model.GroupLesson;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;
import javax.validation.constraints.PositiveOrZero;
import java.time.LocalDate;
import java.time.LocalTime;

public class GroupLessonDto {
    private Long id;

    @NotNull
    private Long teacherId;

    private String teacherName;

    @NotNull
    private String lessonTopic;

    @NotNull
    private LocalDate scheduledDate;

    @NotNull
    private LocalTime scheduledTime;

    @Positive
    private Integer durationMinutes = 60;

    @PositiveOrZero
    private Integer maxStudents;

    @PositiveOrZero
    private Integer currentStudents = 0;

    private GroupLesson.GroupLessonStatus status = GroupLesson.GroupLessonStatus.SCHEDULED;

    private String description;

    private String meetingLink;

    private String createdAt;

    private String updatedAt;

    // Constructors
    public GroupLessonDto() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getLessonTopic() {
        return lessonTopic;
    }

    public void setLessonTopic(String lessonTopic) {
        this.lessonTopic = lessonTopic;
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

    public Integer getMaxStudents() {
        return maxStudents;
    }

    public void setMaxStudents(Integer maxStudents) {
        this.maxStudents = maxStudents;
    }

    public Integer getCurrentStudents() {
        return currentStudents;
    }

    public void setCurrentStudents(Integer currentStudents) {
        this.currentStudents = currentStudents;
    }

    public GroupLesson.GroupLessonStatus getStatus() {
        return status;
    }

    public void setStatus(GroupLesson.GroupLessonStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
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

    // Utility methods
    public boolean isFull() {
        return maxStudents != null && currentStudents != null && currentStudents >= maxStudents;
    }

    public boolean hasSpace() {
        return maxStudents == null || currentStudents == null || currentStudents < maxStudents;
    }

    public int getAvailableSpaces() {
        if (maxStudents == null || currentStudents == null) {
            return Integer.MAX_VALUE;
        }
        return Math.max(0, maxStudents - currentStudents);
    }

    public String getStatusName() {
        switch (status) {
            case SCHEDULED: return "Запланирован";
            case CONFIRMED: return "Подтвержден";
            case IN_PROGRESS: return "В процессе";
            case COMPLETED: return "Завершен";
            case CANCELLED: return "Отменен";
            case POSTPONED: return "Перенесен";
            default: return "Неизвестный";
        }
    }
}