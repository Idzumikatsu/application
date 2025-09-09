package com.crm.system.service;

import com.crm.system.model.Notification;
import com.crm.system.model.User;
import com.crm.system.model.Student;
import com.crm.system.model.Notification.RecipientType;
import com.crm.system.model.Notification.NotificationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Logger;

@Service
public class EmailService {

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private NotificationService notificationService;

    @Value("${email.sender.name}")
    private String senderName;

    @Value("${email.sender.address}")
    private String senderAddress;

    @Value("${email.retry.max-attempts:3}")
    private int maxRetryAttempts;

    @Value("${email.retry.delay-ms:5000}")
    private long retryDelayMs;

    /**
     * Отправляет email уведомление на основе объекта Notification
     */
    @Async
    @Transactional
    public CompletableFuture<Boolean> sendNotificationEmail(Notification notification) {
        String recipientEmail = getRecipientEmail(notification.getRecipientId(), notification.getRecipientType());
        
        if (recipientEmail == null) {
            logger.warning("Cannot send email notification: recipient email not found for ID: " + 
                          notification.getRecipientId() + ", type: " + notification.getRecipientType());
            notification.markAsFailed();
            notificationService.updateNotification(notification);
            return CompletableFuture.completedFuture(false);
        }

        String subject = notification.getTitle();
        String templateName = getTemplateName(notification.getNotificationType());
        Map<String, Object> templateVariables = createTemplateVariables(notification);

        return sendEmailWithRetry(recipientEmail, subject, templateName, templateVariables, notification);
    }

