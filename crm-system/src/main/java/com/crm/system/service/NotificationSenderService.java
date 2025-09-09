package com.crm.system.service;

import com.crm.system.model.Notification;
import com.crm.system.model.TelegramMessage;
import com.crm.system.model.User;
import com.crm.system.model.Student;
import com.crm.system.model.GroupLesson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.logging.Logger;

@Service
public class NotificationSenderService {

    private static final Logger logger = Logger.getLogger(NotificationSenderService.class.getName());

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TelegramBotService telegramBotService;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    /**
     * Отправка уведомления студенту
     */
    public void sendNotificationToStudent(Student student, String title, String message, 
                                         Notification.NotificationType notificationType) {
        try {
            // Создаем уведомление в системе
            Notification notification = new Notification();
            notification.setRecipientId(student.getId());
            notification.setRecipientType(Notification.RecipientType.STUDENT);
            notification.setNotificationType(notificationType);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setPriority(1);
            
            Notification savedNotification = notificationService.saveNotification(notification);
            
            // Отправляем уведомление в Telegram, если есть chatId
            if (student.getTelegramChatId() != null) {
                telegramBotService.sendMessage(
                        student.getTelegramChatId(),
                        student.getId(),
                        TelegramMessage.RecipientType.STUDENT,
                        message,
                        TelegramMessage.MessageType.SYSTEM_NOTIFICATION
                );
            }
            
            logger.info("Sent notification to student " + student.getId() + ": " + title);
            
        } catch (Exception e) {
            logger.severe("Error sending notification to student " + student.getId() + ": " + e.getMessage());
        }
    }

    /**
     * Отправка уведомления преподавателю
     */
    public void sendNotificationToTeacher(User teacher, String title, String message, 
                                         Notification.NotificationType notificationType) {
        try {
            // Создаем уведомление в системе
            Notification notification = new Notification();
            notification.setRecipientId(teacher.getId());
            notification.setRecipientType(Notification.RecipientType.TEACHER);
            notification.setNotificationType(notificationType);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setPriority(1);
            
            Notification savedNotification = notificationService.saveNotification(notification);
            
            // Отправляем уведомление в Telegram, если есть chatId
            if (teacher.getTelegramChatId() != null) {
                telegramBotService.sendMessage(
                        teacher.getTelegramChatId(),
                        teacher.getId(),
                        TelegramMessage.RecipientType.TEACHER,
                        message,
                        TelegramMessage.MessageType.SYSTEM_NOTIFICATION
                );
            }
            
            logger.info("Sent notification to teacher " + teacher.getId() + ": " + title);
            
        } catch (Exception e) {
            logger.severe("Error sending notification to teacher " + teacher.getId() + ": " + e.getMessage());
        }
    }

    /**
     * Отправка уведомления менеджеру
     */
    public void sendNotificationToManager(User manager, String title, String message, 
                                         Notification.NotificationType notificationType) {
        try {
            // Создаем уведомление в системе
            Notification notification = new Notification();
            notification.setRecipientId(manager.getId());
            notification.setRecipientType(Notification.RecipientType.MANAGER);
            notification.setNotificationType(notificationType);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setPriority(1);
            
            Notification savedNotification = notificationService.saveNotification(notification);
            
            // Отправляем уведомление в Telegram, если есть chatId
            if (manager.getTelegramChatId() != null) {
                telegramBotService.sendMessage(
                        manager.getTelegramChatId(),
                        manager.getId(),
                        TelegramMessage.RecipientType.MANAGER,
                        message,
                        TelegramMessage.MessageType.SYSTEM_NOTIFICATION
                );
            }
            
            logger.info("Sent notification to manager " + manager.getId() + ": " + title);
            
        } catch (Exception e) {
            logger.severe("Error sending notification to manager " + manager.getId() + ": " + e.getMessage());
        }
    }

