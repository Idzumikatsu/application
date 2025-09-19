package com.crm.system.controller;

import com.crm.system.dto.DashboardStatsDto;
import com.crm.system.dto.MessageDto;
import com.crm.system.service.DashboardService;
import com.crm.system.service.NotificationBroadcastService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private NotificationBroadcastService notificationBroadcastService;

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        DashboardStatsDto stats = dashboardService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/students-ending-soon")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<?> getStudentsWithEndingPackages() {
        return ResponseEntity.ok(dashboardService.getStudentsWithEndingPackages());
    }

    // Extended admin dashboard endpoints
    @GetMapping("/admin/overview")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminOverview() {
        Map<String, Object> overview = new HashMap<>();
        
        // User statistics
        overview.put("totalStudents", dashboardService.getTotalStudents());
        overview.put("totalTeachers", dashboardService.getTotalTeachers());
        overview.put("totalManagers", dashboardService.getTotalManagers());
        overview.put("totalAdmins", dashboardService.getTotalAdmins());
        
        // Lesson statistics
        overview.put("totalLessonsToday", dashboardService.getTotalLessonsScheduledToday());
        overview.put("totalLessonsThisWeek", dashboardService.getTotalLessonsScheduledThisWeek());
        overview.put("totalLessonsThisMonth", dashboardService.getTotalLessonsScheduledThisMonth());
        overview.put("totalCompletedLessons", dashboardService.getTotalCompletedLessons());
        overview.put("totalCancelledLessons", dashboardService.getTotalCancelledLessons());
        overview.put("totalMissedLessons", dashboardService.getTotalMissedLessons());
        overview.put("totalScheduledLessons", dashboardService.getTotalScheduledLessons());
        
        // Lesson package statistics
        overview.put("totalLessonPackages", dashboardService.getTotalLessonPackages());
        overview.put("activeLessonPackages", dashboardService.getActiveLessonPackages());
        overview.put("expiredLessonPackages", dashboardService.getExpiredLessonPackages());
        
        // System statistics
        overview.put("totalUsers", dashboardService.getTotalUsers());
        overview.put("totalActiveUsers", dashboardService.getTotalActiveUsers());
        overview.put("lessonCompletionRate", dashboardService.getLessonCompletionRate());
        overview.put("lessonCancellationRate", dashboardService.getLessonCancellationRate());
        
        // Students without teachers
        overview.put("studentsWithoutTeacher", dashboardService.getStudentsWithoutTeacher());
        
        overview.put("lastUpdated", LocalDateTime.now());
        
        return ResponseEntity.ok(overview);
    }

    @GetMapping("/admin/system-monitoring")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getSystemMonitoring() {
        Map<String, Object> monitoring = new HashMap<>();
        
        // Notification statistics
        monitoring.put("pendingNotifications", dashboardService.getPendingNotifications());
        monitoring.put("failedNotifications", dashboardService.getFailedNotifications());
        
        // System performance metrics (placeholder - would integrate with actual monitoring)
        monitoring.put("systemUptimePercentage", dashboardService.getSystemUptimePercentage());
        monitoring.put("databaseSizeInMB", dashboardService.getDatabaseSizeInMB());
        monitoring.put("activeUserSessions", dashboardService.getActiveUserSessions());
        monitoring.put("totalEmailsSentToday", dashboardService.getTotalEmailsSentToday());
        monitoring.put("failedEmailsToday", dashboardService.getFailedEmailsToday());
        
        // Availability slot statistics
        monitoring.put("totalAvailabilitySlots", dashboardService.getTotalAvailabilitySlots());
        monitoring.put("bookedAvailabilitySlots", dashboardService.getBookedAvailabilitySlots());
        monitoring.put("availableAvailabilitySlots", dashboardService.getAvailableAvailabilitySlots());
        
        monitoring.put("lastUpdated", LocalDateTime.now());
        
        return ResponseEntity.ok(monitoring);
    }

    @GetMapping("/admin/performance-metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getPerformanceMetrics(
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate) {
        
        LocalDate now = LocalDate.now();
        LocalDate defaultStartDate = now.minusDays(30);
        LocalDate defaultEndDate = now;
        
        LocalDate actualStartDate = startDate != null ? startDate : defaultStartDate;
        LocalDate actualEndDate = endDate != null ? endDate : defaultEndDate;
        
        Map<String, Object> metrics = new HashMap<>();
        
        // Lesson metrics over time period
        metrics.put("lessonsByDate", dashboardService.getLessonsByDate(actualStartDate, actualEndDate));
        metrics.put("lessonCompletionTrend", dashboardService.getLessonCompletionTrend(actualStartDate, actualEndDate));
        metrics.put("lessonCancellationTrend", dashboardService.getLessonCancellationTrend(actualStartDate, actualEndDate));
        
        // User activity metrics
        metrics.put("userRegistrationsByDate", dashboardService.getUserRegistrationsByDate(actualStartDate, actualEndDate));
        metrics.put("activeUsersByDate", dashboardService.getActiveUsersByDate(actualStartDate, actualEndDate));
        
        // System resource usage (placeholder)
        metrics.put("cpuUsageByHour", dashboardService.getCpuUsageByHour(actualStartDate, actualEndDate));
        metrics.put("memoryUsageByHour", dashboardService.getMemoryUsageByHour(actualStartDate, actualEndDate));
        
        metrics.put("startDate", actualStartDate);
        metrics.put("endDate", actualEndDate);
        metrics.put("generatedAt", LocalDateTime.now());
        
        return ResponseEntity.ok(metrics);
    }

    @GetMapping("/admin/top-performers")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getTopPerformers(
            @RequestParam(defaultValue = "10") int limit) {
        
        Map<String, Object> topPerformers = new HashMap<>();
        
        // Top teachers by lessons completed
        topPerformers.put("topTeachersByLessons", dashboardService.getMostActiveTeachers(limit));
        
        // Top students by lessons completed
        topPerformers.put("topStudentsByLessons", dashboardService.getMostActiveStudents(limit));
        
        // Teachers with highest student satisfaction (placeholder)
        topPerformers.put("topTeachersBySatisfaction", dashboardService.getTopRatedTeachers(limit));
        
        topPerformers.put("generatedAt", LocalDateTime.now());
        
        return ResponseEntity.ok(topPerformers);
    }

    @GetMapping("/admin/alerts-and-notifications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAlertsAndNotifications() {
        Map<String, Object> alerts = new HashMap<>();
        
        // System alerts
        alerts.put("systemAlerts", dashboardService.getRecentSystemAlerts(10));
        
        // Pending notifications requiring attention
        alerts.put("pendingNotifications", dashboardService.getPendingNotificationsRequiringAttention(20));
        
        // Failed operations
        alerts.put("recentFailedOperations", dashboardService.getRecentFailedOperations(10));
        
        // Low lesson packages
        alerts.put("studentsWithLowPackages", dashboardService.getStudentsWithLowPackages(5));
        
        alerts.put("generatedAt", LocalDateTime.now());
        
        return ResponseEntity.ok(alerts);
    }

    @PostMapping("/admin/broadcast-alert")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<MessageDto> broadcastSystemAlert(@RequestBody BroadcastAlertDto alertDto) {
        // Send system alert notification to all admins
        notificationBroadcastService.broadcastToRecipientType(
                com.crm.system.model.Notification.RecipientType.ADMIN,
                com.crm.system.model.Notification.NotificationType.SYSTEM_ALERT,
                alertDto.getSubject(),
                alertDto.getMessage());
        
        // Send email alert to all admins
        // In a real implementation, this would integrate with EmailService
        
        return ResponseEntity.ok(new MessageDto("System alert broadcast successfully!"));
    }

    // DTO for broadcast alert request
    public static class BroadcastAlertDto {
        private String subject;
        private String message;
        private String alertLevel; // INFO, WARNING, ERROR, CRITICAL

        // Getters and setters
        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String getAlertLevel() { return alertLevel; }
        public void setAlertLevel(String alertLevel) { this.alertLevel = alertLevel; }
    }
}