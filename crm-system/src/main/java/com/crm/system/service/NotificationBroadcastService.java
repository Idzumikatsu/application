package com.crm.system.service;

import com.crm.system.dto.NotificationDto;
import com.crm.system.model.Notification;
import com.crm.system.model.Notification.RecipientType;
import com.crm.system.model.Notification.NotificationType;
import com.crm.system.model.Notification.NotificationStatus;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.model.Student;
import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.Lesson;
import com.crm.system.model.TelegramMessage;
import com.crm.system.repository.NotificationRepository;
import com.crm.system.repository.UserRepository;
import com.crm.system.repository.StudentRepository;
import com.crm.system.repository.AvailabilitySlotRepository;
import com.crm.system.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;
import java.util.stream.Collectors;

@Service
public class NotificationBroadcastService {

    private static final Logger logger = Logger.getLogger(NotificationBroadcastService.class.getName());

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TelegramNotificationService telegramNotificationService;

    @Autowired
    private EmailService emailService;

    // Конфигурационные параметры
    private static final int BATCH_SIZE = 100;
    private static final int MAX_RETRIES = 3;

    /**
     * Основной метод для широковещательной рассылки уведомлений
     */
    public BroadcastResult broadcastNotification(NotificationDto notificationDto, RecipientFilter filter) {
        logger.info("Starting broadcast notification: " + notificationDto.getTitle());
        
        BroadcastResult result = new BroadcastResult();
        long startTime = System.currentTimeMillis();

        try {
            // Получаем список получателей на основе фильтра
            List<User> recipients = getRecipientsByFilter(filter);
            logger.info("Found " + recipients.size() + " recipients for broadcast");

            // Обрабатываем получателей батчами
            int totalBatches = (int) Math.ceil((double) recipients.size() / BATCH_SIZE);
            
            for (int batch = 0; batch < totalBatches; batch++) {
                int fromIndex = batch * BATCH_SIZE;
                int toIndex = Math.min(fromIndex + BATCH_SIZE, recipients.size());
                List<User> batchRecipients = recipients.subList(fromIndex, toIndex);
                
                processBatch(batchRecipients, notificationDto, result, batch + 1, totalBatches);
                
                // Небольшая пауза между батчами для избежания перегрузки
                if (batch < totalBatches - 1) {
                    Thread.sleep(100);
                }
            }

            result.setSuccess(true);
            
        } catch (Exception e) {
            logger.severe("Error during broadcast notification: " + e.getMessage());
            result.setSuccess(false);
            result.setErrorMessage(e.getMessage());
        }

        long duration = System.currentTimeMillis() - startTime;
        result.setDurationMs(duration);
        logger.info("Broadcast completed in " + duration + "ms. Success: " + result.isSuccess());

        return result;
    }

    /**
     * Обработка батча получателей
     */
    private void processBatch(List<User> recipients, NotificationDto notificationDto,
                             BroadcastResult result, int batchNumber, int totalBatches) {
        logger.info("Processing batch " + batchNumber + "/" + totalBatches + " with " + recipients.size() + " recipients");
        
        for (User recipient : recipients) {
            try {
                sendNotificationToRecipient(recipient, notificationDto, result);
            } catch (Exception e) {
                logger.warning("Failed to send notification to user " + recipient.getId() + ": " + e.getMessage());
                result.incrementFailed();
            }
        }
    }

    /**
     * Отправка уведомления конкретному получателю
     */
    private void sendNotificationToRecipient(User recipient, NotificationDto notificationDto, BroadcastResult result) {
        // Создаем системное уведомление
        Notification notification = createSystemNotification(recipient, notificationDto);
        notificationService.saveNotification(notification);
        result.incrementSystemNotificationsSent();

        // Отправляем Telegram уведомление, если есть chatId
        if (recipient.getTelegramChatId() != null) {
            sendTelegramNotification(recipient, notificationDto, result);
        } else {
            result.incrementTelegramSkipped();
        }

        // Отправляем Email уведомление, если есть email
        if (recipient.getEmail() != null && !recipient.getEmail().isEmpty()) {
            sendEmailNotification(recipient, notificationDto, result);
        } else {
            result.incrementEmailSkipped();
        }

        result.incrementTotalProcessed();
    }

