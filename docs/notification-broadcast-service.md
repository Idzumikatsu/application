# Notification Broadcast Service

## Overview

The [`NotificationBroadcastService`](crm-system/src/main/java/com/crm/system/service/NotificationBroadcastService.java:1) is a comprehensive service designed for mass notification delivery to users in the CRM system. It supports both system notifications and Telegram messages with advanced filtering capabilities.

## Key Features

### 1. **Dual Notification Delivery**
- **System Notifications**: Stores notifications in the database for in-app display
- **Telegram Messages**: Sends real-time messages via Telegram bot
- **Automatic fallback**: Users without Telegram receive only system notifications

### 2. **Advanced Recipient Filtering**
- **User Role Filtering**: Send to specific roles (STUDENT, TEACHER, MANAGER, ADMIN)
- **Registration Date Range**: Filter users by registration date
- **Active Status Filtering**: Target only active/inactive users
- **Custom Criteria**: Extensible filter system for future requirements

### 3. **Batch Processing**
- **BATCH_SIZE = 100**: Processes users in batches to avoid system overload
- **Automatic Throttling**: 100ms pause between batches
- **Progress Tracking**: Real-time logging of batch processing status

### 4. **Comprehensive Error Handling**
- **Individual Failure Handling**: Failed deliveries don't stop entire broadcast
- **Retry Mechanism**: MAX_RETRIES = 3 for failed attempts
- **Detailed Error Reporting**: Complete error messages and statistics

### 5. **Performance Monitoring**
- **Execution Timing**: Measures total processing time
- **Success/Failure Metrics**: Tracks delivery statistics
- **Resource Usage**: Optimized batch processing to minimize memory usage

## API Methods

### Core Method
```java
BroadcastResult broadcastNotification(NotificationDto notificationDto, RecipientFilter filter)
```

### Convenience Methods
```java
broadcastToAllStudents(String title, String message, NotificationType type, int priority)
broadcastToAllTeachers(String title, String message, NotificationType type, int priority)
broadcastToAllManagers(String title, String message, NotificationType type, int priority)
broadcastToAllAdmins(String title, String message, NotificationType type, int priority)
broadcastToAllUsers(String title, String message, NotificationType type, int priority)
broadcastWithCustomFilter(String title, String message, NotificationType type, int priority, RecipientFilter filter)
```

## Data Structures

### NotificationDto
```java
public class NotificationDto {
    private String title;
    private String message;
    private NotificationType notificationType;
    private int priority;
    // getters and setters
}
```

### RecipientFilter
```java
public static class RecipientFilter {
    private List<UserRole> userTypes;
    private LocalDate registrationDateFrom;
    private LocalDate registrationDateTo;
    private Boolean isActive;
    // getters and setters
}
```

### BroadcastResult
```java
public static class BroadcastResult {
    private boolean success;
    private String errorMessage;
    private long durationMs;
    private int totalProcessed;
    private int systemNotificationsSent;
    private int telegramNotificationsSent;
    private int telegramFailed;
    private int telegramSkipped;
    private int failed;
    // getters, setters, and increment methods
}
```

## Usage Examples

### Example 1: Broadcast to All Users
```java
BroadcastResult result = notificationBroadcastService.broadcastToAllUsers(
    "System Update", 
    "System will be down for maintenance tomorrow",
    NotificationType.SYSTEM_MESSAGE,
    1
);
```

### Example 2: Broadcast to Specific Role
```java
BroadcastResult result = notificationBroadcastService.broadcastToAllTeachers(
    "Teacher Meeting",
    "Important meeting scheduled for Friday",
    NotificationType.SYSTEM_MESSAGE,
    2
);
```

### Example 3: Custom Filtered Broadcast
```java
RecipientFilter filter = new RecipientFilter();
filter.setUserTypes(List.of(UserRole.STUDENT));
filter.setRegistrationDateFrom(LocalDate.of(2024, 1, 1));

BroadcastResult result = notificationBroadcastService.broadcastWithCustomFilter(
    "Welcome New Students",
    "Welcome to our platform!",
    NotificationType.SYSTEM_MESSAGE,
    1,
    filter
);
```

## Scheduled Broadcasting

The service includes a scheduled method for automatic broadcasts:
```java
@Scheduled(cron = "0 0 9 * * ?") // Daily at 09:00
public void scheduledBroadcast()
```

## Error Handling

The service provides detailed error information:
- **Individual failures** are logged but don't stop the broadcast
- **Telegram delivery failures** are tracked separately
- **System notification failures** are tracked separately
- **Complete error messages** are available in BroadcastResult

## Performance Considerations

1. **Batch Processing**: 100 users per batch to avoid memory issues
2. **Throttling**: 100ms pauses between batches to prevent API rate limiting
3. **Database Optimization**: Uses efficient repository methods for user retrieval
4. **Memory Management**: Processes users in streams to minimize memory footprint

## Integration Points

### Dependencies
- [`NotificationService`](crm-system/src/main/java/com/crm/system/service/NotificationService.java:1): For system notification storage
- [`TelegramNotificationService`](crm-system/src/main/java/com/crm/system/service/TelegramNotificationService.java:1): For Telegram message delivery
- [`UserRepository`](crm-system/src/main/java/com/crm/system/repository/UserRepository.java:1): For user retrieval and filtering

### Testing
Comprehensive test coverage available in [`NotificationBroadcastServiceTest`](crm-system/src/test/java/com/crm/system/service/NotificationBroadcastServiceTest.java:1)

## Security Considerations

- Only active users receive notifications (configurable via filter)
- User data access follows existing repository security patterns
- Telegram chat ID validation is handled by underlying services

## Monitoring and Logging

- **INFO level**: Broadcast start/complete, batch processing
- **WARNING level**: Individual delivery failures
- **SEVERE level**: Critical broadcast failures
- **Performance metrics**: Execution time and success rates

## Future Enhancements

1. **Template Support**: Pre-defined message templates
2. **A/B Testing**: Different messages to user segments
3. **Delivery Scheduling**: Future-dated broadcasts
4. **Analytics Integration**: Track notification engagement
5. **Multi-language Support**: Localized message delivery