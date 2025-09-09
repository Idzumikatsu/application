package com.crm.system.repository;

import com.crm.system.model.NotificationSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NotificationSettingsRepository extends JpaRepository<NotificationSettings, Long> {

    Optional<NotificationSettings> findByUserIdAndUserType(Long userId, NotificationSettings.UserType userType);

    boolean existsByUserIdAndUserType(Long userId, NotificationSettings.UserType userType);
}