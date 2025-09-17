package com.crm.system.controller;

import com.crm.system.dto.MessageDto;
import com.crm.system.dto.TelegramRegistrationRequest;
import com.crm.system.dto.TelegramSendRequest;
import com.crm.system.model.Student;
import com.crm.system.model.TelegramMessage;
import com.crm.system.model.User;
import com.crm.system.service.StudentService;
import com.crm.system.service.TelegramNotificationService;
import com.crm.system.service.UserService;
import jakarta.validation.Valid;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TelegramNotificationController {

    private static final Logger log = LoggerFactory.getLogger(TelegramNotificationController.class);

    private final TelegramNotificationService telegramNotificationService;
    private final UserService userService;
    private final StudentService studentService;

    public TelegramNotificationController(TelegramNotificationService telegramNotificationService,
                                          UserService userService,
                                          StudentService studentService) {
        this.telegramNotificationService = telegramNotificationService;
        this.userService = userService;
        this.studentService = studentService;
    }

    @PostMapping("/notifications/telegram/send")
    public ResponseEntity<MessageDto> sendTelegramNotification(@Valid @RequestBody TelegramSendRequest request) {
        TelegramMessage.RecipientType recipientType;
        TelegramMessage.MessageType messageType;
        try {
            recipientType = TelegramMessage.RecipientType.valueOf(request.getRecipientType().toUpperCase(Locale.ROOT));
            messageType = TelegramMessage.MessageType.valueOf(request.getMessageType().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest()
                    .body(new MessageDto("Unsupported recipient or message type"));
        }

        Long chatId = request.getChatId();
        if (chatId == null) {
            chatId = resolveChatId(request.getRecipientId(), recipientType);
        }

        if (chatId == null) {
            return ResponseEntity.badRequest()
                    .body(new MessageDto("Chat ID is not registered for recipient " + request.getRecipientId()));
        }

        telegramNotificationService.sendNotification(chatId,
                request.getRecipientId(),
                recipientType,
                request.getMessage(),
                messageType);

        return ResponseEntity.ok(new MessageDto("Notification queued for delivery"));
    }

    @PostMapping("/users/{userId}/telegram")
    @Transactional
    public ResponseEntity<MessageDto> registerUserTelegramChat(@PathVariable Long userId,
                                                                @Valid @RequestBody TelegramRegistrationRequest request) {
        boolean updated = false;
        User user = userService.findById(userId).orElse(null);
        if (user != null) {
            user.setTelegramChatId(request.getChatId());
            userService.saveUser(user);
            updated = true;
        }

        if (!updated) {
            Student student = studentService.findById(userId).orElse(null);
            if (student != null) {
                student.setTelegramChatId(request.getChatId());
                studentService.saveStudent(student);
                updated = true;
            }
        }

        if (!updated) {
            return ResponseEntity.badRequest()
                    .body(new MessageDto("User or student with id " + userId + " not found"));
        }

        return ResponseEntity.ok(new MessageDto("Telegram chat registered"));
    }

    private Long resolveChatId(Long recipientId, TelegramMessage.RecipientType recipientType) {
        return switch (recipientType) {
            case STUDENT -> studentService.findById(recipientId)
                    .map(Student::getTelegramChatId)
                    .orElse(null);
            case TEACHER, MANAGER, ADMIN -> userService.findById(recipientId)
                    .map(User::getTelegramChatId)
                    .orElse(null);
        };
    }
}
