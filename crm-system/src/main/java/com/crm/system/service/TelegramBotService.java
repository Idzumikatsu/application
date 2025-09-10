package com.crm.system.service;

import com.crm.system.model.TelegramBot;
import com.crm.system.model.TelegramMessage;
import com.crm.system.repository.TelegramBotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TelegramBotService {

    @Autowired
    private TelegramBotRepository telegramBotRepository;

    @Autowired
    private TelegramNotificationService telegramNotificationService;

    public Optional<TelegramBot> findById(Long id) {
        return telegramBotRepository.findById(id);
    }

    public void sendMessage(Long chatId, Long recipientId, TelegramMessage.RecipientType recipientType,
                          String messageText, TelegramMessage.MessageType messageType) {
        telegramNotificationService.sendNotification(chatId, recipientId, recipientType, messageText, messageType);
    }

    public void sendMessage(TelegramMessage message) {
        telegramNotificationService.sendNotification(
            message.getChatId(),
            message.getRecipientId(),
            message.getRecipientType(),
            message.getMessageText(),
            message.getMessageType()
        );
    }

    public Optional<TelegramBot> findByBotUsername(String botUsername) {
        return telegramBotRepository.findByBotUsername(botUsername);
    }

    public Optional<TelegramBot> findByBotName(String botName) {
        return telegramBotRepository.findByBotName(botName);
    }

    public Optional<TelegramBot> findByBotToken(String botToken) {
        return telegramBotRepository.findByBotToken(botToken);
    }

    public Optional<TelegramBot> findActiveBotByBotUsername(String botUsername) {
        return telegramBotRepository.findActiveBotByBotUsername(botUsername);
    }

    public Optional<TelegramBot> findActiveBotByBotName(String botName) {
        return telegramBotRepository.findActiveBotByBotName(botName);
    }

    public Optional<TelegramBot> findActiveBotByBotToken(String botToken) {
        return telegramBotRepository.findActiveBotByBotToken(botToken);
    }

    public TelegramBot saveTelegramBot(TelegramBot telegramBot) {
        return telegramBotRepository.save(telegramBot);
    }

    public TelegramBot createTelegramBot(String botToken, String botUsername, String botName) {
        TelegramBot telegramBot = new TelegramBot(botToken, botUsername, botName);
        return telegramBotRepository.save(telegramBot);
    }

    public TelegramBot createTelegramBot(String botToken, String botUsername, String botName, String description) {
        TelegramBot telegramBot = new TelegramBot(botToken, botUsername, botName);
        telegramBot.setDescription(description);
        return telegramBotRepository.save(telegramBot);
    }

    public List<TelegramBot> findAll() {
        return telegramBotRepository.findAll();
    }

    public Page<TelegramBot> findAll(Pageable pageable) {
        return telegramBotRepository.findAll(pageable);
    }

    public TelegramBot updateTelegramBot(TelegramBot telegramBot) {
        return telegramBotRepository.save(telegramBot);
    }

    public void deleteTelegramBot(Long id) {
        telegramBotRepository.deleteById(id);
    }

    public List<TelegramBot> findActiveBots() {
        return telegramBotRepository.findActiveBots();
    }

    public List<TelegramBot> findInactiveBots() {
        return telegramBotRepository.findInactiveBots();
    }

    public List<TelegramBot> findByIsActive(Boolean isActive) {
        return telegramBotRepository.findByIsActive(isActive);
    }

    public List<TelegramBot> findByDescriptionContaining(String description) {
        return telegramBotRepository.findByDescriptionContaining(description);
    }

    public List<TelegramBot> findByBotUsernameContaining(String botUsername) {
        return telegramBotRepository.findByBotUsernameContaining(botUsername);
    }

    public List<TelegramBot> findByBotNameContaining(String botName) {
        return telegramBotRepository.findByBotNameContaining(botName);
    }

    public List<TelegramBot> findActiveBotsByDescriptionContaining(String description) {
        return telegramBotRepository.findActiveBotsByDescriptionContaining(description);
    }

    public List<TelegramBot> findActiveBotsByBotUsernameContaining(String botUsername) {
        return telegramBotRepository.findActiveBotsByBotUsernameContaining(botUsername);
    }

    public List<TelegramBot> findActiveBotsByBotNameContaining(String botName) {
        return telegramBotRepository.findActiveBotsByBotNameContaining(botName);
    }

    public List<TelegramBot> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return telegramBotRepository.findByCreatedAtBetween(startDate, endDate);
    }

    public List<TelegramBot> findActiveBotsByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return telegramBotRepository.findActiveBotsByCreatedAtBetween(startDate, endDate);
    }

    public List<TelegramBot> findInactiveBotsByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return telegramBotRepository.findInactiveBotsByCreatedAtBetween(startDate, endDate);
    }

    public List<TelegramBot> findByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return telegramBotRepository.findByUpdatedAtBetween(startDate, endDate);
    }

    public List<TelegramBot> findActiveBotsByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return telegramBotRepository.findActiveBotsByUpdatedAtBetween(startDate, endDate);
    }

    public List<TelegramBot> findInactiveBotsByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate) {
        return telegramBotRepository.findInactiveBotsByUpdatedAtBetween(startDate, endDate);
    }

    public Long countActiveBots() {
        return telegramBotRepository.countActiveBots();
    }

    public Long countInactiveBots() {
        return telegramBotRepository.countInactiveBots();
    }

    public Page<TelegramBot> findByIsActive(Boolean isActive, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findByIsActive(isActive);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findByDescriptionContaining(String description, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findByDescriptionContaining(description);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findByBotUsernameContaining(String botUsername, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findByBotUsernameContaining(botUsername);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findByBotNameContaining(String botName, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findByBotNameContaining(botName);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findActiveBotsByDescriptionContaining(String description, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findActiveBotsByDescriptionContaining(description);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findActiveBotsByBotUsernameContaining(String botUsername, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findActiveBotsByBotUsernameContaining(botUsername);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findActiveBotsByBotNameContaining(String botName, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findActiveBotsByBotNameContaining(botName);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findByCreatedAtBetween(startDate, endDate);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findActiveBotsByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findActiveBotsByCreatedAtBetween(startDate, endDate);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findInactiveBotsByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findInactiveBotsByCreatedAtBetween(startDate, endDate);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findByUpdatedAtBetween(startDate, endDate);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findActiveBotsByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findActiveBotsByUpdatedAtBetween(startDate, endDate);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public Page<TelegramBot> findInactiveBotsByUpdatedAtBetween(LocalDateTime startDate, LocalDateTime endDate, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findInactiveBotsByUpdatedAtBetween(startDate, endDate);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public void activateBot(Long id) {
        Optional<TelegramBot> botOpt = findById(id);
        if (botOpt.isPresent()) {
            TelegramBot bot = botOpt.get();
            bot.activate();
            telegramBotRepository.save(bot);
        }
    }

    public void deactivateBot(Long id) {
        Optional<TelegramBot> botOpt = findById(id);
        if (botOpt.isPresent()) {
            TelegramBot bot = botOpt.get();
            bot.deactivate();
            telegramBotRepository.save(bot);
        }
    }

    public boolean isBotActive(Long id) {
        return findById(id).map(TelegramBot::isActive).orElse(false);
    }

    public String getBotInfo(Long id) {
        return findById(id).map(TelegramBot::getBotInfo).orElse("Bot not found");
    }

    public String getBotStatus(Long id) {
        return findById(id).map(TelegramBot::getStatus).orElse("Unknown");
    }

    public void updateBotToken(Long id, String newToken) {
        Optional<TelegramBot> botOpt = findById(id);
        if (botOpt.isPresent()) {
            TelegramBot bot = botOpt.get();
            bot.setBotToken(newToken);
            telegramBotRepository.save(bot);
        }
    }

    public void updateBotUsername(Long id, String newUsername) {
        Optional<TelegramBot> botOpt = findById(id);
        if (botOpt.isPresent()) {
            TelegramBot bot = botOpt.get();
            bot.setBotUsername(newUsername);
            telegramBotRepository.save(bot);
        }
    }

    public void updateBotName(Long id, String newName) {
        Optional<TelegramBot> botOpt = findById(id);
        if (botOpt.isPresent()) {
            TelegramBot bot = botOpt.get();
            bot.setBotName(newName);
            telegramBotRepository.save(bot);
        }
    }

    public void updateBotDescription(Long id, String newDescription) {
        Optional<TelegramBot> botOpt = findById(id);
        if (botOpt.isPresent()) {
            TelegramBot bot = botOpt.get();
            bot.setDescription(newDescription);
            telegramBotRepository.save(bot);
        }
    }

    public void updateBotCredentials(Long id, String token, String username, String name) {
        Optional<TelegramBot> botOpt = findById(id);
        if (botOpt.isPresent()) {
            TelegramBot bot = botOpt.get();
            bot.setBotToken(token);
            bot.setBotUsername(username);
            bot.setBotName(name);
            telegramBotRepository.save(bot);
        }
    }

    public void updateBotStatus(Long id, Boolean isActive) {
        Optional<TelegramBot> botOpt = findById(id);
        if (botOpt.isPresent()) {
            TelegramBot bot = botOpt.get();
            bot.setIsActive(isActive);
            telegramBotRepository.save(bot);
        }
    }

    public TelegramBot registerNewBot(String botToken, String botUsername, String botName, String description) {
        TelegramBot telegramBot = new TelegramBot(botToken, botUsername, botName);
        telegramBot.setDescription(description);
        telegramBot.setIsActive(true);
        return telegramBotRepository.save(telegramBot);
    }

    public void unregisterBot(Long id) {
        telegramBotRepository.deleteById(id);
    }

    public List<TelegramBot> searchBots(String searchTerm) {
        return telegramBotRepository.findByBotNameContaining(searchTerm);
    }

    public Page<TelegramBot> searchBots(String searchTerm, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findByBotNameContaining(searchTerm);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public List<TelegramBot> searchActiveBots(String searchTerm) {
        return telegramBotRepository.findActiveBotsByBotNameContaining(searchTerm);
    }

    public Page<TelegramBot> searchActiveBots(String searchTerm, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findActiveBotsByBotNameContaining(searchTerm);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public List<TelegramBot> searchInactiveBots(String searchTerm) {
        return telegramBotRepository.findInactiveBotsByBotNameContaining(searchTerm);
    }

    public Page<TelegramBot> searchInactiveBots(String searchTerm, Pageable pageable) {
        List<TelegramBot> bots = telegramBotRepository.findInactiveBotsByBotNameContaining(searchTerm);
        return new PageImpl<>(bots, pageable, bots.size());
    }

    public List<TelegramBot> getAllBotsSortedByName() {
        Pageable pageable = PageRequest.of(0, 1000);
        Page<TelegramBot> botPage = telegramBotRepository.findAll(pageable);
        return botPage.getContent();
    }

    public List<TelegramBot> getActiveBotsSortedByName() {
        return telegramBotRepository.findActiveBots();
    }

    public List<TelegramBot> getInactiveBotsSortedByName() {
        return telegramBotRepository.findInactiveBots();
    }

    public Long getTotalBotsCount() {
        return telegramBotRepository.count();
    }

    public Long getActiveBotsCount() {
        return telegramBotRepository.countActiveBots();
    }

    public Long getInactiveBotsCount() {
        return telegramBotRepository.countInactiveBots();
    }
}