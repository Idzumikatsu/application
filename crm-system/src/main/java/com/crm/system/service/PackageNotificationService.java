package com.crm.system.service;

import com.crm.system.model.LessonPackage;
import com.crm.system.model.Student;
import com.crm.system.model.TelegramMessage;
import com.crm.system.repository.LessonPackageRepository;
import com.crm.system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.logging.Logger;

@Service
public class PackageNotificationService {

    private static final Logger logger = Logger.getLogger(PackageNotificationService.class.getName());

    @Autowired
    private LessonPackageRepository lessonPackageRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TelegramNotificationService telegramNotificationService;

    /**
     * Проверяет пакеты, которые скоро закончатся (менее 5 уроков осталось)
     * и отправляет уведомления студентам и менеджерам
     */
    @Scheduled(cron = "0 0 9 * * *") // Каждый день в 9:00
    public void checkPackagesEndingSoon() {
        logger.info("Checking for packages ending soon...");
        
        List<LessonPackage> packages = lessonPackageRepository.findPackagesWithLowRemainingLessons(5);
        
        for (LessonPackage lessonPackage : packages) {
            try {
                sendPackageEndingSoonNotification(lessonPackage);
            } catch (Exception e) {
                logger.severe("Failed to send notification for package " + lessonPackage.getId() + ": " + e.getMessage());
            }
        }
    }

    /**
     * Проверяет просроченные пакеты (истек срок действия)
     */
    @Scheduled(cron = "0 0 10 * * *") // Каждый день в 10:00
    public void checkExpiredPackages() {
        logger.info("Checking for expired packages...");
        
        List<LessonPackage> packages = lessonPackageRepository.findExpiredPackages(LocalDateTime.now());
        
        for (LessonPackage lessonPackage : packages) {
            try {
                sendPackageExpiredNotification(lessonPackage);
            } catch (Exception e) {
                logger.severe("Failed to send expired notification for package " + lessonPackage.getId() + ": " + e.getMessage());
            }
        }
    }

    /**
     * Отправляет уведомление о том, что пакет скоро закончится
     */
    private void sendPackageEndingSoonNotification(LessonPackage lessonPackage) {
        Student student = studentRepository.findById(lessonPackage.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found: " + lessonPackage.getStudentId()));

        if (student.getTelegramChatId() != null) {
            String message = String.format(
                "📚 Ваш пакет уроков \"%s\" скоро закончится!\n" +
                "Осталось уроков: %d из %d\n" +
                "Срок действия: до %s\n\n" +
                "Рекомендуем приобрести новый пакет заранее!",
                lessonPackage.getName(),
                lessonPackage.getRemainingLessons(),
                lessonPackage.getTotalLessons(),
                lessonPackage.getExpirationDate().toLocalDate()
            );

            telegramNotificationService.sendNotification(
                student.getTelegramChatId(),
                student.getId(),
                TelegramMessage.RecipientType.STUDENT,
                message,
                TelegramMessage.MessageType.PACKAGE_ENDING_SOON
            );
        }

        // Также отправляем уведомление менеджерам
        String managerMessage = String.format(
            "⚠️ Пакет студента %s скоро закончится!\n" +
            "Студент: %s %s\n" +
            "Пакет: %s\n" +
            "Осталось уроков: %d из %d\n" +
            "Срок действия: до %s",
            student.getFullName(),
            student.getFirstName(),
            student.getLastName(),
            lessonPackage.getName(),
            lessonPackage.getRemainingLessons(),
            lessonPackage.getTotalLessons(),
            lessonPackage.getExpirationDate().toLocalDate()
        );

        // Отправляем всем активным менеджерам
        telegramNotificationService.sendNotificationToManagers(
            managerMessage,
            TelegramMessage.MessageType.PACKAGE_ENDING_SOON
        );
    }

    /**
     * Отправляет уведомление о просроченном пакете
     */
    private void sendPackageExpiredNotification(LessonPackage lessonPackage) {
        Student student = studentRepository.findById(lessonPackage.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found: " + lessonPackage.getStudentId()));

        if (student.getTelegramChatId() != null) {
            String message = String.format(
                "⏰ Ваш пакет уроков \"%s\" истек!\n" +
                "Дата истечения: %s\n" +
                "Осталось неиспользованных уроков: %d\n\n" +
                "Пожалуйста, приобретите новый пакет для продолжения занятий.",
                lessonPackage.getName(),
                lessonPackage.getExpirationDate().toLocalDate(),
                lessonPackage.getRemainingLessons()
            );

            telegramNotificationService.sendNotification(
                student.getTelegramChatId(),
                student.getId(),
                TelegramMessage.RecipientType.STUDENT,
                message,
                TelegramMessage.MessageType.PACKAGE_EXPIRED
            );
        }

        // Уведомление менеджерам
        String managerMessage = String.format(
            "❌ Пакет студента %s истек!\n" +
            "Студент: %s %s\n" +
            "Пакет: %s\n" +
            "Осталось неиспользованных уроков: %d\n" +
            "Дата истечения: %s",
            student.getFullName(),
            student.getFirstName(),
            student.getLastName(),
            lessonPackage.getName(),
            lessonPackage.getRemainingLessons(),
            lessonPackage.getExpirationDate().toLocalDate()
        );

        telegramNotificationService.sendNotificationToManagers(
            managerMessage,
            TelegramMessage.MessageType.PACKAGE_EXPIRED
        );
    }

    /**
     * Проверяет конкретный пакет и отправляет уведомления при необходимости
     */
    public void checkAndNotifyForPackage(LessonPackage lessonPackage) {
        if (lessonPackage.getRemainingLessons() <= 5 && lessonPackage.getRemainingLessons() > 0) {
            sendPackageEndingSoonNotification(lessonPackage);
        }
        
        if (lessonPackage.getExpirationDate().isBefore(LocalDateTime.now()) && lessonPackage.getRemainingLessons() > 0) {
            sendPackageExpiredNotification(lessonPackage);
        }
    }
}