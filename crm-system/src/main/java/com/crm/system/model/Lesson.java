package com.crm.system.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "lessons")
public class Lesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id")
    private AvailabilitySlot slot;

    @NotNull
    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @NotNull
    @Column(name = "scheduled_time")
    private LocalTime scheduledTime;

    @Column(name = "duration_minutes", nullable = false, columnDefinition = "integer default 60")
    private Integer durationMinutes = 60;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private LessonStatus status = LessonStatus.SCHEDULED;

    @Column(name = "cancellation_reason")
    private String cancellationReason;

    @Enumerated(EnumType.STRING)
    @Column(name = "cancelled_by")
    private CancelledBy cancelledBy;

    @Column(name = "notes")
    private String notes;

    @Column(name = "confirmed_by_teacher")
    private Boolean confirmedByTeacher = false;

    @Column(name = "attendance_confirmed")
    private Boolean attendanceConfirmed = false;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Enums
    public enum LessonStatus {
        SCHEDULED,    // Урок запланирован
        COMPLETED,   // Урок проведен
        CANCELLED,   // Урок отменен
        MISSED       // Урок пропущен
    }

    public enum CancelledBy {
        STUDENT,     // Отменен студентом
        TEACHER,     // Отменен преподавателем
        MANAGER      // Отменен менеджером
    }

    // Constructors
    public Lesson() {}

    public Lesson(Student student, User teacher, LocalDate scheduledDate, LocalTime scheduledTime) {
        this.student = student;
        this.teacher = teacher;
        this.scheduledDate = scheduledDate;
        this.scheduledTime = scheduledTime;
        this.durationMinutes = 60;
        this.status = LessonStatus.SCHEDULED;
        this.confirmedByTeacher = false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    public AvailabilitySlot getSlot() {
        return slot;
    }

    public void setSlot(AvailabilitySlot slot) {
        this.slot = slot;
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

    public LessonStatus getStatus() {
        return status;
    }

    public void setStatus(LessonStatus status) {
        this.status = status;
    }

    public String getCancellationReason() {
        return cancellationReason;
    }

    public void setCancellationReason(String cancellationReason) {
        this.cancellationReason = cancellationReason;
    }

    public CancelledBy getCancelledBy() {
        return cancelledBy;
    }

    public void setCancelledBy(CancelledBy cancelledBy) {
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

    public Boolean getAttendanceConfirmed() {
        return attendanceConfirmed;
    }

    public void setAttendanceConfirmed(Boolean attendanceConfirmed) {
        this.attendanceConfirmed = attendanceConfirmed;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
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
    public boolean isScheduled() {
        return this.status == LessonStatus.SCHEDULED;
    }

    public boolean isCompleted() {
        return this.status == LessonStatus.COMPLETED;
    }

    public boolean isCancelled() {
        return this.status == LessonStatus.CANCELLED;
    }

    public boolean isMissed() {
        return this.status == LessonStatus.MISSED;
    }

    public void completeLesson() {
        this.status = LessonStatus.COMPLETED;
        this.confirmedByTeacher = true;
    }

    public void cancelLesson(CancelledBy cancelledBy, String reason) {
        this.status = LessonStatus.CANCELLED;
        this.cancelledBy = cancelledBy;
        this.cancellationReason = reason;
    }

    public void markAsMissed() {
        this.status = LessonStatus.MISSED;
    }

    public void confirmAttendance() {
        this.attendanceConfirmed = true;
    }
}