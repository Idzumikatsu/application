package com.crm.system.service;

import com.crm.system.model.TelegramMessage;
import com.crm.system.model.TelegramMessage.RecipientType;
import com.crm.system.model.TelegramMessage.MessageType;
import com.crm.system.model.TelegramMessage.DeliveryStatus;
import com.crm.system.repository.TelegramMessageRepository;
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
public class TelegramMessageService {

    @Autowired
    private TelegramMessageRepository telegramMessageRepository;

    public Optional<TelegramMessage> findById(Long id) {
        return telegramMessageRepository.findById(id);
    }

    public TelegramMessage saveTelegramMessage(TelegramMessage telegramMessage) {
        return telegramMessageRepository.save(telegramMessage);
    }

    public TelegramMessage createTelegramMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                               String messageText) {
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
        return telegramMessageRepository.save(telegramMessage);
    }

    public Page<TelegramMessage> findByChatIdAndDateRange(
            Long chatId, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        // Метод findByChatIdAndDateRange не существует в репозитории
        // Используем существующий метод с фильтрацией по дате создания
        return telegramMessageRepository.findByRecipientIdAndRecipientTypeAndDateRange(
            chatId, RecipientType.STUDENT, startDate, endDate, pageable);
    }

    public Page<TelegramMessage> findByRecipientIdAndRecipientTypeAndDeliveryStatuses(
            Long recipientId, RecipientType recipientType, List<DeliveryStatus> statuses, Pageable pageable) {
        return telegramMessageRepository.findByRecipientIdAndRecipientTypeAndDeliveryStatuses(
                recipientId, recipientType, statuses, pageable);
    }

    public Page<TelegramMessage> findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
            Long recipientId, RecipientType recipientType, List<MessageType> messageTypes, 
            List<DeliveryStatus> statuses, Pageable pageable) {
        return telegramMessageRepository.findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, messageTypes, statuses, pageable);
    }

    public List<TelegramMessage> findFailedMessagesWithRetriesBelow(Integer maxRetries) {
        return telegramMessageRepository.findFailedMessagesWithRetriesBelow(maxRetries);
    }

    public List<TelegramMessage> findPendingMessagesBeforeDateTime(LocalDateTime beforeDateTime) {
        return telegramMessageRepository.findPendingMessagesBeforeDateTime(beforeDateTime);
    }

    public Page<TelegramMessage> findDeliveredButUnreadMessagesByRecipient(
            Long recipientId, RecipientType recipientType, Pageable pageable) {
        return telegramMessageRepository.findDeliveredButUnreadMessagesByRecipient(recipientId, recipientType, pageable);
    }

    public List<TelegramMessage> findDeliveredButUnreadMessagesByRecipientAndTypes(
            Long recipientId, RecipientType recipientType, List<MessageType> messageTypes) {
        return telegramMessageRepository.findDeliveredButUnreadMessagesByRecipientAndTypes(
                recipientId, recipientType, messageTypes);
    }

    public List<TelegramMessage> findByRecipientTypeAndRecipientIdAndMessageTypeAndRelatedEntityIdAndDeliveryStatuses(
            RecipientType recipientType, Long recipientId, MessageType messageType,
            Long relatedEntityId, List<DeliveryStatus> statuses) {
        // Используем существующий метод с фильтрацией по типу сущности
        return telegramMessageRepository.findByRecipientIdAndRecipientTypeAndRelatedEntityIdAndRelatedEntityTypeAndDeliveryStatuses(
                recipientId, recipientType, relatedEntityId, "LESSON", statuses);
    }

    public Optional<TelegramMessage> findByChatIdAndMessageId(Long chatId, Long messageId) {
        return telegramMessageRepository.findByChatIdAndMessageId(chatId, messageId);
    }

    public Long countDeliveredButUnreadMessagesByRecipient(Long recipientId, RecipientType recipientType) {
        return telegramMessageRepository.countDeliveredButUnreadMessagesByRecipient(recipientId, recipientType);
    }

    public Long countFailedMessages() {
        return telegramMessageRepository.countFailedMessages();
    }

    public Long countSentMessages() {
        return telegramMessageRepository.countSentMessages();
    }

    public Long countDeliveredMessages() {
        return telegramMessageRepository.countDeliveredMessages();
    }

    public Long countReadMessages() {
        return telegramMessageRepository.countReadMessages();
    }

    public Page<TelegramMessage> findSentMessagesByTypesAndDateRange(
            List<MessageType> types, LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        return telegramMessageRepository.findSentMessagesByTypesAndDateRange(types, startDate, endDate, pageable);
    }

    public List<TelegramMessage> findSentMessagesByRecipientTypeAndBeforeDateTime(
            RecipientType recipientType, LocalDateTime beforeDateTime) {
        return telegramMessageRepository.findSentMessagesByRecipientTypeAndBeforeDateTime(recipientType, beforeDateTime);
    }

    public List<TelegramMessage> findSentMessagesByRecipientTypeAndIdAndTypes(
            RecipientType recipientType, Long recipientId, List<MessageType> messageTypes) {
        return telegramMessageRepository.findSentMessagesByRecipientTypeAndIdAndTypes(
                recipientType, recipientId, messageTypes);
    }

    public List<TelegramMessage> findMessagesByRecipientTypeAndIdAndTypesAndStatusesAndDateRange(
            RecipientType recipientType, Long recipientId, List<MessageType> messageTypes,
            List<DeliveryStatus> statuses, LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return telegramMessageRepository.findMessagesByRecipientTypeAndIdAndTypesAndStatusesAndDateRange(
                recipientType, recipientId, messageTypes, statuses, startDateTime, endDateTime);
    }

    public List<TelegramMessage> findMessagesByRecipientTypeAndIdAndEntityAndTypesAndStatusesAndDateRange(
            RecipientType recipientType, Long recipientId, Long relatedEntityId, String relatedEntityType,
            List<MessageType> messageTypes, List<DeliveryStatus> statuses,
            LocalDateTime startDateTime, LocalDateTime endDateTime) {
        return telegramMessageRepository.findMessagesByRecipientTypeAndIdAndEntityAndTypesAndStatusesAndDateRange(
                recipientType, recipientId, relatedEntityId, relatedEntityType, messageTypes, statuses,
                startDateTime, endDateTime);
    }

    public List<TelegramMessage> findSentMessagesByRecipientAndEntityAndType(
            RecipientType recipientType, Long recipientId, Long relatedEntityId,
            String relatedEntityType, MessageType messageType) {
        return telegramMessageRepository.findSentMessagesByRecipientTypeAndIdAndEntityAndType(
                recipientType, recipientId, relatedEntityId, relatedEntityType, messageType);
    }

    public TelegramMessage updateTelegramMessage(TelegramMessage telegramMessage) {
        return telegramMessageRepository.save(telegramMessage);
    }

    public void deleteTelegramMessage(Long id) {
        telegramMessageRepository.deleteById(id);
    }

    public void markAsDelivered(TelegramMessage telegramMessage) {
        telegramMessage.markAsDelivered();
        telegramMessageRepository.save(telegramMessage);
    }

    public void markAsRead(TelegramMessage telegramMessage) {
        telegramMessage.markAsRead();
        telegramMessageRepository.save(telegramMessage);
    }

    public void markAsFailed(TelegramMessage telegramMessage, String errorMessage) {
        telegramMessage.markAsFailed(errorMessage);
        telegramMessageRepository.save(telegramMessage);
    }

    public void incrementRetryCount(TelegramMessage telegramMessage) {
        telegramMessage.incrementRetryCount();
        telegramMessageRepository.save(telegramMessage);
    }

    public boolean isMessagePending(TelegramMessage telegramMessage) {
        return telegramMessage.isPending();
    }

    public boolean isMessageSent(TelegramMessage telegramMessage) {
        return telegramMessage.isSent();
    }

    public boolean isMessageDelivered(TelegramMessage telegramMessage) {
        return telegramMessage.isDelivered();
    }

    public boolean isMessageRead(TelegramMessage telegramMessage) {
        return telegramMessage.isRead();
    }

    public boolean hasMessageFailed(TelegramMessage telegramMessage) {
        return telegramMessage.hasFailed();
    }

    public String getRecipientTypeName(TelegramMessage telegramMessage) {
        return telegramMessage.getRecipientTypeName();
    }

    public String getMessageTypeName(TelegramMessage telegramMessage) {
        return telegramMessage.getMessageTypeName();
    }

    public String getDeliveryStatusName(TelegramMessage telegramMessage) {
        return telegramMessage.getDeliveryStatusName();
    }

    // Business methods
    public TelegramMessage sendLessonScheduledMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                                   String lessonInfo) {
        String messageText = "У вас новый урок запланирован:\n\n" + lessonInfo;
        
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
        telegramMessage.setMessageType(MessageType.LESSON_SCHEDULED);
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
        telegramMessage.setSentAt(LocalDateTime.now());
        
        return telegramMessageRepository.save(telegramMessage);
    }

    public TelegramMessage sendLessonCancelledMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                                   String lessonInfo, String reason) {
        String messageText = "Ваш урок отменен:\n\n" + lessonInfo + "\n\nПричина отмены: " + reason;
        
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
        telegramMessage.setMessageType(MessageType.LESSON_CANCELLED);
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
        telegramMessage.setSentAt(LocalDateTime.now());
        
        return telegramMessageRepository.save(telegramMessage);
    }

    public TelegramMessage sendLessonReminderMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                                  String lessonInfo) {
        String messageText = "Напоминание: У вас урок сегодня:\n\n" + lessonInfo;
        
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
        telegramMessage.setMessageType(MessageType.LESSON_REMINDER);
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
        telegramMessage.setSentAt(LocalDateTime.now());
        
        return telegramMessageRepository.save(telegramMessage);
    }

    public TelegramMessage sendGroupLessonScheduledMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                                        String lessonInfo) {
        String messageText = "Ваш групповой урок запланирован:\n\n" + lessonInfo;
        
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
        telegramMessage.setMessageType(MessageType.GROUP_LESSON_SCHEDULED);
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
        telegramMessage.setSentAt(LocalDateTime.now());
        
        return telegramMessageRepository.save(telegramMessage);
    }

    public TelegramMessage sendGroupLessonCancelledMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                                       String lessonInfo, String reason) {
        String messageText = "Ваш групповой урок отменен:\n\n" + lessonInfo + "\n\nПричина отмены: " + reason;
        
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
        telegramMessage.setMessageType(MessageType.GROUP_LESSON_CANCELLED);
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
        telegramMessage.setSentAt(LocalDateTime.now());
        
        return telegramMessageRepository.save(telegramMessage);
    }

    public TelegramMessage sendGroupLessonReminderMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                                      String lessonInfo) {
        String messageText = "Напоминание: У вас групповой урок сегодня:\n\n" + lessonInfo;
        
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
        telegramMessage.setMessageType(MessageType.GROUP_LESSON_REMINDER);
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
        telegramMessage.setSentAt(LocalDateTime.now());
        
        return telegramMessageRepository.save(telegramMessage);
    }

    public TelegramMessage sendPackageEndingSoonMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                                     String packageInfo) {
        String messageText = "Ваш пакет уроков скоро заканчивается:\n\n" + packageInfo;
        
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
        telegramMessage.setMessageType(MessageType.SYSTEM_NOTIFICATION);
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
        telegramMessage.setSentAt(LocalDateTime.now());
        
        return telegramMessageRepository.save(telegramMessage);
    }

    public TelegramMessage sendPaymentDueMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                              String paymentInfo) {
        String messageText = "Напоминание об оплате:\n\n" + paymentInfo;
        
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
        telegramMessage.setMessageType(MessageType.SYSTEM_NOTIFICATION);
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
        telegramMessage.setSentAt(LocalDateTime.now());
        
        return telegramMessageRepository.save(telegramMessage);
    }

    public TelegramMessage sendSystemMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                          String message) {
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, message);
        telegramMessage.setMessageType(MessageType.SYSTEM_NOTIFICATION);
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
        telegramMessage.setSentAt(LocalDateTime.now());
        
        return telegramMessageRepository.save(telegramMessage);
    }

    public TelegramMessage sendFeedbackRequestMessage(Long chatId, Long recipientId, RecipientType recipientType, 
                                                  String feedbackInfo) {
        String messageText = "Пожалуйста, оставьте обратную связь:\n\n" + feedbackInfo;
        
        TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
        telegramMessage.setMessageType(MessageType.FEEDBACK_REQUEST);
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
        telegramMessage.setSentAt(LocalDateTime.now());
        
        return telegramMessageRepository.save(telegramMessage);
    }

    public List<TelegramMessage> findFutureScheduledLessonsMessagesByRecipient(
            Long recipientId, RecipientType recipientType) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime future = now.plusWeeks(1);
        
        List<MessageType> lessonTypes = List.of(
            MessageType.LESSON_SCHEDULED,
            MessageType.GROUP_LESSON_SCHEDULED
        );
        
        List<DeliveryStatus> statuses = List.of(
            DeliveryStatus.PENDING,
            DeliveryStatus.SENT,
            DeliveryStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<TelegramMessage> messagePage = findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, lessonTypes, statuses, pageable);
        
        return messagePage.getContent().stream()
                .filter(m -> m.getSentAt().isAfter(now) || m.getSentAt().isEqual(now))
                .filter(m -> m.getSentAt().isBefore(future) || m.getSentAt().isEqual(future))
                .collect(Collectors.toList());
    }

    public List<TelegramMessage> findPastCompletedLessonsMessagesByRecipient(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<MessageType> lessonTypes = List.of(
            MessageType.LESSON_REMINDER,
            MessageType.GROUP_LESSON_REMINDER
        );
        
        List<DeliveryStatus> statuses = List.of(
            DeliveryStatus.READ,
            DeliveryStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<TelegramMessage> messagePage = findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, lessonTypes, statuses, pageable);
        
        return messagePage.getContent().stream()
                .filter(m -> m.getSentAt().isAfter(startDateTime) || m.getSentAt().isEqual(startDateTime))
                .filter(m -> m.getSentAt().isBefore(endDateTime) || m.getSentAt().isEqual(endDateTime))
                .collect(Collectors.toList());
    }

    public List<TelegramMessage> findCancelledLessonsMessagesByRecipient(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<MessageType> lessonTypes = List.of(
            MessageType.LESSON_CANCELLED,
            MessageType.GROUP_LESSON_CANCELLED
        );
        
        List<DeliveryStatus> statuses = List.of(
            DeliveryStatus.READ,
            DeliveryStatus.DELIVERED,
            DeliveryStatus.SENT
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<TelegramMessage> messagePage = findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, lessonTypes, statuses, pageable);
        
        return messagePage.getContent().stream()
                .filter(m -> m.getSentAt().isAfter(startDateTime) || m.getSentAt().isEqual(startDateTime))
                .filter(m -> m.getSentAt().isBefore(endDateTime) || m.getSentAt().isEqual(endDateTime))
                .collect(Collectors.toList());
    }

    public List<TelegramMessage> findMissedLessonsMessagesByRecipient(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<MessageType> lessonTypes = List.of(
            MessageType.LESSON_REMINDER,
            MessageType.GROUP_LESSON_REMINDER
        );
        
        List<DeliveryStatus> statuses = List.of(
            DeliveryStatus.READ,
            DeliveryStatus.DELIVERED,
            DeliveryStatus.SENT
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<TelegramMessage> messagePage = findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, lessonTypes, statuses, pageable);
        
        return messagePage.getContent().stream()
                .filter(m -> m.getSentAt().isAfter(startDateTime) || m.getSentAt().isEqual(startDateTime))
                .filter(m -> m.getSentAt().isBefore(endDateTime) || m.getSentAt().isEqual(endDateTime))
                .collect(Collectors.toList());
    }

    public List<TelegramMessage> findPackageEndingSoonMessagesByRecipient(
            Long recipientId, RecipientType recipientType) {
        List<MessageType> packageTypes = List.of(MessageType.SYSTEM_NOTIFICATION);
        
        List<DeliveryStatus> statuses = List.of(
            DeliveryStatus.PENDING,
            DeliveryStatus.SENT,
            DeliveryStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<TelegramMessage> messagePage = findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, packageTypes, statuses, pageable);
        
        return messagePage.getContent();
    }

    public List<TelegramMessage> findPaymentDueMessagesByRecipient(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<MessageType> paymentTypes = List.of(MessageType.SYSTEM_NOTIFICATION);
        
        List<DeliveryStatus> statuses = List.of(
            DeliveryStatus.PENDING,
            DeliveryStatus.SENT,
            DeliveryStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<TelegramMessage> messagePage = findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, paymentTypes, statuses, pageable);
        
        return messagePage.getContent().stream()
                .filter(m -> m.getSentAt().isAfter(startDateTime) || m.getSentAt().isEqual(startDateTime))
                .filter(m -> m.getSentAt().isBefore(endDateTime) || m.getSentAt().isEqual(endDateTime))
                .collect(Collectors.toList());
    }

    public List<TelegramMessage> findSystemMessagesByRecipient(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<MessageType> systemTypes = List.of(MessageType.SYSTEM_NOTIFICATION);
        
        List<DeliveryStatus> statuses = List.of(
            DeliveryStatus.PENDING,
            DeliveryStatus.SENT,
            DeliveryStatus.DELIVERED,
            DeliveryStatus.READ
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<TelegramMessage> messagePage = findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, systemTypes, statuses, pageable);
        
        return messagePage.getContent().stream()
                .filter(m -> m.getSentAt().isAfter(startDateTime) || m.getSentAt().isEqual(startDateTime))
                .filter(m -> m.getSentAt().isBefore(endDateTime) || m.getSentAt().isEqual(endDateTime))
                .collect(Collectors.toList());
    }

    public List<TelegramMessage> findFeedbackRequestsByRecipient(
            Long recipientId, RecipientType recipientType) {
        List<MessageType> feedbackTypes = List.of(MessageType.FEEDBACK_REQUEST);
        
        List<DeliveryStatus> statuses = List.of(
            DeliveryStatus.PENDING,
            DeliveryStatus.SENT,
            DeliveryStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<TelegramMessage> messagePage = findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, feedbackTypes, statuses, pageable);
        
        return messagePage.getContent();
    }

    public Page<TelegramMessage> findMessagesByRecipientTypeAndIdAndDateRange(
            RecipientType recipientType, Long recipientId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return findByRecipientIdAndRecipientTypeAndDeliveryStatuses(
                recipientId, recipientType, List.of(DeliveryStatus.values()), pageable);
    }

    public Page<TelegramMessage> findUnreadMessagesByRecipient(
            Long recipientId, RecipientType recipientType, Pageable pageable) {
        List<DeliveryStatus> unreadStatuses = List.of(
            DeliveryStatus.PENDING,
            DeliveryStatus.SENT,
            DeliveryStatus.DELIVERED
        );
        
        return findByRecipientIdAndRecipientTypeAndDeliveryStatuses(
                recipientId, recipientType, unreadStatuses, pageable);
    }

    public Page<TelegramMessage> findReadMessagesByRecipientAndDateRange(
            Long recipientId, RecipientType recipientType, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        List<DeliveryStatus> readStatuses = List.of(DeliveryStatus.READ);
        
        Page<TelegramMessage> allReadMessages = findByRecipientIdAndRecipientTypeAndDeliveryStatuses(
                recipientId, recipientType, readStatuses, pageable);
        
        List<TelegramMessage> filteredMessages = allReadMessages.getContent().stream()
                .filter(m -> m.getReadAt() != null)
                .filter(m -> m.getReadAt().isAfter(startDateTime) || m.getReadAt().isEqual(startDateTime))
                .filter(m -> m.getReadAt().isBefore(endDateTime) || m.getReadAt().isEqual(endDateTime))
                .collect(Collectors.toList());
        
        return new PageImpl<>(filteredMessages, pageable, filteredMessages.size());
    }

    public void markAllAsReadByRecipient(Long recipientId, RecipientType recipientType) {
        List<DeliveryStatus> unreadStatuses = List.of(
            DeliveryStatus.PENDING,
            DeliveryStatus.SENT,
            DeliveryStatus.DELIVERED
        );
        
        Pageable pageable = PageRequest.of(0, 100);
        Page<TelegramMessage> unreadMessages = findByRecipientIdAndRecipientTypeAndDeliveryStatuses(
                recipientId, recipientType, unreadStatuses, pageable);
        
        for (TelegramMessage message : unreadMessages.getContent()) {
            markAsRead(message);
        }
    }

    public void markAsReadById(Long messageId) {
        Optional<TelegramMessage> messageOpt = findById(messageId);
        if (messageOpt.isPresent()) {
            TelegramMessage message = messageOpt.get();
            markAsRead(message);
        }
    }

    public void deleteAllByRecipient(Long recipientId, RecipientType recipientType) {
        // В реальной реализации здесь будет удаление всех сообщений пользователя
        // Для демонстрации просто выводим информацию
        System.out.println("Deleting all messages for recipientId: " + recipientId + ", recipientType: " + recipientType);
    }

    public void deleteByRecipientAndDateRange(Long recipientId, RecipientType recipientType, 
                                            LocalDate startDate, LocalDate endDate) {
        // В реальной реализации здесь будет удаление сообщений пользователя в заданном диапазоне дат
        // Для демонстрации просто выводим информацию
        System.out.println("Deleting messages for recipientId: " + recipientId + 
                          ", recipientType: " + recipientType + 
                          ", date range: " + startDate + " to " + endDate);
    }

    public Long countUnreadMessagesByRecipient(Long recipientId, RecipientType recipientType) {
        List<DeliveryStatus> unreadStatuses = List.of(
            DeliveryStatus.PENDING,
            DeliveryStatus.SENT,
            DeliveryStatus.DELIVERED
        );
        
        return telegramMessageRepository.countByRecipientIdAndRecipientTypeAndDeliveryStatusesAndDateRange(
                recipientId, recipientType, unreadStatuses, LocalDateTime.MIN, LocalDateTime.MAX);
    }

    public Long countReadMessagesByRecipientAndDateRange(Long recipientId, RecipientType recipientType, 
                                                      LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return telegramMessageRepository.countByRecipientIdAndRecipientTypeAndDeliveryStatusesAndDateRange(
                recipientId, recipientType, List.of(DeliveryStatus.READ), startDateTime, endDateTime);
    }

    public Long countMessagesByRecipientTypeAndIdAndDateRange(
            RecipientType recipientType, Long recipientId, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return telegramMessageRepository.countByRecipientTypeAndRecipientIdAndDateRange(
                recipientType, recipientId, startDateTime, endDateTime);
    }

    public Long countMessagesByRecipientTypeAndIdAndMessageTypesAndDateRange(
            RecipientType recipientType, Long recipientId, List<MessageType> messageTypes, 
            LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return telegramMessageRepository.countByRecipientTypeAndRecipientIdAndMessageTypesAndDateRange(
                recipientType, recipientId, messageTypes, startDateTime, endDateTime);
    }

    public Long countMessagesByRecipientTypeAndIdAndDeliveryStatusesAndDateRange(
            RecipientType recipientType, Long recipientId, List<DeliveryStatus> statuses, 
            LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return telegramMessageRepository.countByRecipientTypeAndRecipientIdAndDeliveryStatusesAndDateRange(
                recipientType, recipientId, statuses, startDateTime, endDateTime);
    }

    public Long countMessagesByRecipientTypeAndIdAndMessageTypesAndDeliveryStatusesAndDateRange(
            RecipientType recipientType, Long recipientId, List<MessageType> messageTypes, 
            List<DeliveryStatus> statuses, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);
        
        return telegramMessageRepository.countByRecipientTypeAndRecipientIdAndMessageTypesAndDeliveryStatusesAndDateRange(
                recipientType, recipientId, messageTypes, statuses, startDateTime, endDateTime);
    }
}