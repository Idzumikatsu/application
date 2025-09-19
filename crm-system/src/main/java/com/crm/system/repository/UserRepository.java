package com.crm.system.repository;

import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(UserRole role);
    List<User> findByRoleAndIsActive(UserRole role, Boolean isActive);
    Boolean existsByEmail(String email);
    
    User findByTelegramChatId(Long chatId);
    
    Boolean existsByTelegramChatId(Long chatId);
    
    // Added for dashboard statistics
    long countByRole(UserRole role);
}