    /**
     * Отправляет email с повторными попытками при ошибках
     */
    private CompletableFuture<Boolean> sendEmailWithRetry(String recipientEmail, String subject, 
                                                        String templateName, Map<String, Object> variables,
                                                        Notification notification) {
        return CompletableFuture.supplyAsync(() -> {
            int attempt = 0;
            while (attempt < maxRetryAttempts) {
                try {
                    boolean success = sendEmail(recipientEmail, subject, templateName, variables);
                    if (success) {
                        notification.markAsSent();
                        notificationService.updateNotification(notification);
                        logger.info("Email sent successfully to: " + recipientEmail);
                        return true;
                    }
                } catch (Exception e) {
                    logger.warning("Email sending attempt " + (attempt + 1) + " failed for: " + 
                                 recipientEmail + ". Error: " + e.getMessage());
                }

                attempt++;
                if (attempt < maxRetryAttempts) {
                    try {
                        Thread.sleep(retryDelayMs);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }

            notification.markAsFailed();
            notificationService.updateNotification(notification);
            logger.severe("Failed to send email after " + maxRetryAttempts + " attempts to: " + recipientEmail);
            return false;
        });
    }

    /**
     * Отправляет email с использованием Thymeleaf шаблона
     */
    public boolean sendEmail(String recipientEmail, String subject, String templateName, 
                           Map<String, Object> variables) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderAddress, senderName);
            helper.setTo(recipientEmail);
            helper.setSubject(subject);

            // Подготавливаем контекст для шаблона
            Context context = new Context();
            context.setVariables(variables);

            // Генерируем HTML содержимое из шаблона
            String htmlContent = templateEngine.process(templateName, context);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            return true;
        } catch (MessagingException e) {
            logger.severe("Failed to send email to: " + recipientEmail + ". Error: " + e.getMessage());
            return false;
        } catch (Exception e) {
            logger.severe("Unexpected error while sending email to: " + recipientEmail + ". Error: " + e.getMessage());
            return false;
        }
    }

    /**
     * Получает email адрес получателя по ID и типу
     */
    private String getRecipientEmail(Long recipientId, RecipientType recipientType) {
        switch (recipientType) {
            case STUDENT:
                return studentService.findById(recipientId)
                    .map(Student::getEmail)
                    .orElse(null);
            case TEACHER:
            case MANAGER:
            case ADMIN:
                return userService.findById(recipientId)
                    .map(User::getEmail)
                    .orElse(null);
            default:
                return null;
        }
    }

    /**
     * Определяет имя шаблона по типу уведомления
     */
    private String getTemplateName(NotificationType notificationType) {
        switch (notificationType) {
            case LESSON_SCHEDULED:
            case GROUP_LESSON_SCHEDULED:
                return "lesson-scheduled";
            case LESSON_CANCELLED:
            case GROUP_LESSON_CANCELLED:
                return "lesson-cancelled";
            case LESSON_REMINDER:
            case GROUP_LESSON_REMINDER:
                return "lesson-reminder";
            case LESSON_COMPLETED:
                return "lesson-completed";
            case PACKAGE_ENDING_SOON:
                return "package-ending-soon";
            case PAYMENT_DUE:
                return "payment-due";
            case SYSTEM_MESSAGE:
                return "system-message";
            case FEEDBACK_REQUEST:
                return "feedback-request";
            default:
                return "default-notification";
        }
    }

    /**
     * Создает переменные для шаблона на основе уведомления
     */
    private Map<String, Object> createTemplateVariables(Notification notification) {
        Map<String, Object> variables = new HashMap<>();
        variables.put("notification", notification);
        variables.put("recipientName", getRecipientName(notification.getRecipientId(), notification.getRecipientType()));
        variables.put("currentYear", LocalDateTime.now().getYear());
        variables.put("schoolName", "CRM English School");
        
        // Добавляем дополнительные переменные в зависимости от типа уведомления
        switch (notification.getNotificationType()) {
            case LESSON_SCHEDULED:
            case GROUP_LESSON_SCHEDULED:
            case LESSON_CANCELLED:
            case GROUP_LESSON_CANCELLED:
            case LESSON_REMINDER:
            case GROUP_LESSON_REMINDER:
                variables.put("lessonInfo", notification.getMessage());
                break;
            case PACKAGE_ENDING_SOON:
                variables.put("packageInfo", notification.getMessage());
                break;
            case PAYMENT_DUE:
                variables.put("paymentInfo", notification.getMessage());
                break;
        }
        
        return variables;
    }

    /**
     * Получает имя получателя по ID и типу
     */
    private String getRecipientName(Long recipientId, RecipientType recipientType) {
        switch (recipientType) {
            case STUDENT:
                return studentService.findById(recipientId)
                    .map(student -> student.getFirstName() + " " + student.getLastName())
                    .orElse("Student");
            case TEACHER:
            case MANAGER:
            case ADMIN:
                return userService.findById(recipientId)
                    .map(user -> user.getFirstName() + " " + user.getLastName())
                    .orElse("User");
            default:
                return "User";
        }
    }

    /**
     * Методы для отправки конкретных типов уведомлений
     */
    @Async
    public CompletableFuture<Boolean> sendLessonScheduledEmail(Long recipientId, RecipientType recipientType,
                                                              String recipientEmail, String lessonInfo) {
        logger.info("Sending lesson scheduled email to: " + recipientEmail + ", recipient ID: " + recipientId);
        String subject = "Урок запланирован - CRM English School";
        Map<String, Object> variables = new HashMap<>();
        variables.put("lessonInfo", lessonInfo);
        variables.put("recipientName", getRecipientName(recipientId, recipientType));
        
        return sendEmailWithRetry(recipientEmail, subject, "lesson-scheduled", variables, null);
    }

    @Async
    public CompletableFuture<Boolean> sendLessonCancelledEmail(Long recipientId, RecipientType recipientType,
                                                            String recipientEmail, String lessonInfo, String reason) {
        logger.info("Sending lesson cancelled email to: " + recipientEmail + ", recipient ID: " + recipientId);
        String subject = "Урок отменен - CRM English School";
        Map<String, Object> variables = new HashMap<>();
        variables.put("lessonInfo", lessonInfo);
        variables.put("reason", reason);
        variables.put("recipientName", getRecipientName(recipientId, recipientType));
        
        return sendEmailWithRetry(recipientEmail, subject, "lesson-cancelled", variables, null);
    }

    @Async
    public CompletableFuture<Boolean> sendLessonReminderEmail(Long recipientId, RecipientType recipientType,
                                                             String recipientEmail, String lessonInfo) {
        logger.info("Sending lesson reminder email to: " + recipientEmail + ", recipient ID: " + recipientId);
        String subject = "Напоминание об уроке - CRM English School";
        Map<String, Object> variables = new HashMap<>();
        variables.put("lessonInfo", lessonInfo);
        variables.put("recipientName", getRecipientName(recipientId, recipientType));
        
        return sendEmailWithRetry(recipientEmail, subject, "lesson-reminder", variables, null);
    }

    @Async
    public CompletableFuture<Boolean> sendPackageEndingSoonEmail(Long recipientId, RecipientType recipientType,
                                                                String recipientEmail, String packageInfo) {
        logger.info("Sending package ending soon email to: " + recipientEmail + ", recipient ID: " + recipientId);
        String subject = "Пакет уроков заканчивается - CRM English School";
        Map<String, Object> variables = new HashMap<>();
        variables.put("packageInfo", packageInfo);
        variables.put("recipientName", getRecipientName(recipientId, recipientType));
        
        return sendEmailWithRetry(recipientEmail, subject, "package-ending-soon", variables, null);
    }

    @Async
    public CompletableFuture<Boolean> sendPaymentDueEmail(Long recipientId, RecipientType recipientType,
                                                        String recipientEmail, String paymentInfo) {
        logger.info("Sending payment due email to: " + recipientEmail + ", recipient ID: " + recipientId);
        String subject = "Напоминание об оплате - CRM English School";
        Map<String, Object> variables = new HashMap<>();
        variables.put("paymentInfo", paymentInfo);
        variables.put("recipientName", getRecipientName(recipientId, recipientType));
        
        return sendEmailWithRetry(recipientEmail, subject, "payment-due", variables, null);
    }

    @Async
    public CompletableFuture<Boolean> sendSystemMessageEmail(Long recipientId, RecipientType recipientType,
                                                           String recipientEmail, String message) {
        logger.info("Sending system message email to: " + recipientEmail + ", recipient ID: " + recipientId);
        String subject = "Системное сообщение - CRM English School";
        Map<String, Object> variables = new HashMap<>();
        variables.put("message", message);
        variables.put("recipientName", getRecipientName(recipientId, recipientType));
        
        return sendEmailWithRetry(recipientEmail, subject, "system-message", variables, null);
    }

    @Async
    public CompletableFuture<Boolean> sendFeedbackRequestEmail(Long recipientId, RecipientType recipientType,
                                                              String recipientEmail, String feedbackInfo) {
        logger.info("Sending feedback request email to: " + recipientEmail + ", recipient ID: " + recipientId);
        String subject = "Запрос на обратную связь - CRM English School";
        Map<String, Object> variables = new HashMap<>();
        variables.put("feedbackInfo", feedbackInfo);
        variables.put("recipientName", getRecipientName(recipientId, recipientType));
        
        return sendEmailWithRetry(recipientEmail, subject, "feedback-request", variables, null);
    }
}