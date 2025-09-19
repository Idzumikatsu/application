package com.crm.system.controller;

import com.crm.system.dto.MessageDto;
import com.crm.system.model.Notification;
import com.crm.system.service.EmailService;
import com.crm.system.service.NotificationBroadcastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.preauthorize.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.concurrent.CompletableFuture;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/emails")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationBroadcastService notificationBroadcastService;

    // Basic bulk email sending for admin
    @PostMapping("/bulk-send")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendBulkEmail(@RequestBody BulkEmailRequest request) {
        CompletableFuture<Boolean> future = emailService.sendBulkEmail(
                request.getRecipientEmails(),
                request.getSubject(),
                request.getMessage(),
                "System Administrator");
        
        // In a real implementation, you might want to handle this asynchronously
        // For now, we'll wait for completion
        future.join();
        
        return ResponseEntity.ok(new MessageDto("Bulk email sent successfully to " + request.getRecipientEmails().size() + " recipients!"));
    }

    // Bulk email sending by recipient type for admin
    @PostMapping("/bulk-send-by-type")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendBulkEmailByRecipientType(@RequestBody BulkEmailByTypeRequest request) {
        CompletableFuture<Boolean> future = emailService.sendBulkEmailByRecipientType(
                request.getRecipientType(),
                request.getSubject(),
                request.getMessage(),
                "System Administrator");
        
        // In a real implementation, you might want to handle this asynchronously
        // For now, we'll wait for completion
        future.join();
        
        return ResponseEntity.ok(new MessageDto("Bulk email sent successfully by recipient type: " + request.getRecipientType()));
    }

    // Bulk email sending with filtering for admin
    @PostMapping("/bulk-send-filtered")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendFilteredBulkEmail(@RequestBody FilteredBulkEmailRequest request) {
        CompletableFuture<Boolean> future = emailService.sendFilteredBulkEmail(
                request.getRecipientIds(),
                request.getRecipientType(),
                request.getSubject(),
                request.getMessage(),
                "System Administrator");
        
        // In a real implementation, you might want to handle this asynchronously
        // For now, we'll wait for completion
        future.join();
        
        return ResponseEntity.ok(new MessageDto("Filtered bulk email sent successfully to " + request.getRecipientIds().size() + " recipients!"));
    }

    // System maintenance emails for admin
    @PostMapping("/system-maintenance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendSystemMaintenanceEmail(@RequestBody SystemMaintenanceEmailRequest request) {
        CompletableFuture<Boolean> future = emailService.sendSystemMaintenanceEmail(
                request.getSubject(),
                request.getMessage());
        
        // In a real implementation, you might want to handle this asynchronously
        // For now, we'll wait for completion
        future.join();
        
        return ResponseEntity.ok(new MessageDto("System maintenance email sent successfully!"));
    }

    // System alert emails for admin
    @PostMapping("/system-alert")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendSystemAlertEmail(@RequestBody SystemAlertEmailRequest request) {
        CompletableFuture<Boolean> future = emailService.sendSystemAlertEmail(
                request.getSubject(),
                request.getMessage(),
                request.getAlertLevel());
        
        // In a real implementation, you might want to handle this asynchronously
        // For now, we'll wait for completion
        future.join();
        
        return ResponseEntity.ok(new MessageDto("System alert email sent successfully!"));
    }

    // System report emails for admin
    @PostMapping("/system-report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendSystemReportEmail(@RequestBody SystemReportEmailRequest request) {
        CompletableFuture<Boolean> future = emailService.sendSystemReportEmail(
                request.getSubject(),
                request.getReportContent(),
                request.getRecipientEmails());
        
        // In a real implementation, you might want to handle this asynchronously
        // For now, we'll wait for completion
        future.join();
        
        return ResponseEntity.ok(new MessageDto("System report email sent successfully to " + request.getRecipientEmails().size() + " recipients!"));
    }

    // Security alert emails for admin
    @PostMapping("/security-alert")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendSecurityAlertEmail(@RequestBody SecurityAlertEmailRequest request) {
        CompletableFuture<Boolean> future = emailService.sendSecurityAlertEmail(
                request.getSubject(),
                request.getAlertMessage(),
                request.getIpAddress(),
                request.getUserAgent());
        
        // In a real implementation, you might want to handle this asynchronously
        // For now, we'll wait for completion
        future.join();
        
        return ResponseEntity.ok(new MessageDto("Security alert email sent successfully!"));
    }

    // Performance alert emails for admin
    @PostMapping("/performance-alert")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendPerformanceAlertEmail(@RequestBody PerformanceAlertEmailRequest request) {
        CompletableFuture<Boolean> future = emailService.sendPerformanceAlertEmail(
                request.getSubject(),
                request.getAlertMessage(),
                request.getCpuUsage(),
                request.getMemoryUsage(),
                request.getDiskUsage());
        
        // In a real implementation, you might want to handle this asynchronously
        // For now, we'll wait for completion
        future.join();
        
        return ResponseEntity.ok(new MessageDto("Performance alert email sent successfully!"));
    }

    // Backup status emails for admin
    @PostMapping("/backup-status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendBackupStatusEmail(@RequestBody BackupStatusEmailRequest request) {
        CompletableFuture<Boolean> future = emailService.sendBackupStatusEmail(
                request.getSubject(),
                request.getBackupStatus(),
                request.isSuccess(),
                request.getDetails());
        
        // In a real implementation, you might want to handle this asynchronously
        // For now, we'll wait for completion
        future.join();
        
        return ResponseEntity.ok(new MessageDto("Backup status email sent successfully!"));
    }

    // Email template management (placeholder for future implementation)
    @GetMapping("/templates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> getEmailTemplates() {
        // This would return a list of available email templates
        return ResponseEntity.ok(new MessageDto("Available email templates - to be implemented"));
    }

    @PostMapping("/templates")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> createEmailTemplate(@RequestBody EmailTemplateRequest request) {
        // This would create a new email template
        return ResponseEntity.ok(new MessageDto("Email template created successfully - to be implemented"));
    }

    @PutMapping("/templates/{templateId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> updateEmailTemplate(@PathVariable Long templateId, @RequestBody EmailTemplateRequest request) {
        // This would update an existing email template
        return ResponseEntity.ok(new MessageDto("Email template updated successfully - to be implemented"));
    }

    @DeleteMapping("/templates/{templateId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> deleteEmailTemplate(@PathVariable Long templateId) {
        // This would delete an email template
        return ResponseEntity.ok(new MessageDto("Email template deleted successfully - to be implemented"));
    }

    // Email statistics and monitoring
    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> getEmailStatistics() {
        // This would return email sending statistics
        return ResponseEntity.ok(new MessageDto("Email statistics - to be implemented"));
    }

    // DTO classes for request bodies
    public static class BulkEmailRequest {
        private List<String> recipientEmails;
        private String subject;
        private String message;

        // Getters and setters
        public List<String> getRecipientEmails() { return recipientEmails; }
        public void setRecipientEmails(List<String> recipientEmails) { this.recipientEmails = recipientEmails; }

        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class BulkEmailByTypeRequest {
        private Notification.RecipientType recipientType;
        private String subject;
        private String message;

        // Getters and setters
        public Notification.RecipientType getRecipientType() { return recipientType; }
        public void setRecipientType(Notification.RecipientType recipientType) { this.recipientType = recipientType; }

        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class FilteredBulkEmailRequest {
        private List<Long> recipientIds;
        private Notification.RecipientType recipientType;
        private String subject;
        private String message;

        // Getters and setters
        public List<Long> getRecipientIds() { return recipientIds; }
        public void setRecipientIds(List<Long> recipientIds) { this.recipientIds = recipientIds; }

        public Notification.RecipientType getRecipientType() { return recipientType; }
        public void setRecipientType(Notification.RecipientType recipientType) { this.recipientType = recipientType; }

        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class SystemMaintenanceEmailRequest {
        private String subject;
        private String message;

        // Getters and setters
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class SystemAlertEmailRequest {
        private String subject;
        private String message;
        private String alertLevel; // INFO, WARNING, ERROR, CRITICAL

        // Getters and setters
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getAlertLevel() { return alertLevel; }
        public void setAlertLevel(String alertLevel) { this.alertLevel = alertLevel; }
    }

    public static class SystemReportEmailRequest {
        private String subject;
        private String reportContent;
        private List<String> recipientEmails;

        // Getters and setters
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getReportContent() { return reportContent; }
        public void setReportContent(String reportContent) { this.reportContent = reportContent; }

        public List<String> getRecipientEmails() { return recipientEmails; }
        public void setRecipientEmails(List<String> recipientEmails) { this.recipientEmails = recipientEmails; }
    }

    public static class SecurityAlertEmailRequest {
        private String subject;
        private String alertMessage;
        private String ipAddress;
        private String userAgent;

        // Getters and setters
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getAlertMessage() { return alertMessage; }
        public void setAlertMessage(String alertMessage) { this.alertMessage = alertMessage; }

        public String getIpAddress() { return ipAddress; }
        public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

        public String getUserAgent() { return userAgent; }
        public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    }

    public static class PerformanceAlertEmailRequest {
        private String subject;
        private String alertMessage;
        private double cpuUsage;
        private double memoryUsage;
        private double diskUsage;

        // Getters and setters
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getAlertMessage() { return alertMessage; }
        public void setAlertMessage(String alertMessage) { this.alertMessage = alertMessage; }

        public double getCpuUsage() { return cpuUsage; }
        public void setCpuUsage(double cpuUsage) { this.cpuUsage = cpuUsage; }

        public double getMemoryUsage() { return memoryUsage; }
        public void setMemoryUsage(double memoryUsage) { this.memoryUsage = memoryUsage; }

        public double getDiskUsage() { return diskUsage; }
        public void setDiskUsage(double diskUsage) { this.diskUsage = diskUsage; }
    }

    public static class BackupStatusEmailRequest {
        private String subject;
        private String backupStatus;
        private boolean success;
        private String details;

        // Getters and setters
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getBackupStatus() { return backupStatus; }
        public void setBackupStatus(String backupStatus) { this.backupStatus = backupStatus; }

        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }

        public String getDetails() { return details; }
        public void setDetails(String details) { this.details = details; }
    }

    public static class EmailTemplateRequest {
        private String templateName;
        private String templateSubject;
        private String templateBody;
        private String description;

        // Getters and setters
        public String getTemplateName() { return templateName; }
        public void setTemplateName(String templateName) { this.templateName = templateName; }

        public String getTemplateSubject() { return templateSubject; }
        public void setTemplateSubject(String templateSubject) { this.templateSubject = templateSubject; }

        public String getTemplateBody() { return templateBody; }
        public void setTemplateBody(String templateBody) { this.templateBody = templateBody; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}