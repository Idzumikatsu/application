package com.crm.system.service;

import com.crm.system.model.SystemSettings;
import com.crm.system.repository.SystemSettingsRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class SystemSettingsServiceTest {

    @Mock
    private SystemSettingsRepository systemSettingsRepository;

    @InjectMocks
    private SystemSettingsService systemSettingsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindById() {
        // Given
        Long id = 1L;
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setId(id);
        when(systemSettingsRepository.findById(id)).thenReturn(Optional.of(systemSettings));

        // When
        Optional<SystemSettings> result = systemSettingsService.findById(id);

        // Then
        assertTrue(result.isPresent());
        assertEquals(id, result.get().getId());
        verify(systemSettingsRepository, times(1)).findById(id);
    }

    @Test
    void testFindBySettingKey() {
        // Given
        String settingKey = "test.setting";
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setSettingKey(settingKey);
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.of(systemSettings));

        // When
        Optional<SystemSettings> result = systemSettingsService.findBySettingKey(settingKey);

        // Then
        assertTrue(result.isPresent());
        assertEquals(settingKey, result.get().getSettingKey());
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
    }

    @Test
    void testSaveSystemSettings() {
        // Given
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setSettingKey("test.setting");
        systemSettings.setSettingValue("test.value");
        when(systemSettingsRepository.save(any(SystemSettings.class))).thenReturn(systemSettings);

        // When
        SystemSettings result = systemSettingsService.saveSystemSettings(systemSettings);

        // Then
        assertNotNull(result);
        assertEquals("test.setting", result.getSettingKey());
        assertEquals("test.value", result.getSettingValue());
        verify(systemSettingsRepository, times(1)).save(systemSettings);
    }

    @Test
    void testCreateSystemSettings() {
        // Given
        String settingKey = "test.setting";
        String settingValue = "test.value";
        String description = "Test setting";
        when(systemSettingsRepository.existsBySettingKey(settingKey)).thenReturn(false);
        SystemSettings systemSettings = new SystemSettings(settingKey, settingValue, description);
        when(systemSettingsRepository.save(any(SystemSettings.class))).thenReturn(systemSettings);

        // When
        SystemSettings result = systemSettingsService.createSystemSettings(settingKey, settingValue, description);

        // Then
        assertNotNull(result);
        assertEquals(settingKey, result.getSettingKey());
        assertEquals(settingValue, result.getSettingValue());
        assertEquals(description, result.getDescription());
        verify(systemSettingsRepository, times(1)).existsBySettingKey(settingKey);
        verify(systemSettingsRepository, times(1)).save(any(SystemSettings.class));
    }

    @Test
    void testCreateSystemSettingsThrowsExceptionWhenSettingExists() {
        // Given
        String settingKey = "test.setting";
        String settingValue = "test.value";
        String description = "Test setting";
        when(systemSettingsRepository.existsBySettingKey(settingKey)).thenReturn(true);

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            systemSettingsService.createSystemSettings(settingKey, settingValue, description);
        });

        assertEquals("System setting with key '" + settingKey + "' already exists", exception.getMessage());
        verify(systemSettingsRepository, times(1)).existsBySettingKey(settingKey);
        verify(systemSettingsRepository, times(0)).save(any(SystemSettings.class));
    }

    @Test
    void testUpdateSystemSettings() {
        // Given
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setSettingKey("test.setting");
        systemSettings.setSettingValue("updated.value");
        when(systemSettingsRepository.save(any(SystemSettings.class))).thenReturn(systemSettings);

        // When
        SystemSettings result = systemSettingsService.updateSystemSettings(systemSettings);

        // Then
        assertNotNull(result);
        assertEquals("test.setting", result.getSettingKey());
        assertEquals("updated.value", result.getSettingValue());
        verify(systemSettingsRepository, times(1)).save(systemSettings);
    }

    @Test
    void testUpdateSettingValue() {
        // Given
        String settingKey = "test.setting";
        String newValue = "new.value";
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setSettingKey(settingKey);
        systemSettings.setSettingValue("old.value");
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.of(systemSettings));
        when(systemSettingsRepository.save(any(SystemSettings.class))).thenReturn(systemSettings);

        // When
        SystemSettings result = systemSettingsService.updateSettingValue(settingKey, newValue);

        // Then
        assertNotNull(result);
        assertEquals(newValue, result.getSettingValue());
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
        verify(systemSettingsRepository, times(1)).save(systemSettings);
    }

    @Test
    void testUpdateSettingValueThrowsExceptionWhenSettingNotFound() {
        // Given
        String settingKey = "nonexistent.setting";
        String newValue = "new.value";
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.empty());

        // When & Then
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            systemSettingsService.updateSettingValue(settingKey, newValue);
        });

        assertEquals("System setting with key '" + settingKey + "' not found", exception.getMessage());
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
        verify(systemSettingsRepository, times(0)).save(any(SystemSettings.class));
    }

    @Test
    void testDeleteSystemSettings() {
        // Given
        Long id = 1L;

        // When
        systemSettingsService.deleteSystemSettings(id);

        // Then
        verify(systemSettingsRepository, times(1)).deleteById(id);
    }

    @Test
    void testDeleteBySettingKey() {
        // Given
        String settingKey = "test.setting";
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setId(1L);
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.of(systemSettings));

        // When
        systemSettingsService.deleteBySettingKey(settingKey);

        // Then
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
        verify(systemSettingsRepository, times(1)).deleteById(1L);
    }

    @Test
    void testDeleteBySettingKeyWhenSettingDoesNotExist() {
        // Given
        String settingKey = "nonexistent.setting";
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.empty());

        // When
        systemSettingsService.deleteBySettingKey(settingKey);

        // Then
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
        verify(systemSettingsRepository, times(0)).deleteById(anyLong());
    }

    @Test
    void testExistsBySettingKey() {
        // Given
        String settingKey = "test.setting";
        when(systemSettingsRepository.existsBySettingKey(settingKey)).thenReturn(true);

        // When
        boolean result = systemSettingsService.existsBySettingKey(settingKey);

        // Then
        assertTrue(result);
        verify(systemSettingsRepository, times(1)).existsBySettingKey(settingKey);
    }

    @Test
    void testGetSettingValue() {
        // Given
        String settingKey = "test.setting";
        String settingValue = "test.value";
        String defaultValue = "default.value";
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setSettingValue(settingValue);
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.of(systemSettings));

        // When
        String result = systemSettingsService.getSettingValue(settingKey, defaultValue);

        // Then
        assertEquals(settingValue, result);
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
    }

    @Test
    void testGetSettingValueReturnsDefaultValueWhenSettingNotFound() {
        // Given
        String settingKey = "nonexistent.setting";
        String defaultValue = "default.value";
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.empty());

        // When
        String result = systemSettingsService.getSettingValue(settingKey, defaultValue);

        // Then
        assertEquals(defaultValue, result);
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
    }

    @Test
    void testGetSettingValueAsInt() {
        // Given
        String settingKey = "test.int.setting";
        int defaultValue = 10;
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setSettingValue("5");
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.of(systemSettings));

        // When
        int result = systemSettingsService.getSettingValueAsInt(settingKey, defaultValue);

        // Then
        assertEquals(5, result);
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
    }

    @Test
    void testGetSettingValueAsIntReturnsDefaultValueWhenSettingNotFound() {
        // Given
        String settingKey = "nonexistent.setting";
        int defaultValue = 10;
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.empty());

        // When
        int result = systemSettingsService.getSettingValueAsInt(settingKey, defaultValue);

        // Then
        assertEquals(defaultValue, result);
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
    }

    @Test
    void testGetSettingValueAsIntReturnsDefaultValueWhenInvalidFormat() {
        // Given
        String settingKey = "invalid.int.setting";
        int defaultValue = 10;
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setSettingValue("invalid");
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.of(systemSettings));

        // When
        int result = systemSettingsService.getSettingValueAsInt(settingKey, defaultValue);

        // Then
        assertEquals(defaultValue, result);
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
    }

    @Test
    void testGetSettingValueAsBoolean() {
        // Given
        String settingKey = "test.boolean.setting";
        boolean defaultValue = false;
        SystemSettings systemSettings = new SystemSettings();
        systemSettings.setSettingValue("true");
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.of(systemSettings));

        // When
        boolean result = systemSettingsService.getSettingValueAsBoolean(settingKey, defaultValue);

        // Then
        assertTrue(result);
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
    }

    @Test
    void testGetSettingValueAsBooleanReturnsDefaultValueWhenSettingNotFound() {
        // Given
        String settingKey = "nonexistent.setting";
        boolean defaultValue = false;
        when(systemSettingsRepository.findBySettingKey(settingKey)).thenReturn(Optional.empty());

        // When
        boolean result = systemSettingsService.getSettingValueAsBoolean(settingKey, defaultValue);

        // Then
        assertEquals(defaultValue, result);
        verify(systemSettingsRepository, times(1)).findBySettingKey(settingKey);
    }
}