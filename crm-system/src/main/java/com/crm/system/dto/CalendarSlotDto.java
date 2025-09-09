package com.crm.system.dto;

import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.Lesson;

import java.time.LocalTime;

public class CalendarSlotDto {
    private Long slotId;
    private Long lessonId;
    private LocalTime time;
    private Integer durationMinutes;
    private AvailabilitySlot.SlotStatus slotStatus;
    private Lesson.LessonStatus lessonStatus;
    private String studentName;
    private Long studentId;
    private Boolean isBooked;

    // Constructors
    public CalendarSlotDto() {}

    // Getters and Setters
    public Long getSlotId() {
        return slotId;
    }

    public void setSlotId(Long slotId) {
        this.slotId = slotId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public LocalTime getTime() {
        return time;
    }

    public void setTime(LocalTime time) {
        this.time = time;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public AvailabilitySlot.SlotStatus getSlotStatus() {
        return slotStatus;
    }

    public void setSlotStatus(AvailabilitySlot.SlotStatus slotStatus) {
        this.slotStatus = slotStatus;
    }

    public Lesson.LessonStatus getLessonStatus() {
        return lessonStatus;
    }

    public void setLessonStatus(Lesson.LessonStatus lessonStatus) {
        this.lessonStatus = lessonStatus;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Boolean getIsBooked() {
        return isBooked;
    }

    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
    }
}