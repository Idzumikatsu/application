package com.crm.system.telegram;

import com.crm.system.model.TelegramMessage;
import com.crm.system.model.TelegramMessage.RecipientType;
import com.crm.system.model.TelegramMessage.MessageType;
import com.crm.system.model.TelegramMessage.DeliveryStatus;
import com.crm.system.model.Lesson;
import com.crm.system.model.GroupLesson;
import com.crm.system.service.TelegramNotificationService;
import com.crm.system.service.UserService;
import com.crm.system.service.StudentService;
import com.crm.system.service.LessonService;
import com.crm.system.service.GroupLessonService;
import com.crm.system.service.GroupLessonRegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.User;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
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

    @Autowired
    private LessonService lessonService;

    @Autowired
    private GroupLessonService groupLessonService;

    @Autowired
    private GroupLessonRegistrationService groupLessonRegistrationService;

    @Value("${telegram.bot.token}")
    private String botToken;
    
    @Value("${telegram.bot.username:crm_english_school_bot}")
    private String botUsername;

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
        telegramMessage.setDeliveryStatus(DeliveryStatus.PENDING);
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
        // Обработка команд подтверждения присутствия
        if (command.startsWith("/confirm_attendance_")) {
            handleAttendanceConfirmationCommand(chatId, command);
        } else {
            switch (command) {
                case "/start":
                    handleStartCommand(chatId, telegramUser);
                    break;
                case "/register":
                    handleRegisterCommand(chatId, telegramUser);
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
    }

    private void handleTextMessage(Long chatId, String text, User telegramUser) {
        // Проверяем, является ли сообщение email для регистрации
        if (isValidEmail(text)) {
            handleEmailRegistration(chatId, text, telegramUser);
        } else {
            // Обработка обычных сообщений
            sendTextMessage(chatId, "Спасибо за ваше сообщение. Я передал его менеджеру.");
        }
    }
    
    private boolean isValidEmail(String text) {
        // Простая проверка email
        return text != null && text.contains("@") && text.contains(".");
    }
    
    private void handleEmailRegistration(Long chatId, String email, User telegramUser) {
        try {
            // Ищем пользователя по email
            java.util.Optional<com.crm.system.model.User> userOptional = userService.findByEmail(email);
            if (userOptional.isPresent()) {
                com.crm.system.model.User user = userOptional.get();
                // Обновляем chatId пользователя
                user.setTelegramChatId(chatId);
                userService.saveUser(user);
                
                String successText = "✅ Регистрация успешно завершена!\n\n" +
                        "Теперь вы будете получать уведомления о:\n" +
                        "• Ваших уроках\n" +
                        "• Напоминаниях о занятиях\n" +
                        "• Отменах уроков\n" +
                        "• Групповых уроках\n\n" +
                        "Используйте команду /lessons для просмотра расписания.";
                
                sendTextMessage(chatId, successText);
                
                // Отправляем уведомление менеджеру
                sendRegistrationNotificationToManager(user, telegramUser);
                
            } else {
                // Ищем студента по email
                java.util.Optional<com.crm.system.model.Student> studentOptional = studentService.findByEmail(email);
                if (studentOptional.isPresent()) {
                    com.crm.system.model.Student student = studentOptional.get();
                    // Обновляем chatId студента
                    student.setTelegramChatId(chatId);
                    studentService.saveStudent(student);
                    
                    String successText = "✅ Регистрация успешно завершена!\n\n" +
                            "Теперь вы будете получать уведомления о:\n" +
                            "• Ваших уроках\n" +
                            "• Напоминаниях о занятиях\n" +
                            "• Отменах уроков\n" +
                            "• Групповых уроках\n\n" +
                            "Используйте команду /lessons для просмотра расписания.";
                    
                    sendTextMessage(chatId, successText);
                    
                    // Отправляем уведомление менеджеру
                    sendRegistrationNotificationToManager(student, telegramUser);
                    
                } else {
                    String errorText = "❌ Пользователь с email " + email + " не найден в системе.\n\n" +
                            "Пожалуйста, проверьте правильность email или обратитесь к менеджеру.";
                    sendTextMessage(chatId, errorText);
                }
            }
        } catch (Exception e) {
            logger.severe("Error during email registration: " + e.getMessage());
            String errorText = "❌ Произошла ошибка при регистрации. Пожалуйста, попробуйте позже или обратитесь к менеджеру.";
            sendTextMessage(chatId, errorText);
        }
    }
    
    private void sendRegistrationNotificationToManager(com.crm.system.model.User user, User telegramUser) {
        String notificationText = "📋 Новый пользователь зарегистрировался в Telegram боте:\n\n" +
                "Имя: " + user.getFirstName() + " " + user.getLastName() + "\n" +
                "Email: " + user.getEmail() + "\n" +
                "Telegram: @" + (telegramUser.getUserName() != null ? telegramUser.getUserName() : "не указан") + "\n" +
                "Chat ID: " + user.getTelegramChatId();
        
        // Отправляем уведомление всем активным менеджерам
        telegramNotificationService.notifyManagersAboutRegistration(notificationText);
    }
    
    private void sendRegistrationNotificationToManager(com.crm.system.model.Student student, User telegramUser) {
        String notificationText = "📋 Новый студент зарегистрировался в Telegram боте:\n\n" +
                "Имя: " + student.getFirstName() + " " + student.getLastName() + "\n" +
                "Email: " + student.getEmail() + "\n" +
                "Telegram: @" + (telegramUser.getUserName() != null ? telegramUser.getUserName() : "не указан") + "\n" +
                "Chat ID: " + student.getTelegramChatId();
        
        // Отправляем уведомление всем активным менеджерам
        telegramNotificationService.notifyManagersAboutRegistration(notificationText);
    }

    private void handleCallbackQuery(String callbackData) {
        logger.info("Received callback query: " + callbackData);
        
        // Обработка callback-запросов для подтверждения присутствия
        if (callbackData.startsWith("confirm_attendance_")) {
            handleAttendanceConfirmation(callbackData);
        } else {
            // Другие типы callback-запросов
            telegramNotificationService.handleCallbackQuery(callbackData);
        }
    }
    
    private void handleAttendanceConfirmation(String callbackData) {
        try {
            // Извлекаем ID урока из callback данных
            String[] parts = callbackData.split("_");
            if (parts.length >= 3) {
                Long lessonId = Long.parseLong(parts[2]);
                Long chatId = Long.parseLong(parts[3]);
                
                // Обновляем статус присутствия
                boolean confirmed = lessonService.confirmAttendance(lessonId);
                
                if (confirmed) {
                    sendTextMessage(chatId, "✅ Ваше присутствие на уроке подтверждено!");
                    
                    // Отправляем уведомление менеджеру
                    java.util.Optional<com.crm.system.model.Lesson> lessonOptional = lessonService.findById(lessonId);
                    if (lessonOptional.isPresent()) {
                        com.crm.system.model.Lesson lesson = lessonOptional.get();
                        String notificationText = "✅ Студент подтвердил присутствие на уроке:\n\n" +
                                               "📚 Урок: " + lesson.getSubject() + "\n" +
                                               "👨‍🎓 Студент: " + lesson.getStudent().getFirstName() + " " + lesson.getStudent().getLastName() + "\n" +
                                               "⏰ Время: " + lesson.getScheduledTime() + "\n" +
                                               "📍 Платформа: " + lesson.getPlatform();
                        
                        telegramNotificationService.notifyManagersAboutAttendanceConfirmation(notificationText);
                    }
                } else {
                    sendTextMessage(chatId, "❌ Не удалось подтвердить присутствие. Обратитесь к менеджеру.");
                }
            }
        } catch (Exception e) {
            logger.severe("Error handling attendance confirmation: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void handleStartCommand(Long chatId, User telegramUser) {
        String welcomeText = "Добро пожаловать в CRM-систему онлайн-школы английского языка! 👋\n\n" +
                "Я буду уведомлять вас о ваших уроках, напоминать о предстоящих занятиях и информировать о важных событиях.\n\n" +
                "Для получения уведомлений необходимо зарегистрироваться в системе.\n\n" +
                "Доступные команды:\n" +
                "/register - Регистрация в системе\n" +
                "/lessons - Просмотр расписания уроков\n" +
                "/groupllessons - Просмотр групповых уроков\n" +
                "/help - Помощь\n" +
                "/feedback - Оставить обратную связь";

        sendTextMessage(chatId, welcomeText);
        
        // Проверяем, зарегистрирован ли пользователь
        checkUserRegistration(chatId, telegramUser);
    }
    
    private void handleRegisterCommand(Long chatId, User telegramUser) {
        String registrationText = "Регистрация в системе уведомлений 📋\n\n" +
                "Для регистрации введите ваш email, который вы указали при регистрации в школе.\n\n" +
                "Формат: email@example.com\n\n" +
                "После регистрации вы будете получать уведомления о ваших уроках и важных событиях.";

        sendTextMessage(chatId, registrationText);
    }
    
    private void checkUserRegistration(Long chatId, User telegramUser) {
        // Проверяем, есть ли пользователь с таким chatId в системе
        boolean isUserRegistered = userService.isUserRegisteredWithTelegram(chatId);
        boolean isStudentRegistered = studentService.isStudentRegisteredWithTelegram(chatId);
        
        if (!isUserRegistered && !isStudentRegistered) {
            String registrationPrompt = "⚠️ Вы еще не зарегистрированы в системе уведомлений.\n\n" +
                    "Для регистрации используйте команду /register и введите ваш email.";
            sendTextMessage(chatId, registrationPrompt);
        } else {
            String welcomeBackText = "✅ Вы уже зарегистрированы в системе!\n\n" +
                    "Теперь вы будете получать все уведомления о ваших уроках и важных событиях.";
            sendTextMessage(chatId, welcomeBackText);
        }
    }

    private void sendLessonsSchedule(Long chatId, User telegramUser) {
        String scheduleText = "Ваше расписание уроков:\n\n" +
                "Пока у вас нет запланированных уроков.\n\n" +
                "Менеджер свяжется с вами для планирования.\n\n" +
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
        String helpText = "Доступные команды:\n\n" +
                "/start - Начальное приветствие\n" +
                "/register - Регистрация в системе уведомлений\n" +
                "/lessons - Просмотр расписания уроков\n" +
                "/groupllessons - Просмотр расписания групповых уроков\n" +
                "/help - Помощь\n" +
                "/feedback - Оставить обратную связь\n\n" +
                "Если у вас есть вопросы, вы можете написать их в чат, и я передам менеджеру.";

        sendTextMessage(chatId, helpText);
    }

    private void sendFeedbackRequest(Long chatId, User telegramUser) {
        String feedbackText = "Пожалуйста, оставьте вашу обратную связь о прошедших уроках.\n\n" +
                "Вы можете написать текст сообщения, и я передам его менеджеру.";

        sendTextMessage(chatId, feedbackText);
    }

    private void sendUnknownCommandMessage(Long chatId, String command) {
        String unknownText = "Неизвестная команда: " + command + "\n\n" +
                "Доступные команды:\n" +
                "/start - Начальное приветствие\n" +
                "/register - Регистрация в системе уведомлений\n" +
                "/lessons - Просмотр расписания уроков\n" +
                "/groupllessons - Просмотр расписания групповых уроков\n" +
                "/help - Помощь\n" +
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
            case LESSON_REMINDER:
                notificationText = "Напоминание: У вас урок сегодня:\n\n" + lessonInfo;
                break;
            case LESSON_CANCELLED:
                notificationText = "Ваш урок отменен:\n\n" + lessonInfo;
                break;
            case LESSON_CONFIRMATION:
                notificationText = "Подтверждение урока:\n\n" + lessonInfo;
                break;
            case GROUP_LESSON_REMINDER:
                notificationText = "Напоминание: У вас групповой урок сегодня:\n\n" + lessonInfo;
                break;
            case GROUP_LESSON_CANCELLED:
                notificationText = "Ваш групповой урок отменен:\n\n" + lessonInfo;
                break;
            case SYSTEM_NOTIFICATION:
                notificationText = "Системное уведомление:\n\n" + lessonInfo;
                break;
            case FEEDBACK_REQUEST:
                notificationText = "Запрос на обратную связь:\n\n" + lessonInfo;
                break;
            default:
                notificationText = "Уведомление:\n\n" + lessonInfo;
                break;
        }

        sendTextMessage(chatId, notificationText);
    }

    public void sendSystemNotification(Long chatId, String notificationText) {
        sendTextMessage(chatId, notificationText);
    }

    public void sendFeedbackRequest(Long chatId, String feedbackInfo) {
        String messageText = "Пожалуйста, оставьте обратную связь:\n\n" + feedbackInfo;
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
    
        // Методы для работы с напоминаниями о уроках
        public void sendLessonReminders() {
            try {
                LocalDate today = LocalDate.now();
                LocalDate tomorrow = today.plusDays(1);
                
                // Отправляем напоминания об индивидуальных уроках
                sendIndividualLessonReminders(today, tomorrow);
                
                // Отправляем напоминания о групповых уроках
                sendGroupLessonReminders(today, tomorrow);
                
            } catch (Exception e) {
                logger.severe("Error sending lesson reminders: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        private void sendIndividualLessonReminders(LocalDate today, LocalDate tomorrow) {
            try {
                // Получаем уроки на сегодня и завтра
                List<com.crm.system.model.Lesson> todayLessons = lessonService.findByDateRange(today, today);
                List<com.crm.system.model.Lesson> tomorrowLessons = lessonService.findByDateRange(tomorrow, tomorrow);
                
                // Отправляем напоминания о сегодняшних уроках
                for (com.crm.system.model.Lesson lesson : todayLessons) {
                    if (lesson.isScheduled() && lesson.getStudent() != null && lesson.getStudent().getTelegramChatId() != null) {
                        String reminderText = formatIndividualLessonReminder(lesson, "сегодня");
                        sendTextMessage(lesson.getStudent().getTelegramChatId(), reminderText);
                    }
                }
                
                // Отправляем напоминания о завтрашних уроках
                for (com.crm.system.model.Lesson lesson : tomorrowLessons) {
                    if (lesson.isScheduled() && lesson.getStudent() != null && lesson.getStudent().getTelegramChatId() != null) {
                        String reminderText = formatIndividualLessonReminder(lesson, "завтра");
                        sendTextMessage(lesson.getStudent().getTelegramChatId(), reminderText);
                    }
                }
                
            } catch (Exception e) {
                logger.severe("Error sending individual lesson reminders: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        private void sendGroupLessonReminders(LocalDate today, LocalDate tomorrow) {
            try {
                // Получаем групповые уроки на сегодня и завтра
                List<com.crm.system.model.GroupLesson> todayGroupLessons = groupLessonService.findByDateRangeAndStatuses(
                    today, today, List.of(com.crm.system.model.GroupLesson.GroupLessonStatus.SCHEDULED,
                                        com.crm.system.model.GroupLesson.GroupLessonStatus.CONFIRMED));
                
                List<com.crm.system.model.GroupLesson> tomorrowGroupLessons = groupLessonService.findByDateRangeAndStatuses(
                    tomorrow, tomorrow, List.of(com.crm.system.model.GroupLesson.GroupLessonStatus.SCHEDULED,
                                               com.crm.system.model.GroupLesson.GroupLessonStatus.CONFIRMED));
                
                // Отправляем напоминания о сегодняшних групповых уроках
                for (com.crm.system.model.GroupLesson groupLesson : todayGroupLessons) {
                    sendGroupLessonReminderToParticipants(groupLesson, "сегодня");
                }
                
                // Отправляем напоминания о завтрашних групповых уроках
                for (com.crm.system.model.GroupLesson groupLesson : tomorrowGroupLessons) {
                    sendGroupLessonReminderToParticipants(groupLesson, "завтра");
                }
                
            } catch (Exception e) {
                logger.severe("Error sending group lesson reminders: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        private void sendGroupLessonReminderToParticipants(com.crm.system.model.GroupLesson groupLesson, String day) {
            try {
                // Получаем всех участников группового урока
                List<com.crm.system.model.GroupLessonRegistration> registrations = groupLessonRegistrationService.findByGroupLessonId(groupLesson.getId());
                List<com.crm.system.model.Student> participants = registrations.stream()
                        .map(com.crm.system.model.GroupLessonRegistration::getStudent)
                        .collect(java.util.stream.Collectors.toList());
                
                for (com.crm.system.model.Student student : participants) {
                    if (student.getTelegramChatId() != null) {
                        String reminderText = formatGroupLessonReminder(groupLesson, student, day);
                        sendTextMessage(student.getTelegramChatId(), reminderText);
                    }
                }
                
            } catch (Exception e) {
                logger.severe("Error sending group lesson reminder to participants: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        private String formatIndividualLessonReminder(com.crm.system.model.Lesson lesson, String day) {
            return "🔔 Напоминание об уроке " + day + ":\n\n" +
                   "📚 Урок: " + lesson.getSubject() + "\n" +
                   "👨‍🏫 Преподаватель: " + lesson.getTeacher().getFirstName() + " " + lesson.getTeacher().getLastName() + "\n" +
                   "⏰ Время: " + lesson.getScheduledTime() + "\n" +
                   "📍 Платформа: " + lesson.getPlatform() + "\n\n" +
                   "Не забудьте подготовиться к уроку!";
        }
        
        private String formatGroupLessonReminder(com.crm.system.model.GroupLesson groupLesson, com.crm.system.model.Student student, String day) {
            return "🔔 Напоминание о групповом уроке " + day + ":\n\n" +
                   "📚 Тема: " + groupLesson.getLessonTopic() + "\n" +
                   "👨‍🏫 Преподаватель: " + groupLesson.getTeacher().getFirstName() + " " + groupLesson.getTeacher().getLastName() + "\n" +
                   "⏰ Время: " + groupLesson.getScheduledTime() + "\n" +
                   "📍 Платформа: " + groupLesson.getPlatform() + "\n" +
                   "👥 Участников: " + groupLesson.getCurrentParticipants() + "/" + groupLesson.getMaxParticipants() + "\n\n" +
                   "Не забудьте подготовиться к уроку!";
        }
        
        // Метод для отправки напоминаний о предстоящих уроках (вызывается из планировщика)
        public void scheduleLessonReminders() {
            logger.info("Starting scheduled lesson reminders...");
            sendLessonReminders();
            logger.info("Scheduled lesson reminders completed.");
        }
        
        // Метод для отправки запросов на подтверждение присутствия после уроков
        public void sendAttendanceConfirmationRequests() {
            try {
                LocalDate today = LocalDate.now();
                LocalDateTime now = LocalDateTime.now();
                
                // Получаем завершенные уроки за сегодня
                List<Lesson> completedLessons = lessonService.findCompletedLessonsForAttendanceConfirmation(today, now);
                
                for (Lesson lesson : completedLessons) {
                    if (lesson.getStudent() != null && lesson.getStudent().getTelegramChatId() != null) {
                        sendAttendanceConfirmationRequest(lesson);
                    }
                }
                
            } catch (Exception e) {
                logger.severe("Error sending attendance confirmation requests: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        private void sendAttendanceConfirmationRequest(Lesson lesson) {
            try {
                Long chatId = lesson.getStudent().getTelegramChatId();
                String messageText = "📋 Подтверждение присутствия на уроке\n\n" +
                                  "📚 Урок: " + lesson.getSubject() + "\n" +
                                  "👨‍🏫 Преподаватель: " + lesson.getTeacher().getFirstName() + " " + lesson.getTeacher().getLastName() + "\n" +
                                  "⏰ Время: " + lesson.getScheduledTime() + "\n\n" +
                                  "Пожалуйста, подтвердите ваше присутствие на уроке:";
                
                // В реальной реализации здесь будет создание inline-кнопок для подтверждения
                // Для демонстрации отправляем текстовое сообщение
                sendTextMessage(chatId, messageText);
                
                // Отправляем дополнительное сообщение с инструкциями
                String instructions = "Для подтверждения присутствия используйте команду:\n" +
                                   "/confirm_attendance_" + lesson.getId();
                
                sendTextMessage(chatId, instructions);
                
            } catch (Exception e) {
                logger.severe("Error sending attendance confirmation request: " + e.getMessage());
                e.printStackTrace();
            }
        }
        
        // Метод для обработки текстовых команд подтверждения присутствия
        private void handleAttendanceConfirmationCommand(Long chatId, String command) {
            try {
                if (command.startsWith("/confirm_attendance_")) {
                    String[] parts = command.split("_");
                    if (parts.length >= 3) {
                        Long lessonId = Long.parseLong(parts[2]);
                        
                        // Обновляем статус присутствия
                        boolean confirmed = lessonService.confirmAttendance(lessonId);
                        
                        if (confirmed) {
                            sendTextMessage(chatId, "✅ Ваше присутствие на уроке подтверждено!");
                            
                            // Отправляем уведомление менеджеру
                            java.util.Optional<Lesson> lessonOptional = lessonService.findById(lessonId);
                            if (lessonOptional.isPresent()) {
                                Lesson lesson = lessonOptional.get();
                                String notificationText = "✅ Студент подтвердил присутствие на уроке:\n\n" +
                                                       "📚 Урок: " + lesson.getSubject() + "\n" +
                                                       "👨‍🎓 Студент: " + lesson.getStudent().getFirstName() + " " + lesson.getStudent().getLastName() + "\n" +
                                                       "⏰ Время: " + lesson.getScheduledTime() + "\n" +
                                                       "📍 Платформа: " + lesson.getPlatform();
                                
                                telegramNotificationService.notifyManagersAboutAttendanceConfirmation(notificationText);
                            }
                        } else {
                            sendTextMessage(chatId, "❌ Не удалось подтвердить присутствие. Обратитесь к менеджеру.");
                        }
                    }
                }
            } catch (Exception e) {
                logger.severe("Error handling attendance confirmation command: " + e.getMessage());
                e.printStackTrace();
                sendTextMessage(chatId, "❌ Произошла ошибка при обработке подтверждения. Обратитесь к менеджеру.");
            }
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