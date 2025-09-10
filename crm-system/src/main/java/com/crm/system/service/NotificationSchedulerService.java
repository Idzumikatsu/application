package com.crm.system.service;

import com.crm.system.model.Notification;
import com.crm.system.model.TelegramMessage;
import com.crm.system.model.User;
import com.crm.system.model.Student;
import com.crm.system.model.GroupLesson;
import com.crm.system.model.GroupLessonRegistration;
import com.crm.system.model.LessonPackage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.logging.Logger;

@Service
public class NotificationSchedulerService {

    private static final Logger logger = Logger.getLogger(NotificationSchedulerService.class.getName());

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TelegramBotService telegramBotService;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private GroupLessonService groupLessonService;

    @Autowired
    private GroupLessonRegistrationService groupLessonRegistrationService;

    @Autowired
    private TelegramNotificationService telegramNotificationService;

    @Autowired
    private LessonPackageService lessonPackageService;

    @Autowired
    private TelegramMessageService telegramMessageService;

    /**
     * Планировщик для отправки уведомлений о предстоящих индивидуальных уроках
     */
    @Scheduled(fixedRate = 300000) // Выполнять каждые 5 минут
    public void sendIndividualLessonReminders() {
        logger.info("Starting individual lesson reminders scheduler");
        
        try {
            // Получаем уроки, которые начнутся через 24 часа
            LocalDateTime startTime = LocalDateTime.now().plusHours(23);
            LocalDateTime endTime = LocalDateTime.now().plusHours(25);
            
            // TODO: Реализовать поиск уроков в этом временном диапазоне
            // Когда будет реализована сущность Lesson
            
        } catch (Exception e) {
            logger.severe("Error in sendIndividualLessonReminders: " + e.getMessage());
        }
    }

    /**
     * Планировщик для отправки уведомлений о предстоящих групповых уроках
     */
    @Scheduled(fixedRate = 300000) // Выполнять каждые 5 минут
    public void sendGroupLessonReminders() {
        logger.info("Starting group lesson reminders scheduler");
        
        try {
            LocalDateTime oneDayBefore = LocalDateTime.now().plusHours(23);
            LocalDateTime oneDayAfter = LocalDateTime.now().plusHours(25);
            
            // Ищем групповые уроки, запланированные на завтра
            List<GroupLesson> upcomingLessons = groupLessonService.findByDateRangeAndStatuses(
                    oneDayBefore.toLocalDate(),
                    oneDayAfter.toLocalDate(),
                    java.util.Collections.singletonList(GroupLesson.GroupLessonStatus.CONFIRMED)
            );

            for (GroupLesson lesson : upcomingLessons) {
                sendGroupLessonReminder(lesson);
            }
            
        } catch (Exception e) {
            logger.severe("Error in sendGroupLessonReminders: " + e.getMessage());
        }
    }

    /**
     * Отправка напоминаний о групповом уроке всем зарегистрированным студентам
     */
    private void sendGroupLessonReminder(GroupLesson lesson) {
        try {
            // Получаем всех зарегистрированных студентов
            List<GroupLessonRegistration> registrations = groupLessonRegistrationService
                    .findByGroupLessonId(lesson.getId());

            StringBuilder lessonInfo = new StringBuilder();
            lessonInfo.append("Групповой урок: ").append(lesson.getLessonTopic()).append("\n");
            lessonInfo.append("Дата: ").append(lesson.getScheduledDate()).append("\n");
            lessonInfo.append("Время: ").append(lesson.getScheduledTime()).append("\n");
            lessonInfo.append("Преподаватель: ")
                    .append(lesson.getTeacher().getFirstName())
                    .append(" ")
                    .append(lesson.getTeacher().getLastName())
                    .append("\n");
            
            if (lesson.getMeetingLink() != null && !lesson.getMeetingLink().isEmpty()) {
                lessonInfo.append("Ссылка на урок: ").append(lesson.getMeetingLink()).append("\n");
            }

            for (GroupLessonRegistration registration : registrations) {
                Student student = registration.getStudent();
                
                // Отправляем уведомление в системе
                Notification notification = new Notification();
                notification.setRecipientId(student.getId());
                notification.setRecipientType(Notification.RecipientType.STUDENT);
                notification.setNotificationType(Notification.NotificationType.GROUP_LESSON_REMINDER);
                notification.setTitle("Напоминание о групповом уроке");
                notification.setMessage(lessonInfo.toString());
                notification.setRelatedEntityId(lesson.getId());
                notification.setRelatedEntityType("GroupLesson");
                notification.setPriority(1);
                
                notificationService.saveNotification(notification);
                
                // Отправляем уведомление в Telegram, если есть chatId
                if (student.getTelegramChatId() != null) {
                    telegramNotificationService.sendGroupLessonReminderNotification(
                            student.getTelegramChatId(),
                            student.getId(),
                            TelegramMessage.RecipientType.STUDENT,
                            lessonInfo.toString()
                    );
                }
            }
            
        } catch (Exception e) {
            logger.severe("Error in sendGroupLessonReminder for lesson " + lesson.getId() + ": " + e.getMessage());
        }
    }