    /**
     * Создание системного уведомления
     */
    private Notification createSystemNotification(User recipient, NotificationDto notificationDto) {
        Notification notification = new Notification();
        notification.setRecipientId(recipient.getId());
        notification.setRecipientType(Notification.RecipientType.valueOf(recipient.getRole().name()));
        notification.setNotificationType(Notification.NotificationType.valueOf(notificationDto.getNotificationType().name()));
        notification.setTitle(notificationDto.getTitle());
        notification.setMessage(notificationDto.getMessage());
        notification.setPriority(notificationDto.getPriority());
        notification.setStatus(Notification.NotificationStatus.PENDING);
        notification.setCreatedAt(LocalDateTime.now());
        
        return notification;
    }

    /**
     * Отправка Telegram уведомления
     */
    private void sendTelegramNotification(User recipient, NotificationDto notificationDto, BroadcastResult result) {
        try {
            telegramNotificationService.sendNotification(
                recipient.getTelegramChatId(),
                recipient.getId(),
                TelegramMessage.RecipientType.valueOf(recipient.getRole().name()),
                notificationDto.getMessage(),
                TelegramMessage.MessageType.valueOf(notificationDto.getNotificationType().name())
            );
            result.incrementTelegramNotificationsSent();
        } catch (Exception e) {
            logger.warning("Failed to send Telegram notification to user " + recipient.getId() + ": " + e.getMessage());
            result.incrementTelegramFailed();
        }
    }

    /**
     * Отправка Email уведомления
     */
    private void sendEmailNotification(User recipient, NotificationDto notificationDto, BroadcastResult result) {
        try {
            emailService.sendNotificationEmail(
                recipient.getEmail(),
                recipient.getFullName(),
                notificationDto.getTitle(),
                notificationDto.getMessage(),
                notificationDto.getNotificationType(),
                notificationDto.getPriority()
            );
            result.incrementEmailNotificationsSent();
        } catch (Exception e) {
            logger.warning("Failed to send email notification to user " + recipient.getId() + ": " + e.getMessage());
            result.incrementEmailFailed();
        }
    }

    /**
     * Получение получателей на основе фильтра
     */
    private List<User> getRecipientsByFilter(RecipientFilter filter) {
        if (filter == null) {
            // Возвращаем всех активных пользователей
            return userRepository.findAll().stream()
                    .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                    .collect(Collectors.toList());
        }

        // Реализация фильтрации по различным критериям
        if (filter.getUserTypes() != null && !filter.getUserTypes().isEmpty()) {
            return filter.getUserTypes().stream()
                    .flatMap(userType -> userRepository.findByRoleAndIsActive(
                            UserRole.valueOf(userType.name()), true).stream())
                    .collect(Collectors.toList());
        }

        if (filter.getRegistrationDateFrom() != null || filter.getRegistrationDateTo() != null) {
            // Фильтрация по дате регистрации - реализация через stream фильтрацию
            return userRepository.findAll().stream()
                    .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                    .filter(user -> {
                        if (filter.getRegistrationDateFrom() != null &&
                            user.getCreatedAt().toLocalDate().isBefore(filter.getRegistrationDateFrom())) {
                            return false;
                        }
                        if (filter.getRegistrationDateTo() != null &&
                            user.getCreatedAt().toLocalDate().isAfter(filter.getRegistrationDateTo())) {
                            return false;
                        }
                        return true;
                    })
                    .collect(Collectors.toList());
        }

        // По умолчанию возвращаем всех активных пользователей
        return userRepository.findAll().stream()
                .filter(user -> Boolean.TRUE.equals(user.getIsActive()))
                .collect(Collectors.toList());
    }

    /**
     * Широковещательная рассылка всем студентам
     */
    public BroadcastResult broadcastToAllStudents(String title, String message, NotificationType type, int priority) {
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setTitle(title);
        notificationDto.setMessage(message);
        notificationDto.setNotificationType(type);
        notificationDto.setPriority(priority);
        RecipientFilter filter = new RecipientFilter();
        filter.setUserTypes(List.of(UserRole.STUDENT));
        return broadcastNotification(notificationDto, filter);
    }

