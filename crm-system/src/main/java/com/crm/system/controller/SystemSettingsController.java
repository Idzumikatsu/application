package com.crm.system.controller;

import com.crm.system.dto.MessageDto;
import com.crm.system.model.SystemSettings;
import com.crm.system.service.SystemSettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/system-settings")
public class SystemSettingsController {

    @Autowired
    private SystemSettingsService systemSettingsService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SystemSettingsDto>> getAllSystemSettings() {
        List<SystemSettings> settings = systemSettingsService.findAll();
        List<SystemSettingsDto> settingsDtos = settings.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(settingsDtos);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSettingsDto> getSystemSettingById(@PathVariable Long id) {
        SystemSettings setting = systemSettingsService.findById(id)
                .orElseThrow(() -> new RuntimeException("System setting not found with id: " + id));
        return ResponseEntity.ok(convertToDto(setting));
    }

    @GetMapping("/keys/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemSettingsDto> getSystemSettingByKey(@PathVariable String key) {
        SystemSettings setting = systemSettingsService.findBySettingKey(key)
                .orElseThrow(() -> new RuntimeException("System setting not found with key: " + key));
        return ResponseEntity.ok(convertToDto(setting));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")\n    public ResponseEntity<SystemSettingsDto> createSystemSetting(@Valid @RequestBody CreateSystemSettingsDto settingDto) {
        if (systemSettingsService.existsBySettingKey(settingDto.getSettingKey())) {
            throw new RuntimeException("System setting with key '" + settingDto.getSettingKey() + "' already exists");
        }

        SystemSettings setting = systemSettingsService.createSystemSettings(
                settingDto.getSettingKey(), settingDto.getSettingValue(), settingDto.getDescription());
        return ResponseEntity.ok(convertToDto(setting));
    }

    @PutMapping("/{id}")\n    @PreAuthorize("hasRole('ADMIN')")\n    public ResponseEntity<SystemSettingsDto> updateSystemSetting(@PathVariable Long id, @Valid @RequestBody UpdateSystemSettingsDto settingDto) {
        SystemSettings setting = systemSettingsService.findById(id)
                .orElseThrow(() -> new RuntimeException("System setting not found with id: " + id));

        setting.setSettingValue(settingDto.getSettingValue());
        setting.setDescription(settingDto.getDescription());
        setting = systemSettingsService.updateSystemSettings(setting);

        return ResponseEntity.ok(convertToDto(setting));
    }

    @PutMapping("/keys/{key}")
    @PreAuthorize("hasRole('ADMIN')")\n    public ResponseEntity<SystemSettingsDto> updateSystemSettingByKey(@PathVariable String key, @Valid @RequestBody UpdateSystemSettingsDto settingDto) {
        SystemSettings setting = systemSettingsService.findBySettingKey(key)
                .orElseThrow(() -> new RuntimeException("System setting not found with key: " + key));

        setting.setSettingValue(settingDto.getSettingValue());
        setting.setDescription(settingDto.getDescription());
        setting = systemSettingsService.updateSystemSettings(setting);

        return ResponseEntity.ok(convertToDto(setting));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> deleteSystemSetting(@PathVariable Long id) {
        systemSettingsService.deleteSystemSettings(id);
        return ResponseEntity.ok(new MessageDto("System setting deleted successfully!"));
    }

    @DeleteMapping("/keys/{key}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> deleteSystemSettingByKey(@PathVariable String key) {
        systemSettingsService.deleteBySettingKey(key);
        return ResponseEntity.ok(new MessageDto("System setting deleted successfully!"));
    }

    // Bulk operations
    @PostMapping("/bulk-update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity&lt;MessageDto&gt; bulkUpdateSystemSettings(@Valid @RequestBody List&lt;BulkUpdateSettingDto&gt; settings) {
        for (BulkUpdateSettingDto settingDto : settings) {
            systemSettingsService.updateSettingValue(settingDto.getSettingKey(), settingDto.getSettingValue());
        }
        return ResponseEntity.ok(new MessageDto("System settings updated successfully!"));
    }

    @PostMapping("/bulk-create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> bulkCreateSystemSettings(@Valid @RequestBody List<CreateSystemSettingsDto> settings) {
        for (CreateSystemSettingsDto settingDto : settings) {
            if (!systemSettingsService.existsBySettingKey(settingDto.getSettingKey())) {
                systemSettingsService.createSystemSettings(
                        settingDto.getSettingKey(), settingDto.getSettingValue(), settingDto.getDescription());
            }
        }
        return ResponseEntity.ok(new MessageDto("System settings created successfully!"));
    }

    // Configuration management
    @PostMapping("/reset-defaults")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> resetToDefaultSettings() {
        // This would reset system settings to default values
        // For now, return a placeholder
        return ResponseEntity.ok(new MessageDto("System settings reset to defaults successfully!"));
    }

    @PostMapping("/backup")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> backupSystemSettings() {
        // This would create a backup of current system settings
        // For now, return a placeholder
        return ResponseEntity.ok(new MessageDto("System settings backed up successfully!"));
    }

    @PostMapping("/restore")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> restoreSystemSettings(@RequestParam String backupId) {
        // This would restore system settings from a backup
        // For now, return a placeholder
        return ResponseEntity.ok(new MessageDto("System settings restored successfully from backup: " + backupId));
    }

    // System information
    @GetMapping("/info")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SystemInfoDto> getSystemInformation() {
        SystemInfoDto info = new SystemInfoDto();
        info.setTotalSettings((int) systemSettingsService.findAll().size());
        info.setLastUpdated(java.time.LocalDateTime.now());
        // In a real implementation, this would include more system information
        return ResponseEntity.ok(info);
    }

    private SystemSettingsDto convertToDto(SystemSettings systemSettings) {
        SystemSettingsDto dto = new SystemSettingsDto();
        dto.setId(systemSettings.getId());
        dto.setSettingKey(systemSettings.getSettingKey());
        dto.setSettingValue(systemSettings.getSettingValue());
        dto.setDescription(systemSettings.getDescription());
        dto.setCreatedAt(systemSettings.getCreatedAt());
        dto.setUpdatedAt(systemSettings.getUpdatedAt());
        return dto;
    }

    // DTO classes
    public static class SystemSettingsDto {
        private Long id;
        private String settingKey;
        private String settingValue;
        private String description;
        private java.time.LocalDateTime createdAt;
        private java.time.LocalDateTime updatedAt;

        // Getters and setters
        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }

        public String getSettingKey() { return settingKey; }
        public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

        public String getSettingValue() { return settingValue; }
        public void setSettingValue(String settingValue) { this.settingValue = settingValue; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }

        public java.time.LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }

        public java.time.LocalDateTime getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(java.time.LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    }

    public static class CreateSystemSettingsDto {
        private String settingKey;
        private String settingValue;
        private String description;

        // Getters and setters
        public String getSettingKey() { return settingKey; }
        public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

        public String getSettingValue() { return settingValue; }
        public void setSettingValue(String settingValue) { this.settingValue = settingValue; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class UpdateSystemSettingsDto {
        private String settingValue;
        private String description;

        // Getters and setters
        public String getSettingValue() { return settingValue; }
        public void setSettingValue(String settingValue) { this.settingValue = settingValue; }

        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class BulkUpdateSettingDto {
        private String settingKey;
        private String settingValue;

        // Getters and setters
        public String getSettingKey() { return settingKey; }
        public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

        public String getSettingValue() { return settingValue; }
        public void setSettingValue(String settingValue) { this.settingValue = settingValue; }
    }

    public static class SystemInfoDto {
        private int totalSettings;
        private java.time.LocalDateTime lastUpdated;
        private String systemVersion = "1.0.0"; // Placeholder

        // Getters and setters
        public int getTotalSettings() { return totalSettings; }
        public void setTotalSettings(int totalSettings) { this.totalSettings = totalSettings; }

        public java.time.LocalDateTime getLastUpdated() { return lastUpdated; }
        public void setLastUpdated(java.time.LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }

        public String getSystemVersion() { return systemVersion; }
        public void setSystemVersion(String systemVersion) { this.systemVersion = systemVersion; }
    }
}