    /**
     * Планировщик для отправки уведомлений об отмене уроков
     */
    @Scheduled(fixedRate = 300000) // Выполнять каждые 5 минут
    public void sendLessonCancellationNotices() {
        logger.info("Starting lesson cancellation notices scheduler");
        
        try {
            LocalDateTime oneHourBefore = LocalDateTime.now().plusMinutes(59);
            LocalDateTime oneHourAfter = LocalDateTime.now().plusMinutes(61);
            
            // TODO: Реализовать поиск отмененных уроков, которые должны быть уведомлены
            
        } catch (Exception e) {
            logger.severe("Error in sendLessonCancellationNotices: " + e.getMessage());
        }
    }

    /**
     * Планировщик для отправки уведомлений о завершении уроков и запросах на обратную связь
     */
    @Scheduled(fixedRate = 3600000) // Выполнять каждый час
    public void sendFeedbackRequests() {
        logger.info("Starting feedback requests scheduler");
        
        try {
            LocalDateTime oneDayAfterCompletion = LocalDateTime.now().minusDays(1);
            
            // TODO: Реализовать поиск завершенных уроков, для которых нужно запросить обратную связь
            
        } catch (Exception e) {
            logger.severe("Error in sendFeedbackRequests: " + e.getMessage());
        }
    }

    /**
     * Планировщик для повторной отправки неудачных уведомлений
     */
    @Scheduled(fixedRate = 600000) // Выполнять каждые 10 минут
    public void retryFailedNotifications() {
        logger.info("Starting failed notifications retry scheduler");
        
        try {
            List<TelegramMessage> failedMessages = telegramMessageService.findFailedMessagesWithRetriesBelow(3);
            
            for (TelegramMessage message : failedMessages) {
                // Увеличиваем счетчик попыток
                telegramMessageService.incrementRetryCount(message);
                
                // Повторная отправка
                telegramNotificationService.sendNotification(
                        message.getChatId(),
                        message.getRecipientId(),
                        message.getRecipientType(),
                        message.getMessageText(),
                        message.getMessageType()
                );
            }
            
        } catch (Exception e) {
            logger.severe("Error in retryFailedNotifications: " + e.getMessage());
        }
    }

    /**
     * Планировщик для очистки старых уведомлений
     */
    @Scheduled(cron = "0 0 2 * * ?") // Выполнять ежедневно в 02:00
    public void cleanupOldNotifications() {
        logger.info("Starting old notifications cleanup scheduler");
        
        try {
            LocalDateTime cutoffDate = LocalDateTime.now().minusMonths(6);
            
            // TODO: Реализовать очистку уведомлений старше 6 месяцев
            
        } catch (Exception e) {
            logger.severe("Error in cleanupOldNotifications: " + e.getMessage());
        }
    }

    /**
     * Планировщик для отправки уведомлений о заканчивающихся пакетах уроков
     */
    @Scheduled(cron = "0 0 9 * * ?") // Выполнять ежедневно в 09:00
    public void sendPackageEndingSoonNotices() {
        logger.info("Starting package ending soon notices scheduler");
        
        try {
            // Используем метод из TelegramNotificationService для проверки и отправки уведомлений
            telegramNotificationService.checkAndSendPackageNotifications();
            logger.info("Package notifications sent successfully");
            
        } catch (Exception e) {
            logger.severe("Error in sendPackageEndingSoonNotices: " + e.getMessage());
        }
    }

