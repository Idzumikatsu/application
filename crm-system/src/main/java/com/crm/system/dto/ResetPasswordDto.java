package com.crm.system.dto;

public class ResetPasswordDto {
    private String newPassword;

    // Constructors
    public ResetPasswordDto() {}

    public ResetPasswordDto(String newPassword) {
        this.newPassword = newPassword;
    }

    // Getters and Setters
    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}