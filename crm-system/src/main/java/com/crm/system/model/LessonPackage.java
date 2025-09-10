package com.crm.system.model;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "lesson_packages")
public class LessonPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Min(0)
    @NotNull
    @Column(name = "total_lessons")
    private Integer totalLessons;

    @Min(0)
    @NotNull
    @Column(name = "remaining_lessons")
    private Integer remainingLessons;

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
    public LessonPackage() {}

    public LessonPackage(Student student, Integer totalLessons) {
        this.student = student;
        this.totalLessons = totalLessons;
        this.remainingLessons = totalLessons;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Integer getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(Integer totalLessons) {
        this.totalLessons = totalLessons;
    }

    public Integer getRemainingLessons() {
        return remainingLessons;
    }

    public void setRemainingLessons(Integer remainingLessons) {
        this.remainingLessons = remainingLessons;
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

    // Business methods
    public boolean hasEnoughLessons(int lessonsNeeded) {
        return remainingLessons >= lessonsNeeded;
    }

    public void deductLessons(int lessonsToDeduct) {
        if (hasEnoughLessons(lessonsToDeduct)) {
            this.remainingLessons -= lessonsToDeduct;
        } else {
            throw new IllegalArgumentException("Not enough lessons in the package");
        }
    }

    public void addLessons(int lessonsToAdd) {
        this.totalLessons += lessonsToAdd;
        this.remainingLessons += lessonsToAdd;
    }

    // Additional methods needed for notifications
    public String getName() {
        return "Пакет из " + totalLessons + " уроков";
    }

    public LocalDateTime getExpirationDate() {
        // Default expiration: 3 months from creation
        return createdAt != null ? createdAt.plusMonths(3) : LocalDateTime.now().plusMonths(3);
    }

    public Long getStudentId() {
        return student != null ? student.getId() : null;
    }
}