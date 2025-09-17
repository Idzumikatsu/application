package com.crm.system.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "email.gateway")
public class EmailGatewayProperties {

    /** Base URL of the email service (without trailing slash). */
    private String baseUrl = "http://email-service:8081/api/emails";

    /** Frontend login URL used in welcome emails. */
    private String frontendLoginUrl = "https://crm-synergy.ru/login";

    /** Default support email address included in templates. */
    private String supportEmail = "support@crm-synergy.ru";

    /** Link to Telegram bot instructions. */
    private String telegramBotUrl = "https://t.me/crm_english_school_bot";

    /** Optional API key for authentication (not used yet). */
    private String apiKey;

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getFrontendLoginUrl() {
        return frontendLoginUrl;
    }

    public void setFrontendLoginUrl(String frontendLoginUrl) {
        this.frontendLoginUrl = frontendLoginUrl;
    }

    public String getSupportEmail() {
        return supportEmail;
    }

    public void setSupportEmail(String supportEmail) {
        this.supportEmail = supportEmail;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
    }

    public String getTelegramBotUrl() {
        return telegramBotUrl;
    }

    public void setTelegramBotUrl(String telegramBotUrl) {
        this.telegramBotUrl = telegramBotUrl;
    }
}
