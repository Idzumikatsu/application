package com.crm.system.controller;

import com.crm.system.dto.TelegramMessageDto;
import com.crm.system.model.TelegramMessage;
import com.crm.system.model.TelegramMessage.RecipientType;
import com.crm.system.model.TelegramMessage.MessageType;
import com.crm.system.model.TelegramMessage.DeliveryStatus;
import com.crm.system.service.TelegramMessageService;
import com.crm.system.service.UserService;
import com.crm.system.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class TelegramMessageController {

    @Autowired
    private TelegramMessageService telegramMessageService;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @GetMapping("/telegram-messages/chats/{chatId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramMessageDto>> getChatMessages(
            @PathVariable Long chatId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        LocalDate start = startDate != null ? startDate : LocalDate.now().minusDays(30);
        LocalDate end = endDate != null ? endDate : LocalDate.now();

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramMessage> messagePage = telegramMessageService.findByChatIdAndDateRange(
                chatId, start.atStartOfDay(), end.atTime(23, 59, 59), pageable);

        List<TelegramMessageDto> messageDtos = messagePage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramMessageDto> dtoPage = new PageImpl<>(messageDtos, pageable, messagePage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/telegram-messages/recipients/{recipientId}/{recipientType}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramMessageDto>> getRecipientMessages(
            @PathVariable Long recipientId,
            @PathVariable RecipientType recipientType,
            @RequestParam(required = false) List<DeliveryStatus> statuses,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<DeliveryStatus> deliveryStatuses = statuses != null ? statuses : 
                List.of(DeliveryStatus.PENDING, DeliveryStatus.SENT, DeliveryStatus.DELIVERED, DeliveryStatus.READ);

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramMessage> messagePage = telegramMessageService.findByRecipientIdAndRecipientTypeAndDeliveryStatuses(
                recipientId, recipientType, deliveryStatuses, pageable);

        List<TelegramMessageDto> messageDtos = messagePage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramMessageDto> dtoPage = new PageImpl<>(messageDtos, pageable, messagePage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/telegram-messages/{id}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TelegramMessageDto> getMessageById(@PathVariable Long id) {
        TelegramMessage message = telegramMessageService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram message not found with id: " + id));
        return ResponseEntity.ok(convertToDto(message));
    }

    @PostMapping("/telegram-messages/{id}/mark-as-delivered")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TelegramMessageDto> markMessageAsDelivered(@PathVariable Long id) {
        TelegramMessage message = telegramMessageService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram message not found with id: " + id));

        telegramMessageService.markAsDelivered(message);
        return ResponseEntity.ok(convertToDto(message));
    }

    @PostMapping("/telegram-messages/{id}/mark-as-read")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TelegramMessageDto> markMessageAsRead(@PathVariable Long id) {
        TelegramMessage message = telegramMessageService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram message not found with id: " + id));

        telegramMessageService.markAsRead(message);
        return ResponseEntity.ok(convertToDto(message));
    }

    @PostMapping("/telegram-messages/{id}/mark-as-failed")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TelegramMessageDto> markMessageAsFailed(
            @PathVariable Long id,
            @RequestParam String errorMessage) {
        TelegramMessage message = telegramMessageService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram message not found with id: " + id));

        telegramMessageService.markAsFailed(message, errorMessage);
        return ResponseEntity.ok(convertToDto(message));
    }

    @GetMapping("/telegram-messages/recipients/{recipientId}/{recipientType}/unread-count")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Long> getUnreadMessagesCount(
            @PathVariable Long recipientId,
            @PathVariable RecipientType recipientType) {

        Long unreadCount = telegramMessageService.countDeliveredButUnreadMessagesByRecipient(recipientId, recipientType);
        return ResponseEntity.ok(unreadCount);
    }

    @GetMapping("/telegram-messages/recipients/{recipientId}/{recipientType}/delivered-but-unread")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramMessageDto>> getDeliveredButUnreadMessages(
            @PathVariable Long recipientId,
            @PathVariable RecipientType recipientType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramMessage> messagePage = telegramMessageService.findDeliveredButUnreadMessagesByRecipient(
                recipientId, recipientType, pageable);

        List<TelegramMessageDto> messageDtos = messagePage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramMessageDto> dtoPage = new PageImpl<>(messageDtos, pageable, messagePage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/telegram-messages/recipients/{recipientId}/{recipientType}/message-types/{messageTypes}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramMessageDto>> getMessagesByRecipientAndTypes(
            @PathVariable Long recipientId,
            @PathVariable RecipientType recipientType,
            @PathVariable List<MessageType> messageTypes,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<DeliveryStatus> deliveryStatuses = List.of(
            DeliveryStatus.PENDING,
            DeliveryStatus.SENT,
            DeliveryStatus.DELIVERED,
            DeliveryStatus.READ
        );

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramMessage> messagePage = telegramMessageService.findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, messageTypes, deliveryStatuses, pageable);

        List<TelegramMessageDto> messageDtos = messagePage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramMessageDto> dtoPage = new PageImpl<>(messageDtos, pageable, messagePage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/telegram-messages/recipients/{recipientId}/{recipientType}/statuses/{deliveryStatuses}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramMessageDto>> getMessagesByRecipientAndStatuses(
            @PathVariable Long recipientId,
            @PathVariable RecipientType recipientType,
            @PathVariable List<DeliveryStatus> deliveryStatuses,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramMessage> messagePage = telegramMessageService.findByRecipientIdAndRecipientTypeAndDeliveryStatuses(
                recipientId, recipientType, deliveryStatuses, pageable);

        List<TelegramMessageDto> messageDtos = messagePage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramMessageDto> dtoPage = new PageImpl<>(messageDtos, pageable, messagePage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/telegram-messages/recipients/{recipientId}/{recipientType}/message-types/{messageTypes}/statuses/{deliveryStatuses}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramMessageDto>> getMessagesByRecipientAndTypesAndStatuses(
            @PathVariable Long recipientId,
            @PathVariable RecipientType recipientType,
            @PathVariable List<MessageType> messageTypes,
            @PathVariable List<DeliveryStatus> deliveryStatuses,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramMessage> messagePage = telegramMessageService.findByRecipientIdAndRecipientTypeAndMessageTypesAndDeliveryStatuses(
                recipientId, recipientType, messageTypes, deliveryStatuses, pageable);

        List<TelegramMessageDto> messageDtos = messagePage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramMessageDto> dtoPage = new PageImpl<>(messageDtos, pageable, messagePage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @PostMapping("/telegram-messages/{id}/increment-retry-count")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<TelegramMessageDto> incrementRetryCount(@PathVariable Long id) {
        TelegramMessage message = telegramMessageService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram message not found with id: " + id));

        telegramMessageService.incrementRetryCount(message);
        return ResponseEntity.ok(convertToDto(message));
    }

    @GetMapping("/telegram-messages/failed-with-retries-below/{maxRetries}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<TelegramMessageDto>> getFailedMessagesWithRetriesBelow(@PathVariable Integer maxRetries) {
        List<TelegramMessage> messages = telegramMessageService.findFailedMessagesWithRetriesBelow(maxRetries);
        List<TelegramMessageDto> messageDtos = messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messageDtos);
    }

    @GetMapping("/telegram-messages/pending-before/{beforeDateTime}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<TelegramMessageDto>> getPendingMessagesBeforeDateTime(@PathVariable LocalDateTime beforeDateTime) {
        List<TelegramMessage> messages = telegramMessageService.findPendingMessagesBeforeDateTime(beforeDateTime);
        List<TelegramMessageDto> messageDtos = messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messageDtos);
    }

    @GetMapping("/telegram-messages/sent-by-types-and-date-range")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramMessageDto>> getSentMessagesByTypesAndDateRange(
            @RequestParam List<MessageType> types,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramMessage> messagePage = telegramMessageService.findSentMessagesByTypesAndDateRange(
                types, startDate, endDate, pageable);

        List<TelegramMessageDto> messageDtos = messagePage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramMessageDto> dtoPage = new PageImpl<>(messageDtos, pageable, messagePage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/telegram-messages/sent-by-recipient-type-and-before-date-time")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<TelegramMessageDto>> getSentMessagesByRecipientTypeAndBeforeDateTime(
            @RequestParam RecipientType recipientType,
            @RequestParam LocalDateTime beforeDateTime) {

        List<TelegramMessage> messages = telegramMessageService.findSentMessagesByRecipientTypeAndBeforeDateTime(
                recipientType, beforeDateTime);
        List<TelegramMessageDto> messageDtos = messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messageDtos);
    }

    @GetMapping("/telegram-messages/sent-by-recipient-type-and-id-and-types")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<TelegramMessageDto>> getSentMessagesByRecipientTypeAndIdAndTypes(
            @RequestParam RecipientType recipientType,
            @RequestParam Long recipientId,
            @RequestParam List<MessageType> messageTypes) {

        List<TelegramMessage> messages = telegramMessageService.findSentMessagesByRecipientTypeAndIdAndTypes(
                recipientType, recipientId, messageTypes);
        List<TelegramMessageDto> messageDtos = messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messageDtos);
    }

    @GetMapping("/telegram-messages/sent-by-recipient-and-entity-and-type")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<TelegramMessageDto>> getSentMessagesByRecipientAndEntityAndType(
            @RequestParam RecipientType recipientType,
            @RequestParam Long recipientId,
            @RequestParam Long relatedEntityId,
            @RequestParam String relatedEntityType,
            @RequestParam MessageType messageType) {

        List<TelegramMessage> messages = telegramMessageService.findSentMessagesByRecipientAndEntityAndType(
                recipientType, recipientId, relatedEntityId, relatedEntityType, messageType);
        List<TelegramMessageDto> messageDtos = messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messageDtos);
    }

    @GetMapping("/telegram-messages/by-recipient-type-and-id-and-types-and-statuses-and-date-range")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<TelegramMessageDto>> getMessagesByRecipientTypeAndIdAndTypesAndStatusesAndDateRange(
            @RequestParam RecipientType recipientType,
            @RequestParam Long recipientId,
            @RequestParam List<MessageType> messageTypes,
            @RequestParam List<DeliveryStatus> statuses,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        List<TelegramMessage> messages = telegramMessageService.findMessagesByRecipientTypeAndIdAndTypesAndStatusesAndDateRange(
                recipientType, recipientId, messageTypes, statuses, startDateTime, endDateTime);
        List<TelegramMessageDto> messageDtos = messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messageDtos);
    }

    @GetMapping("/telegram-messages/by-recipient-type-and-id-and-entity-and-types-and-statuses-and-date-range")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<TelegramMessageDto>> getMessagesByRecipientTypeAndIdAndEntityAndTypesAndStatusesAndDateRange(
            @RequestParam RecipientType recipientType,
            @RequestParam Long recipientId,
            @RequestParam Long relatedEntityId,
            @RequestParam String relatedEntityType,
            @RequestParam List<MessageType> messageTypes,
            @RequestParam List<DeliveryStatus> statuses,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

        List<TelegramMessage> messages = telegramMessageService.findMessagesByRecipientTypeAndIdAndEntityAndTypesAndStatusesAndDateRange(
                recipientType, recipientId, relatedEntityId, relatedEntityType, messageTypes, statuses, startDateTime, endDateTime);
        List<TelegramMessageDto> messageDtos = messages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(messageDtos);
    }

    private TelegramMessageDto convertToDto(TelegramMessage message) {
        TelegramMessageDto dto = new TelegramMessageDto();
        dto.setId(message.getId());
        dto.setChatId(message.getChatId());
        dto.setMessageId(message.getMessageId());
        dto.setRecipientId(message.getRecipientId());
        dto.setRecipientType(message.getRecipientType());
        dto.setMessageText(message.getMessageText());
        dto.setMessageType(message.getMessageType());
        dto.setDeliveryStatus(message.getDeliveryStatus());
        dto.setSentAt(message.getSentAt());
        dto.setDeliveredAt(message.getDeliveredAt());
        dto.setReadAt(message.getReadAt());
        dto.setErrorMessage(message.getErrorMessage());
        dto.setRetryCount(message.getRetryCount());
        dto.setRelatedEntityId(message.getRelatedEntityId());
        dto.setRelatedEntityType(message.getRelatedEntityType());
        if (message.getCreatedAt() != null) {
            dto.setCreatedAt(message.getCreatedAt().toString());
        }
        if (message.getUpdatedAt() != null) {
            dto.setUpdatedAt(message.getUpdatedAt().toString());
        }
        return dto;
    }
}