package com.crm.system.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "recipient_id")
    private Long recipientId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "recipient_type")
    private RecipientType recipientType;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type")
    private NotificationType notificationType;

    @NotNull
    @Column(name = "title")
    private String title;

    @NotNull
    @Column(name = "message")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private NotificationStatus status = NotificationStatus.PENDING;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @Column(name = "related_entity_type")
    private String relatedEntityType;

    @Column(name = "priority")
    private Integer priority = 0;

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
    public enum RecipientType {
        STUDENT,      // Студент
        TEACHER,      // Преподаватель
        MANAGER,      // Менеджер
        ADMIN         // Администратор
    }

    public enum NotificationType {
        LESSON_SCHEDULED,        // Урок запланирован
        LESSON_CANCELLED,       // Урок отменен
        LESSON_REMINDER,        // Напоминание об уроке
        LESSON_COMPLETED,       // Урок завершен
        GROUP_LESSON_SCHEDULED, // Групповой урок запланирован
        GROUP_LESSON_CANCELLED,  // Групповой урок отменен
        GROUP_LESSON_REMINDER,  // Напоминание о групповом уроке
        PACKAGE_ENDING_SOON,    // Пакет уроков заканчивается
        PAYMENT_DUE,            // Оплата по расписанию
        SYSTEM_MESSAGE,        // Системное сообщение
        FEEDBACK_REQUEST        // Запрос на обратную связь
    }

    public enum NotificationStatus {
        PENDING,      // Ожидает отправки
        SENT,         // Отправлено
        DELIVERED,    // Доставлено
        READ,         // Прочитано
        FAILED        // Ошибка отправки
    }

    // Constructors
    public Notification() {}

    public Notification(Long recipientId, RecipientType recipientType, 
                       NotificationType notificationType, String title, String message) {
        this.recipientId = recipientId;
        this.recipientType = recipientType;
        this.notificationType = notificationType;
        this.title = title;
        this.message = message;
        this.status = NotificationStatus.PENDING;
        this.priority = 0;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public RecipientType getRecipientType() {
        return recipientType;
    }

    public void setRecipientType(RecipientType recipientType) {
        this.recipientType = recipientType;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public NotificationStatus getStatus() {
        return status;
    }

    public void setStatus(NotificationStatus status) {
        this.status = status;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public Long getRelatedEntityId() {
        return relatedEntityId;
    }

    public void setRelatedEntityId(Long relatedEntityId) {
        this.relatedEntityId = relatedEntityId;
    }

    public String getRelatedEntityType() {
        return relatedEntityType;
    }

    public void setRelatedEntityType(String relatedEntityType) {
        this.relatedEntityType = relatedEntityType;
    }

    public Integer getPriority() {
        return priority;
    }

    public void setPriority(Integer priority) {
        this.priority = priority;
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
    public boolean isPending() {
        return this.status == NotificationStatus.PENDING;
    }

    public boolean isSent() {
        return this.status == NotificationStatus.SENT;
    }

    public boolean isDelivered() {
        return this.status == NotificationStatus.DELIVERED;
    }

    public boolean isRead() {
        return this.status == NotificationStatus.READ;
    }

    public boolean hasFailed() {
        return this.status == NotificationStatus.FAILED;
    }

    public void markAsSent() {
        this.status = NotificationStatus.SENT;
        this.sentAt = LocalDateTime.now();
    }

    public void markAsDelivered() {
        this.status = NotificationStatus.DELIVERED;
    }

    public void markAsRead() {
        this.status = NotificationStatus.READ;
        this.readAt = LocalDateTime.now();
    }

    public void markAsFailed() {
        this.status = NotificationStatus.FAILED;
    }

    public String getRecipientTypeName() {
        switch (this.recipientType) {
            case STUDENT: return "Студент";
            case TEACHER: return "Преподаватель";
            case MANAGER: return "Менеджер";
            case ADMIN: return "Администратор";
            default: return "Неизвестный";
        }
    }

    public String getNotificationTypeName() {
        switch (this.notificationType) {
            case LESSON_SCHEDULED: return "Урок запланирован";
            case LESSON_CANCELLED: return "Урок отменен";
            case LESSON_REMINDER: return "Напоминание об уроке";
            case LESSON_COMPLETED: return "Урок завершен";
            case GROUP_LESSON_SCHEDULED: return "Групповой урок запланирован";
            case GROUP_LESSON_CANCELLED: return "Групповой урок отменен";
            case GROUP_LESSON_REMINDER: return "Напоминание о групповом уроке";
            case PACKAGE_ENDING_SOON: return "Пакет уроков заканчивается";
            case PAYMENT_DUE: return "Оплата по расписанию";
            case SYSTEM_MESSAGE: return "Системное сообщение";
            case FEEDBACK_REQUEST: return "Запрос на обратную связь";
            default: return "Уведомление";
        }
    }

    public String getStatusName() {
        switch (this.status) {
            case PENDING: return "Ожидает отправки";
            case SENT: return "Отправлено";
            case DELIVERED: return "Доставлено";
            case READ: return "Прочитано";
            case FAILED: return "Ошибка отправки";
            default: return "Неизвестный";
        }
    }
}