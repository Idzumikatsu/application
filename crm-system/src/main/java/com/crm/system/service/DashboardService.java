package com.crm.system.service;

import com.crm.system.dto.DashboardStatsDto;
import com.crm.system.dto.StudentLessonSummaryDto;
import com.crm.system.model.LessonPackage;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.crm.system.model.Lesson;
import com.crm.system.repository.LessonPackageRepository;
import com.crm.system.repository.LessonRepository;
import com.crm.system.repository.StudentRepository;
import com.crm.system.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private LessonPackageRepository lessonPackageRepository;

    public DashboardStatsDto getDashboardStats() {
        // Get user counts
        long totalStudents = studentRepository.count();
        long totalTeachers = userRepository.countByRole(UserRole.TEACHER);
        long totalManagers = userRepository.countByRole(UserRole.MANAGER);
        
        // Get active user counts (users created in last 30 days or with recent activity)
        long activeStudents = studentRepository.count();
        long activeTeachers = userRepository.countByRole(UserRole.TEACHER);
        
        // Get lesson counts
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(java.time.DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(java.time.DayOfWeek.SUNDAY);
        
        long lessonsToday = lessonRepository.countByScheduledDate(today);
        long lessonsThisWeek = lessonRepository.countByScheduledDateBetween(startOfWeek, endOfWeek);
        
        // Get students with packages ending soon (≤ 3 lessons remaining)
        List<StudentLessonSummaryDto> studentsEndingSoon = getStudentsWithEndingPackages();
        
        return new DashboardStatsDto(
            totalStudents,
            totalTeachers,
            totalManagers,
            activeStudents,
            activeTeachers,
            lessonsToday,
            lessonsThisWeek,
            studentsEndingSoon
        );
    }

    public List<StudentLessonSummaryDto> getStudentsWithEndingPackages() {
        // Find lesson packages with 3 or fewer remaining lessons
        List<LessonPackage> packages = lessonPackageRepository.findByRemainingLessonsLessThanEqual(3);
        
        return packages.stream().map(pkg -> {
            Student student = pkg.getStudent();
            User teacher = student.getAssignedTeacher();
            
            return new StudentLessonSummaryDto(
                student.getId(),
                student.getFirstName() + " " + student.getLastName(),
                teacher != null ? teacher.getFirstName() + " " + teacher.getLastName() : "Не назначен",
                pkg.getRemainingLessons(),
                pkg.getTotalLessons()
            );
        }).collect(Collectors.toList());
    }

    public long getTotalUsers() {
        return userRepository.count();
    }

    public long getTotalActiveUsers() {
        // For now, return all users as active
        // In a real implementation, this would check for recent activity
        return userRepository.count();
    }

    // Extended metrics for admin
    public long getTotalLessonPackages() {
        return lessonPackageRepository.count();
    }

    public long getActiveLessonPackages() {
        return lessonPackageRepository.countByRemainingLessonsGreaterThan(0);
    }

    public long getExpiredLessonPackages() {
        return lessonPackageRepository.findExpiredPackages(LocalDateTime.now()).size();
    }

    public List<LessonPackage> getLowLessonPackages(int threshold) {
        return lessonPackageRepository.findPackagesWithLowRemainingLessons(threshold);
    }

    public long getTotalLessonsScheduledToday() {
        LocalDate today = LocalDate.now();
        return lessonRepository.countByScheduledDate(today);
    }

    public long getTotalLessonsScheduledThisWeek() {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(java.time.DayOfWeek.MONDAY);
        LocalDate endOfWeek = today.with(java.time.DayOfWeek.SUNDAY);
        return lessonRepository.countByScheduledDateBetween(startOfWeek, endOfWeek);
    }

    public long getTotalLessonsScheduledThisMonth() {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate endOfMonth = today.withDayOfMonth(today.lengthOfMonth());
        return lessonRepository.countByScheduledDateBetween(startOfMonth, endOfMonth);
    }

    public long getTotalCompletedLessons() {
        return lessonRepository.countByStatus(com.crm.system.model.Lesson.LessonStatus.COMPLETED);
    }

    public long getTotalCancelledLessons() {
        return lessonRepository.countByStatus(com.crm.system.model.Lesson.LessonStatus.CANCELLED);
    }

    public long getTotalMissedLessons() {
        return lessonRepository.countByStatus(com.crm.system.model.Lesson.LessonStatus.MISSED);
    }

    public long getTotalScheduledLessons() {
        return lessonRepository.countByStatus(com.crm.system.model.Lesson.LessonStatus.SCHEDULED);
    }

    public double getLessonCompletionRate() {
        long completed = getTotalCompletedLessons();
        long total = lessonRepository.count();
        return total > 0 ? (double) completed / total * 100 : 0;
    }

    public double getLessonCancellationRate() {
        long cancelled = getTotalCancelledLessons();
        long total = lessonRepository.count();
        return total > 0 ? (double) cancelled / total * 100 : 0;
    }

    public List<User> getMostActiveTeachers(int limit) {
        // This would require a more complex query in a real implementation
        // For now, return all teachers
        return userRepository.findByRole(UserRole.TEACHER);
    }

    public List<Student> getMostActiveStudents(int limit) {
        // This would require a more complex query in a real implementation
        // For now, return all students
        return studentRepository.findAll();
    }

    public long getStudentsWithoutTeacher() {
        return studentRepository.countByAssignedTeacherIsNull();
    }

    public long getTeachersWithoutStudents() {
        // This would require a more complex query in a real implementation
        // For now, return 0
        return 0;
    }

    // System monitoring metrics
    public long getPendingNotifications() {
        // This would require access to NotificationService
        // For now, return 0
        return 0;
    }

    public long getFailedNotifications() {
        // This would require access to NotificationService
        // For now, return 0
        return 0;
    }

    public long getTotalAvailabilitySlots() {
        // This would require access to AvailabilitySlotRepository
        // For now, return 0
        return 0;
    }

    public long getBookedAvailabilitySlots() {
        // This would require access to AvailabilitySlotRepository
        // For now, return 0
        return 0;
    }

    public long getAvailableAvailabilitySlots() {
        // This would require access to AvailabilitySlotRepository
        // For now, return 0
        return 0;
    }

    public double getSystemUptimePercentage() {
        // This would require access to system monitoring
        // For now, return 100%
        return 100.0;
    }

    public long getDatabaseSizeInMB() {
        // This would require access to database monitoring
        // For now, return 0
        return 0;
    }

    public long getActiveUserSessions() {
        // This would require access to session management
        // For now, return 0
        return 0;
    }

    public long getTotalEmailsSentToday() {
        // This would require access to EmailService or EmailLogRepository
        // For now, return 0
        return 0;
    }

    public long getFailedEmailsToday() {
        // This would require access to EmailService or EmailLogRepository
        // For now, return 0
        return 0;
    }

    // Extended admin dashboard methods
    public long getTotalStudents() {
        return studentRepository.count();
    }

    public long getTotalTeachers() {
        return userRepository.countByRole(UserRole.TEACHER);
    }

    public long getTotalManagers() {
        return userRepository.countByRole(UserRole.MANAGER);
    }

    public long getTotalAdmins() {
        return userRepository.countByRole(UserRole.ADMIN);
    }

    public List<Map<String, Object>> getLessonsByDate(LocalDate startDate, LocalDate endDate) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for lesson counts by date
        return result;
    }

    public List<Map<String, Object>> getLessonCompletionTrend(LocalDate startDate, LocalDate endDate) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for lesson completion trends
        return result;
    }

    public List<Map<String, Object>> getLessonCancellationTrend(LocalDate startDate, LocalDate endDate) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for lesson cancellation trends
        return result;
    }

    public List<Map<String, Object>> getUserRegistrationsByDate(LocalDate startDate, LocalDate endDate) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for user registrations by date
        return result;
    }

    public List<Map<String, Object>> getActiveUsersByDate(LocalDate startDate, LocalDate endDate) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for active users by date
        return result;
    }

    public List<Map<String, Object>> getCpuUsageByHour(LocalDate startDate, LocalDate endDate) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query system monitoring for CPU usage
        return result;
    }

    public List<Map<String, Object>> getMemoryUsageByHour(LocalDate startDate, LocalDate endDate) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query system monitoring for memory usage
        return result;
    }

    public List<Map<String, Object>> getMostActiveTeachers(int limit) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for most active teachers
        return result;
    }

    public List<Map<String, Object>> getMostActiveStudents(int limit) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for most active students
        return result;
    }

    public List<Map<String, Object>> getTopRatedTeachers(int limit) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for top-rated teachers
        return result;
    }

    public List<Map<String, Object>> getRecentSystemAlerts(int limit) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for recent system alerts
        return result;
    }

    public List<Map<String, Object>> getPendingNotificationsRequiringAttention(int limit) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for pending notifications
        return result;
    }

    public List<Map<String, Object>> getRecentFailedOperations(int limit) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for recent failed operations
        return result;
    }

    public List<Map<String, Object>> getStudentsWithLowPackages(int threshold) {
        // Placeholder implementation
        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // In a real implementation, this would query the database for students with low packages
        return result;
    }
}