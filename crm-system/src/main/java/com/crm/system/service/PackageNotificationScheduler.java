package com.crm.system.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
public class PackageNotificationScheduler {

    @Autowired
    private TelegramNotificationService telegramNotificationService;

    /**
     * Ежедневная проверка пакетов уроков в 09:00 утра
     */
    @Scheduled(cron = "0 0 9 * * *") // Каждый день в 09:00
    public void checkPackagesDaily() {
        telegramNotificationService.checkAndSendPackageNotifications();
    }

    /**
     * Еженедельная проверка пакетов уроков в понедельник в 10:00
     */
    @Scheduled(cron = "0 0 10 * * MON") // Каждый понедельник в 10:00
    public void checkPackagesWeekly() {
        telegramNotificationService.checkAndSendPackageNotifications();
    }
}