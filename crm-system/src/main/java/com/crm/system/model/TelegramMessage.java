package com.crm.system.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "telegram_messages")
public class TelegramMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "chat_id")
    private Long chatId;

    @Column(name = "message_id")
    private Long messageId;

    @NotNull
    @Column(name = "recipient_id")
    private Long recipientId;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "recipient_type")
    private RecipientType recipientType;

    @NotNull
    @Column(name = "message_text")
    private String messageText;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type")
    private MessageType messageType;

    @Enumerated(EnumType.STRING)
    @Column(name = "delivery_status")
    private DeliveryStatus deliveryStatus = DeliveryStatus.PENDING;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "read_at")
    private LocalDateTime readAt;

    @Column(name = "error_message")
    private String errorMessage;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "related_entity_id")
    private Long relatedEntityId;

    @Column(name = "related_entity_type")
    private String relatedEntityType;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        sentAt = LocalDateTime.now();
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

    public enum MessageType {
        TEXT,                    // Текстовое сообщение
        LESSON_REMINDER,         // Напоминание об уроке
        LESSON_CANCELLED,        // Уведомление об отмене урока
        LESSON_CONFIRMATION,     // Подтверждение урока
        GROUP_LESSON_REMINDER,   // Напоминание о групповом уроке
        GROUP_LESSON_CANCELLED,  // Уведомление об отмене группового урока
        SYSTEM_NOTIFICATION,     // Системное уведомление
        FEEDBACK_REQUEST         // Запрос на обратную связь
    }

    public enum DeliveryStatus {
        PENDING,      // Ожидает отправки
        SENT,         // Отправлено
        DELIVERED,    // Доставлено
        READ,         // Прочитано
        FAILED        // Ошибка отправки
    }

    // Constructors
    public TelegramMessage() {}

    public TelegramMessage(Long chatId, Long recipientId, RecipientType recipientType, String messageText) {
        this.chatId = chatId;
        this.recipientId = recipientId;
        this.recipientType = recipientType;
        this.messageText = messageText;
        this.deliveryStatus = DeliveryStatus.PENDING;
        this.messageType = MessageType.TEXT;
        this.retryCount = 0;
    }

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

    public RecipientType getRecipientType() {
        return recipientType;
    }

    public void setRecipientType(RecipientType recipientType) {
        this.recipientType = recipientType;
    }

    public String getMessageText() {
        return messageText;
    }

    public void setMessageText(String messageText) {
        this.messageText = messageText;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public void setMessageType(MessageType messageType) {
        this.messageType = messageType;
    }

    public DeliveryStatus getDeliveryStatus() {
        return deliveryStatus;
    }

    public void setDeliveryStatus(DeliveryStatus deliveryStatus) {
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
        return this.deliveryStatus == DeliveryStatus.PENDING;
    }

    public boolean isSent() {
        return this.deliveryStatus == DeliveryStatus.SENT;
    }

    public boolean isDelivered() {
        return this.deliveryStatus == DeliveryStatus.DELIVERED;
    }

    public boolean isRead() {
        return this.deliveryStatus == DeliveryStatus.READ;
    }

    public boolean hasFailed() {
        return this.deliveryStatus == DeliveryStatus.FAILED;
    }

    public void markAsSent() {
        this.deliveryStatus = DeliveryStatus.SENT;
        this.sentAt = LocalDateTime.now();
    }

    public void markAsDelivered() {
        this.deliveryStatus = DeliveryStatus.DELIVERED;
        this.deliveredAt = LocalDateTime.now();
    }

    public void markAsRead() {
        this.deliveryStatus = DeliveryStatus.READ;
        this.readAt = LocalDateTime.now();
    }

    public void markAsFailed(String errorMessage) {
        this.deliveryStatus = DeliveryStatus.FAILED;
        this.errorMessage = errorMessage;
    }

    public void incrementRetryCount() {
        this.retryCount++;
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

    public String getMessageTypeName() {
        switch (this.messageType) {
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
        switch (this.deliveryStatus) {
            case PENDING: return "Ожидает отправки";
            case SENT: return "Отправлено";
            case DELIVERED: return "Доставлено";
            case READ: return "Прочитано";
            case FAILED: return "Ошибка отправки";
            default: return "Неизвестный";
        }
    }
}