    /**
     * Отправка уведомления администратору
     */
    public void sendNotificationToAdmin(User admin, String title, String message, 
                                      Notification.NotificationType notificationType) {
        try {
            // Создаем уведомление в системе
            Notification notification = new Notification();
            notification.setRecipientId(admin.getId());
            notification.setRecipientType(Notification.RecipientType.ADMIN);
            notification.setNotificationType(notificationType);
            notification.setTitle(title);
            notification.setMessage(message);
            notification.setPriority(1);
            
            Notification savedNotification = notificationService.saveNotification(notification);
            
            // Отправляем уведомление в Telegram, если есть chatId
            if (admin.getTelegramChatId() != null) {
                telegramBotService.sendMessage(
                        admin.getTelegramChatId(),
                        admin.getId(),
                        TelegramMessage.RecipientType.ADMIN,
                        message,
                        TelegramMessage.MessageType.SYSTEM_NOTIFICATION
                );
            }
            
            logger.info("Sent notification to admin " + admin.getId() + ": " + title);
            
        } catch (Exception e) {
            logger.severe("Error sending notification to admin " + admin.getId() + ": " + e.getMessage());
        }
    }

    /**
     * Отправка уведомления о регистрации в групповом уроке
     */
    public void sendGroupLessonRegistrationNotification(GroupLesson lesson, Student student) {
        try {
            StringBuilder message = new StringBuilder();
            message.append("Вы успешно зарегистрировались на групповой урок!\n\n");
            message.append("Групповой урок: ").append(lesson.getLessonTopic()).append("\n");
            message.append("Дата: ").append(lesson.getScheduledDate()).append("\n");
            message.append("Время: ").append(lesson.getScheduledTime()).append("\n");
            message.append("Преподаватель: ")
                    .append(lesson.getTeacher().getFirstName())
                    .append(" ")
                    .append(lesson.getTeacher().getLastName())
                    .append("\n");
            
            if (lesson.getMeetingLink() != null && !lesson.getMeetingLink().isEmpty()) {
                message.append("Ссылка на урок: ").append(lesson.getMeetingLink()).append("\n");
            }
            
            message.append("\nЗа день до урока вы получите напоминание.");

            sendNotificationToStudent(
                    student,
                    "Регистрация на групповой урок",
                    message.toString(),
                    Notification.NotificationType.GROUP_LESSON_SCHEDULED
            );
            
        } catch (Exception e) {
            logger.severe("Error sending group lesson registration notification: " + e.getMessage());
        }
    }

    /**
     * Отправка уведомления об отмене регистрации в групповом уроке
     */
    public void sendGroupLessonUnregistrationNotification(GroupLesson lesson, Student student, String reason) {
        try {
            StringBuilder message = new StringBuilder();
            message.append("Ваша регистрация на групповой урок была отменена.\n\n");
            message.append("Групповой урок: ").append(lesson.getLessonTopic()).append("\n");
            message.append("Дата: ").append(lesson.getScheduledDate()).append("\n");
            message.append("Время: ").append(lesson.getScheduledTime()).append("\n");
            message.append("Причина отмены: ").append(reason).append("\n");

            sendNotificationToStudent(
                    student,
                    "Отмена регистрации на групповой урок",
                    message.toString(),
                    Notification.NotificationType.GROUP_LESSON_CANCELLED
            );
            
        } catch (Exception e) {
            logger.severe("Error sending group lesson unregistration notification: " + e.getMessage());
        }
    }

    /**
     * Отправка уведомления преподавателю о новой регистрации в его групповом уроке
     */
    public void sendNewRegistrationNotificationToTeacher(GroupLesson lesson, Student student) {
        try {
            StringBuilder message = new StringBuilder();
            message.append("Новая регистрация на ваш групповой урок!\n\n");
            message.append("Групповой урок: ").append(lesson.getLessonTopic()).append("\n");
            message.append("Студент: ")
                    .append(student.getFirstName())
                    .append(" ")
                    .append(student.getLastName())
                    .append("\n");
            message.append("Всего зарегистрированных: ").append(lesson.getCurrentStudents()).append("/")
                    .append(lesson.getMaxStudents() != null ? lesson.getMaxStudents() : "∞").append("\n");

            sendNotificationToTeacher(
                    lesson.getTeacher(),
                    "Новая регистрация на групповой урок",
                    message.toString(),
                    Notification.NotificationType.GROUP_LESSON_SCHEDULED
            );
            
        } catch (Exception e) {
            logger.severe("Error sending new registration notification to teacher: " + e.getMessage());
        }
    }

