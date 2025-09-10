package com.crm.system.repository;

import com.crm.system.model.TelegramMessage;
import com.crm.system.model.TelegramMessage.RecipientType;
import com.crm.system.model.TelegramMessage.MessageType;
import com.crm.system.model.TelegramMessage.DeliveryStatus;
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
public interface TelegramMessageRepository extends JpaRepository<TelegramMessage, Long> {
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientId = :recipientId " +
           "AND tm.recipientType = :recipientType " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate " +
           "ORDER BY tm.createdAt DESC")
    Page<TelegramMessage> findByRecipientIdAndRecipientTypeAndDateRange(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientId = :recipientId " +
           "AND tm.recipientType = :recipientType " +
           "AND tm.deliveryStatus IN :statuses " +
           "ORDER BY tm.createdAt DESC")
    Page<TelegramMessage> findByRecipientIdAndRecipientTypeAndDeliveryStatuses(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("statuses") List<DeliveryStatus> statuses,
        Pageable pageable
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientId = :recipientId " +
           "AND tm.recipientType = :recipientType " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.deliveryStatus IN :statuses " +
           "ORDER BY tm.createdAt DESC")
    Page<TelegramMessage> findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("messageTypes") List<MessageType> messageTypes,
        @Param("statuses") List<DeliveryStatus> statuses,
        Pageable pageable
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.deliveryStatus = 'FAILED' " +
           "AND tm.retryCount < :maxRetries " +
           "ORDER BY tm.createdAt ASC")
    List<TelegramMessage> findFailedMessagesWithRetriesBelow(@Param("maxRetries") Integer maxRetries);

    List<TelegramMessage> findByDeliveryStatus(TelegramMessage.DeliveryStatus deliveryStatus);

    List<TelegramMessage> findByDeliveryStatusAndCreatedAtBefore(TelegramMessage.DeliveryStatus deliveryStatus, LocalDateTime createdAt);
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.createdAt <= :beforeDateTime ORDER BY tm.createdAt ASC")
    List<TelegramMessage> findMessagesBeforeDateTime(@Param("beforeDateTime") LocalDateTime beforeDateTime);
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.deliveryStatus = 'PENDING' " +
           "AND tm.createdAt <= :beforeDateTime " +
           "ORDER BY tm.createdAt ASC")
    List<TelegramMessage> findPendingMessagesBeforeDateTime(@Param("beforeDateTime") LocalDateTime beforeDateTime);
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientId = :recipientId " +
           "AND tm.recipientType = :recipientType " +
           "AND tm.deliveryStatus = 'DELIVERED' " +
           "AND tm.readAt IS NULL " +
           "ORDER BY tm.createdAt DESC")
    Page<TelegramMessage> findDeliveredButUnreadMessagesByRecipient(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        Pageable pageable
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientId = :recipientId " +
           "AND tm.recipientType = :recipientType " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.deliveryStatus = 'DELIVERED' " +
           "AND tm.readAt IS NULL " +
           "ORDER BY tm.createdAt DESC")
    List<TelegramMessage> findDeliveredButUnreadMessagesByRecipientAndTypes(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("messageTypes") List<MessageType> messageTypes
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientId = :recipientId " +
           "AND tm.recipientType = :recipientType " +
           "AND tm.relatedEntityId = :relatedEntityId " +
           "AND tm.relatedEntityType = :relatedEntityType " +
           "AND tm.deliveryStatus IN :statuses")
    List<TelegramMessage> findByRecipientIdAndRecipientTypeAndRelatedEntityIdAndRelatedEntityTypeAndDeliveryStatuses(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("relatedEntityId") Long relatedEntityId,
        @Param("relatedEntityType") String relatedEntityType,
        @Param("statuses") List<DeliveryStatus> statuses
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.chatId = :chatId " +
           "AND tm.messageId = :messageId")
    Optional<TelegramMessage> findByChatIdAndMessageId(
        @Param("chatId") Long chatId,
        @Param("messageId") Long messageId
    );
    
    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.recipientId = :recipientId " +
           "AND tm.recipientType = :recipientType " +
           "AND tm.deliveryStatus = 'DELIVERED' " +
           "AND tm.readAt IS NULL")
    Long countDeliveredButUnreadMessagesByRecipient(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType
    );
    
    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.deliveryStatus = 'FAILED'")
    Long countFailedMessages();
    
    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.deliveryStatus = 'SENT'")
    Long countSentMessages();
    
    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.deliveryStatus = 'DELIVERED'")
    Long countDeliveredMessages();
    
    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.deliveryStatus = 'READ'")
    Long countReadMessages();
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.messageType IN :types " +
           "AND tm.deliveryStatus = 'SENT' " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate " +
           "ORDER BY tm.createdAt DESC")
    Page<TelegramMessage> findSentMessagesByTypesAndDateRange(
        @Param("types") List<MessageType> types,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate,
        Pageable pageable
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.deliveryStatus = 'SENT' " +
           "AND tm.createdAt <= :beforeDateTime " +
           "ORDER BY tm.createdAt ASC")
    List<TelegramMessage> findSentMessagesByRecipientTypeAndBeforeDateTime(
        @Param("recipientType") RecipientType recipientType,
        @Param("beforeDateTime") LocalDateTime beforeDateTime
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.deliveryStatus = 'SENT' " +
           "ORDER BY tm.createdAt DESC")
    List<TelegramMessage> findSentMessagesByRecipientTypeAndIdAndTypes(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("messageTypes") List<MessageType> messageTypes
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.relatedEntityId = :relatedEntityId " +
           "AND tm.relatedEntityType = :relatedEntityType " +
           "AND tm.messageType = :messageType " +
           "AND tm.deliveryStatus = 'SENT'")
    List<TelegramMessage> findSentMessagesByRecipientTypeAndIdAndEntityAndType(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("relatedEntityId") Long relatedEntityId,
        @Param("relatedEntityType") String relatedEntityType,
        @Param("messageType") MessageType messageType
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.deliveryStatus IN :statuses " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate " +
           "ORDER BY tm.createdAt DESC")
    List<TelegramMessage> findMessagesByRecipientTypeAndIdAndTypesAndStatusesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("messageTypes") List<MessageType> messageTypes,
        @Param("statuses") List<DeliveryStatus> statuses,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.relatedEntityId = :relatedEntityId " +
           "AND tm.relatedEntityType = :relatedEntityType " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.deliveryStatus IN :statuses " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate " +
           "ORDER BY tm.createdAt DESC")
    List<TelegramMessage> findMessagesByRecipientTypeAndIdAndEntityAndTypesAndStatusesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("relatedEntityId") Long relatedEntityId,
        @Param("relatedEntityType") String relatedEntityType,
        @Param("messageTypes") List<MessageType> messageTypes,
        @Param("statuses") List<DeliveryStatus> statuses,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.deliveryStatus IN :statuses " +
           "AND tm.retryCount < :maxRetries " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate " +
           "ORDER BY tm.createdAt DESC")
    List<TelegramMessage> findMessagesByRecipientTypeAndIdAndTypesAndStatusesAndMaxRetriesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("messageTypes") List<MessageType> messageTypes,
        @Param("statuses") List<DeliveryStatus> statuses,
        @Param("maxRetries") Integer maxRetries,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.relatedEntityId = :relatedEntityId " +
           "AND tm.relatedEntityType = :relatedEntityType " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.deliveryStatus IN :statuses " +
           "AND tm.retryCount < :maxRetries " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate " +
           "ORDER BY tm.createdAt DESC")
    List<TelegramMessage> findMessagesByRecipientTypeAndIdAndEntityAndTypesAndStatusesAndMaxRetriesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("relatedEntityId") Long relatedEntityId,
        @Param("relatedEntityType") String relatedEntityType,
        @Param("messageTypes") List<MessageType> messageTypes,
        @Param("statuses") List<DeliveryStatus> statuses,
        @Param("maxRetries") Integer maxRetries,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.deliveryStatus IN :statuses " +
           "AND tm.retryCount >= :minRetries " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate " +
           "ORDER BY tm.createdAt DESC")
    List<TelegramMessage> findMessagesByRecipientTypeAndIdAndTypesAndStatusesAndMinRetriesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("messageTypes") List<MessageType> messageTypes,
        @Param("statuses") List<DeliveryStatus> statuses,
        @Param("minRetries") Integer minRetries,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.relatedEntityId = :relatedEntityId " +
           "AND tm.relatedEntityType = :relatedEntityType " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.deliveryStatus IN :statuses " +
           "AND tm.retryCount >= :minRetries " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate " +
           "ORDER BY tm.createdAt DESC")
    List<TelegramMessage> findMessagesByRecipientTypeAndIdAndEntityAndTypesAndStatusesAndMinRetriesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("relatedEntityId") Long relatedEntityId,
        @Param("relatedEntityType") String relatedEntityType,
        @Param("messageTypes") List<MessageType> messageTypes,
        @Param("statuses") List<DeliveryStatus> statuses,
        @Param("minRetries") Integer minRetries,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
    @Query("SELECT tm FROM TelegramMessage tm WHERE tm.chatId = :chatId " +
           "AND tm.messageType = :messageType " +
           "ORDER BY tm.createdAt DESC")
    List<TelegramMessage> findByChatIdAndMessageTypeOrderByCreatedAtDesc(
        @Param("chatId") String chatId,
        @Param("messageType") MessageType messageType
    );

    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.deliveryStatus = :deliveryStatus")
    Long countByDeliveryStatus(@Param("deliveryStatus") DeliveryStatus deliveryStatus);

    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.recipientId = :recipientId " +
           "AND tm.recipientType = :recipientType " +
           "AND tm.deliveryStatus IN :deliveryStatuses " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate")
    Long countByRecipientIdAndRecipientTypeAndDeliveryStatusesAndDateRange(
        @Param("recipientId") Long recipientId,
        @Param("recipientType") RecipientType recipientType,
        @Param("deliveryStatuses") List<DeliveryStatus> deliveryStatuses,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate")
    Long countByRecipientTypeAndRecipientIdAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate")
    Long countByRecipientTypeAndRecipientIdAndMessageTypesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("messageTypes") List<MessageType> messageTypes,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.deliveryStatus IN :deliveryStatuses " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate")
    Long countByRecipientTypeAndRecipientIdAndDeliveryStatusesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("deliveryStatuses") List<DeliveryStatus> deliveryStatuses,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );

    @Query("SELECT COUNT(tm) FROM TelegramMessage tm WHERE tm.recipientType = :recipientType " +
           "AND tm.recipientId = :recipientId " +
           "AND tm.messageType IN :messageTypes " +
           "AND tm.deliveryStatus IN :deliveryStatuses " +
           "AND tm.createdAt >= :startDate AND tm.createdAt <= :endDate")
    Long countByRecipientTypeAndRecipientIdAndMessageTypesAndDeliveryStatusesAndDateRange(
        @Param("recipientType") RecipientType recipientType,
        @Param("recipientId") Long recipientId,
        @Param("messageTypes") List<MessageType> messageTypes,
        @Param("deliveryStatuses") List<DeliveryStatus> deliveryStatuses,
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}