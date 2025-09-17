package com.crm.email.controller;

import com.crm.email.dto.EmailSendResponse;
import com.crm.email.dto.MaintenanceEmailRequest;
import com.crm.email.dto.PasswordResetEmailRequest;
import com.crm.email.dto.WelcomeEmailRequest;
import com.crm.email.service.WelcomeEmailService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    private static final Logger log = LoggerFactory.getLogger(EmailController.class);

    private final WelcomeEmailService welcomeEmailService;

    public EmailController(WelcomeEmailService welcomeEmailService) {
        this.welcomeEmailService = welcomeEmailService;
    }

    @PostMapping("/welcome")
    public ResponseEntity<EmailSendResponse> sendWelcomeEmail(@Valid @RequestBody WelcomeEmailRequest request) throws MessagingException {
        welcomeEmailService.sendWelcomeEmail(request);
        return ResponseEntity.ok(new EmailSendResponse(true, "Welcome email sent"));
    }

    @PostMapping("/password-reset")
    public ResponseEntity<EmailSendResponse> sendPasswordResetEmail(@Valid @RequestBody PasswordResetEmailRequest request) throws MessagingException {
        welcomeEmailService.sendPasswordResetEmail(request);
        return ResponseEntity.ok(new EmailSendResponse(true, "Password reset email sent"));
    }

    @PostMapping("/maintenance")
    public ResponseEntity<EmailSendResponse> sendMaintenanceEmail(@Valid @RequestBody MaintenanceEmailRequest request) throws MessagingException {
        welcomeEmailService.sendMaintenanceEmail(request);
        return ResponseEntity.ok(new EmailSendResponse(true, "Maintenance email sent"));
    }

    @ExceptionHandler(MessagingException.class)
    public ResponseEntity<EmailSendResponse> handleMessagingException(MessagingException ex) {
        log.error("Email sending failed", ex);
        return ResponseEntity.internalServerError().body(new EmailSendResponse(false, "Email sending failed: " + ex.getMessage()));
    }
}
