package com.crm.system.service;

import com.crm.system.model.TelegramMessage;
import com.crm.system.model.TelegramMessage.RecipientType;
import com.crm.system.model.TelegramMessage.MessageType;
import com.crm.system.model.TelegramMessage.DeliveryStatus;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.model.Student;
import com.crm.system.model.LessonPackage;
import com.crm.system.repository.TelegramMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.telegram.telegrambots.bots.DefaultAbsSender;
import org.telegram.telegrambots.bots.DefaultBotOptions;
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
    private NotificationSettingsService notificationSettingsService;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private LessonPackageService lessonPackageService;

    @Value("${telegram.bot.token}")
    private String botToken;

    public TelegramNotificationService() {
        super(new DefaultBotOptions());
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    public void sendNotification(Long chatId, Long recipientId, RecipientType recipientType,
                                String messageText, MessageType messageType) {
        
        // Проверяем настройки уведомлений пользователя
        NotificationSettings.UserType userType = convertRecipientTypeToUserType(recipientType);
        if (!notificationSettingsService.shouldSendTelegramNotification(recipientId, userType, messageType)) {
            logger.info("Telegram notifications disabled for user " + recipientId + " for message type " + messageType);
            return;
        }

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

    /**
     * Отправляет уведомление всем менеджерам
     */
    public void sendNotificationToManagers(String messageText, TelegramMessage.MessageType messageType) {
        List<User> managers = userService.findByRole(UserRole.MANAGER);
        
        for (User manager : managers) {
            if (manager.getTelegramChatId() != null) {
                sendNotification(
                    manager.getTelegramChatId(),
                    manager.getId(),
                    TelegramMessage.RecipientType.MANAGER,
                    messageText,
                    messageType
                );
            }
        }
    }

    /**
     * Преобразует RecipientType в UserType для проверки настроек уведомлений
     */
    private NotificationSettings.UserType convertRecipientTypeToUserType(TelegramMessage.RecipientType recipientType) {
        switch (recipientType) {
            case STUDENT:
                return NotificationSettings.UserType.STUDENT;
            case TEACHER:
                return NotificationSettings.UserType.TEACHER;
            case MANAGER:
                return NotificationSettings.UserType.MANAGER;
            case ADMIN:
                return NotificationSettings.UserType.ADMIN;
            default:
                return NotificationSettings.UserType.STUDENT;
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
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.PACKAGE_ENDING_SOON);
    }

    public void sendPackageExpiredNotification(Long chatId, Long recipientId, RecipientType recipientType,
                                             String packageInfo) {
        String messageText = "Ваш пакет уроков закончился:\n\n" + packageInfo +
                           "\n\nПожалуйста, приобретите новый пакет для продолжения занятий.";
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.PACKAGE_EXPIRED);
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

    // Метод для уведомления менеджеров о регистрации пользователей
    public void notifyManagersAboutRegistration(String notificationText) {
        // Получаем всех активных менеджеров
        List<User> managers = userService.findByRole(UserRole.MANAGER);
        
        for (User manager : managers) {
            if (manager.getTelegramChatId() != null) {
                // Отправляем уведомление менеджеру
                sendNotification(
                    manager.getTelegramChatId(),
                    manager.getId(),
                    RecipientType.MANAGER,
                    notificationText,
                    MessageType.SYSTEM_NOTIFICATION
                );
            }
        }
    }

    // Метод для уведомления менеджеров о подтверждении присутствия
    public void notifyManagersAboutAttendanceConfirmation(String notificationText) {
        // Получаем всех активных менеджеров
        List<User> managers = userService.findByRole(UserRole.MANAGER);
        
        for (User manager : managers) {
            if (manager.getTelegramChatId() != null) {
                // Отправляем уведомление менеджеру
                sendNotification(
                    manager.getTelegramChatId(),
                    manager.getId(),
                    RecipientType.MANAGER,
                    notificationText,
                    MessageType.SYSTEM_NOTIFICATION
                );
            }
        }
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

    // Методы для уведомлений об изменениях статусов уроков
    public void notifyLessonStatusChange(Long chatId, Long recipientId, RecipientType recipientType,
                                       String lessonInfo, Lesson.LessonStatus oldStatus, Lesson.LessonStatus newStatus) {
        String messageText = String.format("Статус урока изменен:\n\n%s\n\nБыло: %s\nСтало: %s",
            lessonInfo, getStatusDescription(oldStatus), getStatusDescription(newStatus));
        sendNotification(chatId, recipientId, recipientType, messageText, MessageType.LESSON_STATUS_CHANGE);
    }

    public void notifyStudentAboutLessonStatusChange(Long studentId, String lessonInfo,
                                                   Lesson.LessonStatus oldStatus, Lesson.LessonStatus newStatus) {
        Student student = studentService.findById(studentId);
        if (student != null && student.getTelegramChatId() != null) {
            notifyLessonStatusChange(
                student.getTelegramChatId(),
                studentId,
                RecipientType.STUDENT,
                lessonInfo,
                oldStatus,
                newStatus
            );
        }
    }

    public void notifyTeacherAboutLessonStatusChange(Long teacherId, String lessonInfo,
                                                   Lesson.LessonStatus oldStatus, Lesson.LessonStatus newStatus) {
        User teacher = userService.findById(teacherId);
        if (teacher != null && teacher.getTelegramChatId() != null) {
            notifyLessonStatusChange(
                teacher.getTelegramChatId(),
                teacherId,
                RecipientType.TEACHER,
                lessonInfo,
                oldStatus,
                newStatus
            );
        }
    }

    public void notifyManagersAboutLessonStatusChange(String lessonInfo,
                                                    Lesson.LessonStatus oldStatus, Lesson.LessonStatus newStatus) {
        String messageText = String.format("Статус урока изменен:\n\n%s\n\nБыло: %s\nСтало: %s",
            lessonInfo, getStatusDescription(oldStatus), getStatusDescription(newStatus));
        notifyManagersAboutSystemEvent(messageText);
    }

    private String getStatusDescription(Lesson.LessonStatus status) {
        switch (status) {
            case SCHEDULED: return "Запланирован";
            case COMPLETED: return "Проведен";
            case CANCELLED: return "Отменен";
            case MISSED: return "Пропущен";
            default: return status.toString();
        }
    }

    public void notifyManagersAboutSystemEvent(String notificationText) {
        // Получаем всех активных менеджеров
        List<User> managers = userService.findByRole(UserRole.MANAGER);
        
        for (User manager : managers) {
            if (manager.getTelegramChatId() != null) {
                // Отправляем уведомление менеджеру
                sendNotification(
                    manager.getTelegramChatId(),
                    manager.getId(),
                    RecipientType.MANAGER,
                    notificationText,
                    MessageType.SYSTEM_NOTIFICATION
                );
            }
        }
    }

    // Методы для уведомлений о пакетах уроков
    public void notifyStudentAboutPackageEndingSoon(Long studentId, LessonPackage lessonPackage) {
        Student student = studentService.findById(studentId);
        if (student != null && student.getTelegramChatId() != null) {
            String packageInfo = String.format(
                "Пакет уроков #%d\nОсталось уроков: %d из %d\nДата создания: %s",
                lessonPackage.getId(),
                lessonPackage.getRemainingLessons(),
                lessonPackage.getTotalLessons(),
                lessonPackage.getCreatedAt().toLocalDate()
            );
            sendPackageEndingSoonNotification(
                student.getTelegramChatId(),
                studentId,
                RecipientType.STUDENT,
                packageInfo
            );
        }
    }

    public void notifyStudentAboutPackageExpired(Long studentId, LessonPackage lessonPackage) {
        Student student = studentService.findById(studentId);
        if (student != null && student.getTelegramChatId() != null) {
            String packageInfo = String.format(
                "Пакет уроков #%d\nИспользовано уроков: %d из %d\nДата создания: %s",
                lessonPackage.getId(),
                lessonPackage.getTotalLessons() - lessonPackage.getRemainingLessons(),
                lessonPackage.getTotalLessons(),
                lessonPackage.getCreatedAt().toLocalDate()
            );
            sendPackageExpiredNotification(
                student.getTelegramChatId(),
                studentId,
                RecipientType.STUDENT,
                packageInfo
            );
        }
    }

    public void notifyManagersAboutPackageEndingSoon(LessonPackage lessonPackage) {
        String notificationText = String.format(
            "Пакет уроков скоро заканчивается:\n\n" +
            "Студент: %s %s\n" +
            "Пакет #%d\n" +
            "Осталось уроков: %d из %d\n" +
            "Дата создания: %s",
            lessonPackage.getStudent().getFirstName(),
            lessonPackage.getStudent().getLastName(),
            lessonPackage.getId(),
            lessonPackage.getRemainingLessons(),
            lessonPackage.getTotalLessons(),
            lessonPackage.getCreatedAt().toLocalDate()
        );
        notifyManagersAboutSystemEvent(notificationText);
    }

    public void notifyManagersAboutPackageExpired(LessonPackage lessonPackage) {
        String notificationText = String.format(
            "Пакет уроков закончился:\n\n" +
            "Студент: %s %s\n" +
            "Пакет #%d\n" +
            "Использовано уроков: %d из %d\n" +
            "Дата создания: %s",
            lessonPackage.getStudent().getFirstName(),
            lessonPackage.getStudent().getLastName(),
            lessonPackage.getId(),
            lessonPackage.getTotalLessons() - lessonPackage.getRemainingLessons(),
            lessonPackage.getTotalLessons(),
            lessonPackage.getCreatedAt().toLocalDate()
        );
        notifyManagersAboutSystemEvent(notificationText);
    }

    // Метод для проверки и отправки уведомлений о пакетах
    public void checkAndSendPackageNotifications() {
        // Получаем все пакеты с малым количеством оставшихся уроков
        List<LessonPackage> packagesEndingSoon = lessonPackageService.findPackagesWithLowRemainingLessons(5);
        
        for (LessonPackage lessonPackage : packagesEndingSoon) {
            // Уведомляем студента
            notifyStudentAboutPackageEndingSoon(lessonPackage.getStudent().getId(), lessonPackage);
            
            // Уведомляем менеджеров
            notifyManagersAboutPackageEndingSoon(lessonPackage);
        }

        // Получаем все закончившиеся пакеты
        List<LessonPackage> expiredPackages = lessonPackageService.findExpiredPackages();
        
        for (LessonPackage lessonPackage : expiredPackages) {
            // Уведомляем студента
            notifyStudentAboutPackageExpired(lessonPackage.getStudent().getId(), lessonPackage);
            
            // Уведомляем менеджеров
            notifyManagersAboutPackageExpired(lessonPackage);
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