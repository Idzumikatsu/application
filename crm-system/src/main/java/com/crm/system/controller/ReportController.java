package com.crm.system.controller;

import com.crm.system.dto.ExportReportDto;
import com.crm.system.dto.MessageDto;
import com.crm.system.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/students")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Resource> generateStudentsReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startDateTime = parseDateTime(startDate);
        LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generateStudentsReport(startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating students report: " + e.getMessage());
        }
    }

    @GetMapping("/teachers")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Resource> generateTeachersReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startDateTime = parseDateTime(startDate);
        LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generateTeachersReport(startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating teachers report: " + e.getMessage());
        }
    }

    @GetMapping("/lessons")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<Resource> generateLessonsReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startDateTime = parseDateTime(startDate);
        LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generateLessonsReport(startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating lessons report: " + e.getMessage());
        }
    }

    // Extended reports for admin
    @GetMapping("/packages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> generatePackagesReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startDateTime = parseDateTime(startDate);
        LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generatePackagesReport(startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating packages report: " + e.getMessage());
        }
    }

    @GetMapping("/system-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> generateSystemStatsReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startDateTime = parseDateTime(startDate);
        LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generateSystemStatsReport(startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating system stats report: " + e.getMessage());
        }
    }

    @GetMapping("/teacher-performance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> generateTeacherPerformanceReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startDateTime = parseDateTime(startDate);
        LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generateTeacherPerformanceReport(startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating teacher performance report: " + e.getMessage());
        }
    }

    @GetMapping("/student-progress")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> generateStudentProgressReport(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startDateTime = parseDateTime(startDate);
        LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generateStudentProgressReport(startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating student progress report: " + e.getMessage());
        }
    }

    // Mass export functionality for admin
    @GetMapping("/mass-export")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Resource> generateMassExportReport(
            @RequestParam String exportType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        
        LocalDateTime startDateTime = parseDateTime(startDate);
        LocalDateTime endDateTime = parseDateTime(endDate);
        
        try {
            ExportReportDto exportDto = reportService.generateMassExportReport(exportType, startDateTime, endDateTime);
            return createExcelResponse(exportDto);
        } catch (Exception e) {
            throw new RuntimeException("Error generating mass export report: " + e.getMessage());
        }
    }

    private LocalDateTime parseDateTime(String dateTimeStr) {
        if (dateTimeStr == null || dateTimeStr.isEmpty()) {
            return null;
        }
        
        try {
            return LocalDateTime.parse(dateTimeStr, DateTimeFormatter.ISO_LOCAL_DATE_TIME);
        } catch (Exception e) {
            throw new RuntimeException("Invalid date format. Expected ISO_LOCAL_DATE_TIME format.");
        }
    }

    private ResponseEntity<Resource> createExcelResponse(ExportReportDto exportDto) {
        ByteArrayResource resource = new ByteArrayResource(exportDto.getData());
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + exportDto.getFileName() + "\"")
                .body(resource);
    }

    // Report status and metadata endpoints
    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<MessageDto> getReportGenerationStatus() {
        // In a real implementation, this would return the status of ongoing report generation
        return ResponseEntity.ok(new MessageDto("Report generation service is operational"));
    }

    @GetMapping("/metadata")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<MessageDto> getReportMetadata() {
        // In a real implementation, this would return metadata about available reports
        return ResponseEntity.ok(new MessageDto("Available reports: students, teachers, lessons, packages, system-stats, teacher-performance, student-progress, mass-export"));
    }
}