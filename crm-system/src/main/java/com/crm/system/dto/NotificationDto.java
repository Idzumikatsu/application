package com.crm.system.dto;

import com.crm.system.model.Notification;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class NotificationDto {
    private Long id;

    @NotNull
    private Long recipientId;

    private String recipientName;

    @NotNull
    private Notification.RecipientType recipientType;

    @NotNull
    private Notification.NotificationType notificationType;

    @NotNull
    private String title;

    @NotNull
    private String message;

    private Notification.NotificationStatus status = Notification.NotificationStatus.PENDING;

    private LocalDateTime sentAt;

    private LocalDateTime readAt;

    private Long relatedEntityId;

    private String relatedEntityType;

    private Integer priority = 0;

    private String createdAt;

    private String updatedAt;

    // Constructors
    public NotificationDto() {}

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

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public Notification.RecipientType getRecipientType() {
        return recipientType;
    }

    public void setRecipientType(Notification.RecipientType recipientType) {
        this.recipientType = recipientType;
    }

    public Notification.NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(Notification.NotificationType notificationType) {
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

    public Notification.NotificationStatus getStatus() {
        return status;
    }

    public void setStatus(Notification.NotificationStatus status) {
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
    public boolean isPending() {
        return this.status == Notification.NotificationStatus.PENDING;
    }

    public boolean isSent() {
        return this.status == Notification.NotificationStatus.SENT;
    }

    public boolean isDelivered() {
        return this.status == Notification.NotificationStatus.DELIVERED;
    }

    public boolean isRead() {
        return this.status == Notification.NotificationStatus.READ;
    }

    public boolean hasFailed() {
        return this.status == Notification.NotificationStatus.FAILED;
    }

    public String getRecipientTypeName() {
        switch (recipientType) {
            case STUDENT: return "Студент";
            case TEACHER: return "Преподаватель";
            case MANAGER: return "Менеджер";
            case ADMIN: return "Администратор";
            default: return "Неизвестный";
        }
    }

    public String getNotificationTypeName() {
        switch (notificationType) {
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
            case SYSTEM_ALERT: return "Системное предупреждение";
            case SYSTEM_MAINTENANCE: return "Техническое обслуживание";
            case FEEDBACK_REQUEST: return "Запрос на обратную связь";
            default: return "Уведомление";
        }
    }

    public String getStatusName() {
        switch (status) {
            case PENDING: return "Ожидает отправки";
            case SENT: return "Отправлено";
            case DELIVERED: return "Доставлено";
            case READ: return "Прочитано";
            case FAILED: return "Ошибка отправки";
            default: return "Неизвестный";
        }
    }
}