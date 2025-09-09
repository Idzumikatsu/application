package com.crm.system.service;

import com.crm.system.model.Notification;
import com.crm.system.model.Notification.NotificationStatus;
import com.crm.system.model.Notification.RecipientType;
import com.crm.system.model.Notification.NotificationType;
import com.crm.system.repository.NotificationRepository;
import com.crm.system.repository.UserRepository;
import com.crm.system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }

    public Notification saveNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public Notification createNotification(Long recipientId, RecipientType recipientType, 
                                         NotificationType notificationType, String title, String message) {
        Notification notification = new Notification(recipientId, recipientType, notificationType, title, message);
        return notificationRepository.save(notification);
    }

    public Page<Notification> findByRecipientIdAndRecipientTypeAndDateRange(
            Long recipientId, RecipientType recipientType, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndRecipientTypeAndDateRange(
                recipientId, recipientType, startDate, endDate, pageable);
    }

    public Page<Notification> findByRecipientIdAndRecipientTypeAndStatuses(
            Long recipientId, RecipientType recipientType, List<NotificationStatus> statuses, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndRecipientTypeAndStatuses(
                recipientId, recipientType, statuses, pageable);
    }

    public Page<Notification> findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
            Long recipientId, RecipientType recipientType, List<NotificationType> notificationTypes, 
            List<NotificationStatus> statuses, Pageable pageable) {
        return notificationRepository.findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                recipientId, recipientType, notificationTypes, statuses, pageable);
    }

    public List<Notification> findPendingNotificationsByRecipient(Long recipientId, RecipientType recipientType) {
        return notificationRepository.findPendingNotificationsByRecipient(recipientId, recipientType);
    }

    public Page<Notification> findReadNotificationsByRecipient(
            Long recipientId, RecipientType recipientType, Pageable pageable) {
        return notificationRepository.findReadNotificationsByRecipient(recipientId, recipientType, pageable);
    }

    public List<Notification> findPendingNotificationsBeforeDateTime(LocalDateTime beforeDateTime) {
        return notificationRepository.findPendingNotificationsBeforeDateTime(beforeDateTime);
    }

    public List<Notification> findPendingNotificationsByRecipientAndTypes(
            Long recipientId, RecipientType recipientType, List<NotificationType> notificationTypes) {
        return notificationRepository.findPendingNotificationsByRecipientAndTypes(recipientId, recipientType, notificationTypes);
    }

    public List<Notification> findPendingNotificationByRecipientAndTypeAndEntity(
            Long recipientId, RecipientType recipientType, NotificationType notificationType, Long relatedEntityId) {
        return notificationRepository.findPendingNotificationByRecipientAndTypeAndEntity(
                recipientId, recipientType, notificationType, relatedEntityId);
    }

    public Long countPendingNotificationsByRecipient(Long recipientId, RecipientType recipientType) {
        return notificationRepository.countPendingNotificationsByRecipient(recipientId, recipientType);
    }

    public Long countReadNotificationsByRecipient(Long recipientId, RecipientType recipientType) {
        return notificationRepository.countReadNotificationsByRecipient(recipientId, recipientType);
    }

    public Long countPendingNotifications() {
        return notificationRepository.countPendingNotifications();
    }

    public Long countFailedNotifications() {
        return notificationRepository.countFailedNotifications();
    }

    public Page<Notification> findPendingNotificationsByTypesAndDateRange(
            List<NotificationType> types, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return notificationRepository.findPendingNotificationsByTypesAndDateRange(types, startDate, endDate, pageable);
    }

    public List<Notification> findPendingNotificationsByRecipientTypeAndBeforeDateTime(
            RecipientType recipientType, LocalDateTime beforeDateTime) {
        return notificationRepository.findPendingNotificationsByRecipientTypeAndBeforeDateTime(recipientType, beforeDateTime);
    }

    public List<Notification> findByRecipientTypeAndRecipientIdAndNotificationTypeAndRelatedEntityIdAndStatuses(
            RecipientType recipientType, Long recipientId, NotificationType notificationType, 
            Long relatedEntityId, List<NotificationStatus> statuses) {
        return notificationRepository.findByRecipientTypeAndRecipientIdAndNotificationTypeAndRelatedEntityIdAndStatuses(
                recipientType, recipientId, notificationType, relatedEntityId, statuses);
    }

    public List<Notification> findPendingNotificationsByRecipientTypeAndIdAndTypes(
            RecipientType recipientType, Long recipientId, List<NotificationType> notificationTypes) {
        return notificationRepository.findPendingNotificationsByRecipientTypeAndIdAndTypes(
                recipientType, recipientId, notificationTypes);
    }

    public Notification updateNotification(Notification notification) {
        return notificationRepository.save(notification);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    public void markAsSent(Notification notification) {
        notification.markAsSent();
        notificationRepository.save(notification);
    }

    public void markAsDelivered(Notification notification) {
        notification.markAsDelivered();
        notificationRepository.save(notification);
    }

    public void markAsRead(Notification notification) {
        notification.markAsRead();
        notificationRepository.save(notification);
    }

    public void markAsFailed(Notification notification) {
        notification.markAsFailed();
        notificationRepository.save(notification);
    }

    public boolean isNotificationPending(Notification notification) {
        return notification.isPending();
    }

    public boolean isNotificationSent(Notification notification) {
        return notification.isSent();
    }

    public boolean isNotificationDelivered(Notification notification) {
        return notification.isDelivered();
    }

    public boolean isNotificationRead(Notification notification) {
        return notification.isRead();
    }

    public boolean hasNotificationFailed(Notification notification) {
        return notification.hasFailed();
    }

    public String getRecipientTypeName(Notification notification) {
        return notification.getRecipientTypeName();
    }

    public String getNotificationTypeName(Notification notification) {
        return notification.getNotificationTypeName();
    }

    public String getStatusName(Notification notification) {
        return notification.getStatusName();
    }

    // Business methods
    public Notification sendLessonScheduledNotification(Long recipientId, RecipientType recipientType, 
                                                       String lessonInfo) {
        String title = "Урок запланирован";
        String message = "Ваш урок запланирован:\n\n" + lessonInfo;
        
        Notification notification = new Notification(recipientId, recipientType, 
                                                   NotificationType.LESSON_SCHEDULED, title, message);
        return notificationRepository.save(notification);
    }

    public Notification sendLessonCancelledNotification(Long recipientId, RecipientType recipientType, 
                                                      String lessonInfo, String reason) {
        String title = "Урок отменен";
        String message = "Ваш урок отменен:\n\n" + lessonInfo + "\n\nПричина отмены: " + reason;
        
        Notification notification = new Notification(recipientId, recipientType, 
                                                   NotificationType.LESSON_CANCELLED, title, message);
        return notificationRepository.save(notification);
    }

    public Notification sendLessonReminderNotification(Long recipientId, RecipientType recipientType, 
                                                     String lessonInfo) {
        String title = "Напоминание об уроке";
        String message = "Напоминание о вашем предстоящем уроке:\n\n" + lessonInfo;
        
        Notification notification = new Notification(recipientId, recipientType, 
                                                   NotificationType.LESSON_REMINDER, title, message);
        return notificationRepository.save(notification);
    }

    public Notification sendGroupLessonScheduledNotification(Long recipientId, RecipientType recipientType, 
                                                           String lessonInfo) {
        String title = "Групповой урок запланирован";
        String message = "Ваш групповой урок запланирован:\n\n" + lessonInfo;
        
        Notification notification = new Notification(recipientId, recipientType, 
                                                   NotificationType.GROUP_LESSON_SCHEDULED, title, message);
        return notificationRepository.save(notification);
    }

    public Notification sendGroupLessonCancelledNotification(Long recipientId, RecipientType recipientType, 
                                                           String lessonInfo, String reason) {
        String title = "Групповой урок отменен";
        String message = "Ваш групповой урок отменен:\n\n" + lessonInfo + "\n\nПричина отмены: " + reason;
        
        Notification notification = new Notification(recipientId, recipientType, 
                                                   NotificationType.GROUP_LESSON_CANCELLED, title, message);
        return notificationRepository.save(notification);
    }

    public Notification sendGroupLessonReminderNotification(Long recipientId, RecipientType recipientType, 
                                                          String lessonInfo) {
        String title = "Напоминание о групповом уроке";
        String message = "Напоминание о вашем предстоящем групповом уроке:\n\n" + lessonInfo;
        
        Notification notification = new Notification(recipientId, recipientType, 
                                                   NotificationType.GROUP_LESSON_REMINDER, title, message);
        return notificationRepository.save(notification);
    }

    public Notification sendPackageEndingSoonNotification(Long recipientId, RecipientType recipientType, 
                                                        String packageInfo) {
        String title = "Пакет уроков заканчивается";
        String message = "Ваш пакет уроков скоро заканчивается:\n\n" + packageInfo;
        
        Notification notification = new Notification(recipientId, recipientType, 
                                                   NotificationType.PACKAGE_ENDING_SOON, title, message);
        return notificationRepository.save(notification);
    }

    public Notification sendPaymentDueNotification(Long recipientId, RecipientType recipientType, 
                                                 String paymentInfo) {
        String title = "Оплата по расписанию";
        String message = "Напоминание об оплате:\n\n" + paymentInfo;
        
        Notification notification = new Notification(recipientId, recipientType, 
                                                   NotificationType.PAYMENT_DUE, title, message);
        return notificationRepository.save(notification);
    }

    public Notification sendSystemMessageNotification(Long recipientId, RecipientType recipientType, 
                                                    String message) {
        String title = "Системное сообщение";
        
        Notification notification = new Notification(recipientId, recipientType, 
                                                   NotificationType.SYSTEM_MESSAGE, title, message);
        return notificationRepository.save(notification);
    }

    public Notification sendFeedbackRequestNotification(Long recipientId, RecipientType recipientType, 
                                                      String feedbackInfo) {
        String title = "Запрос на обратную связь";
        String message = "Пожалуйста, оставьте обратную связь:\n\n" + feedbackInfo;
        
        Notification notification = new Notification(recipientId, recipientType, 
                                                   NotificationType.FEEDBACK_REQUEST, title, message);
        return notificationRepository.save(notification);
    }

    public List<Notification> findFutureScheduledLessonsNotificationsByRecipient(
            Long recipientId, RecipientType recipientType) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime future = now.plusWeeks(1);
        
        List<NotificationType> lessonTypes = List.of(
            NotificationType.LESSON_SCHEDULED,
            NotificationType.GROUP_LESSON_SCHEDULED
        );
        
        List<NotificationStatus> statuses = List.of(
            NotificationStatus.PENDING,
            NotificationStatus.SENT,
            NotificationStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<Notification> notificationPage = findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                recipientId, recipientType, lessonTypes, statuses, pageable);
        
        return notificationPage.getContent().stream()
                .filter(n -> n.getCreatedAt().isAfter(now) || n.getCreatedAt().isEqual(now))
                .filter(n -> n.getCreatedAt().isBefore(future) || n.getCreatedAt().isEqual(future))
                .collect(Collectors.toList());
    }

    public List<Notification> findPastCompletedLessonsNotificationsByRecipient(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<NotificationType> lessonTypes = List.of(
            NotificationType.LESSON_COMPLETED,
            NotificationType.GROUP_LESSON_COMPLETED
        );
        
        List<NotificationStatus> statuses = List.of(
            NotificationStatus.READ,
            NotificationStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<Notification> notificationPage = findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                recipientId, recipientType, lessonTypes, statuses, pageable);
        
        return notificationPage.getContent().stream()
                .filter(n -> n.getCreatedAt().isAfter(startDateTime) || n.getCreatedAt().isEqual(startDateTime))
                .filter(n -> n.getCreatedAt().isBefore(endDateTime) || n.getCreatedAt().isEqual(endDateTime))
                .collect(Collectors.toList());
    }

    public List<Notification> findCancelledLessonsNotificationsByRecipient(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<NotificationType> lessonTypes = List.of(
            NotificationType.LESSON_CANCELLED,
            NotificationType.GROUP_LESSON_CANCELLED
        );
        
        List<NotificationStatus> statuses = List.of(
            NotificationStatus.READ,
            NotificationStatus.DELIVERED,
            NotificationStatus.SENT
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<Notification> notificationPage = findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                recipientId, recipientType, lessonTypes, statuses, pageable);
        
        return notificationPage.getContent().stream()
                .filter(n -> n.getCreatedAt().isAfter(startDateTime) || n.getCreatedAt().isEqual(startDateTime))
                .filter(n -> n.getCreatedAt().isBefore(endDateTime) || n.getCreatedAt().isEqual(endDateTime))
                .collect(Collectors.toList());
    }

    public List<Notification> findMissedLessonsNotificationsByRecipient(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<NotificationType> lessonTypes = List.of(
            NotificationType.LESSON_MISSED,
            NotificationType.GROUP_LESSON_MISSED
        );
        
        List<NotificationStatus> statuses = List.of(
            NotificationStatus.READ,
            NotificationStatus.DELIVERED,
            NotificationStatus.SENT
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<Notification> notificationPage = findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                recipientId, recipientType, lessonTypes, statuses, pageable);
        
        return notificationPage.getContent().stream()
                .filter(n -> n.getCreatedAt().isAfter(startDateTime) || n.getCreatedAt().isEqual(startDateTime))
                .filter(n -> n.getCreatedAt().isBefore(endDateTime) || n.getCreatedAt().isEqual(endDateTime))
                .collect(Collectors.toList());
    }

    public List<Notification> findPackageEndingSoonNotificationsByRecipient(
            Long recipientId, RecipientType recipientType) {
        List<NotificationType> packageTypes = List.of(NotificationType.PACKAGE_ENDING_SOON);
        
        List<NotificationStatus> statuses = List.of(
            NotificationStatus.PENDING,
            NotificationStatus.SENT,
            NotificationStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<Notification> notificationPage = findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                recipientId, recipientType, packageTypes, statuses, pageable);
        
        return notificationPage.getContent();
    }

    public List<Notification> findPaymentDueNotificationsByRecipient(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<NotificationType> paymentTypes = List.of(NotificationType.PAYMENT_DUE);
        
        List<NotificationStatus> statuses = List.of(
            NotificationStatus.PENDING,
            NotificationStatus.SENT,
            NotificationStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<Notification> notificationPage = findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                recipientId, recipientType, paymentTypes, statuses, pageable);
        
        return notificationPage.getContent().stream()
                .filter(n -> n.getCreatedAt().isAfter(startDateTime) || n.getCreatedAt().isEqual(startDateTime))
                .filter(n -> n.getCreatedAt().isBefore(endDateTime) || n.getCreatedAt().isEqual(endDateTime))
                .collect(Collectors.toList());
    }

    public List<Notification> findSystemMessagesByRecipient(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<NotificationType> systemTypes = List.of(NotificationType.SYSTEM_MESSAGE);
        
        List<NotificationStatus> statuses = List.of(
            NotificationStatus.PENDING,
            NotificationStatus.SENT,
            NotificationStatus.DELIVERED,
            NotificationStatus.READ
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<Notification> notificationPage = findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                recipientId, recipientType, systemTypes, statuses, pageable);
        
        return notificationPage.getContent().stream()
                .filter(n -> n.getCreatedAt().isAfter(startDateTime) || n.getCreatedAt().isEqual(startDateTime))
                .filter(n -> n.getCreatedAt().isBefore(endDateTime) || n.getCreatedAt().isEqual(endDateTime))
                .collect(Collectors.toList());
    }

    public List<Notification> findFeedbackRequestsByRecipient(
            Long recipientId, RecipientType recipientType) {
        List<NotificationType> feedbackTypes = List.of(NotificationType.FEEDBACK_REQUEST);
        
        List<NotificationStatus> statuses = List.of(
            NotificationStatus.PENDING,
            NotificationStatus.SENT,
            NotificationStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<Notification> notificationPage = findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
                recipientId, recipientType, feedbackTypes, statuses, pageable);
        
        return notificationPage.getContent();
    }

    public Page<Notification> findNotificationsByRecipientTypeAndIdAndDateRange(
            RecipientType recipientType, Long recipientId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return findByRecipientIdAndRecipientTypeAndDateRange(
                recipientId, recipientType, startDateTime, endDateTime, pageable);
    }

    public Page<Notification> findUnreadNotificationsByRecipient(
            Long recipientId, RecipientType recipientType, Pageable pageable) {
        List<NotificationStatus> unreadStatuses = List.of(
            NotificationStatus.PENDING,
            NotificationStatus.SENT,
            NotificationStatus.DELIVERED
        );
        
        return findByRecipientIdAndRecipientTypeAndStatuses(
                recipientId, recipientType, unreadStatuses, pageable);
    }

    public Page<Notification> findReadNotificationsByRecipientAndDateRange(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<NotificationStatus> readStatuses = List.of(NotificationStatus.READ);
        
        Page<Notification> allReadNotifications = findByRecipientIdAndRecipientTypeAndStatuses(
                recipientId, recipientType, readStatuses, pageable);
        
        List<Notification> filteredNotifications = allReadNotifications.getContent().stream()
                .filter(n -> n.getReadAt() != null)
                .filter(n -> n.getReadAt().isAfter(startDateTime) || n.getReadAt().isEqual(startDateTime))
                .filter(n -> n.getReadAt().isBefore(endDateTime) || n.getReadAt().isEqual(endDateTime))
                .collect(Collectors.toList());
        
        return new PageImpl<>(filteredNotifications, pageable, filteredNotifications.size());
    }

    public void markAllAsReadByRecipient(Long recipientId, RecipientType recipientType) {
        List<Notification> pendingNotifications = findPendingNotificationsByRecipient(recipientId, recipientType);
        
        for (Notification notification : pendingNotifications) {
            markAsRead(notification);
        }
    }

    public void markAsReadById(Long notificationId) {
        Optional<Notification> notificationOpt = findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            markAsRead(notification);
        }
    }

    public void deleteAllByRecipient(Long recipientId, RecipientType recipientType) {
        // В реальной реализации здесь будет удаление всех уведомлений пользователя
        // Для демонстрации просто выводим информацию
        System.out.println("Deleting all notifications for recipientId: " + recipientId + ", recipientType: " + recipientType);
    }

    public void deleteByRecipientAndDateRange(Long recipientId, RecipientType recipientType, 
                                            LocalDate startDate, LocalDate endDate) {
        // В реальной реализации здесь будет удаление уведомлений пользователя в заданном диапазоне дат
        // Для демонстрации просто выводим информацию
        System.out.println("Deleting notifications for recipientId: " + recipientId + 
                          ", recipientType: " + recipientType + 
                          ", date range: " + startDate + " to " + endDate);
    }

    public Long countUnreadNotificationsByRecipient(Long recipientId, RecipientType recipientType) {
        List<NotificationStatus> unreadStatuses = List.of(
            NotificationStatus.PENDING,
            NotificationStatus.SENT,
            NotificationStatus.DELIVERED
        );
        
        return notificationRepository.countByRecipientIdAndRecipientTypeAndStatuses(
                recipientId, recipientType, unreadStatuses);
    }

    public Long countReadNotificationsByRecipientAndDateRange(Long recipientId, RecipientType recipientType, 
                                                            LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return notificationRepository.countByRecipientIdAndRecipientTypeAndStatusesAndDateRange(
                recipientId, recipientType, NotificationStatus.READ, startDateTime, endDateTime);
    }

    public Long countNotificationsByRecipientTypeAndIdAndDateRange(
            RecipientType recipientType, Long recipientId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return notificationRepository.countByRecipientTypeAndRecipientIdAndDateRange(
                recipientType, recipientId, startDateTime, endDateTime);
    }

    public Long countNotificationsByRecipientTypeAndIdAndNotificationTypesAndDateRange(
            RecipientType recipientType, Long recipientId, List<NotificationType> notificationTypes, 
            LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return notificationRepository.countByRecipientTypeAndRecipientIdAndNotificationTypesAndDateRange(
                recipientType, recipientId, notificationTypes, startDateTime, endDateTime);
    }

    public Long countNotificationsByRecipientTypeAndIdAndStatusesAndDateRange(
            RecipientType recipientType, Long recipientId, List<NotificationStatus> statuses, 
            LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return notificationRepository.countByRecipientTypeAndRecipientIdAndStatusesAndDateRange(
                recipientType, recipientId, statuses, startDateTime, endDateTime);
    }

    public Long countNotificationsByRecipientTypeAndIdAndNotificationTypesAndStatusesAndDateRange(
            RecipientType recipientType, Long recipientId, List<NotificationType> notificationTypes, 
            List<NotificationStatus> statuses, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return notificationRepository.countByRecipientTypeAndRecipientIdAndNotificationTypesAndStatusesAndDateRange(
                recipientType, recipientId, notificationTypes, statuses, startDateTime, endDateTime);
    }
}