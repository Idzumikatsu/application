package com.crm.system.dto;

import com.crm.system.model.GroupLessonRegistration;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class GroupLessonRegistrationDto {
    private Long id;

    @NotNull
    private Long groupLessonId;

    private String groupLessonTopic;

    @NotNull
    private Long studentId;

    private String studentName;

    private String studentEmail;

    private GroupLessonRegistration.RegistrationStatus registrationStatus = GroupLessonRegistration.RegistrationStatus.REGISTERED;

    private LocalDateTime registeredAt;

    private Boolean attended = false;

    private LocalDateTime attendanceConfirmedAt;

    private String cancellationReason;

    private String createdAt;

    private String updatedAt;

    // Constructors
    public GroupLessonRegistrationDto() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGroupLessonId() {
        return groupLessonId;
    }

    public void setGroupLessonId(Long groupLessonId) {
        this.groupLessonId = groupLessonId;
    }

    public String getGroupLessonTopic() {
        return groupLessonTopic;
    }

    public void setGroupLessonTopic(String groupLessonTopic) {
        this.groupLessonTopic = groupLessonTopic;
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

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public GroupLessonRegistration.RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(GroupLessonRegistration.RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }

    public LocalDateTime getRegisteredAt() {
        return registeredAt;
    }

    public void setRegisteredAt(LocalDateTime registeredAt) {
        this.registeredAt = registeredAt;
    }

    public Boolean getAttended() {
        return attended;
    }

    public void setAttended(Boolean attended) {
        this.attended = attended;
    }

    public LocalDateTime getAttendanceConfirmedAt() {
        return attendanceConfirmedAt;
    }

    public void setAttendanceConfirmedAt(LocalDateTime attendanceConfirmedAt) {
        this.attendanceConfirmedAt = attendanceConfirmedAt;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
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
    public boolean isRegistered() {
        return this.registrationStatus == GroupLessonRegistration.RegistrationStatus.REGISTERED;
    }

    public boolean hasAttended() {
        return this.registrationStatus == GroupLessonRegistration.RegistrationStatus.ATTENDED;
    }

    public boolean hasMissed() {
        return this.registrationStatus == GroupLessonRegistration.RegistrationStatus.MISSED;
    }

    public boolean isCancelled() {
        return this.registrationStatus == GroupLessonRegistration.RegistrationStatus.CANCELLED;
    }

    public String getRegistrationStatusName() {
        switch (registrationStatus) {
            case REGISTERED: return "Зарегистрирован";
            case ATTENDED: return "Посетил";
            case MISSED: return "Пропустил";
            case CANCELLED: return "Отменен";
            default: return "Неизвестный";
        }
    }
}