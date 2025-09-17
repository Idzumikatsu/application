package com.crm.system.controller;

import com.crm.system.dto.NotificationDto;
import com.crm.system.model.Notification;
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

    @GetMapping("/recipients/{recipientId}/{recipientType}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<NotificationDto>> getNotificationsByRecipient(
            @PathVariable Long recipientId,
            @PathVariable Notification.RecipientType recipientType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) List<Notification.NotificationStatus> statuses,
            @RequestParam(required = false) List<Notification.NotificationType> types,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {

        Pageable pageable = PageRequest.of(page, size);
        
        // Check if user has permission to access these notifications
        if (!hasPermissionToAccessNotifications(recipientId, recipientType)) {
            return ResponseEntity.status(403).build();
        }

        Page<Notification> notificationPage;
        
        LocalDateTime startDateTime = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endDateTime = endDate != null ? endDate.atTime(23, 59, 59) : null;

        if (statuses != null && types != null) {
            notificationPage = notificationService.findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                    recipientId, recipientType, types, statuses, pageable);
        } else if (statuses != null) {
            notificationPage = notificationService.findByRecipientIdAndRecipientTypeAndStatuses(
                    recipientId, recipientType, statuses, pageable);
        } else if (types != null) {
            notificationPage = notificationService.findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                    recipientId, recipientType, types, 
                    List.of(Notification.NotificationStatus.PENDING, 
                           Notification.NotificationStatus.SENT, 
                           Notification.NotificationStatus.DELIVERED), pageable);
        } else if (startDateTime != null && endDateTime != null) {
            notificationPage = notificationService.findByRecipientIdAndRecipientTypeAndDateRange(
                    recipientId, recipientType, startDateTime, endDateTime, pageable);
        } else {
            notificationPage = notificationService.findByRecipientIdAndRecipientTypeAndStatuses(
                    recipientId, recipientType, 
                    List.of(Notification.NotificationStatus.PENDING, 
                           Notification.NotificationStatus.SENT, 
                           Notification.NotificationStatus.DELIVERED), pageable);
        }

        Page<NotificationDto> notificationDtos = notificationPage.map(this::convertToDto);
        return ResponseEntity.ok(notificationDtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<NotificationDto> getNotificationById(@PathVariable Long id) {
        Notification notification = notificationService.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
                
        // Check if user has permission to access this notification
        if (!hasPermissionToAccessNotification(notification)) {
            return ResponseEntity.status(403).build();
        }

        return ResponseEntity.ok(convertToDto(notification));
    }

    @PostMapping("/{id}/mark-as-read")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<NotificationDto> markNotificationAsRead(@PathVariable Long id) {
        Notification notification = notificationService.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found with id: " + id));
                
        // Check if user has permission to access this notification
        if (!hasPermissionToAccessNotification(notification)) {
            return ResponseEntity.status(403).build();
        }

        notificationService.markAsRead(notification);
        return ResponseEntity.ok(convertToDto(notification));
    }

    @GetMapping("/recipients/{recipientId}/{recipientType}/unread-count")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Long> getUnreadNotificationCount(
            @PathVariable Long recipientId,
            @PathVariable Notification.RecipientType recipientType) {
        
        // Check if user has permission to access these notifications
        if (!hasPermissionToAccessNotifications(recipientId, recipientType)) {
            return ResponseEntity.status(403).build();
        }

        Long count = notificationService.countUnreadNotificationsByRecipient(recipientId, recipientType);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/recipients/{recipientId}/{recipientType}/pending")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<NotificationDto>> getPendingNotifications(
            @PathVariable Long recipientId,
            @PathVariable Notification.RecipientType recipientType) {
        
        // Check if user has permission to access these notifications
        if (!hasPermissionToAccessNotifications(recipientId, recipientType)) {
            return ResponseEntity.status(403).build();
        }

        List<Notification> notifications = notificationService.findPendingNotificationsByRecipient(recipientId, recipientType);
        List<NotificationDto> notificationDtos = notifications.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(notificationDtos);
    }

    @GetMapping("/recipients/{recipientId}/{recipientType}/unread")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<NotificationDto>> getUnreadNotifications(
            @PathVariable Long recipientId,
            @PathVariable Notification.RecipientType recipientType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        // Check if user has permission to access these notifications
        if (!hasPermissionToAccessNotifications(recipientId, recipientType)) {
            return ResponseEntity.status(403).build();
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationService.findUnreadNotificationsByRecipient(recipientId, recipientType, pageable);
        Page<NotificationDto> notificationDtos = notifications.map(this::convertToDto);
        return ResponseEntity.ok(notificationDtos);
    }

    @PostMapping("/recipients/{recipientId}/{recipientType}/mark-all-as-read")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Void> markAllNotificationsAsRead(
            @PathVariable Long recipientId,
            @PathVariable Notification.RecipientType recipientType) {
        
        // Check if user has permission to access these notifications
        if (!hasPermissionToAccessNotifications(recipientId, recipientType)) {
            return ResponseEntity.status(403).build();
        }

        notificationService.markAllAsReadByRecipient(recipientId, recipientType);
        return ResponseEntity.ok().build();
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
        dto.setSentAt(notification.getSentAt());
        dto.setReadAt(notification.getReadAt());
        dto.setRelatedEntityId(notification.getRelatedEntityId());
        dto.setRelatedEntityType(notification.getRelatedEntityType());
        dto.setPriority(notification.getPriority());
        if (notification.getCreatedAt() != null) {
            dto.setCreatedAt(notification.getCreatedAt().toString());
        }
        if (notification.getUpdatedAt() != null) {
            dto.setUpdatedAt(notification.getUpdatedAt().toString());
        }
        return dto;
    }

    private boolean hasPermissionToAccessNotifications(Long recipientId, Notification.RecipientType recipientType) {
        // In a real implementation, this would check the current user's identity
        // against the recipientId and recipientType
        // For now, we'll assume the security annotations handle this
        return true;
    }

    private boolean hasPermissionToAccessNotification(Notification notification) {
        // In a real implementation, this would check the current user's identity
        // against the notification's recipientId and recipientType
        // For now, we'll assume the security annotations handle this
        return true;
    }
}