package com.crm.system.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "group_lesson_registrations")
public class GroupLessonRegistration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "group_lesson_id", nullable = false)
    private GroupLesson groupLesson;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Enumerated(EnumType.STRING)
    @Column(name = "registration_status")
    private RegistrationStatus registrationStatus = RegistrationStatus.REGISTERED;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @Column(name = "attended")
    private Boolean attended = false;

    @Column(name = "attendance_confirmed_at")
    private LocalDateTime attendanceConfirmedAt;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        registeredAt = LocalDateTime.now();
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Enums
    public enum RegistrationStatus {
        REGISTERED,    // Зарегистрирован
        ATTENDED,     // Посетил урок
        MISSED,       // Пропустил урок
        CANCELLED     // Отменил регистрацию
    }

    // Constructors
    public GroupLessonRegistration() {}

    public GroupLessonRegistration(GroupLesson groupLesson, Student student) {
        this.groupLesson = groupLesson;
        this.student = student;
        this.registrationStatus = RegistrationStatus.REGISTERED;
        this.attended = false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public GroupLesson getGroupLesson() {
        return groupLesson;
    }

    public void setGroupLesson(GroupLesson groupLesson) {
        this.groupLesson = groupLesson;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(RegistrationStatus registrationStatus) {
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Utility methods
    public boolean isRegistered() {
        return this.registrationStatus == RegistrationStatus.REGISTERED;
    }

    public boolean hasAttended() {
        return this.registrationStatus == RegistrationStatus.ATTENDED;
    }

    public boolean hasMissed() {
        return this.registrationStatus == RegistrationStatus.MISSED;
    }

    public boolean isCancelled() {
        return this.registrationStatus == RegistrationStatus.CANCELLED;
    }

    public void markAsAttended() {
        this.registrationStatus = RegistrationStatus.ATTENDED;
        this.attended = true;
        this.attendanceConfirmedAt = LocalDateTime.now();
    }

    public void markAsMissed() {
        this.registrationStatus = RegistrationStatus.MISSED;
        this.attended = false;
        this.attendanceConfirmedAt = LocalDateTime.now();
    }

    public void cancelRegistration(String reason) {
        this.registrationStatus = RegistrationStatus.CANCELLED;
        this.cancellationReason = reason;
        this.attended = false;
    }

    public String getStudentFullName() {
        if (student != null) {
            return student.getFirstName() + " " + student.getLastName();
        }
        return "";
    }

    public String getStudentEmail() {
        if (student != null) {
            return student.getEmail();
        }
        return "";
    }

    public String getGroupLessonTopic() {
        if (groupLesson != null) {
            return groupLesson.getLessonTopic();
        }
        return "";
    }

    public String getTeacherFullName() {
        if (groupLesson != null && groupLesson.getTeacher() != null) {
            User teacher = groupLesson.getTeacher();
            return teacher.getFirstName() + " " + teacher.getLastName();
        }
        return "";
    }

    public LocalDateTime getScheduledDateTime() {
        if (groupLesson != null) {
            return LocalDateTime.of(groupLesson.getScheduledDate(), groupLesson.getScheduledTime());
        }
        return null;
    }

    public boolean isLessonScheduled() {
        return groupLesson != null && groupLesson.isScheduled();
    }

    public boolean isLessonConfirmed() {
        return groupLesson != null && groupLesson.isConfirmed();
    }

    public boolean isLessonInProgress() {
        return groupLesson != null && groupLesson.isInProgress();
    }

    public boolean isLessonCompleted() {
        return groupLesson != null && groupLesson.isCompleted();
    }

    public boolean isLessonCancelled() {
        return groupLesson != null && groupLesson.isCancelled();
    }

    public boolean isLessonPostponed() {
        return groupLesson != null && groupLesson.isPostponed();
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

    public String getGroupLessonStatusName() {
        if (groupLesson != null) {
            switch (groupLesson.getStatus()) {
                case SCHEDULED: return "Запланирован";
                case CONFIRMED: return "Подтвержден";
                case IN_PROGRESS: return "В процессе";
                case COMPLETED: return "Завершен";
                case CANCELLED: return "Отменен";
                case POSTPONED: return "Перенесен";
                default: return "Неизвестный";
            }
        }
        return "";
    }
}