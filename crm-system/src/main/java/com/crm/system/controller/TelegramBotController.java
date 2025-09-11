package com.crm.system.controller;

import com.crm.system.dto.TelegramBotDto;
import com.crm.system.model.TelegramBot;
import com.crm.system.service.TelegramBotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class TelegramBotController {

    @Autowired
    private TelegramBotService telegramBotService;

    @GetMapping("/telegram-bots")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramBotDto>> getAllTelegramBots(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramBot> botPage = telegramBotService.findAll(pageable);

        List<TelegramBotDto> botDtos = botPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramBotDto> dtoPage = new PageImpl<>(botDtos, pageable, botPage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/telegram-bots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> getTelegramBotById(@PathVariable Long id) {
        TelegramBot telegramBot = telegramBotService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram bot not found with id: " + id));
        return ResponseEntity.ok(convertToDto(telegramBot));
    }

    @PostMapping("/telegram-bots")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> createTelegramBot(@Valid @RequestBody TelegramBotDto telegramBotDto) {
        TelegramBot telegramBot = new TelegramBot(
                telegramBotDto.getBotToken(),
                telegramBotDto.getBotUsername(),
                telegramBotDto.getBotName()
        );
        telegramBot.setDescription(telegramBotDto.getDescription());
        telegramBot.setIsActive(telegramBotDto.getIsActive());

        TelegramBot savedBot = telegramBotService.saveTelegramBot(telegramBot);
        return ResponseEntity.ok(convertToDto(savedBot));
    }

    @PutMapping("/telegram-bots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> updateTelegramBot(
            @PathVariable Long id,
            @Valid @RequestBody TelegramBotDto telegramBotDto) {

        TelegramBot telegramBot = telegramBotService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram bot not found with id: " + id));

        telegramBot.setBotToken(telegramBotDto.getBotToken());
        telegramBot.setBotUsername(telegramBotDto.getBotUsername());
        telegramBot.setBotName(telegramBotDto.getBotName());
        telegramBot.setDescription(telegramBotDto.getDescription());
        telegramBot.setIsActive(telegramBotDto.getIsActive());
        telegramBot.setUpdatedAt(LocalDateTime.now());

        TelegramBot updatedBot = telegramBotService.updateTelegramBot(telegramBot);
        return ResponseEntity.ok(convertToDto(updatedBot));
    }

    @DeleteMapping("/telegram-bots/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteTelegramBot(@PathVariable Long id) {
        if (!telegramBotService.findById(id).isPresent()) {
            throw new RuntimeException("Telegram bot not found with id: " + id);
        }
        telegramBotService.deleteTelegramBot(id);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/telegram-bots/{id}/activate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> activateTelegramBot(@PathVariable Long id) {
        telegramBotService.activateBot(id);
        TelegramBot activatedBot = telegramBotService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram bot not found with id: " + id));
        return ResponseEntity.ok(convertToDto(activatedBot));
    }

    @PostMapping("/telegram-bots/{id}/deactivate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> deactivateTelegramBot(@PathVariable Long id) {
        telegramBotService.deactivateBot(id);
        TelegramBot deactivatedBot = telegramBotService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram bot not found with id: " + id));
        return ResponseEntity.ok(convertToDto(deactivatedBot));
    }

    @GetMapping("/telegram-bots/active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TelegramBotDto>> getActiveTelegramBots() {
        List<TelegramBot> activeBots = telegramBotService.findActiveBots();
        List<TelegramBotDto> botDtos = activeBots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(botDtos);
    }

    @GetMapping("/telegram-bots/inactive")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TelegramBotDto>> getInactiveTelegramBots() {
        List<TelegramBot> inactiveBots = telegramBotService.findInactiveBots();
        List<TelegramBotDto> botDtos = inactiveBots.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(botDtos);
    }

    @GetMapping("/telegram-bots/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramBotDto>> searchTelegramBots(
            @RequestParam String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramBot> botPage = telegramBotService.searchBots(term, pageable);

        List<TelegramBotDto> botDtos = botPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramBotDto> dtoPage = new PageImpl<>(botDtos, pageable, botPage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/telegram-bots/active/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramBotDto>> searchActiveTelegramBots(
            @RequestParam String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramBot> botPage = telegramBotService.searchActiveBots(term, pageable);

        List<TelegramBotDto> botDtos = botPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramBotDto> dtoPage = new PageImpl<>(botDtos, pageable, botPage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/telegram-bots/inactive/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<TelegramBotDto>> searchInactiveTelegramBots(
            @RequestParam String term,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        Page<TelegramBot> botPage = telegramBotService.searchInactiveBots(term, pageable);

        List<TelegramBotDto> botDtos = botPage.getContent().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        Page<TelegramBotDto> dtoPage = new PageImpl<>(botDtos, pageable, botPage.getTotalElements());
        return ResponseEntity.ok(dtoPage);
    }

    @GetMapping("/telegram-bots/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getTelegramBotsStats() {
        Long totalBots = telegramBotService.getTotalBotsCount();
        Long activeBots = telegramBotService.getActiveBotsCount();
        Long inactiveBots = telegramBotService.getInactiveBotsCount();

        String stats = String.format("Total bots: %d, Active bots: %d, Inactive bots: %d", 
                                   totalBots, activeBots, inactiveBots);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/telegram-bots/{botUsername}/by-username")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> getTelegramBotByUsername(@PathVariable String botUsername) {
        TelegramBot telegramBot = telegramBotService.findByBotUsername(botUsername)
                .orElseThrow(() -> new RuntimeException("Telegram bot not found with username: " + botUsername));
        return ResponseEntity.ok(convertToDto(telegramBot));
    }

    @GetMapping("/telegram-bots/name/{botName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> getTelegramBotByName(@PathVariable String botName) {
        TelegramBot telegramBot = telegramBotService.findByBotName(botName)
                .orElseThrow(() -> new RuntimeException("Telegram bot not found with name: " + botName));
        return ResponseEntity.ok(convertToDto(telegramBot));
    }

    @GetMapping("/telegram-bots/token/{botToken}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> getTelegramBotByToken(@PathVariable String botToken) {
        TelegramBot telegramBot = telegramBotService.findByBotToken(botToken)
                .orElseThrow(() -> new RuntimeException("Telegram bot not found with token: " + botToken));
        return ResponseEntity.ok(convertToDto(telegramBot));
    }

    @GetMapping("/telegram-bots/active/{botUsername}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> getActiveTelegramBotByUsername(@PathVariable String botUsername) {
        TelegramBot telegramBot = telegramBotService.findActiveBotByBotUsername(botUsername)
                .orElseThrow(() -> new RuntimeException("Active Telegram bot not found with username: " + botUsername));
        return ResponseEntity.ok(convertToDto(telegramBot));
    }

    @GetMapping("/telegram-bots/active/name/{botName}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> getActiveTelegramBotByName(@PathVariable String botName) {
        TelegramBot telegramBot = telegramBotService.findActiveBotByBotName(botName)
                .orElseThrow(() -> new RuntimeException("Active Telegram bot not found with name: " + botName));
        return ResponseEntity.ok(convertToDto(telegramBot));
    }

    @GetMapping("/telegram-bots/active/token/{botToken}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> getActiveTelegramBotByToken(@PathVariable String botToken) {
        TelegramBot telegramBot = telegramBotService.findActiveBotByBotToken(botToken)
                .orElseThrow(() -> new RuntimeException("Active Telegram bot not found with token: " + botToken));
        return ResponseEntity.ok(convertToDto(telegramBot));
    }

    @PutMapping("/telegram-bots/{id}/credentials")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> updateTelegramBotCredentials(
            @PathVariable Long id,
            @RequestParam String token,
            @RequestParam String username,
            @RequestParam String name) {

        telegramBotService.updateBotCredentials(id, token, username, name);
        TelegramBot updatedBot = telegramBotService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram bot not found with id: " + id));
        return ResponseEntity.ok(convertToDto(updatedBot));
    }

    @PutMapping("/telegram-bots/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> updateTelegramBotStatus(
            @PathVariable Long id,
            @RequestParam Boolean isActive) {

        telegramBotService.updateBotStatus(id, isActive);
        TelegramBot updatedBot = telegramBotService.findById(id)
                .orElseThrow(() -> new RuntimeException("Telegram bot not found with id: " + id));
        return ResponseEntity.ok(convertToDto(updatedBot));
    }

    @GetMapping("/telegram-bots/{id}/info")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getTelegramBotInfo(@PathVariable Long id) {
        String botInfo = telegramBotService.getBotInfo(id);
        return ResponseEntity.ok(botInfo);
    }

    @GetMapping("/telegram-bots/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getTelegramBotStatus(@PathVariable Long id) {
        String botStatus = telegramBotService.getBotStatus(id);
        return ResponseEntity.ok(botStatus);
    }

    @PostMapping("/telegram-bots/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TelegramBotDto> registerNewTelegramBot(
            @RequestParam String botToken,
            @RequestParam String botUsername,
            @RequestParam String botName,
            @RequestParam(required = false) String description) {

        TelegramBot registeredBot = telegramBotService.registerNewBot(botToken, botUsername, botName, description);
        return ResponseEntity.ok(convertToDto(registeredBot));
    }

    @DeleteMapping("/telegram-bots/unregister/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> unregisterTelegramBot(@PathVariable Long id) {
        if (!telegramBotService.findById(id).isPresent()) {
            throw new RuntimeException("Telegram bot not found with id: " + id);
        }
        telegramBotService.unregisterBot(id);
        return ResponseEntity.ok().build();
    }

    private TelegramBotDto convertToDto(TelegramBot telegramBot) {
        TelegramBotDto dto = new TelegramBotDto();
        dto.setId(telegramBot.getId());
        dto.setBotToken(telegramBot.getBotToken());
        dto.setBotUsername(telegramBot.getBotUsername());
        dto.setBotName(telegramBot.getBotName());
        dto.setIsActive(telegramBot.getIsActive());
        dto.setDescription(telegramBot.getDescription());
        if (telegramBot.getCreatedAt() != null) {
            dto.setCreatedAt(telegramBot.getCreatedAt());
        }
        if (telegramBot.getUpdatedAt() != null) {
            dto.setUpdatedAt(telegramBot.getUpdatedAt());
        }
        return dto;
    }
}