package com.crm.system.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "group_lessons")
public class GroupLesson {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @NotNull
    @Column(name = "lesson_topic")
    private String lessonTopic;

    @NotNull
    @Column(name = "scheduled_date")
    private LocalDate scheduledDate;

    @NotNull
    @Column(name = "scheduled_time")
    private LocalTime scheduledTime;

    @Column(name = "duration_minutes", nullable = false, columnDefinition = "integer default 60")
    private Integer durationMinutes = 60;

    @Column(name = "max_students")
    private Integer maxStudents;

    @Column(name = "current_students")
    private Integer currentStudents = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private GroupLessonStatus status = GroupLessonStatus.SCHEDULED;

    @Column(name = "description")
    private String description;

    @Column(name = "meeting_link")
    private String meetingLink;

    @OneToMany(mappedBy = "groupLesson", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupLessonRegistration> registrations = new ArrayList<>();

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
    public enum GroupLessonStatus {
        SCHEDULED,    // Групповой урок запланирован
        CONFIRMED,     // Групповой урок подтвержден
        IN_PROGRESS,   // Групповой урок в процессе
        COMPLETED,     // Групповой урок завершен
        CANCELLED,     // Групповой урок отменен
        POSTPONED      // Групповой урок перенесен
    }

    // Constructors
    public GroupLesson() {}

    public GroupLesson(User teacher, String lessonTopic, LocalDate scheduledDate, LocalTime scheduledTime) {
        this.teacher = teacher;
        this.lessonTopic = lessonTopic;
        this.scheduledDate = scheduledDate;
        this.scheduledTime = scheduledTime;
        this.durationMinutes = 60;
        this.currentStudents = 0;
        this.status = GroupLessonStatus.SCHEDULED;
    }

    public GroupLesson(User teacher, String lessonTopic, LocalDate scheduledDate, LocalTime scheduledTime, Integer durationMinutes) {
        this.teacher = teacher;
        this.lessonTopic = lessonTopic;
        this.scheduledDate = scheduledDate;
        this.scheduledTime = scheduledTime;
        this.durationMinutes = durationMinutes != null ? durationMinutes : 60;
        this.currentStudents = 0;
        this.status = GroupLessonStatus.SCHEDULED;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
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

    public GroupLessonStatus getStatus() {
        return status;
    }

    public void setStatus(GroupLessonStatus status) {
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

    public List<GroupLessonRegistration> getRegistrations() {
        return registrations;
    }

    public void setRegistrations(List<GroupLessonRegistration> registrations) {
        this.registrations = registrations;
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
    public boolean isFull() {
        return maxStudents != null && currentStudents >= maxStudents;
    }

    public boolean hasSpace() {
        return maxStudents == null || currentStudents < maxStudents;
    }

    public int getAvailableSpaces() {
        if (maxStudents == null) {
            return Integer.MAX_VALUE;
        }
        return Math.max(0, maxStudents - currentStudents);
    }

    public void incrementStudentCount() {
        this.currentStudents++;
    }

    public void decrementStudentCount() {
        if (this.currentStudents > 0) {
            this.currentStudents--;
        }
    }

    public void addRegistration(GroupLessonRegistration registration) {
        registrations.add(registration);
        registration.setGroupLesson(this);
        incrementStudentCount();
    }

    public void removeRegistration(GroupLessonRegistration registration) {
        registrations.remove(registration);
        registration.setGroupLesson(null);
        decrementStudentCount();
    }

    public boolean isScheduled() {
        return this.status == GroupLessonStatus.SCHEDULED;
    }

    public boolean isConfirmed() {
        return this.status == GroupLessonStatus.CONFIRMED;
    }

    public boolean isInProgress() {
        return this.status == GroupLessonStatus.IN_PROGRESS;
    }

    public boolean isCompleted() {
        return this.status == GroupLessonStatus.COMPLETED;
    }

    public boolean isCancelled() {
        return this.status == GroupLessonStatus.CANCELLED;
    }

    public boolean isPostponed() {
        return this.status == GroupLessonStatus.POSTPONED;
    }

    public void confirmLesson() {
        this.status = GroupLessonStatus.CONFIRMED;
    }

    public void startLesson() {
        this.status = GroupLessonStatus.IN_PROGRESS;
    }

    public void completeLesson() {
        this.status = GroupLessonStatus.COMPLETED;
    }

    public void cancelLesson() {
        this.status = GroupLessonStatus.CANCELLED;
    }

    public void postponeLesson() {
        this.status = GroupLessonStatus.POSTPONED;
    }
}