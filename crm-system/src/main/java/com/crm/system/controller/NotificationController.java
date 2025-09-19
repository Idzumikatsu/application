package com.crm.system.controller;

import com.crm.system.dto.MessageDto;
import com.crm.system.dto.NotificationDto;
import com.crm.system.model.Notification;
import com.crm.system.service.NotificationBroadcastService;
import com.crm.system.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private NotificationBroadcastService notificationBroadcastService;

    // User-specific notification endpoints (existing functionality)
    @GetMapping("/recipients/{recipientId}/{recipientType}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Page<NotificationDto>> getNotificationsByRecipient(
            @PathVariable Long recipientId,
            @PathVariable Notification.RecipientType recipientType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<Notification.NotificationStatus> statuses,
            @RequestParam(required = false) List<Notification.NotificationType> types) {
        
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notificationPage;
        
        if (statuses != null && !statuses.isEmpty() && types != null && !types.isEmpty()) {
            notificationPage = notificationService.findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                    recipientId, recipientType, types, statuses, pageable);
        } else if (statuses != null && !statuses.isEmpty()) {
            notificationPage = notificationService.findByRecipientIdAndRecipientTypeAndStatuses(
                    recipientId, recipientType, statuses, pageable);
        } else if (types != null && !types.isEmpty()) {
            // This would require a new method in NotificationService
            notificationPage = notificationService.findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                    recipientId, recipientType, types, List.of(), pageable);
        } else {
            // Get all notifications for recipient
            notificationPage = notificationService.findByRecipientIdAndRecipientTypeAndDateRange(
                    recipientId, recipientType, LocalDateTime.now().minusMonths(1), LocalDateTime.now(), pageable);
        }
        
        Page<NotificationDto> notificationDtos = notificationPage.map(this::convertToDto);
        return ResponseEntity.ok(notificationDtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<NotificationDto> getNotificationById(@PathVariable Long id) {
        Notification notification = notificationService.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        return ResponseEntity.ok(convertToDto(notification));
    }

    @PostMapping("/{id}/mark-as-read")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<NotificationDto> markNotificationAsRead(@PathVariable Long id) {
        Notification notification = notificationService.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
        notificationService.markAsRead(notification);
        return ResponseEntity.ok(convertToDto(notification));
    }

    @GetMapping("/recipients/{recipientId}/{recipientType}/unread-count")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<Long> getUnreadNotificationsCount(
            @PathVariable Long recipientId,
            @PathVariable Notification.RecipientType recipientType) {
        Long count = notificationService.countUnreadNotificationsByRecipient(recipientId, recipientType);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/recipients/{recipientId}/{recipientType}/pending")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('TEACHER') or hasRole('STUDENT')")
    public ResponseEntity<List<NotificationDto>> getPendingNotifications(
            @PathVariable Long recipientId,
            @PathVariable Notification.RecipientType recipientType) {
        List<Notification> notifications = notificationService.findPendingNotificationsByRecipient(recipientId, recipientType);
        List<NotificationDto> notificationDtos = notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDtos);
    }

    // Extended admin notification management endpoints
    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendBroadcastNotification(@RequestBody BroadcastNotificationRequest request) {
        notificationBroadcastService.broadcastToRecipientType(
                request.getRecipientType(),
                request.getNotificationType(),
                request.getTitle(),
                request.getMessage());
        return ResponseEntity.ok(new MessageDto("Broadcast notification sent successfully!"));
    }

    @PostMapping("/broadcast/filtered")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendFilteredBroadcastNotification(@RequestBody FilteredBroadcastNotificationRequest request) {
        notificationBroadcastService.broadcastToFilteredRecipients(
                request.getRecipientIds(),
                request.getRecipientType(),
                request.getNotificationType(),
                request.getTitle(),
                request.getMessage());
        return ResponseEntity.ok(new MessageDto("Filtered broadcast notification sent successfully!"));
    }

    @PostMapping("/broadcast/priority")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> sendPriorityBroadcastNotification(@RequestBody PriorityBroadcastNotificationRequest request) {
        notificationBroadcastService.broadcastWithPriority(
                request.getRecipientType(),
                request.getNotificationType(),
                request.getTitle(),
                request.getMessage(),
                request.isHighPriority());
        return ResponseEntity.ok(new MessageDto("Priority broadcast notification sent successfully!"));
    }

    @GetMapping("/statistics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<NotificationBroadcastService.BroadcastStatistics> getNotificationStatistics() {
        NotificationBroadcastService.BroadcastStatistics statistics = notificationBroadcastService.getBroadcastStatistics();
        return ResponseEntity.ok(statistics);
    }

    @PostMapping("/resend-failed")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> resendFailedNotifications() {
        Integer resentCount = notificationBroadcastService.resendFailedNotifications().join();
        return ResponseEntity.ok(new MessageDto("Resent " + resentCount + " failed notifications successfully!"));
    }

    @DeleteMapping("/cancel-scheduled/{notificationType}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> cancelScheduledNotifications(@PathVariable Notification.NotificationType notificationType) {
        notificationBroadcastService.cancelScheduledBroadcasts(notificationType);
        return ResponseEntity.ok(new MessageDto("Cancelled scheduled notifications of type: " + notificationType));
    }

    // System-wide notification monitoring for admin
    @GetMapping("/system-overview")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> getSystemNotificationOverview() {
        // This endpoint will return system-wide notification statistics
        // For now, return a placeholder - will be enhanced with actual data
        return ResponseEntity.ok(new MessageDto("System notification overview - to be implemented with detailed statistics"));
    }

    private NotificationDto convertToDto(Notification notification) {
        NotificationDto dto = new NotificationDto();
        dto.setId(notification.getId());
        dto.setRecipientId(notification.getRecipientId());
        dto.setRecipientType(notification.getRecipientType());
        dto.setNotificationType(notification.getNotificationType());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setStatus(notification.getStatus());
        dto.setCreatedAt(notification.getCreatedAt());
        dto.setSentAt(notification.getSentAt());
        dto.setDeliveredAt(notification.getDeliveredAt());
        dto.setReadAt(notification.getReadAt());
        dto.setFailedAt(notification.getFailedAt());
        return dto;
    }

    // DTO classes for request bodies
    public static class BroadcastNotificationRequest {
        private Notification.RecipientType recipientType;
        private Notification.NotificationType notificationType;
        private String title;
        private String message;

        // Getters and setters
        public Notification.RecipientType getRecipientType() { return recipientType; }
        public void setRecipientType(Notification.RecipientType recipientType) { this.recipientType = recipientType; }

        public Notification.NotificationType getNotificationType() { return notificationType; }
        public void setNotificationType(Notification.NotificationType notificationType) { this.notificationType = notificationType; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class FilteredBroadcastNotificationRequest {
        private List<Long> recipientIds;
        private Notification.RecipientType recipientType;
        private Notification.NotificationType notificationType;
        private String title;
        private String message;

        // Getters and setters
        public List<Long> getRecipientIds() { return recipientIds; }
        public void setRecipientIds(List<Long> recipientIds) { this.recipientIds = recipientIds; }

        public Notification.RecipientType getRecipientType() { return recipientType; }
        public void setRecipientType(Notification.RecipientType recipientType) { this.recipientType = recipientType; }

        public Notification.NotificationType getNotificationType() { return notificationType; }
        public void setNotificationType(Notification.NotificationType notificationType) { this.notificationType = notificationType; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }

    public static class PriorityBroadcastNotificationRequest {
        private Notification.RecipientType recipientType;
        private Notification.NotificationType notificationType;
        private String title;
        private String message;
        private boolean highPriority;

        // Getters and setters
        public Notification.RecipientType getRecipientType() { return recipientType; }
        public void setRecipientType(Notification.RecipientType recipientType) { this.recipientType = recipientType; }

        public Notification.NotificationType getNotificationType() { return notificationType; }
        public void setNotificationType(Notification.NotificationType notificationType) { this.notificationType = notificationType; }

        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public boolean isHighPriority() { return highPriority; }
        public void setHighPriority(boolean highPriority) { this.highPriority = highPriority; }
    }
}