    /**
     * Отправка уведомления преподавателю об отмене регистрации студента в его групповом уроке
     */
    public void sendUnregistrationNotificationToTeacher(GroupLesson lesson, Student student, String reason) {
        try {
            StringBuilder message = new StringBuilder();
            message.append("Студент отменил регистрацию на ваш групповой урок.\n\n");
            message.append("Групповой урок: ").append(lesson.getLessonTopic()).append("\n");
            message.append("Студент: ")
                    .append(student.getFirstName())
                    .append(" ")
                    .append(student.getLastName())
                    .append("\n");
            message.append("Причина отмены: ").append(reason).append("\n");
            message.append("Всего зарегистрированных: ").append(lesson.getCurrentStudents()).append("/")
                    .append(lesson.getMaxStudents() != null ? lesson.getMaxStudents() : "∞").append("\n");

            sendNotificationToTeacher(
                    lesson.getTeacher(),
                    "Отмена регистрации на групповой урок",
                    message.toString(),
                    Notification.NotificationType.GROUP_LESSON_CANCELLED
            );
            
        } catch (Exception e) {
            logger.severe("Error sending unregistration notification to teacher: " + e.getMessage());
        }
    }

    /**
     * Отправка уведомления о том, что групповой урок почти заполнен
     */
    public void sendGroupLessonAlmostFullNotification(GroupLesson lesson) {
        try {
            if (lesson.getMaxStudents() != null && lesson.getCurrentStudents() >= lesson.getMaxStudents() * 0.8) {
                StringBuilder message = new StringBuilder();
                message.append("Ваш групповой урок почти заполнен!\n\n");
                message.append("Групповой урок: ").append(lesson.getLessonTopic()).append("\n");
                message.append("Дата: ").append(lesson.getScheduledDate()).append("\n");
                message.append("Время: ").append(lesson.getScheduledTime()).append("\n");
                message.append("Зарегистрировано: ").append(lesson.getCurrentStudents()).append("/")
                        .append(lesson.getMaxStudents()).append("\n");
                message.append("Осталось мест: ").append(lesson.getAvailableSpaces()).append("\n");

                sendNotificationToTeacher(
                        lesson.getTeacher(),
                        "Групповой урок почти заполнен",
                        message.toString(),
                        Notification.NotificationType.SYSTEM_MESSAGE
                );
            }
            
        } catch (Exception e) {
            logger.severe("Error sending group lesson almost full notification: " + e.getMessage());
        }
    }

    /**
     * Отправка уведомления о том, что группа заполнена
     */
    public void sendGroupLessonFullNotification(GroupLesson lesson) {
        try {
            if (lesson.isFull()) {
                StringBuilder message = new StringBuilder();
                message.append("Ваш групповой урок полностью заполнен!\n\n");
                message.append("Групповой урок: ").append(lesson.getLessonTopic()).append("\n");
                message.append("Дата: ").append(lesson.getScheduledDate()).append("\n");
                message.append("Время: ").append(lesson.getScheduledTime()).append("\n");
                message.append("Зарегистрировано: ").append(lesson.getCurrentStudents()).append("/")
                        .append(lesson.getMaxStudents()).append("\n");

                sendNotificationToTeacher(
                        lesson.getTeacher(),
                        "Групповой урок полностью заполнен",
                        message.toString(),
                        Notification.NotificationType.SYSTEM_MESSAGE
                );
            }
            
        } catch (Exception e) {
            logger.severe("Error sending group lesson full notification: " + e.getMessage());
        }
    }
}