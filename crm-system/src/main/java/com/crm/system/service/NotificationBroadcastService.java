package com.crm.system.service;

import com.crm.system.model.Notification;
import com.crm.system.model.Notification.RecipientType;
import com.crm.system.model.Notification.NotificationType;
import com.crm.system.model.Notification.NotificationStatus;
import com.crm.system.model.User;
import com.crm.system.model.Student;
import com.crm.system.repository.NotificationRepository;
import com.crm.system.repository.UserRepository;
import com.crm.system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import java.util.logging.Logger;

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
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    /**
     * Создает и отправляет широковещательное уведомление всем пользователям определенного типа
     */
    public CompletableFuture<List<Notification>> broadcastToRecipientType(
            RecipientType recipientType, NotificationType notificationType, 
            String title, String message) {
        
        logger.info("Broadcasting notification to all " + recipientType + " recipients");
        
        // Создаем уведомления для всех получателей указанного типа
        List<Notification> notifications = createNotificationsForRecipientType(
                recipientType, notificationType, title, message);
        
        // Сохраняем все уведомления
        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);
        
        // Отправляем уведомления асинхронно
        sendNotificationsAsync(savedNotifications);
        
        return CompletableFuture.completedFuture(savedNotifications);
    }

    /**
     * Создает и отправляет широковещательное уведомление фильтрованному списку пользователей
     */
    public CompletableFuture<List<Notification>> broadcastToFilteredRecipients(
            List<Long> recipientIds, RecipientType recipientType, 
            NotificationType notificationType, String title, String message) {
        
        logger.info("Broadcasting notification to " + recipientIds.size() + " filtered recipients");
        
        // Создаем уведомления для отфильтрованных получателей
        List<Notification> notifications = createNotificationsForFilteredRecipients(
                recipientIds, recipientType, notificationType, title, message);
        
        // Сохраняем все уведомления
        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);
        
        // Отправляем уведомления асинхронно
        sendNotificationsAsync(savedNotifications);
        
        return CompletableFuture.completedFuture(savedNotifications);
    }

    /**
     * Создает уведомления для всех получателей указанного типа
     */
    private List<Notification> createNotificationsForRecipientType(
            RecipientType recipientType, NotificationType notificationType, 
            String title, String message) {
        
        switch (recipientType) {
            case STUDENT:
                List<Student> students = studentRepository.findAll();
                return students.stream()
                    .map(student -> new Notification(student.getId(), recipientType, notificationType, title, message))
                    .collect(Collectors.toList());
                    
            case TEACHER:
                List<User> teachers = userRepository.findByRole(com.crm.system.model.UserRole.TEACHER);
                return teachers.stream()
                    .map(teacher -> new Notification(teacher.getId(), recipientType, notificationType, title, message))
                    .collect(Collectors.toList());
                    
            case MANAGER:
                List<User> managers = userRepository.findByRole(com.crm.system.model.UserRole.MANAGER);
                return managers.stream()
                    .map(manager -> new Notification(manager.getId(), recipientType, notificationType, title, message))
                    .collect(Collectors.toList());
                    
            case ADMIN:
                List<User> admins = userRepository.findByRole(com.crm.system.model.UserRole.ADMIN);
                return admins.stream()
                    .map(admin -> new Notification(admin.getId(), recipientType, notificationType, title, message))
                    .collect(Collectors.toList());
                    
            default:
                return List.of();
        }
    }

    /**
     * Создает уведомления для отфильтрованных получателей
     */
    private List<Notification> createNotificationsForFilteredRecipients(
            List<Long> recipientIds, RecipientType recipientType, 
            NotificationType notificationType, String title, String message) {
        
        return recipientIds.stream()
            .map(id -> new Notification(id, recipientType, notificationType, title, message))
            .collect(Collectors.toList());
    }

    /**
     * Асинхронно отправляет уведомления
     */
    private void sendNotificationsAsync(List<Notification> notifications) {
        for (Notification notification : notifications) {
            // Отправляем email уведомление
            sendEmailNotificationAsync(notification);
            
            // Отправляем push-уведомление (в реальной реализации)
            sendPushNotificationAsync(notification);
        }
    }

    /**
     * Асинхронно отправляет email уведомление
     */
    private void sendEmailNotificationAsync(Notification notification) {
        String recipientEmail = getRecipientEmail(notification.getRecipientId(), notification.getRecipientType());
        
        if (recipientEmail != null && !recipientEmail.isEmpty()) {
            emailService.sendNotificationEmail(notification);
        }
    }

    /**
     * Асинхронно отправляет push-уведомление
     */
    private void sendPushNotificationAsync(Notification notification) {
        // В реальной реализации здесь будет отправка push-уведомления
        // через Firebase Cloud Messaging, Apple Push Notification Service и т.д.
        logger.info("Sending push notification to recipient ID: " + notification.getRecipientId());
    }

    /**
     * Получает email адрес получателя по ID и типу
     */
    private String getRecipientEmail(Long recipientId, RecipientType recipientType) {
        switch (recipientType) {
            case STUDENT:
                return studentRepository.findById(recipientId)
                    .map(Student::getEmail)
                    .orElse(null);
            case TEACHER:
            case MANAGER:
            case ADMIN:
                return userRepository.findById(recipientId)
                    .map(User::getEmail)
                    .orElse(null);
            default:
                return null;
        }
    }

    /**
     * Получает имя получателя по ID и типу
     */
    private String getRecipientName(Long recipientId, RecipientType recipientType) {
        switch (recipientType) {
            case STUDENT:
                return studentRepository.findById(recipientId)
                    .map(student -> student.getFirstName() + " " + student.getLastName())
                    .orElse("Student");
            case TEACHER:
            case MANAGER:
            case ADMIN:
                return userRepository.findById(recipientId)
                    .map(user -> user.getFirstName() + " " + user.getLastName())
                    .orElse("User");
            default:
                return "User";
        }
    }

    /**
     * Отправляет широковещательное уведомление с приоритетом
     */
    public CompletableFuture<List<Notification>> broadcastWithPriority(
            RecipientType recipientType, NotificationType notificationType, 
            String title, String message, boolean highPriority) {
        
        logger.info("Broadcasting " + (highPriority ? "high priority" : "normal priority") + 
                   " notification to all " + recipientType + " recipients");
        
        // Создаем уведомления для всех получателей указанного типа
        List<Notification> notifications = createNotificationsForRecipientType(
                recipientType, notificationType, title, message);
        
        // Если это высокоприоритетное уведомление, устанавливаем соответствующий флаг
        if (highPriority) {
            notifications.forEach(notification -> {
                // В реальной реализации здесь можно установить специальный флаг приоритета
                // или использовать отдельную таблицу для высокоприоритетных уведомлений
                logger.info("High priority notification created for recipient ID: " + notification.getRecipientId());
            });
        }
        
        // Сохраняем все уведомления
        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);
        
        // Отправляем уведомления асинхронно
        sendNotificationsAsync(savedNotifications);
        
        return CompletableFuture.completedFuture(savedNotifications);
    }

    /**
     * Отправляет широковещательное уведомление с отложенной доставкой
     */
    public CompletableFuture<List<Notification>> broadcastScheduled(
            RecipientType recipientType, NotificationType notificationType, 
            String title, String message, LocalDateTime scheduledTime) {
        
        logger.info("Scheduling broadcast notification for " + scheduledTime + 
                   " to all " + recipientType + " recipients");
        
        // Создаем уведомления для всех получателей указанного типа
        List<Notification> notifications = createNotificationsForRecipientType(
                recipientType, notificationType, title, message);
        
        // Устанавливаем запланированное время доставки
        notifications.forEach(notification -> {
            // В реальной реализации здесь будет установлено запланированное время
            // и уведомления будут отправляться планировщиком задач
            logger.info("Scheduled notification created for recipient ID: " + notification.getRecipientId() + 
                       " at " + scheduledTime);
        });
        
        // Сохраняем все уведомления
        List<Notification> savedNotifications = notificationRepository.saveAll(notifications);
        
        // В реальной реализации здесь будет запланирована отправка уведомлений
        // через планировщик задач Spring @Scheduled или Quartz
        
        return CompletableFuture.completedFuture(savedNotifications);
    }

    /**
     * Получает статистику по широковещательной рассылке
     */
    public BroadcastStatistics getBroadcastStatistics() {
        long totalNotifications = notificationRepository.count();
        long pendingNotifications = notificationRepository.countByStatus(NotificationStatus.PENDING);
        long sentNotifications = notificationRepository.countByStatus(NotificationStatus.SENT);
        long deliveredNotifications = notificationRepository.countByStatus(NotificationStatus.DELIVERED);
        long readNotifications = notificationRepository.countByStatus(NotificationStatus.READ);
        long failedNotifications = notificationRepository.countByStatus(NotificationStatus.FAILED);
        
        return new BroadcastStatistics(
                totalNotifications,
                pendingNotifications,
                sentNotifications,
                deliveredNotifications,
                readNotifications,
                failedNotifications
        );
    }

    /**
     * Отменяет запланированные широковещательные уведомления
     */
    public void cancelScheduledBroadcasts(NotificationType notificationType) {
        logger.info("Cancelling scheduled broadcasts of type: " + notificationType);
        
        // В реальной реализации здесь будут отменены все запланированные уведомления
        // указанного типа
        List<Notification> scheduledNotifications = notificationRepository
                .findByNotificationTypeAndStatus(notificationType, NotificationStatus.PENDING);
        
        // Отменяем каждое уведомление
        for (Notification notification : scheduledNotifications) {
            notification.markAsFailed();
            notificationRepository.save(notification);
            logger.info("Cancelled scheduled notification ID: " + notification.getId());
        }
    }

    /**
     * Повторная отправка неудавшихся уведомлений
     */
    public CompletableFuture<Integer> resendFailedNotifications() {
        logger.info("Resending failed notifications");
        
        // Получаем все неудавшиеся уведомления
        List<Notification> failedNotifications = notificationRepository
                .findByStatus(NotificationStatus.FAILED);
        
        int resentCount = 0;
        
        // Повторно отправляем каждое неудавшееся уведомление
        for (Notification notification : failedNotifications) {
            try {
                // Сбрасываем статус уведомления
                notification.resetStatus();
                
                // Повторно отправляем уведомление
                sendNotificationsAsync(List.of(notification));
                
                // Обновляем уведомление в базе данных
                notificationRepository.save(notification);
                
                resentCount++;
                logger.info("Resent notification ID: " + notification.getId());
            } catch (Exception e) {
                logger.severe("Failed to resend notification ID: " + notification.getId() + 
                             ". Error: " + e.getMessage());
            }
        }
        
        return CompletableFuture.completedFuture(resentCount);
    }

    // Методы фильтрации получателей

    /**
     * Получает список всех студентов с фильтрацией по критериям
     */
    public List<Long> getFilteredStudentIds(StudentFilterCriteria filterCriteria) {
        List<Student> students = studentRepository.findAll();
        
        return students.stream()
            .filter(student -> filterByCriteria(student, filterCriteria))
            .map(Student::getId)
            .collect(Collectors.toList());
    }

    /**
     * Получает список всех преподавателей с фильтрацией по критериям
     */
    public List<Long> getFilteredTeacherIds(TeacherFilterCriteria filterCriteria) {
        List<User> teachers = userRepository.findByRole(com.crm.system.model.UserRole.TEACHER);
        
        return teachers.stream()
            .filter(teacher -> filterByCriteria(teacher, filterCriteria))
            .map(User::getId)
            .collect(Collectors.toList());
    }

    /**
     * Получает список всех менеджеров с фильтрацией по критериям
     */
    public List<Long> getFilteredManagerIds(ManagerFilterCriteria filterCriteria) {
        List<User> managers = userRepository.findByRole(com.crm.system.model.UserRole.MANAGER);
        
        return managers.stream()
            .filter(manager -> filterByCriteria(manager, filterCriteria))
            .map(User::getId)
            .collect(Collectors.toList());
    }

    /**
     * Получает список всех администраторов с фильтрацией по критериям
     */
    public List<Long> getFilteredAdminIds(AdminFilterCriteria filterCriteria) {
        List<User> admins = userRepository.findByRole(com.crm.system.model.UserRole.ADMIN);
        
        return admins.stream()
            .filter(admin -> filterByCriteria(admin, filterCriteria))
            .map(User::getId)
            .collect(Collectors.toList());
    }

    /**
     * Фильтрует студентов по критериям
     */
    private boolean filterByCriteria(Student student, StudentFilterCriteria filterCriteria) {
        // Фильтрация по наличию назначенного преподавателя
        if (filterCriteria.getHasAssignedTeacher() != null) {
            boolean hasAssignedTeacher = student.getAssignedTeacher() != null;
            if (filterCriteria.getHasAssignedTeacher() != hasAssignedTeacher) {
                return false;
            }
        }
        
        // Фильтрация по количеству оставшихся уроков
        if (filterCriteria.getMinRemainingLessons() != null || filterCriteria.getMaxRemainingLessons() != null) {
            // В реальной реализации здесь нужно получить информацию о пакетах уроков студента
            // и сравнить с критериями фильтрации
        }
        
        // Фильтрация по дате регистрации
        if (filterCriteria.getRegisteredAfter() != null) {
            if (student.getCreatedAt() == null || student.getCreatedAt().isBefore(filterCriteria.getRegisteredAfter())) {
                return false;
            }
        }
        
        if (filterCriteria.getRegisteredBefore() != null) {
            if (student.getCreatedAt() == null || student.getCreatedAt().isAfter(filterCriteria.getRegisteredBefore())) {
                return false;
            }
        }
        
        // Фильтрация по активности
        if (filterCriteria.getActiveOnly() != null && filterCriteria.getActiveOnly()) {
            // В реальной реализации здесь нужно проверить активность студента
            // (например, наличие недавних уроков или взаимодействий)
        }
        
        return true;
    }

    /**
     * Фильтрует преподавателей по критериям
     */
    private boolean filterByCriteria(User teacher, TeacherFilterCriteria filterCriteria) {
        // Фильтрация по активности
        if (filterCriteria.getActiveOnly() != null) {
            if (filterCriteria.getActiveOnly() != teacher.getIsActive()) {
                return false;
            }
        }
        
        // Фильтрация по дате регистрации
        if (filterCriteria.getRegisteredAfter() != null) {
            if (teacher.getCreatedAt() == null || teacher.getCreatedAt().isBefore(filterCriteria.getRegisteredAfter())) {
                return false;
            }
        }
        
        if (filterCriteria.getRegisteredBefore() != null) {
            if (teacher.getCreatedAt() == null || teacher.getCreatedAt().isAfter(filterCriteria.getRegisteredBefore())) {
                return false;
            }
        }
        
        // Фильтрация по наличию назначенных студентов
        if (filterCriteria.getHasAssignedStudents() != null) {
            // В реальной реализации здесь нужно проверить, есть ли у преподавателя назначенные студенты
        }
        
        return true;
    }

    /**
     * Фильтрует менеджеров по критериям
     */
    private boolean filterByCriteria(User manager, ManagerFilterCriteria filterCriteria) {
        // Фильтрация по активности
        if (filterCriteria.getActiveOnly() != null) {
            if (filterCriteria.getActiveOnly() != manager.getIsActive()) {
                return false;
            }
        }
        
        // Фильтрация по дате регистрации
        if (filterCriteria.getRegisteredAfter() != null) {
            if (manager.getCreatedAt() == null || manager.getCreatedAt().isBefore(filterCriteria.getRegisteredAfter())) {
                return false;
            }
        }
        
        if (filterCriteria.getRegisteredBefore() != null) {
            if (manager.getCreatedAt() == null || manager.getCreatedAt().isAfter(filterCriteria.getRegisteredBefore())) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Фильтрует администраторов по критериям
     */
    private boolean filterByCriteria(User admin, AdminFilterCriteria filterCriteria) {
        // Фильтрация по активности
        if (filterCriteria.getActiveOnly() != null) {
            if (filterCriteria.getActiveOnly() != admin.getIsActive()) {
                return false;
            }
        }
        
        // Фильтрация по дате регистрации
        if (filterCriteria.getRegisteredAfter() != null) {
            if (admin.getCreatedAt() == null || admin.getCreatedAt().isBefore(filterCriteria.getRegisteredAfter())) {
                return false;
            }
        }
        
        if (filterCriteria.getRegisteredBefore() != null) {
            if (admin.getCreatedAt() == null || admin.getCreatedAt().isAfter(filterCriteria.getRegisteredBefore())) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Отправляет широковещательное уведомление с фильтрацией получателей
     */
    public CompletableFuture<List<Notification>> broadcastWithFilters(
            RecipientType recipientType, NotificationType notificationType, 
            String title, String message, BaseFilterCriteria filterCriteria) {
        
        logger.info("Broadcasting notification with filters to " + recipientType + " recipients");
        
        List<Long> filteredRecipientIds = getFilteredRecipientIds(recipientType, filterCriteria);
        
        return broadcastToFilteredRecipients(filteredRecipientIds, recipientType, notificationType, title, message);
    }

    /**
     * Получает отфильтрованные ID получателей по типу и критериям
     */
    private List<Long> getFilteredRecipientIds(RecipientType recipientType, BaseFilterCriteria filterCriteria) {
        switch (recipientType) {
            case STUDENT:
                if (filterCriteria instanceof StudentFilterCriteria) {
                    return getFilteredStudentIds((StudentFilterCriteria) filterCriteria);
                }
                break;
            case TEACHER:
                if (filterCriteria instanceof TeacherFilterCriteria) {
                    return getFilteredTeacherIds((TeacherFilterCriteria) filterCriteria);
                }
                break;
            case MANAGER:
                if (filterCriteria instanceof ManagerFilterCriteria) {
                    return getFilteredManagerIds((ManagerFilterCriteria) filterCriteria);
                }
                break;
            case ADMIN:
                if (filterCriteria instanceof AdminFilterCriteria) {
                    return getFilteredAdminIds((AdminFilterCriteria) filterCriteria);
                }
                break;
        }
        
        return List.of();
    }

    /**
     * Класс для хранения статистики широковещательной рассылки
     */
    public static class BroadcastStatistics {
        private final long totalNotifications;
        private final long pendingNotifications;
        private final long sentNotifications;
        private final long deliveredNotifications;
        private final long readNotifications;
        private final long failedNotifications;

        public BroadcastStatistics(long totalNotifications, long pendingNotifications, 
                                  long sentNotifications, long deliveredNotifications, 
                                  long readNotifications, long failedNotifications) {
            this.totalNotifications = totalNotifications;
            this.pendingNotifications = pendingNotifications;
            this.sentNotifications = sentNotifications;
            this.deliveredNotifications = deliveredNotifications;
            this.readNotifications = readNotifications;
            this.failedNotifications = failedNotifications;
        }

        // Getters
        public long getTotalNotifications() { return totalNotifications; }
        public long getPendingNotifications() { return pendingNotifications; }
        public long getSentNotifications() { return sentNotifications; }
        public long getDeliveredNotifications() { return deliveredNotifications; }
        public long getReadNotifications() { return readNotifications; }
        public long getFailedNotifications() { return failedNotifications; }

        /**
         * Вычисляет процент доставленных уведомлений
         */
        public double getDeliveryRate() {
            if (totalNotifications == 0) return 0.0;
            return (double) (sentNotifications + deliveredNotifications + readNotifications) / totalNotifications * 100;
        }

        /**
         * Вычисляет процент неудавшихся уведомлений
         */
        public double getFailureRate() {
            if (totalNotifications == 0) return 0.0;
            return (double) failedNotifications / totalNotifications * 100;
        }
    }

    // Базовые классы для фильтрации

    /**
     * Базовый класс для критериев фильтрации
     */
    public static abstract class BaseFilterCriteria {
        private Boolean activeOnly;
        private LocalDateTime registeredAfter;
        private LocalDateTime registeredBefore;

        // Getters and setters
        public Boolean getActiveOnly() { return activeOnly; }
        public void setActiveOnly(Boolean activeOnly) { this.activeOnly = activeOnly; }

        public LocalDateTime getRegisteredAfter() { return registeredAfter; }
        public void setRegisteredAfter(LocalDateTime registeredAfter) { this.registeredAfter = registeredAfter; }

        public LocalDateTime getRegisteredBefore() { return registeredBefore; }
        public void setRegisteredBefore(LocalDateTime registeredBefore) { this.registeredBefore = registeredBefore; }
    }

    /**
     * Класс для критериев фильтрации студентов
     */
    public static class StudentFilterCriteria extends BaseFilterCriteria {
        private Boolean hasAssignedTeacher;
        private Integer minRemainingLessons;
        private Integer maxRemainingLessons;

        // Getters and setters
        public Boolean getHasAssignedTeacher() { return hasAssignedTeacher; }
        public void setHasAssignedTeacher(Boolean hasAssignedTeacher) { this.hasAssignedTeacher = hasAssignedTeacher; }

        public Integer getMinRemainingLessons() { return minRemainingLessons; }
        public void setMinRemainingLessons(Integer minRemainingLessons) { this.minRemainingLessons = minRemainingLessons; }

        public Integer getMaxRemainingLessons() { return maxRemainingLessons; }
        public void setMaxRemainingLessons(Integer maxRemainingLessons) { this.maxRemainingLessons = maxRemainingLessons; }
    }

    /**
     * Класс для критериев фильтрации преподавателей
     */
    public static class TeacherFilterCriteria extends BaseFilterCriteria {
        private Boolean hasAssignedStudents;

        // Getters and setters
        public Boolean getHasAssignedStudents() { return hasAssignedStudents; }
        public void setHasAssignedStudents(Boolean hasAssignedStudents) { this.hasAssignedStudents = hasAssignedStudents; }
    }

    /**
     * Класс для критериев фильтрации менеджеров
     */
    public static class ManagerFilterCriteria extends BaseFilterCriteria {
        // Дополнительные критерии фильтрации для менеджеров могут быть добавлены здесь
    }

    /**
     * Класс для критериев фильтрации администраторов
     */
    public static class AdminFilterCriteria extends BaseFilterCriteria {
        // Дополнительные критерии фильтрации для администраторов могут быть добавлены здесь
    }
}