package com.crm.system.repository;

import com.crm.system.model.TelegramBot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TelegramBotRepository extends JpaRepository<TelegramBot, Long> {
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.botUsername = :botUsername")
    Optional<TelegramBot> findByBotUsername(@Param("botUsername") String botUsername);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.botName = :botName")
    Optional<TelegramBot> findByBotName(@Param("botName") String botName);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.isActive = true")
    List<TelegramBot> findActiveBots();
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.isActive = false")
    List<TelegramBot> findInactiveBots();
    
    @Query("SELECT COUNT(tb) FROM TelegramBot tb WHERE tb.isActive = true")
    Long countActiveBots();
    
    @Query("SELECT COUNT(tb) FROM TelegramBot tb WHERE tb.isActive = false")
    Long countInactiveBots();
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.botToken = :botToken")
    Optional<TelegramBot> findByBotToken(@Param("botToken") String botToken);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.botUsername = :botUsername AND tb.isActive = true")
    Optional<TelegramBot> findActiveBotByBotUsername(@Param("botUsername") String botUsername);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.botName = :botName AND tb.isActive = true")
    Optional<TelegramBot> findActiveBotByBotName(@Param("botName") String botName);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.botToken = :botToken AND tb.isActive = true")
    Optional<TelegramBot> findActiveBotByBotToken(@Param("botToken") String botToken);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.isActive = :isActive")
    List<TelegramBot> findByIsActive(@Param("isActive") Boolean isActive);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.description LIKE %:description%")
    List<TelegramBot> findByDescriptionContaining(@Param("description") String description);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.botUsername LIKE %:botUsername%")
    List<TelegramBot> findByBotUsernameContaining(@Param("botUsername") String botUsername);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.botName LIKE %:botName%")
    List<TelegramBot> findByBotNameContaining(@Param("botName") String botName);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.isActive = true AND tb.description LIKE %:description%")
    List<TelegramBot> findActiveBotsByDescriptionContaining(@Param("description") String description);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.isActive = true AND tb.botUsername LIKE %:botUsername%")
    List<TelegramBot> findActiveBotsByBotUsernameContaining(@Param("botUsername") String botUsername);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.isActive = true AND tb.botName LIKE %:botName%")
    List<TelegramBot> findActiveBotsByBotNameContaining(@Param("botName") String botName);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.createdAt >= :startDate AND tb.createdAt <= :endDate")
    List<TelegramBot> findByCreatedAtBetween(@Param("startDate") java.time.LocalDateTime startDate, 
                                           @Param("endDate") java.time.LocalDateTime endDate);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.isActive = true AND tb.createdAt >= :startDate AND tb.createdAt <= :endDate")
    List<TelegramBot> findActiveBotsByCreatedAtBetween(@Param("startDate") java.time.LocalDateTime startDate, 
                                                     @Param("endDate") java.time.LocalDateTime endDate);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.isActive = false AND tb.createdAt >= :startDate AND tb.createdAt <= :endDate")
    List<TelegramBot> findInactiveBotsByCreatedAtBetween(@Param("startDate") java.time.LocalDateTime startDate, 
                                                       @Param("endDate") java.time.LocalDateTime endDate);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.updatedAt >= :startDate AND tb.updatedAt <= :endDate")
    List<TelegramBot> findByUpdatedAtBetween(@Param("startDate") java.time.LocalDateTime startDate, 
                                           @Param("endDate") java.time.LocalDateTime endDate);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.isActive = true AND tb.updatedAt >= :startDate AND tb.updatedAt <= :endDate")
    List<TelegramBot> findActiveBotsByUpdatedAtBetween(@Param("startDate") java.time.LocalDateTime startDate, 
                                                     @Param("endDate") java.time.LocalDateTime endDate);
    
    @Query("SELECT tb FROM TelegramBot tb WHERE tb.isActive = false AND tb.updatedAt >= :startDate AND tb.updatedAt <= :endDate")
    List<TelegramBot> findInactiveBotsByUpdatedAtBetween(@Param("startDate") java.time.LocalDateTime startDate, 
                                                       @Param("endDate") java.time.LocalDateTime endDate);
}