    /**
     * Отправка уведомления об отмене группового урока
     */
    public void sendGroupLessonCancellationNotice(GroupLesson lesson, String reason) {
        try {
            // Получаем всех зарегистрированных студентов
            List<GroupLessonRegistration> registrations = groupLessonRegistrationService
                    .findByGroupLessonId(lesson.getId());

            StringBuilder cancellationInfo = new StringBuilder();
            cancellationInfo.append("Уведомление об отмене группового урока\n\n");
            cancellationInfo.append("Групповой урок: ").append(lesson.getLessonTopic()).append("\n");
            cancellationInfo.append("Дата: ").append(lesson.getScheduledDate()).append("\n");
            cancellationInfo.append("Время: ").append(lesson.getScheduledTime()).append("\n");
            cancellationInfo.append("Причина отмены: ").append(reason).append("\n");

            for (GroupLessonRegistration registration : registrations) {
                Student student = registration.getStudent();
                
                // Отправляем уведомление в системе
                Notification notification = new Notification();
                notification.setRecipientId(student.getId());
                notification.setRecipientType(Notification.RecipientType.STUDENT);
                notification.setNotificationType(Notification.NotificationType.GROUP_LESSON_CANCELLED);
                notification.setTitle("Отмена группового урока");
                notification.setMessage(cancellationInfo.toString());
                notification.setRelatedEntityId(lesson.getId());
                notification.setRelatedEntityType("GroupLesson");
                notification.setPriority(2); // Высокий приоритет
                
                notificationService.saveNotification(notification);
                
                // Отправляем уведомление в Telegram, если есть chatId
                if (student.getTelegramChatId() != null) {
                    telegramNotificationService.sendGroupLessonCancelledNotification(
                            student.getTelegramChatId(),
                            student.getId(),
                            TelegramMessage.RecipientType.STUDENT,
                            cancellationInfo.toString(),
                            reason
                    );
                }
            }
            
        } catch (Exception e) {
            logger.severe("Error in sendGroupLessonCancellationNotice for lesson " + lesson.getId() + ": " + e.getMessage());
        }
    }

    /**
     * Отправка запроса на обратную связь после завершения группового урока
     */
    public void sendFeedbackRequest(GroupLesson lesson) {
        try {
            // Получаем преподавателя
            User teacher = lesson.getTeacher();
            
            StringBuilder feedbackInfo = new StringBuilder();
            feedbackInfo.append("Запрос на обратную связь\n\n");
            feedbackInfo.append("Групповой урок: ").append(lesson.getLessonTopic()).append("\n");
            feedbackInfo.append("Дата: ").append(lesson.getScheduledDate()).append("\n");
            feedbackInfo.append("Время: ").append(lesson.getScheduledTime()).append("\n");
            feedbackInfo.append("Пожалуйста, оставьте обратную связь по проведенному уроку.");

            // Отправляем уведомление преподавателю в системе
            Notification notification = new Notification();
            notification.setRecipientId(teacher.getId());
            notification.setRecipientType(Notification.RecipientType.TEACHER);
            notification.setNotificationType(Notification.NotificationType.FEEDBACK_REQUEST);
            notification.setTitle("Запрос на обратную связь");
            notification.setMessage(feedbackInfo.toString());
            notification.setRelatedEntityId(lesson.getId());
            notification.setRelatedEntityType("GroupLesson");
            notification.setPriority(1);
            
            notificationService.saveNotification(notification);
            
            // Отправляем уведомление в Telegram, если есть chatId
            if (teacher.getTelegramChatId() != null) {
                telegramNotificationService.sendFeedbackRequestNotification(
                        teacher.getTelegramChatId(),
                        teacher.getId(),
                        TelegramMessage.RecipientType.TEACHER,
                        feedbackInfo.toString()
                );
            }
            
        } catch (Exception e) {
            logger.severe("Error in sendFeedbackRequest for lesson " + lesson.getId() + ": " + e.getMessage());
        }
    }
}