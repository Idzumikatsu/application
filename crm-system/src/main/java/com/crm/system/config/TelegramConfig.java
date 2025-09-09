package com.crm.system.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import javax.annotation.PostConstruct;
import java.util.logging.Logger;

@Configuration
@PropertySource("classpath:application.properties")
public class TelegramConfig {

    private static final Logger logger = Logger.getLogger(TelegramConfig.class.getName());

    @Autowired
    private Environment environment;

    @Value("${telegram.bot.token:}")
    private String botToken;

    @Value("${telegram.bot.username:crm_english_school_bot}")
    private String botUsername;

    @Value("${telegram.bot.enabled:false}")
    private boolean enabled;

    @PostConstruct
    public void validateConfig() {
        if (enabled) {
            validateBotToken();
            logger.info("Telegram bot configuration loaded successfully. Bot username: " + botUsername);
        } else {
            logger.info("Telegram bot is disabled. Set 'telegram.bot.enabled=true' to enable it.");
        }
    }

    private void validateBotToken() {
        if (botToken == null || botToken.trim().isEmpty() || botToken.equals("YOUR_BOT_TOKEN_HERE")) {
            String errorMessage = "Telegram bot token is not configured properly. " +
                    "Please set 'telegram.bot.token' in application.properties or environment variable TELEGRAM_BOT_TOKEN. " +
                    "Current environment: " + getEnvironmentProfile();
            
            logger.severe(errorMessage);
            enabled = false;
            
            // В production среде можно выбрасывать исключение
            if (isProductionEnvironment()) {
                throw new IllegalStateException(errorMessage);
            }
        }
    }

    private String getEnvironmentProfile() {
        String[] activeProfiles = environment.getActiveProfiles();
        if (activeProfiles.length == 0) {
            return "default";
        }
        return String.join(", ", activeProfiles);
    }

    private boolean isProductionEnvironment() {
        String[] activeProfiles = environment.getActiveProfiles();
        for (String profile : activeProfiles) {
            if (profile.equalsIgnoreCase("prod") || profile.equalsIgnoreCase("production")) {
                return true;
            }
        }
        return false;
    }

    public String getBotToken() {
        return botToken;
    }

    public String getBotUsername() {
        return botUsername;
    }

    public boolean isEnabled() {
        return enabled;
    }
}