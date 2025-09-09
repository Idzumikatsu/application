package com.crm.system.service;

import com.crm.system.dto.BookSlotDto;
import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.Lesson;
import com.crm.system.model.Student;
import com.crm.system.model.User;
import com.crm.system.repository.AvailabilitySlotRepository;
import com.crm.system.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SlotBookingService {

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private AvailabilitySlotService availabilitySlotService;

    @Autowired
    private LessonService lessonService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private UserService userService;

    public Lesson bookSlot(BookSlotDto bookSlotDto) {
        // Проверяем существование слота
        AvailabilitySlot slot = availabilitySlotService.findById(bookSlotDto.getSlotId())
                .orElseThrow(() -> new RuntimeException("Availability slot not found with id: " + bookSlotDto.getSlotId()));

        // Проверяем, что слот доступен для бронирования
        if (!slot.isAvailable()) {
            throw new RuntimeException("Slot is not available for booking");
        }

        // Проверяем существование студента
        Student student = studentService.findById(bookSlotDto.getStudentId())
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + bookSlotDto.getStudentId()));

        // Бронируем слот
        slot.bookSlot();
        availabilitySlotService.updateAvailabilitySlot(slot);

        // Создаем урок
        Lesson lesson = new Lesson(
                student,
                slot.getTeacher(),
                slot.getSlotDate(),
                slot.getSlotTime()
        );
        lesson.setDurationMinutes(slot.getDurationMinutes());
        lesson.setSlot(slot);
        lesson.setNotes(bookSlotDto.getNotes());

        return lessonService.saveLesson(lesson);
    }

    public void cancelBooking(Long slotId) {
        AvailabilitySlot slot = availabilitySlotService.findById(slotId)
                .orElseThrow(() -> new RuntimeException("Availability slot not found with id: " + slotId));

        // Отменяем бронирование слота
        slot.cancelBooking();
        availabilitySlotService.updateAvailabilitySlot(slot);

        // Находим связанный урок и отменяем его
        Optional<Lesson> relatedLesson = lessonRepository.findBySlotId(slotId).stream().findFirst();
        if (relatedLesson.isPresent()) {
            Lesson lesson = relatedLesson.get();
            lesson.cancelLesson(Lesson.CancelledBy.MANAGER, "Slot booking cancelled");
            lessonService.updateLesson(lesson);
        }
    }

    public boolean isSlotAvailableForBooking(Long slotId) {
        Optional<AvailabilitySlot> slot = availabilitySlotService.findById(slotId);
        return slot.isPresent() && slot.get().isAvailable();
    }

    public boolean isSlotBookedByStudent(Long slotId, Long studentId) {
        Optional<AvailabilitySlot> slot = availabilitySlotService.findById(slotId);
        if (!slot.isPresent() || !slot.get().isBooked()) {
            return false;
        }

        // Проверяем, есть ли урок, связанный с этим слотом и студентом
        return lessonRepository.findBySlotId(slotId).stream()
                .anyMatch(lesson -> lesson.getStudent().getId().equals(studentId));
    }
}