package com.crm.system.dto;

public class MessageDto {
    private String message;

    public MessageDto() {}

    public MessageDto(String message) {
        this.message = message;
    }

    // Getters and Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}