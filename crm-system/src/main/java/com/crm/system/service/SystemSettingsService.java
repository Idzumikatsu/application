package com.crm.system.service;

import com.crm.system.model.SystemSettings;
import com.crm.system.repository.SystemSettingsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SystemSettingsService {

    @Autowired
    private SystemSettingsRepository systemSettingsRepository;

    public Optional<SystemSettings> findById(Long id) {
        return systemSettingsRepository.findById(id);
    }

    public Optional<SystemSettings> findBySettingKey(String settingKey) {
        return systemSettingsRepository.findBySettingKey(settingKey);
    }

    public SystemSettings saveSystemSettings(SystemSettings systemSettings) {
        return systemSettingsRepository.save(systemSettings);
    }

    public SystemSettings createSystemSettings(String settingKey, String settingValue, String description) {
        // Check if setting already exists
        if (systemSettingsRepository.existsBySettingKey(settingKey)) {
            throw new RuntimeException("System setting with key '" + settingKey + "' already exists");
        }
        
        SystemSettings systemSettings = new SystemSettings(settingKey, settingValue, description);
        return systemSettingsRepository.save(systemSettings);
    }

    public SystemSettings updateSystemSettings(SystemSettings systemSettings) {
        return systemSettingsRepository.save(systemSettings);
    }

    public SystemSettings updateSettingValue(String settingKey, String settingValue) {
        SystemSettings systemSettings = systemSettingsRepository.findBySettingKey(settingKey)
                .orElseThrow(() -> new RuntimeException("System setting with key '" + settingKey + "' not found"));
        systemSettings.setSettingValue(settingValue);
        return systemSettingsRepository.save(systemSettings);
    }

    public void deleteSystemSettings(Long id) {
        systemSettingsRepository.deleteById(id);
    }

    public void deleteBySettingKey(String settingKey) {
        Optional<SystemSettings> systemSettings = systemSettingsRepository.findBySettingKey(settingKey);
        if (systemSettings.isPresent()) {
            systemSettingsRepository.deleteById(systemSettings.get().getId());
        }
    }

    public List<SystemSettings> findAll() {
        return systemSettingsRepository.findAll();
    }

    public boolean existsBySettingKey(String settingKey) {
        return systemSettingsRepository.existsBySettingKey(settingKey);
    }

    public String getSettingValue(String settingKey, String defaultValue) {
        Optional<SystemSettings> systemSettings = systemSettingsRepository.findBySettingKey(settingKey);
        return systemSettings.map(SystemSettings::getSettingValue).orElse(defaultValue);
    }

    public int getSettingValueAsInt(String settingKey, int defaultValue) {
        String value = getSettingValue(settingKey, null);
        if (value != null) {
            try {
                return Integer.parseInt(value);
            } catch (NumberFormatException e) {
                return defaultValue;
            }
        }
        return defaultValue;
    }

    public boolean getSettingValueAsBoolean(String settingKey, boolean defaultValue) {
        String value = getSettingValue(settingKey, null);
        if (value != null) {
            return Boolean.parseBoolean(value);
        }
        return defaultValue;
    }

    // Extended methods for admin
    public List<SystemSettings> findByDescriptionContaining(String description) {
        return systemSettingsRepository.findByDescriptionContaining(description);
    }

    public List<SystemSettings> findBySettingKeyContaining(String settingKey) {
        return systemSettingsRepository.findBySettingKeyContaining(settingKey);
    }

    public long count() {
        return systemSettingsRepository.count();
    }

    public List<SystemSettings> findAllSortedBySettingKey() {
        return systemSettingsRepository.findAllByOrderBySettingKeyAsc();
    }

    public List<SystemSettings> findAllSortedByUpdatedAt() {
        return systemSettingsRepository.findAllByOrderByUpdatedAtDesc();
    }

    public void updateMultipleSettings(List<SystemSettingsUpdateRequest> updates) {
        for (SystemSettingsUpdateRequest update : updates) {
            updateSettingValue(update.getSettingKey(), update.getSettingValue());
        }
    }

    public void createMultipleSettings(List<SystemSettingsCreateRequest> creates) {
        for (SystemSettingsCreateRequest create : creates) {
            if (!existsBySettingKey(create.getSettingKey())) {
                createSystemSettings(create.getSettingKey(), create.getSettingValue(), create.getDescription());
            }
        }
    }

    public void resetToDefaults() {
        // This would reset system settings to default values
        // For now, this is a placeholder
    }

    public void backupSettings() {
        // This would create a backup of current system settings
        // For now, this is a placeholder
    }

    public void restoreSettings(String backupId) {
        // This would restore system settings from a backup
        // For now, this is a placeholder
    }

    // Inner classes for request objects
    public static class SystemSettingsUpdateRequest {
        private String settingKey;
        private String settingValue;

        // Getters and setters
        public String getSettingKey() { return settingKey; }
        public void setSettingKey(String settingKey) { this.settingKey = settingKey; }

        public String getSettingValue() { return settingValue; }
        public void setSettingValue(String settingValue) { this.settingValue = settingValue; }
    }

    public static class SystemSettingsCreateRequest {
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
}