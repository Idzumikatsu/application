package com.crm.system.dto;

import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.GroupLesson;
import com.crm.system.model.GroupLessonRegistration;
import com.crm.system.model.Lesson;

import java.time.LocalTime;

public class CalendarSlotDto {
    private Long slotId;
    private Long lessonId;
    private Long groupLessonId;
    private LocalTime time;
    private Integer durationMinutes;
    private AvailabilitySlot.SlotStatus slotStatus;
    private Lesson.LessonStatus lessonStatus;
    private GroupLesson.GroupLessonStatus groupLessonStatus;
    private String studentName;
    private Long studentId;
    private Boolean isBooked;
    private String groupLessonTopic;
    private Integer maxStudents;
    private Integer currentStudents;
    private GroupLessonRegistration.RegistrationStatus registrationStatus;

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

    public Long getGroupLessonId() {
        return groupLessonId;
    }

    public void setGroupLessonId(Long groupLessonId) {
        this.groupLessonId = groupLessonId;
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

    public GroupLesson.GroupLessonStatus getGroupLessonStatus() {
        return groupLessonStatus;
    }

    public void setGroupLessonStatus(GroupLesson.GroupLessonStatus groupLessonStatus) {
        this.groupLessonStatus = groupLessonStatus;
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

    public String getGroupLessonTopic() {
        return groupLessonTopic;
    }

    public void setGroupLessonTopic(String groupLessonTopic) {
        this.groupLessonTopic = groupLessonTopic;
    }

    public Integer getMaxStudents() {
        return maxStudents;
    }

    public void setMaxStudents(Integer maxStudents) {
        this.maxStudents = maxStudents;
    }

    public Integer getCurrentStudents() {
        return currentStudents;
    }

    public void setCurrentStudents(Integer currentStudents) {
        this.currentStudents = currentStudents;
    }

    public GroupLessonRegistration.RegistrationStatus getRegistrationStatus() {
        return registrationStatus;
    }

    public void setRegistrationStatus(GroupLessonRegistration.RegistrationStatus registrationStatus) {
        this.registrationStatus = registrationStatus;
    }
}