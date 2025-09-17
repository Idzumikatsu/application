package com.crm.email.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class WelcomeEmailRequest {

    @Email
    @NotBlank
    private String recipientEmail;

    @NotBlank
    private String recipientName;

    @NotBlank
    private String role;

    @NotBlank
    private String temporaryPassword;

    @NotBlank
    private String loginUrl;

    private String telegramBotUrl;

    private String supportEmail;

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getTemporaryPassword() {
        return temporaryPassword;
    }

    public void setTemporaryPassword(String temporaryPassword) {
        this.temporaryPassword = temporaryPassword;
    }

    public String getLoginUrl() {
        return loginUrl;
    }

    public void setLoginUrl(String loginUrl) {
        this.loginUrl = loginUrl;
    }

    public String getTelegramBotUrl() {
        return telegramBotUrl;
    }

    public void setTelegramBotUrl(String telegramBotUrl) {
        this.telegramBotUrl = telegramBotUrl;
    }

    public String getSupportEmail() {
        return supportEmail;
    }

    public void setSupportEmail(String supportEmail) {
        this.supportEmail = supportEmail;
    }
}
