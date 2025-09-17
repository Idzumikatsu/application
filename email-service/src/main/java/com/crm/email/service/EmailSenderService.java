package com.crm.email.service;

import com.crm.email.config.EmailProperties;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailSenderService {

    private static final Logger log = LoggerFactory.getLogger(EmailSenderService.class);

    private final JavaMailSender mailSender;
    private final EmailTemplateService templateService;
    private final EmailProperties emailProperties;

    public EmailSenderService(JavaMailSender mailSender,
                              EmailTemplateService templateService,
                              EmailProperties emailProperties) {
        this.mailSender = mailSender;
        this.templateService = templateService;
        this.emailProperties = emailProperties;
    }

    public void sendEmail(String recipientEmail,
                          String subject,
                          String templateName,
                          Map<String, Object> variables) throws MessagingException {

        String body = templateService.render(templateName, variables);
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                StandardCharsets.UTF_8.name());
        helper.setTo(recipientEmail);
        helper.setSubject(subject);
        setFrom(helper);
        helper.setText(body, true);
        mailSender.send(mimeMessage);
        log.info("Email sent to {} with template {}", recipientEmail, templateName);
    }

    private void setFrom(MimeMessageHelper helper) throws MessagingException {
        String address = emailProperties.getAddress();
        String name = emailProperties.getName();
        try {
            if (name != null && !name.isBlank()) {
                helper.setFrom(address, name);
            } else {
                helper.setFrom(address);
            }
        } catch (UnsupportedEncodingException e) {
            helper.setFrom(address);
            log.warn("Could not encode sender name '{}'. Falling back to address only.", name);
        }
    }
}
