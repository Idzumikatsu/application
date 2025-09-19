package com.crm.system.dto;

public class StudentLessonSummaryDto {
    private long studentId;
    private String studentName;
    private String teacherName;
    private int remainingLessons;
    private int totalLessons;

    // Constructors
    public StudentLessonSummaryDto() {}

    public StudentLessonSummaryDto(long studentId, String studentName, String teacherName, 
                                 int remainingLessons, int totalLessons) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.teacherName = teacherName;
        this.remainingLessons = remainingLessons;
        this.totalLessons = totalLessons;
    }

    // Getters and Setters
    public long getStudentId() {
        return studentId;
    }

    public void setStudentId(long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getTeacherName() {
        return teacherName;
    }

    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }

    public int getRemainingLessons() {
        return remainingLessons;
    }

    public void setRemainingLessons(int remainingLessons) {
        this.remainingLessons = remainingLessons;
    }

    public int getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(int totalLessons) {
        this.totalLessons = totalLessons;
    }
}