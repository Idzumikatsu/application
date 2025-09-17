package com.crm.email.service;

import com.crm.email.dto.MaintenanceEmailRequest;
import com.crm.email.dto.PasswordResetEmailRequest;
import com.crm.email.dto.WelcomeEmailRequest;
import jakarta.mail.MessagingException;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class WelcomeEmailService {

    private static final Logger log = LoggerFactory.getLogger(WelcomeEmailService.class);

    private final EmailSenderService emailSenderService;

    public WelcomeEmailService(EmailSenderService emailSenderService) {
        this.emailSenderService = emailSenderService;
    }

    public void sendWelcomeEmail(WelcomeEmailRequest request) throws MessagingException {
        String template = resolveTemplateForRole(request.getRole());
        String subject = buildSubjectForRole(request.getRole());
        Map<String, Object> variables = buildWelcomeVariables(request);
        emailSenderService.sendEmail(request.getRecipientEmail(), subject, template, variables);
    }

    public void sendPasswordResetEmail(PasswordResetEmailRequest request) throws MessagingException {
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", request.getRecipientName());
        variables.put("resetLink", request.getResetLink());
        variables.put("supportEmail", request.getSupportEmail());
        emailSenderService.sendEmail(request.getRecipientEmail(), "Сброс пароля для CRM Synergy", "password-reset", variables);
    }

    public void sendMaintenanceEmail(MaintenanceEmailRequest request) throws MessagingException {
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", request.getRecipientName());
        variables.put("windowStart", request.getWindowStart());
        variables.put("windowEnd", request.getWindowEnd());
        variables.put("details", request.getDetails());
        variables.put("supportEmail", request.getSupportEmail());
        emailSenderService.sendEmail(request.getRecipientEmail(), "Плановое техническое обслуживание CRM Synergy", "system-maintenance", variables);
    }

    private Map<String, Object> buildWelcomeVariables(WelcomeEmailRequest request) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("name", request.getRecipientName());
        variables.put("role", request.getRole());
        variables.put("temporaryPassword", request.getTemporaryPassword());
        variables.put("loginUrl", request.getLoginUrl());
        variables.put("telegramBotUrl", request.getTelegramBotUrl());
        variables.put("supportEmail", request.getSupportEmail());
        return variables;
    }

    private String resolveTemplateForRole(String role) {
        if (role == null) {
            return "welcome-generic";
        }
        return switch (role.toUpperCase()) {
            case "ADMIN", "MANAGER" -> "welcome-manager";
            case "TEACHER" -> "welcome-teacher";
            case "STUDENT" -> "welcome-student";
            default -> "welcome-generic";
        };
    }

    private String buildSubjectForRole(String role) {
        if (role == null) {
            return "Добро пожаловать в CRM Synergy";
        }
        return switch (role.toUpperCase()) {
            case "ADMIN", "MANAGER" -> "Доступ к CRM Synergy: учетная запись менеджера";
            case "TEACHER" -> "Добро пожаловать в CRM Synergy: учетная запись преподавателя";
            case "STUDENT" -> "Добро пожаловать в CRM Synergy";
            default -> "Добро пожаловать в CRM Synergy";
        };
    }
}
