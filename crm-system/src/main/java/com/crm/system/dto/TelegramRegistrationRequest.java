package com.crm.system.dto;

import jakarta.validation.constraints.NotNull;

public class TelegramRegistrationRequest {

    @NotNull
    private Long chatId;

    public Long getChatId() {
        return chatId;
    }

    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }
}
