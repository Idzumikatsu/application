package com.crm.system.model;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "availability_slots")
public class AvailabilitySlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id", nullable = false)
    private User teacher;

    @NotNull
    @Column(name = "slot_date")
    private LocalDate slotDate;

    @NotNull
    @Column(name = "slot_time")
    private LocalTime slotTime;

    @Column(name = "duration_minutes", nullable = false, columnDefinition = "integer default 60")
    private Integer durationMinutes = 60;

    @Column(name = "is_booked", nullable = false)
    private Boolean isBooked = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private SlotStatus status = SlotStatus.AVAILABLE;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // Constructors
    public AvailabilitySlot() {}

    public AvailabilitySlot(User teacher, LocalDate slotDate, LocalTime slotTime) {
        this.teacher = teacher;
        this.slotDate = slotDate;
        this.slotTime = slotTime;
        this.durationMinutes = 60;
        this.isBooked = false;
        this.status = SlotStatus.AVAILABLE;
    }

    public AvailabilitySlot(User teacher, LocalDate slotDate, LocalTime slotTime, Integer durationMinutes) {
        this.teacher = teacher;
        this.slotDate = slotDate;
        this.slotTime = slotTime;
        this.durationMinutes = durationMinutes != null ? durationMinutes : 60;
        this.isBooked = false;
        this.status = SlotStatus.AVAILABLE;
    }

    // Enums
    public enum SlotStatus {
        AVAILABLE,     // Слот доступен для бронирования
        BOOKED,        // Слот забронирован
        BLOCKED        // Слот заблокирован (например, преподаватель недоступен)
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getTeacher() {
        return teacher;
    }

    public void setTeacher(User teacher) {
        this.teacher = teacher;
    }

    public LocalDate getSlotDate() {
        return slotDate;
    }

    public void setSlotDate(LocalDate slotDate) {
        this.slotDate = slotDate;
    }

    public LocalTime getSlotTime() {
        return slotTime;
    }

    public void setSlotTime(LocalTime slotTime) {
        this.slotTime = slotTime;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Boolean getIsBooked() {
        return isBooked;
    }

    public void setIsBooked(Boolean isBooked) {
        this.isBooked = isBooked;
    }

    public SlotStatus getStatus() {
        return status;
    }

    public void setStatus(SlotStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Utility methods
    public boolean isAvailable() {
        return this.status == SlotStatus.AVAILABLE;
    }

    public boolean isBooked() {
        return this.status == SlotStatus.BOOKED;
    }

    public boolean isBlocked() {
        return this.status == SlotStatus.BLOCKED;
    }

    public void bookSlot() {
        this.isBooked = true;
        this.status = SlotStatus.BOOKED;
    }

    public void cancelBooking() {
        this.isBooked = false;
        this.status = SlotStatus.AVAILABLE;
    }

    public void blockSlot() {
        this.isBooked = false;
        this.status = SlotStatus.BLOCKED;
    }
}