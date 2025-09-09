package com.crm.system.service;

import com.crm.system.model.TelegramMessage;
import com.crm.system.repository.TelegramMessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class MessageRetryService {

    @Autowired
    private TelegramMessageRepository telegramMessageRepository;

    @Autowired
    private TelegramBotService telegramBotService;

    /**
     * Ежечасная проверка сообщений для повторной отправки
     */
    @Scheduled(cron = "0 0 * * * *") // Каждый час
    public void retryFailedMessages() {
        List<TelegramMessage> retryMessages = telegramMessageRepository.findByDeliveryStatus(TelegramMessage.DeliveryStatus.RETRY_PENDING);
        
        for (TelegramMessage message : retryMessages) {
            if (message.canRetry()) {
                try {
                    // Попытка повторной отправки
                    telegramBotService.sendMessage(message);
                    message.markAsSent();
                    telegramMessageRepository.save(message);
                } catch (Exception e) {
                    // Если снова ошибка, увеличиваем счетчик и обновляем статус
                    message.incrementRetryCount();
                    if (message.canRetry()) {
                        message.markForRetry();
                    } else {
                        message.markAsFailed("Превышено максимальное количество попыток отправки: " + e.getMessage());
                    }
                    telegramMessageRepository.save(message);
                }
            }
        }
    }

    /**
     * Ежедневная очистка старых неудачных сообщений
     */
    @Scheduled(cron = "0 0 2 * * *") // Каждый день в 02:00
    public void cleanupOldFailedMessages() {
        LocalDateTime weekAgo = LocalDateTime.now().minusDays(7);
        List<TelegramMessage> oldFailedMessages = telegramMessageRepository.findByDeliveryStatusAndCreatedAtBefore(
            TelegramMessage.DeliveryStatus.FAILED, weekAgo);
        
        telegramMessageRepository.deleteAll(oldFailedMessages);
    }
}