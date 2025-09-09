package com.crm.system.service;

import com.crm.system.model.TelegramMessage;
import com.crm.system.model.TelegramMessage.RecipientType;
import com.crm.system.model.TelegramMessage.MessageType;
import com.crm.system.model.TelegramMessage.DeliveryStatus;
import com.crm.system.model.User;
import com.crm.system.model.Student;
import com.crm.system.repository.TelegramMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.DefaultAbsSender;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class TelegramNotificationService extends DefaultAbsSender {

    private static final Logger logger = Logger.getLogger(TelegramNotificationService.class.getName());

    @Autowired
    private TelegramMessageRepository telegramMessageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    // В реальной реализации здесь будет токен бота из конфигурации
    private String botToken = "YOUR_BOT_TOKEN_HERE";

    public TelegramNotificationService() {
        super();
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    public void sendNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                String messageText, MessageType messageType) {
        try {
            // Создаем запись в БД
            TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
            telegramMessage.setMessageType(messageType);
            telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
            telegramMessage.setSentAt(LocalDateTime.now());
            
            telegramMessage = telegramMessageRepository.save(telegramMessage);

            // Отправляем сообщение в Telegram
            SendMessage message = new SendMessage();
            message.setChatId(String.valueOf(chatId));
            message.setText(messageText);

            execute(message);
            telegramMessage.setDeliveryStatus(DeliveryStatus.SENT);
            telegramMessageRepository.save(telegramMessage);
            logger.info("Successfully sent message to chatId: " + chatId);
        } catch (TelegramApiException e) {
            logger.severe("Failed to send message to chatId: " + chatId + ". Error: " + e.getMessage());
            TelegramMessage telegramMessage = new TelegramMessage(chatId, recipientId, recipientType, messageText);
            telegramMessage.setMessageType(messageType);
            telegramMessage.setDeliveryStatus(DeliveryStatus.FAILED);
            telegramMessage.setErrorMessage(e.getMessage());
            telegramMessageRepository.save(telegramMessage);
        }
    }

    public void sendLessonScheduledNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                               String lessonInfo) {
        String messageText = "У вас новый урок запланирован:\n\n" + lessonInfo;
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.LESSON_SCHEDULED);
    }

    public void sendLessonCancelledNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                              String lessonInfo, String reason) {
        String messageText = "Ваш урок отменен:\n\n" + lessonInfo + "\n\nПричина отмены: " + reason;
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.LESSON_CANCELLED);
    }

    public void sendLessonReminderNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                             String lessonInfo) {
        String messageText = "Напоминание: У вас урок сегодня:\n\n" + lessonInfo;
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.LESSON_REMINDER);
    }

    public void sendGroupLessonScheduledNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                                   String lessonInfo) {
        String messageText = "Ваш групповой урок запланирован:\n\n" + lessonInfo;
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.GROUP_LESSON_SCHEDULED);
    }

    public void sendGroupLessonCancelledNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                                   String lessonInfo, String reason) {
        String messageText = "Ваш групповой урок отменен:\n\n" + lessonInfo + "\n\nПричина отмены: " + reason;
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.GROUP_LESSON_CANCELLED);
    }

    public void sendGroupLessonReminderNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                                  String lessonInfo) {
        String messageText = "Напоминание: У вас групповой урок сегодня:\n\n" + lessonInfo;
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.GROUP_LESSON_REMINDER);
    }

    public void sendPackageEndingSoonNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                                String packageInfo) {
        String messageText = "Ваш пакет уроков скоро заканчивается:\n\n" + packageInfo;
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.SYSTEM_NOTIFICATION);
    }

    public void sendPaymentDueNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                         String paymentInfo) {
        String messageText = "Напоминание об оплате:\n\n" + paymentInfo;
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.SYSTEM_NOTIFICATION);
    }

    public void sendSystemMessageNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                            String message) {
        sendNotification(chatId, recipientId, recipientType, message, MessageType.SYSTEM_NOTIFICATION);
    }

    public void sendFeedbackRequestNotification(Long chatId, Long recipientId, RecipientType recipientType, 
                                              String feedbackInfo) {
        String messageText = "Пожалуйста, оставьте обратную связь:\n\n" + feedbackInfo;
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.FEEDBACK_REQUEST);
    }

    // Методы для проверки состояния отправки
    public boolean isMessageDelivered(Long messageId) {
        return telegramMessageRepository.findById(messageId)
                .map(TelegramMessage::isDelivered)
                .orElse(false);
    }

    public boolean isMessageRead(Long messageId) {
        return telegramMessageRepository.findById(messageId)
                .map(TelegramMessage::isRead)
                .orElse(false);
    }

    // Методы для обработки входящих сообщений от пользователей
    public void handleIncomingMessage(Long chatId, String messageText) {
        logger.info("Received message from chatId: " + chatId + ", message: " + messageText);
        // Здесь будет логика обработки входящих сообщений
    }

    // Методы для обработки callback-запросов от пользователей
    public void handleCallbackQuery(String callbackData) {
        logger.info("Received callback query: " + callbackData);
        // Здесь будет логика обработки callback-запросов
    }

    // Методы для обработки ошибок отправки
    public void handleSendMessageFailure(Long messageId, String errorMessage) {
        Optional<TelegramMessage> messageOpt = telegramMessageRepository.findById(messageId);
        if (messageOpt.isPresent()) {
            TelegramMessage message = messageOpt.get();
            message.setDeliveryStatus(DeliveryStatus.FAILED);
            message.setErrorMessage(errorMessage);
            telegramMessageRepository.save(message);
            logger.severe("Failed to send message ID: " + messageId + ". Error: " + errorMessage);
        }
    }

    // Методы для повторной отправки неудачных сообщений
    public void retryFailedMessages(Integer maxRetries) {
        List<TelegramMessage> failedMessages = telegramMessageRepository.findFailedMessagesWithRetriesBelow(maxRetries);
        
        for (TelegramMessage message : failedMessages) {
            try {
                // Увеличиваем счетчик попыток
                message.incrementRetryCount();
                
                // Повторная отправка
                SendMessage sendMessage = new SendMessage();
                sendMessage.setChatId(String.valueOf(message.getChatId()));
                sendMessage.setText(message.getMessageText());
                
                execute(sendMessage);
                
                // Обновляем статус
                message.setDeliveryStatus(DeliveryStatus.SENT);
                telegramMessageRepository.save(message);
                
                logger.info("Successfully resent message ID: " + message.getId() + " to chatId: " + message.getChatId());
            } catch (TelegramApiException e) {
                logger.severe("Failed to resend message ID: " + message.getId() + " to chatId: " + message.getChatId() + 
                             ". Error: " + e.getMessage());
                message.setErrorMessage(e.getMessage());
                telegramMessageRepository.save(message);
            }
        }
    }

    // Методы для обработки подтверждений доставки
    public void handleDeliveryConfirmation(Long messageId) {
        Optional<TelegramMessage> messageOpt = telegramMessageRepository.findById(messageId);
        if (messageOpt.isPresent()) {
            TelegramMessage message = messageOpt.get();
            message.setDeliveryStatus(DeliveryStatus.DELIVERED);
            message.setDeliveredAt(LocalDateTime.now());
            telegramMessageRepository.save(message);
            logger.info("Message ID: " + messageId + " delivered to chatId: " + message.getChatId());
        }
    }

    // Методы для обработки подтверждений прочтения
    public void handleReadConfirmation(Long messageId) {
        Optional<TelegramMessage> messageOpt = telegramMessageRepository.findById(messageId);
        if (messageOpt.isPresent()) {
            TelegramMessage message = messageOpt.get();
            message.setDeliveryStatus(DeliveryStatus.READ);
            message.setReadAt(LocalDateTime.now());
            telegramMessageRepository.save(message);
            logger.info("Message ID: " + messageId + " read by chatId: " + message.getChatId());
        }
    }

    // Методы для получения статистики
    public Long getPendingMessagesCount() {
        return telegramMessageRepository.countByDeliveryStatus(DeliveryStatus.PENDING);
    }

    public Long getSentMessagesCount() {
        return telegramMessageRepository.countByDeliveryStatus(DeliveryStatus.SENT);
    }

    public Long getDeliveredMessagesCount() {
        return telegramMessageRepository.countByDeliveryStatus(DeliveryStatus.DELIVERED);
    }

    public Long getReadMessagesCount() {
        return telegramMessageRepository.countByDeliveryStatus(DeliveryStatus.READ);
    }

    public Long getFailedMessagesCount() {
        return telegramMessageRepository.countByDeliveryStatus(DeliveryStatus.FAILED);
    }

    // Методы для очистки старых сообщений
    public void cleanupOldMessages(LocalDateTime beforeDateTime) {
        List<TelegramMessage> oldMessages = telegramMessageRepository.findMessagesBeforeDateTime(beforeDateTime);
        for (TelegramMessage message : oldMessages) {
            telegramMessageRepository.delete(message);
        }
        logger.info("Cleaned up " + oldMessages.size() + " old messages");
    }

    // Методы для получения сообщений по различным критериям
    public List<TelegramMessage> getPendingMessagesBeforeDateTime(LocalDateTime beforeDateTime) {
        return telegramMessageRepository.findPendingMessagesBeforeDateTime(beforeDateTime);
    }

    public List<TelegramMessage> getFailedMessagesWithRetriesBelow(Integer maxRetries) {
        return telegramMessageRepository.findFailedMessagesWithRetriesBelow(maxRetries);
    }

    public List<TelegramMessage> getDeliveredButUnreadMessagesByRecipient(Long recipientId, RecipientType recipientType) {
        return telegramMessageRepository.findDeliveredButUnreadMessagesByRecipient(recipientId, recipientType);
    }

    public Long countDeliveredButUnreadMessagesByRecipient(Long recipientId, RecipientType recipientType) {
        return telegramMessageRepository.countDeliveredButUnreadMessagesByRecipient(recipientId, recipientType);
    }
}