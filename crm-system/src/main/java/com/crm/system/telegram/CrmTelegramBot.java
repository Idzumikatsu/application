package com.crm.system.telegram;

import com.crm.system.model.TelegramMessage;
import com.crm.system.model.TelegramMessage.RecipientType;
import com.crm.system.model.TelegramMessage.MessageType;
import com.crm.system.model.TelegramMessage.DeliveryStatus;
import com.crm.system.service.TelegramNotificationService;
import com.crm.system.service.UserService;
import com.crm.system.service.StudentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.User;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDateTime;
import java.util.logging.Logger;

@Component
public class CrmTelegramBot extends TelegramLongPollingBot {

    private static final Logger logger = Logger.getLogger(CrmTelegramBot.class.getName());

    @Autowired
    private TelegramNotificationService telegramNotificationService;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    // В реальной реализации здесь будет токен бота из конфигурации
    private String botToken = "YOUR_BOT_TOKEN_HERE";
    private String botUsername = "crm_english_school_bot";

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public void onUpdateReceived(Update update) {
        try {
            // Обработка входящих сообщений
            if (update.hasMessage() && update.getMessage().hasText()) {
                handleMessage(update.getMessage());
            }
            // Обработка callback-запросов
            else if (update.hasCallbackQuery()) {
                handleCallbackQuery(update.getCallbackQuery().getData());
            }
        } catch (Exception e) {
            logger.severe("Error processing update: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void handleMessage(Message message) {
        Long chatId = message.getChatId();
        String text = message.getText();
        User telegramUser = message.getFrom();

        logger.info("Received message from chatId: " + chatId + ", text: " + text);

        // Создаем запись о входящем сообщении
        TelegramMessage telegramMessage = new TelegramMessage(chatId, null, RecipientType.STUDENT, text);
        telegramMessage.setMessageType(MessageType.TEXT);
        telegramMessage.setDeliveryStatus(DeliveryStatus.RECEIVED);
        telegramMessage.setSentAt(LocalDateTime.now());

        // Обработка команд
        if (text.startsWith("/")) {
            handleCommand(chatId, text, telegramUser);
        } else {
            // Обработка обычных сообщений
            handleTextMessage(chatId, text, telegramUser);
        }

        // Сохраняем сообщение в БД
        telegramNotificationService.saveTelegramMessage(telegramMessage);
    }

    private void handleCommand(Long chatId, String command, User telegramUser) {
        switch (command) {
            case "/start":
                sendWelcomeMessage(chatId, telegramUser);
                break;
            case "/lessons":
                sendLessonsSchedule(chatId, telegramUser);
                break;
            case "/groupllessons":
                sendGroupLessonsSchedule(chatId, telegramUser);
                break;
            case "/help":
                sendHelpMessage(chatId, telegramUser);
                break;
            case "/feedback":
                sendFeedbackRequest(chatId, telegramUser);
                break;
            default:
                sendUnknownCommandMessage(chatId, command);
                break;
        }
    }

    private void handleTextMessage(Long chatId, String text, User telegramUser) {
        // В реальной реализации здесь будет логика обработки текстовых сообщений
        sendTextMessage(chatId, "Спасибо за ваше сообщение. Я передал его менеджеру.");
    }

    private void handleCallbackQuery(String callbackData) {
        // В реальной реализации здесь будет логика обработки callback-запросов
        logger.info("Received callback query: " + callbackData);
        telegramNotificationService.handleCallbackQuery(callbackData);
    }

    private void sendWelcomeMessage(Long chatId, User telegramUser) {
        String welcomeText = "Добро пожаловать в CRM-систему онлайн-школы английского языка!
" +
                "Я буду уведомлять вас о ваших уроках, напоминать о предстоящих занятиях и информировать о важных событиях.
" +
                "Доступные команды:
" +
                "/lessons - Просмотр расписания уроков
" +
                "/help - Помощь
" +
                "/feedback - Оставить обратную связь";

        sendTextMessage(chatId, welcomeText);
    }

    private void sendLessonsSchedule(Long chatId, User telegramUser) {
        String scheduleText = "Ваше расписание уроков:

" +
                "Пока у вас нет запланированных уроков.

" +
                "Менеджер свяжется с вами для планирования.

" +
                "Для просмотра групповых уроков используйте команду /groupllessons.";

        sendTextMessage(chatId, scheduleText);
    }

    private void sendGroupLessonsSchedule(Long chatId, User telegramUser) {
        String scheduleText = "Ваше расписание групповых уроков:\n\n" +
                "Пока у вас нет запланированных групповых уроков.\n\n" +
                "Менеджер свяжется с вами для информации о доступных групповых уроках.";

        sendTextMessage(chatId, scheduleText);
    }

    private void sendHelpMessage(Long chatId, User telegramUser) {
        String helpText = "Доступные команды:

" +
                "/start - Начальное приветствие
" +
                "/lessons - Просмотр расписания уроков
" +
                "/groupllessons - Просмотр расписания групповых уроков
" +
                "/help - Помощь
" +
                "/feedback - Оставить обратную связь

" +
                "Если у вас есть вопросы, вы можете написать их в чат, и я передам менеджеру.";

        sendTextMessage(chatId, helpText);
    }

    private void sendFeedbackRequest(Long chatId, User telegramUser) {
        String feedbackText = "Пожалуйста, оставьте вашу обратную связь о прошедших уроках.

" +
                "Вы можете написать текст сообщения, и я передам его менеджеру.";

        sendTextMessage(chatId, feedbackText);
    }

    private void sendUnknownCommandMessage(Long chatId, String command) {
        String unknownText = "Неизвестная команда: " + command + "

" +
                "Доступные команды:
" +
                "/start - Начальное приветствие
" +
                "/lessons - Просмотр расписания уроков
" +
                "/groupllessons - Просмотр расписания групповых уроков
" +
                "/help - Помощь
" +
                "/feedback - Оставить обратную связь";

        sendTextMessage(chatId, unknownText);
    }

    public void sendTextMessage(Long chatId, String text) {
        SendMessage message = new SendMessage();
        message.setChatId(String.valueOf(chatId));
        message.setText(text);

        try {
            execute(message);
            logger.info("Successfully sent message to chatId: " + chatId);
        } catch (TelegramApiException e) {
            logger.severe("Failed to send message to chatId: " + chatId + ". Error: " + e.getMessage());
            telegramNotificationService.handleSendMessageFailure(chatId, e.getMessage());
        }
    }

    public void sendLessonNotification(Long chatId, String lessonInfo, MessageType messageType) {
        String notificationText = "";

        switch (messageType) {
            case LESSON_SCHEDULED:
                notificationText = "У вас новый урок запланирован:

" + lessonInfo;
                break;
            case LESSON_CANCELLED:
                notificationText = "Ваш урок отменен:

" + lessonInfo;
                break;
            case LESSON_REMINDER:
                notificationText = "Напоминание: У вас урок сегодня:

" + lessonInfo;
                break;
            case GROUP_LESSON_SCHEDULED:
                notificationText = "Ваш групповой урок запланирован:

" + lessonInfo;
                break;
            case GROUP_LESSON_CANCELLED:
                notificationText = "Ваш групповой урок отменен:

" + lessonInfo;
                break;
            case GROUP_LESSON_REMINDER:
                notificationText = "Напоминание: У вас групповой урок сегодня:

" + lessonInfo;
                break;
            default:
                notificationText = "Уведомление об уроке:

" + lessonInfo;
                break;
        }

        sendTextMessage(chatId, notificationText);
    }

    public void sendSystemNotification(Long chatId, String notificationText) {
        sendTextMessage(chatId, notificationText);
    }

    public void sendFeedbackRequest(Long chatId, String feedbackInfo) {
        String messageText = "Пожалуйста, оставьте обратную связь:

" + feedbackInfo;
        sendTextMessage(chatId, messageText);
    }

    // Методы для отправки уведомлений различным типам пользователей
    public void sendNotificationToStudent(Long chatId, Long studentId, String messageText) {
        telegramNotificationService.sendNotification(
                chatId, studentId, RecipientType.STUDENT, messageText, MessageType.TEXT);
    }

    public void sendNotificationToTeacher(Long chatId, Long teacherId, String messageText) {
        telegramNotificationService.sendNotification(
                chatId, teacherId, RecipientType.TEACHER, messageText, MessageType.TEXT);
    }

    public void sendNotificationToManager(Long chatId, Long managerId, String messageText) {
        telegramNotificationService.sendNotification(
                chatId, managerId, RecipientType.MANAGER, messageText, MessageType.TEXT);
    }

    public void sendNotificationToAdmin(Long chatId, Long adminId, String messageText) {
        telegramNotificationService.sendNotification(
                chatId, adminId, RecipientType.ADMIN, messageText, MessageType.TEXT);
    }

    // Методы для обработки ошибок
    public void handleBotError(Exception e) {
        logger.severe("Telegram bot error: " + e.getMessage());
        e.printStackTrace();
    }

    // Методы для тестирования
    public void testConnection() {
        logger.info("Testing Telegram bot connection...");
        // В реальной реализации здесь будет код для тестирования подключения к Telegram API
    }
}