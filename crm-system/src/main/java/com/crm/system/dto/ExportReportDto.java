package com.crm.system.dto;

import java.time.LocalDateTime;

public class ExportReportDto {
    private String reportType;
    private String format;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String fileName;
    private byte[] data;

    // Constructors
    public ExportReportDto() {}

    public ExportReportDto(String reportType, String format, LocalDateTime startDate, 
                          LocalDateTime endDate, String fileName, byte[] data) {
        this.reportType = reportType;
        this.format = format;
        this.startDate = startDate;
        this.endDate = endDate;
        this.fileName = fileName;
        this.data = data;
    }

    // Getters and Setters
    public String getReportType() {
        return reportType;
    }

    public void setReportType(String reportType) {
        this.reportType = reportType;
    }

    public String getFormat() {
        return format;
    }

    public void setFormat(String format) {
        this.format = format;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }
}