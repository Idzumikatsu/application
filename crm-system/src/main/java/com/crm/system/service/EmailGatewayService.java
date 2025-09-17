package com.crm.system.service;

import com.crm.system.config.EmailGatewayProperties;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class EmailGatewayService {

    private static final Logger log = LoggerFactory.getLogger(EmailGatewayService.class);

    private final EmailGatewayProperties properties;
    private final RestTemplate restTemplate;

    public EmailGatewayService(EmailGatewayProperties properties) {
        this.properties = properties;
        this.restTemplate = new RestTemplate();
    }

    public void sendWelcomeEmail(User user, String plainPassword) {
        if (user == null) {
            return;
        }
        if (plainPassword == null || plainPassword.isBlank()) {
            log.debug("Skipped welcome email: empty password for user {}", user.getEmail());
            return;
        }
        if (properties.getBaseUrl() == null || properties.getBaseUrl().isBlank()) {
            log.debug("Skipped welcome email: email gateway base URL not configured");
            return;
        }
        try {
            Map<String, Object> payload = new HashMap<>();
            payload.put("recipientEmail", user.getEmail());
            payload.put("recipientName", user.getFullName());
            payload.put("role", user.getRole() != null ? user.getRole().name() : UserRole.STUDENT.name());
            payload.put("temporaryPassword", plainPassword);
            payload.put("loginUrl", properties.getFrontendLoginUrl());
            payload.put("supportEmail", properties.getSupportEmail());
            payload.put("telegramBotUrl", properties.getTelegramBotUrl());

            sendPost("/welcome", payload);
        } catch (Exception ex) {
            log.warn("Failed to send welcome email for user {}: {}", user.getEmail(), ex.getMessage());
        }
    }

    private void sendPost(String path, Map<String, Object> body) {
        String url = properties.getBaseUrl();
        if (!url.endsWith("/")) {
            url += "/";
        }
        url += path.startsWith("/") ? path.substring(1) : path;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        if (properties.getApiKey() != null) {
            headers.set("X-API-Key", properties.getApiKey());
        }

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, requestEntity, String.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            log.debug("Email gateway response: {} - {}", response.getStatusCode(), response.getBody());
        } else {
            log.warn("Email gateway responded with status {} and body {}", response.getStatusCode(), response.getBody());
        }
    }
}
