package com.crm.system.dto;

import com.crm.system.model.TelegramMessage;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class TelegramMessageDto {
    private Long id;

    @NotNull
    private Long chatId;

    private Long messageId;

    @NotNull
    private Long recipientId;

    private String recipientName;

    @NotNull
    private TelegramMessage.RecipientType recipientType;

    private String messageText;

    private TelegramMessage.MessageType messageType;

    private TelegramMessage.DeliveryStatus deliveryStatus = TelegramMessage.DeliveryStatus.SENT;

    private LocalDateTime sentAt;

    private LocalDateTime deliveredAt;

    private LocalDateTime readAt;

    private String errorMessage;

    private Integer retryCount = 0;

    private Long relatedEntityId;

    private String relatedEntityType;

    private String createdAt;

    private String updatedAt;

    // Constructors
    public TelegramMessageDto() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public Long getMessageId() {
        return messageId;
    }

    public void setMessageId(Long messageId) {
        this.messageId = messageId;
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

    public TelegramMessage.RecipientType getRecipientType() {
        return recipientType;
    }

    public void setRecipientType(TelegramMessage.RecipientType recipientType) {
        this.recipientType = recipientType;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public TelegramMessage.MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(TelegramMessage.MessageType messageType) {
        this.messageType = messageType;
    }

    public TelegramMessage.DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(TelegramMessage.DeliveryStatus deliveryStatus) {
        this.deliveryStatus = deliveryStatus;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }

    public LocalDateTime getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(LocalDateTime deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public LocalDateTime getReadAt() {
        return readAt;
    }

    public void setReadAt(LocalDateTime readAt) {
        this.readAt = readAt;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
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
        return this.deliveryStatus == TelegramMessage.DeliveryStatus.PENDING;
    }

    public boolean isSent() {
        return this.deliveryStatus == TelegramMessage.DeliveryStatus.SENT;
    }

    public boolean isDelivered() {
        return this.deliveryStatus == TelegramMessage.DeliveryStatus.DELIVERED;
    }

    public boolean isRead() {
        return this.deliveryStatus == TelegramMessage.DeliveryStatus.READ;
    }

    public boolean hasFailed() {
        return this.deliveryStatus == TelegramMessage.DeliveryStatus.FAILED;
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

    public String getMessageTypeName() {
        switch (messageType) {
            case TEXT: return "Текстовое сообщение";
            case LESSON_REMINDER: return "Напоминание об уроке";
            case LESSON_CANCELLED: return "Уведомление об отмене урока";
            case LESSON_CONFIRMATION: return "Подтверждение урока";
            case GROUP_LESSON_REMINDER: return "Напоминание о групповом уроке";
            case GROUP_LESSON_CANCELLED: return "Уведомление об отмене группового урока";
            case SYSTEM_NOTIFICATION: return "Системное уведомление";
            case FEEDBACK_REQUEST: return "Запрос на обратную связь";
            default: return "Сообщение";
        }
    }

    public String getDeliveryStatusName() {
        switch (deliveryStatus) {
            case PENDING: return "Ожидает отправки";
            case SENT: return "Отправлено";
            case DELIVERED: return "Доставлено";
            case READ: return "Прочитано";
            case FAILED: return "Ошибка отправки";
            default: return "Неизвестный";
        }
    }
}