    /**
     * Широковещательная рассылка всем преподавателям
     */
    public BroadcastResult broadcastToAllTeachers(String title, String message, NotificationType type, int priority) {
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setTitle(title);
        notificationDto.setMessage(message);
        notificationDto.setNotificationType(type);
        notificationDto.setPriority(priority);
        RecipientFilter filter = new RecipientFilter();
        filter.setUserTypes(List.of(UserRole.TEACHER));
        return broadcastNotification(notificationDto, filter);
    }

    /**
     * Широковещательная рассылка всем менеджерам
     */
    public BroadcastResult broadcastToAllManagers(String title, String message, NotificationType type, int priority) {
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setTitle(title);
        notificationDto.setMessage(message);
        notificationDto.setNotificationType(type);
        notificationDto.setPriority(priority);
        RecipientFilter filter = new RecipientFilter();
        filter.setUserTypes(List.of(UserRole.MANAGER));
        return broadcastNotification(notificationDto, filter);
    }

    /**
     * Широковещательная рассылка всем администраторам
     */
    public BroadcastResult broadcastToAllAdmins(String title, String message, NotificationType type, int priority) {
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setTitle(title);
        notificationDto.setMessage(message);
        notificationDto.setNotificationType(type);
        notificationDto.setPriority(priority);
        RecipientFilter filter = new RecipientFilter();
        filter.setUserTypes(List.of(UserRole.ADMIN));
        return broadcastNotification(notificationDto, filter);
    }

    /**
     * Широковещательная рассылка всем пользователям
     */
    public BroadcastResult broadcastToAllUsers(String title, String message, NotificationType type, int priority) {
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setTitle(title);
        notificationDto.setMessage(message);
        notificationDto.setNotificationType(type);
        notificationDto.setPriority(priority);
        return broadcastNotification(notificationDto, null);
    }

    /**
     * Широковещательная рассылка с пользовательским фильтром
     */
    public BroadcastResult broadcastWithCustomFilter(String title, String message, NotificationType type,
                                                   int priority, RecipientFilter filter) {
        NotificationDto notificationDto = new NotificationDto();
        notificationDto.setTitle(title);
        notificationDto.setMessage(message);
        notificationDto.setNotificationType(type);
        notificationDto.setPriority(priority);
        return broadcastNotification(notificationDto, filter);
    }

    /**
     * Планировщик для автоматической широковещательной рассылки
     */
    @Scheduled(cron = "0 0 9 * * ?") // Ежедневно в 09:00
    public void scheduledBroadcast() {
        logger.info("Starting scheduled broadcast");
        
        // Здесь можно добавить логику для регулярных автоматических рассылок
        // Например: уведомления о новых функциях, важных обновлениях и т.д.
    }

    /**
     * Класс для фильтрации получателей
     */
    public static class RecipientFilter {
        private List<UserRole> userTypes;
        private LocalDate registrationDateFrom;
        private LocalDate registrationDateTo;
        private Boolean isActive;
        // Дополнительные критерии фильтрации могут быть добавлены по мере необходимости

        // Getters and setters
        public List<UserRole> getUserTypes() { return userTypes; }
        public void setUserTypes(List<UserRole> userTypes) { this.userTypes = userTypes; }
        
        public LocalDate getRegistrationDateFrom() { return registrationDateFrom; }
        public void setRegistrationDateFrom(LocalDate registrationDateFrom) { this.registrationDateFrom = registrationDateFrom; }
        
        public LocalDate getRegistrationDateTo() { return registrationDateTo; }
        public void setRegistrationDateTo(LocalDate registrationDateTo) { this.registrationDateTo = registrationDateTo; }
        
        public Boolean getIsActive() { return isActive; }
        public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    }

