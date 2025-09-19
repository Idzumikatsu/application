package com.crm.system.repository;

import com.crm.system.model.SystemSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemSettingsRepository extends JpaRepository<SystemSettings, Long> {
    Optional<SystemSettings> findBySettingKey(String settingKey);
    boolean existsBySettingKey(String settingKey);
    
    @Query("SELECT s FROM SystemSettings s WHERE LOWER(s.description) LIKE LOWER(CONCAT('%', :description, '%'))")
    List<SystemSettings> findByDescriptionContaining(String description);
    
    @Query("SELECT s FROM SystemSettings s WHERE LOWER(s.settingKey) LIKE LOWER(CONCAT('%', :settingKey, '%'))")
    List<SystemSettings> findBySettingKeyContaining(String settingKey);
    
    List<SystemSettings> findAllByOrderBySettingKeyAsc();
    
    List<SystemSettings> findAllByOrderByUpdatedAtDesc();
}