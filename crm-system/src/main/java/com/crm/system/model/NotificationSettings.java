package com.crm.system.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "notification_settings")
public class NotificationSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "user_id")
    private Long userId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "user_type")
    private UserType userType;

    @Column(name = "telegram_notifications_enabled")
    private Boolean telegramNotificationsEnabled = true;

    @Column(name = "email_notifications_enabled")
    private Boolean emailNotificationsEnabled = false;

    @Column(name = "lesson_reminders_enabled")
    private Boolean lessonRemindersEnabled = true;

    @Column(name = "lesson_status_changes_enabled")
    private Boolean lessonStatusChangesEnabled = true;

    @Column(name = "package_notifications_enabled")
    private Boolean packageNotificationsEnabled = true;

    @Column(name = "group_lesson_notifications_enabled")
    private Boolean groupLessonNotificationsEnabled = true;

    @Column(name = "system_notifications_enabled")
    private Boolean systemNotificationsEnabled = true;

    @Column(name = "feedback_requests_enabled")
    private Boolean feedbackRequestsEnabled = true;

    @Column(name = "reminder_time_before_lesson")
    private Integer reminderTimeBeforeLesson = 30; // Минуты до урока

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

    public enum UserType {
        STUDENT, TEACHER, MANAGER, ADMIN
    }

    // Constructors
    public NotificationSettings() {}

    public NotificationSettings(Long userId, UserType userType) {
        this.userId = userId;
        this.userType = userType;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public UserType getUserType() {
        return userType;
    }

    public void setUserType(UserType userType) {
        this.userType = userType;
    }

    public Boolean getTelegramNotificationsEnabled() {
        return telegramNotificationsEnabled;
    }

    public void setTelegramNotificationsEnabled(Boolean telegramNotificationsEnabled) {
        this.telegramNotificationsEnabled = telegramNotificationsEnabled;
    }

    public Boolean getEmailNotificationsEnabled() {
        return emailNotificationsEnabled;
    }

    public void setEmailNotificationsEnabled(Boolean emailNotificationsEnabled) {
        this.emailNotificationsEnabled = emailNotificationsEnabled;
    }

    public Boolean getLessonRemindersEnabled() {
        return lessonRemindersEnabled;
    }

    public void setLessonRemindersEnabled(Boolean lessonRemindersEnabled) {
        this.lessonRemindersEnabled = lessonRemindersEnabled;
    }

    public Boolean getLessonStatusChangesEnabled() {
        return lessonStatusChangesEnabled;
    }

    public void setLessonStatusChangesEnabled(Boolean lessonStatusChangesEnabled) {
        this.lessonStatusChangesEnabled = lessonStatusChangesEnabled;
    }

    public Boolean getPackageNotificationsEnabled() {
        return packageNotificationsEnabled;
    }

    public void setPackageNotificationsEnabled(Boolean packageNotificationsEnabled) {
        this.packageNotificationsEnabled = packageNotificationsEnabled;
    }

    public Boolean getGroupLessonNotificationsEnabled() {
        return groupLessonNotificationsEnabled;
    }

    public void setGroupLessonNotificationsEnabled(Boolean groupLessonNotificationsEnabled) {
        this.groupLessonNotificationsEnabled = groupLessonNotificationsEnabled;
    }

    public Boolean getSystemNotificationsEnabled() {
        return systemNotificationsEnabled;
    }

    public void setSystemNotificationsEnabled(Boolean systemNotificationsEnabled) {
        this.systemNotificationsEnabled = systemNotificationsEnabled;
    }

    public Boolean getFeedbackRequestsEnabled() {
        return feedbackRequestsEnabled;
    }

    public void setFeedbackRequestsEnabled(Boolean feedbackRequestsEnabled) {
        this.feedbackRequestsEnabled = feedbackRequestsEnabled;
    }

    public Integer getReminderTimeBeforeLesson() {
        return reminderTimeBeforeLesson;
    }

    public void setReminderTimeBeforeLesson(Integer reminderTimeBeforeLesson) {
        this.reminderTimeBeforeLesson = reminderTimeBeforeLesson;
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
    public boolean shouldSendTelegramNotification(TelegramMessage.MessageType messageType) {
        if (!telegramNotificationsEnabled) {
            return false;
        }

        switch (messageType) {
            case LESSON_REMINDER:
                return lessonRemindersEnabled;
            case LESSON_STATUS_CHANGE:
                return lessonStatusChangesEnabled;
            case PACKAGE_ENDING_SOON:
            case PACKAGE_EXPIRED:
                return packageNotificationsEnabled;
            case GROUP_LESSON_SCHEDULED:
            case GROUP_LESSON_REMINDER:
            case GROUP_LESSON_CANCELLED:
                return groupLessonNotificationsEnabled;
            case SYSTEM_NOTIFICATION:
                return systemNotificationsEnabled;
            case FEEDBACK_REQUEST:
                return feedbackRequestsEnabled;
            default:
                return true;
        }
    }
}