    /**
     * Класс для хранения результатов широковещательной рассылки
     */
    public static class BroadcastResult {
        private boolean success;
        private String errorMessage;
        private long durationMs;
        private int totalProcessed;
        private int systemNotificationsSent;
        private int telegramNotificationsSent;
        private int telegramFailed;
        private int telegramSkipped;
        private int emailNotificationsSent;
        private int emailFailed;
        private int emailSkipped;
        private int failed;

        public BroadcastResult() {
            this.success = false;
            this.totalProcessed = 0;
            this.systemNotificationsSent = 0;
            this.telegramNotificationsSent = 0;
            this.telegramFailed = 0;
            this.telegramSkipped = 0;
            this.emailNotificationsSent = 0;
            this.emailFailed = 0;
            this.emailSkipped = 0;
            this.failed = 0;
        }

        // Getters and setters
        public boolean isSuccess() { return success; }
        public void setSuccess(boolean success) { this.success = success; }
        
        public String getErrorMessage() { return errorMessage; }
        public void setErrorMessage(String errorMessage) { this.errorMessage = errorMessage; }
        
        public long getDurationMs() { return durationMs; }
        public void setDurationMs(long durationMs) { this.durationMs = durationMs; }
        
        public int getTotalProcessed() { return totalProcessed; }
        public void setTotalProcessed(int totalProcessed) { this.totalProcessed = totalProcessed; }
        public void incrementTotalProcessed() { this.totalProcessed++; }
        
        public int getSystemNotificationsSent() { return systemNotificationsSent; }
        public void setSystemNotificationsSent(int systemNotificationsSent) { this.systemNotificationsSent = systemNotificationsSent; }
        public void incrementSystemNotificationsSent() { this.systemNotificationsSent++; }
        
        public int getTelegramNotificationsSent() { return telegramNotificationsSent; }
        public void setTelegramNotificationsSent(int telegramNotificationsSent) { this.telegramNotificationsSent = telegramNotificationsSent; }
        public void incrementTelegramNotificationsSent() { this.telegramNotificationsSent++; }
        
        public int getTelegramFailed() { return telegramFailed; }
        public void setTelegramFailed(int telegramFailed) { this.telegramFailed = telegramFailed; }
        public void incrementTelegramFailed() { this.telegramFailed++; }
        
        public int getTelegramSkipped() { return telegramSkipped; }
        public void setTelegramSkipped(int telegramSkipped) { this.telegramSkipped = telegramSkipped; }
        public void incrementTelegramSkipped() { this.telegramSkipped++; }
        
        public int getEmailNotificationsSent() { return emailNotificationsSent; }
        public void setEmailNotificationsSent(int emailNotificationsSent) { this.emailNotificationsSent = emailNotificationsSent; }
        public void incrementEmailNotificationsSent() { this.emailNotificationsSent++; }
        
        public int getEmailFailed() { return emailFailed; }
        public void setEmailFailed(int emailFailed) { this.emailFailed = emailFailed; }
        public void incrementEmailFailed() { this.emailFailed++; }
        
        public int getEmailSkipped() { return emailSkipped; }
        public void setEmailSkipped(int emailSkipped) { this.emailSkipped = emailSkipped; }
        public void incrementEmailSkipped() { this.emailSkipped++; }
        
        public int getFailed() { return failed; }
        public void setFailed(int failed) { this.failed = failed; }
        public void incrementFailed() { this.failed++; }

        @Override
        public String toString() {
            return "BroadcastResult{" +
                   "success=" + success +
                   ", durationMs=" + durationMs +
                   ", totalProcessed=" + totalProcessed +
                   ", systemNotificationsSent=" + systemNotificationsSent +
                   ", telegramNotificationsSent=" + telegramNotificationsSent +
                   ", telegramFailed=" + telegramFailed +
                   ", telegramSkipped=" + telegramSkipped +
                   ", emailNotificationsSent=" + emailNotificationsSent +
                   ", emailFailed=" + emailFailed +
                   ", emailSkipped=" + emailSkipped +
                   ", failed=" + failed +
                   (errorMessage != null ? ", errorMessage='" + errorMessage + '\'' : "") +
                   '}';
        }
    }
}