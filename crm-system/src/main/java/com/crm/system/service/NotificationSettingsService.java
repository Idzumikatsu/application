package com.crm.system.service;

import com.crm.system.model.NotificationSettings;
import com.crm.system.repository.NotificationSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NotificationSettingsService {

    @Autowired
    private NotificationSettingsRepository notificationSettingsRepository;

    /**
     * Получить настройки уведомлений для пользователя
     */
    public NotificationSettings getSettingsForUser(Long userId, NotificationSettings.UserType userType) {
        Optional<NotificationSettings> existingSettings = notificationSettingsRepository.findByUserIdAndUserType(userId, userType);
        
        if (existingSettings.isPresent()) {
            return existingSettings.get();
        } else {
            // Создаем настройки по умолчанию
            NotificationSettings defaultSettings = new NotificationSettings(userId, userType);
            return notificationSettingsRepository.save(defaultSettings);
        }
    }

    /**
     * Обновить настройки уведомлений
     */
    public NotificationSettings updateSettings(Long userId, NotificationSettings.UserType userType, 
                                             NotificationSettings newSettings) {
        Optional<NotificationSettings> existingSettings = notificationSettingsRepository.findByUserIdAndUserType(userId, userType);
        
        NotificationSettings settingsToUpdate;
        if (existingSettings.isPresent()) {
            settingsToUpdate = existingSettings.get();
        } else {
            settingsToUpdate = new NotificationSettings(userId, userType);
        }

        // Обновляем только разрешенные поля
        if (newSettings.getTelegramNotificationsEnabled() != null) {
            settingsToUpdate.setTelegramNotificationsEnabled(newSettings.getTelegramNotificationsEnabled());
        }
        if (newSettings.getEmailNotificationsEnabled() != null) {
            settingsToUpdate.setEmailNotificationsEnabled(newSettings.getEmailNotificationsEnabled());
        }
        if (newSettings.getLessonRemindersEnabled() != null) {
            settingsToUpdate.setLessonRemindersEnabled(newSettings.getLessonRemindersEnabled());
        }
        if (newSettings.getLessonStatusChangesEnabled() != null) {
            settingsToUpdate.setLessonStatusChangesEnabled(newSettings.getLessonStatusChangesEnabled());
        }
        if (newSettings.getPackageNotificationsEnabled() != null) {
            settingsToUpdate.setPackageNotificationsEnabled(newSettings.getPackageNotificationsEnabled());
        }
        if (newSettings.getGroupLessonNotificationsEnabled() != null) {
            settingsToUpdate.setGroupLessonNotificationsEnabled(newSettings.getGroupLessonNotificationsEnabled());
        }
        if (newSettings.getSystemNotificationsEnabled() != null) {
            settingsToUpdate.setSystemNotificationsEnabled(newSettings.getSystemNotificationsEnabled());
        }
        if (newSettings.getFeedbackRequestsEnabled() != null) {
            settingsToUpdate.setFeedbackRequestsEnabled(newSettings.getFeedbackRequestsEnabled());
        }
        if (newSettings.getReminderTimeBeforeLesson() != null) {
            settingsToUpdate.setReminderTimeBeforeLesson(newSettings.getReminderTimeBeforeLesson());
        }

        return notificationSettingsRepository.save(settingsToUpdate);
    }

    /**
     * Проверить, нужно ли отправлять уведомление через Telegram
     */
    public boolean shouldSendTelegramNotification(Long userId, NotificationSettings.UserType userType, 
                                                 com.crm.system.model.TelegramMessage.MessageType messageType) {
        NotificationSettings settings = getSettingsForUser(userId, userType);
        return settings.shouldSendTelegramNotification(messageType);
    }

    /**
     * Получить время напоминания для пользователя
     */
    public int getReminderTimeForUser(Long userId, NotificationSettings.UserType userType) {
        NotificationSettings settings = getSettingsForUser(userId, userType);
        return settings.getReminderTimeBeforeLesson();
    }

    /**
     * Отключить все уведомления для пользователя
     */
    public NotificationSettings disableAllNotifications(Long userId, NotificationSettings.UserType userType) {
        NotificationSettings settings = getSettingsForUser(userId, userType);
        settings.setTelegramNotificationsEnabled(false);
        settings.setEmailNotificationsEnabled(false);
        settings.setLessonRemindersEnabled(false);
        settings.setLessonStatusChangesEnabled(false);
        settings.setPackageNotificationsEnabled(false);
        settings.setGroupLessonNotificationsEnabled(false);
        settings.setSystemNotificationsEnabled(false);
        settings.setFeedbackRequestsEnabled(false);
        
        return notificationSettingsRepository.save(settings);
    }

    /**
     * Включить все уведомления для пользователя
     */
    public NotificationSettings enableAllNotifications(Long userId, NotificationSettings.UserType userType) {
        NotificationSettings settings = getSettingsForUser(userId, userType);
        settings.setTelegramNotificationsEnabled(true);
        settings.setEmailNotificationsEnabled(false); // Email по умолчанию выключен
        settings.setLessonRemindersEnabled(true);
        settings.setLessonStatusChangesEnabled(true);
        settings.setPackageNotificationsEnabled(true);
        settings.setGroupLessonNotificationsEnabled(true);
        settings.setSystemNotificationsEnabled(true);
        settings.setFeedbackRequestsEnabled(true);
        
        return notificationSettingsRepository.save(settings);
    }
}