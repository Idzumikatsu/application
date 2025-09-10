package com.crm.system.repository;

import com.crm.system.model.Notification;
import com.crm.system.model.Notification.NotificationStatus;
import com.crm.system.model.Notification.RecipientType;
import com.crm.system.model.Notification.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientIdAndRecipientTypeAndDateRange(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.status IN :statuses " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientIdAndRecipientTypeAndStatuses(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("statuses") List<NotificationStatus> statuses,
        Pageable pageable
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.notificationType IN :notificationTypes " +
           "AND n.status IN :statuses " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findByRecipientIdAndRecipientTypeAndNotificationTypesAndStatuses(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("notificationTypes") List<NotificationType> notificationTypes,
        @Param("statuses") List<NotificationStatus> statuses,
        Pageable pageable
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.status = 'PENDING' " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findPendingNotificationsByRecipient(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.status = 'READ' " +
           "ORDER BY n.readAt DESC")
    Page<Notification> findReadNotificationsByRecipient(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        Pageable pageable
    );
    
    @Query("SELECT n FROM Notification n WHERE n.status = 'PENDING' " +
           "AND n.createdAt <= :beforeDateTime " +
           "ORDER BY n.createdAt ASC")
    List<Notification> findPendingNotificationsBeforeDateTime(
        @Param("beforeDateTime") LocalDateTime beforeDateTime
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.notificationType IN :notificationTypes " +
           "AND n.status = 'PENDING' " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findPendingNotificationsByRecipientAndTypes(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("notificationTypes") List<NotificationType> notificationTypes
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.notificationType = :notificationType " +
           "AND n.relatedEntityId = :relatedEntityId " +
           "AND n.status = 'PENDING'")
    List<Notification> findPendingNotificationByRecipientAndTypeAndEntity(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("notificationType") NotificationType notificationType,
        @Param("relatedEntityId") Long relatedEntityId
    );
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.status = 'PENDING'")
    Long countPendingNotificationsByRecipient(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType
    );
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.status = 'READ'")
    Long countReadNotificationsByRecipient(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType
    );
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.status = 'PENDING'")
    Long countPendingNotifications();

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.status = 'FAILED'")
    Long countFailedNotifications();

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.status IN :statuses")
    Long countByRecipientIdAndRecipientTypeAndStatuses(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("statuses") List<NotificationStatus> statuses
    );

    
    @Query("SELECT n FROM Notification n WHERE n.notificationType IN :types " +
           "AND n.status = 'PENDING' " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate " +
           "ORDER BY n.createdAt DESC")
    Page<Notification> findPendingNotificationsByTypesAndDateRange(
        @Param("types") List<NotificationType> types,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.notificationType = :notificationType " +
           "AND n.relatedEntityId = :relatedEntityId " +
           "AND n.status IN :statuses")
    List<Notification> findByRecipientTypeAndRecipientIdAndNotificationTypeAndRelatedEntityIdAndStatuses(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("notificationType") NotificationType notificationType,
        @Param("relatedEntityId") Long relatedEntityId,
        @Param("statuses") List<NotificationStatus> statuses
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.notificationType IN :notificationTypes " +
           "AND n.status = 'PENDING' " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findPendingNotificationsByRecipientTypeAndIdAndTypes(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("notificationTypes") List<NotificationType> notificationTypes
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.status = 'PENDING' " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findPendingNotificationsByRecipientTypeAndId(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId
    );

    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.status = 'PENDING' " +
           "AND n.createdAt <= :beforeDateTime " +
           "ORDER BY n.createdAt ASC")
    List<Notification> findPendingNotificationsByRecipientTypeAndBeforeDateTime(
        @Param("recipientType") RecipientType recipientType,
        @Param("beforeDateTime") LocalDateTime beforeDateTime
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.status IN :statuses " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsByRecipientTypeAndIdAndStatuses(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("statuses") List<NotificationStatus> statuses
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.notificationType IN :notificationTypes " +
           "AND n.status IN :statuses " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsByRecipientTypeAndIdAndNotificationTypesAndStatuses(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("notificationTypes") List<NotificationType> notificationTypes,
        @Param("statuses") List<NotificationStatus> statuses
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsByRecipientTypeAndIdAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate " +
           "AND n.status IN :statuses " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsByRecipientTypeAndIdAndDateRangeAndStatuses(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("statuses") List<NotificationStatus> statuses
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate " +
           "AND n.notificationType IN :notificationTypes " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsByRecipientTypeAndIdAndDateRangeAndNotificationTypes(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("notificationTypes") List<NotificationType> notificationTypes
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate " +
           "AND n.notificationType IN :notificationTypes " +
           "AND n.status IN :statuses " +
           "ORDER BY n.createdAt DESC")
    List<Notification> findNotificationsByRecipientTypeAndIdAndDateRangeAndNotificationTypesAndStatuses(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("notificationTypes") List<NotificationType> notificationTypes,
        @Param("statuses") List<NotificationStatus> statuses
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.priority >= :minPriority " +
           "ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notification> findHighPriorityNotificationsByRecipientTypeAndId(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("minPriority") Integer minPriority
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.priority >= :minPriority " +
           "AND n.status = 'PENDING' " +
           "ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notification> findPendingHighPriorityNotificationsByRecipientTypeAndId(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("minPriority") Integer minPriority
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.priority >= :minPriority " +
           "AND n.status IN :statuses " +
           "ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notification> findHighPriorityNotificationsByRecipientTypeAndIdAndStatuses(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("minPriority") Integer minPriority,
        @Param("statuses") List<NotificationStatus> statuses
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.priority >= :minPriority " +
           "AND n.notificationType IN :notificationTypes " +
           "ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notification> findHighPriorityNotificationsByRecipientTypeAndIdAndNotificationTypes(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("minPriority") Integer minPriority,
        @Param("notificationTypes") List<NotificationType> notificationTypes
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.priority >= :minPriority " +
           "AND n.notificationType IN :notificationTypes " +
           "AND n.status IN :statuses " +
           "ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notification> findHighPriorityNotificationsByRecipientTypeAndIdAndNotificationTypesAndStatuses(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("minPriority") Integer minPriority,
        @Param("notificationTypes") List<NotificationType> notificationTypes,
        @Param("statuses") List<NotificationStatus> statuses
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.priority >= :minPriority " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate " +
           "ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notification> findHighPriorityNotificationsByRecipientTypeAndIdAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("minPriority") Integer minPriority,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.priority >= :minPriority " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate " +
           "AND n.status IN :statuses " +
           "ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notification> findHighPriorityNotificationsByRecipientTypeAndIdAndDateRangeAndStatuses(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("minPriority") Integer minPriority,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("statuses") List<NotificationStatus> statuses
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.priority >= :minPriority " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate " +
           "AND n.notificationType IN :notificationTypes " +
           "ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notification> findHighPriorityNotificationsByRecipientTypeAndIdAndDateRangeAndNotificationTypes(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("minPriority") Integer minPriority,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("notificationTypes") List<NotificationType> notificationTypes
    );
    
    @Query("SELECT n FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.priority >= :minPriority " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate " +
           "AND n.notificationType IN :notificationTypes " +
           "AND n.status IN :statuses " +
           "ORDER BY n.priority DESC, n.createdAt DESC")
    List<Notification> findHighPriorityNotificationsByRecipientTypeAndIdAndDateRangeAndNotificationTypesAndStatuses(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("minPriority") Integer minPriority,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        @Param("notificationTypes") List<NotificationType> notificationTypes,
        @Param("statuses") List<NotificationStatus> statuses
    );

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientId = :recipientId " +
           "AND n.recipientType = :recipientType " +
           "AND n.status IN :statuses " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate")
    Long countByRecipientIdAndRecipientTypeAndStatusesAndDateRange(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("statuses") List<NotificationStatus> statuses,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate")
    Long countByRecipientTypeAndRecipientIdAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.notificationType IN :notificationTypes " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate")
    Long countByRecipientTypeAndRecipientIdAndNotificationTypesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("notificationTypes") List<NotificationType> notificationTypes,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.status IN :statuses " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate")
    Long countByRecipientTypeAndRecipientIdAndStatusesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("statuses") List<NotificationStatus> statuses,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(n) FROM Notification n WHERE n.recipientType = :recipientType " +
           "AND n.recipientId = :recipientId " +
           "AND n.notificationType IN :notificationTypes " +
           "AND n.status IN :statuses " +
           "AND n.createdAt >= :startDate AND n.createdAt <= :endDate")
    Long countByRecipientTypeAndRecipientIdAndNotificationTypesAndStatusesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("notificationTypes") List<NotificationType> notificationTypes,
        @Param("statuses") List<NotificationStatus> statuses,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}