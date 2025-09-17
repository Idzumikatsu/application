package com.crm.system.dto;

import com.crm.system.model.TelegramMessage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TelegramSendRequest {

    @NotNull
    private Long recipientId;

    @NotBlank
    private String recipientType;

    private Long chatId;

    @NotBlank
    private String message;

    @NotBlank
    private String messageType;

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientType() {
        return recipientType;
    }

    public void setRecipientType(String recipientType) {
        this.recipientType = recipientType;
    }

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public TelegramMessage.RecipientType toRecipientType() {
        return TelegramMessage.RecipientType.valueOf(recipientType.toUpperCase());
    }

    public TelegramMessage.MessageType toMessageType() {
        return TelegramMessage.MessageType.valueOf(messageType.toUpperCase());
    }
}
