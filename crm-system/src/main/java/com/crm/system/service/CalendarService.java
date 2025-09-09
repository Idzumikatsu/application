package com.crm.system.service;

import com.crm.system.dto.CalendarDayDto;
import com.crm.system.dto.CalendarSlotDto;
import com.crm.system.model.AvailabilitySlot;
import com.crm.system.model.GroupLesson;
import com.crm.system.model.GroupLessonRegistration;
import com.crm.system.model.Lesson;
import com.crm.system.repository.AvailabilitySlotRepository;
import com.crm.system.repository.LessonRepository;
import com.crm.system.service.AvailabilitySlotService;
import com.crm.system.service.GroupLessonService;
import com.crm.system.service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CalendarService {

    @Autowired
    private AvailabilitySlotRepository availabilitySlotRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private AvailabilitySlotService availabilitySlotService;

    @Autowired
    private LessonService lessonService;
    
    @Autowired
    private GroupLessonService groupLessonService;

    public List<CalendarDayDto> getTeacherCalendar(Long teacherId, LocalDate startDate, LocalDate endDate) {
        List<CalendarDayDto> calendarDays = new ArrayList<>();
        
        // Получаем все слоты доступности преподавателя за период
        List<AvailabilitySlot> slots = availabilitySlotService.findByTeacherIdAndDateRange(teacherId, startDate, endDate);
        
        // Получаем все уроки преподавателя за период
        List<Lesson> lessons = lessonService.findByTeacherIdAndDateRange(teacherId, startDate, endDate);
        
        // Получаем все групповые уроки преподавателя за период
        List<GroupLesson> groupLessons = groupLessonService.findByTeacherIdAndDateRange(teacherId, startDate, endDate);
        
        // Группируем данные по дням
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            List<CalendarSlotDto> daySlots = new ArrayList<>();
            
            // Фильтруем слоты по дате
            List<AvailabilitySlot> dayAvailabilitySlots = slots.stream()
                    .filter(slot -> slot.getSlotDate().equals(date))
                    .collect(Collectors.toList());
            
            // Фильтруем уроки по дате
            List<Lesson> dayLessons = lessons.stream()
                    .filter(lesson -> lesson.getScheduledDate().equals(date))
                    .collect(Collectors.toList());
            
            // Фильтруем групповые уроки по дате
            List<GroupLesson> dayGroupLessons = groupLessons.stream()
                    .filter(groupLesson -> groupLesson.getScheduledDate().equals(date))
                    .collect(Collectors.toList());
            
            // Преобразуем слоты доступности в календарные слоты
            for (AvailabilitySlot slot : dayAvailabilitySlots) {
                CalendarSlotDto calendarSlot = new CalendarSlotDto();
                calendarSlot.setSlotId(slot.getId());
                calendarSlot.setTime(slot.getSlotTime());
                calendarSlot.setDurationMinutes(slot.getDurationMinutes());
                calendarSlot.setSlotStatus(slot.getStatus());
                calendarSlot.setIsBooked(slot.getIsBooked());
                
                // Проверяем, есть ли урок в этом слоте
                Lesson lessonInSlot = dayLessons.stream()
                        .filter(lesson -> lesson.getSlot() != null && lesson.getSlot().getId().equals(slot.getId()))
                        .findFirst()
                        .orElse(null);
                
                if (lessonInSlot != null) {
                    calendarSlot.setLessonId(lessonInSlot.getId());
                    calendarSlot.setLessonStatus(lessonInSlot.getStatus());
                    calendarSlot.setStudentId(lessonInSlot.getStudent().getId());
                    calendarSlot.setStudentName(lessonInSlot.getStudent().getFirstName() + " " + 
                                              lessonInSlot.getStudent().getLastName());
                }
                
                daySlots.add(calendarSlot);
            }
            
            // Добавляем уроки без слотов (если такие есть)
            List<Lesson> lessonsWithoutSlots = dayLessons.stream()
                    .filter(lesson -> lesson.getSlot() == null)
                    .collect(Collectors.toList());
            
            for (Lesson lesson : lessonsWithoutSlots) {
                CalendarSlotDto calendarSlot = new CalendarSlotDto();
                calendarSlot.setLessonId(lesson.getId());
                calendarSlot.setTime(lesson.getScheduledTime());
                calendarSlot.setDurationMinutes(lesson.getDurationMinutes());
                calendarSlot.setLessonStatus(lesson.getStatus());
                calendarSlot.setStudentId(lesson.getStudent().getId());
                calendarSlot.setStudentName(lesson.getStudent().getFirstName() + " " + 
                                          lesson.getStudent().getLastName());
                calendarSlot.setIsBooked(true);
                
                daySlots.add(calendarSlot);
            }
            
            // Добавляем групповые уроки
            for (GroupLesson groupLesson : dayGroupLessons) {
                CalendarSlotDto calendarSlot = new CalendarSlotDto();
                calendarSlot.setGroupLessonId(groupLesson.getId());
                calendarSlot.setGroupLessonTopic(groupLesson.getLessonTopic());
                calendarSlot.setTime(groupLesson.getScheduledTime());
                calendarSlot.setDurationMinutes(groupLesson.getDurationMinutes());
                calendarSlot.setGroupLessonStatus(groupLesson.getStatus());
                calendarSlot.setIsBooked(true);
                calendarSlot.setMaxStudents(groupLesson.getMaxStudents());
                calendarSlot.setCurrentStudents(groupLesson.getCurrentStudents());
                
                daySlots.add(calendarSlot);
            }
            
            calendarDays.add(new CalendarDayDto(date, daySlots));
        }
        
        return calendarDays;
    }

    public List<CalendarDayDto> getStudentCalendar(Long studentId, LocalDate startDate, LocalDate endDate) {
        List<CalendarDayDto> calendarDays = new ArrayList<>();
        
        // Получаем все уроки студента за период
        List<Lesson> lessons = lessonService.findByStudentIdAndDateRange(studentId, startDate, endDate);
        
        // Получаем все регистрации на групповые уроки студента за период
        List<GroupLessonRegistration> groupLessonRegistrations = groupLessonService.findGroupLessonRegistrationsByStudentIdAndDateRange(
                studentId, startDate, endDate);
        
        // Группируем данные по дням
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            List<CalendarSlotDto> daySlots = new ArrayList<>();
            
            // Фильтруем уроки по дате
            List<Lesson> dayLessons = lessons.stream()
                    .filter(lesson -> lesson.getScheduledDate().equals(date))
                    .collect(Collectors.toList());
            
            // Фильтруем регистрации на групповые уроки по дате
            List<GroupLessonRegistration> dayGroupLessonRegistrations = groupLessonRegistrations.stream()
                    .filter(registration -> registration.getGroupLesson().getScheduledDate().equals(date))
                    .collect(Collectors.toList());
            
            // Преобразуем уроки в календарные слоты
            for (Lesson lesson : dayLessons) {
                CalendarSlotDto calendarSlot = new CalendarSlotDto();
                calendarSlot.setLessonId(lesson.getId());
                calendarSlot.setTime(lesson.getScheduledTime());
                calendarSlot.setDurationMinutes(lesson.getDurationMinutes());
                calendarSlot.setLessonStatus(lesson.getStatus());
                calendarSlot.setStudentId(lesson.getStudent().getId());
                calendarSlot.setStudentName(lesson.getStudent().getFirstName() + " " + 
                                          lesson.getStudent().getLastName());
                calendarSlot.setIsBooked(true);
                
                if (lesson.getSlot() != null) {
                    calendarSlot.setSlotId(lesson.getSlot().getId());
                    calendarSlot.setSlotStatus(lesson.getSlot().getStatus());
                }
                
                if (lesson.getTeacher() != null) {
                    calendarSlot.setStudentName(lesson.getTeacher().getFirstName() + " " + 
                                               lesson.getTeacher().getLastName());
                }
                
                daySlots.add(calendarSlot);
            }
            
            // Добавляем групповые уроки
            for (GroupLessonRegistration registration : dayGroupLessonRegistrations) {
                GroupLesson groupLesson = registration.getGroupLesson();
                CalendarSlotDto calendarSlot = new CalendarSlotDto();
                calendarSlot.setGroupLessonId(groupLesson.getId());
                calendarSlot.setGroupLessonTopic(groupLesson.getLessonTopic());
                calendarSlot.setTime(groupLesson.getScheduledTime());
                calendarSlot.setDurationMinutes(groupLesson.getDurationMinutes());
                calendarSlot.setGroupLessonStatus(groupLesson.getStatus());
                calendarSlot.setIsBooked(true);
                calendarSlot.setMaxStudents(groupLesson.getMaxStudents());
                calendarSlot.setCurrentStudents(groupLesson.getCurrentStudents());
                calendarSlot.setRegistrationStatus(registration.getRegistrationStatus());
                
                if (groupLesson.getTeacher() != null) {
                    calendarSlot.setStudentName(groupLesson.getTeacher().getFirstName() + " " + 
                                               groupLesson.getTeacher().getLastName());
                }
                
                daySlots.add(calendarSlot);
            }
            
            calendarDays.add(new CalendarDayDto(date, daySlots));
        }
        
        return calendarDays;
    }

    public List<CalendarSlotDto> getTeacherDaySlots(Long teacherId, LocalDate date) {
        // Получаем слоты доступности преподавателя на дату
        List<AvailabilitySlot> slots = availabilitySlotService.findByTeacherIdAndDate(teacherId, date);
        
        // Получаем уроки преподавателя на дату
        List<Lesson> lessons = lessonService.findByTeacherIdAndDate(teacherId, date);
        
        // Получаем групповые уроки преподавателя на дату
        List<GroupLesson> groupLessons = groupLessonService.findByTeacherIdAndDate(teacherId, date);
        
        List<CalendarSlotDto> calendarSlots = new ArrayList<>();
        
        // Преобразуем слоты доступности в календарные слоты
        for (AvailabilitySlot slot : slots) {
            CalendarSlotDto calendarSlot = new CalendarSlotDto();
            calendarSlot.setSlotId(slot.getId());
            calendarSlot.setTime(slot.getSlotTime());
            calendarSlot.setDurationMinutes(slot.getDurationMinutes());
            calendarSlot.setSlotStatus(slot.getStatus());
            calendarSlot.setIsBooked(slot.getIsBooked());
            
            // Проверяем, есть ли урок в этом слоте
            Lesson lessonInSlot = lessons.stream()
                    .filter(lesson -> lesson.getSlot() != null && lesson.getSlot().getId().equals(slot.getId()))
                    .findFirst()
                    .orElse(null);
            
            if (lessonInSlot != null) {
                calendarSlot.setLessonId(lessonInSlot.getId());
                calendarSlot.setLessonStatus(lessonInSlot.getStatus());
                calendarSlot.setStudentId(lessonInSlot.getStudent().getId());
                calendarSlot.setStudentName(lessonInSlot.getStudent().getFirstName() + " " + 
                                          lessonInSlot.getStudent().getLastName());
            }
            
            calendarSlots.add(calendarSlot);
        }
        
        // Добавляем уроки без слотов (если такие есть)
        List<Lesson> lessonsWithoutSlots = lessons.stream()
                .filter(lesson -> lesson.getSlot() == null)
                .collect(Collectors.toList());
        
        for (Lesson lesson : lessonsWithoutSlots) {
            CalendarSlotDto calendarSlot = new CalendarSlotDto();
            calendarSlot.setLessonId(lesson.getId());
            calendarSlot.setTime(lesson.getScheduledTime());
            calendarSlot.setDurationMinutes(lesson.getDurationMinutes());
            calendarSlot.setLessonStatus(lesson.getStatus());
            calendarSlot.setStudentId(lesson.getStudent().getId());
            calendarSlot.setStudentName(lesson.getStudent().getFirstName() + " " + 
                                      lesson.getStudent().getLastName());
            calendarSlot.setIsBooked(true);
            
            calendarSlots.add(calendarSlot);
        }
        
        // Добавляем групповые уроки
        for (GroupLesson groupLesson : groupLessons) {
            CalendarSlotDto calendarSlot = new CalendarSlotDto();
            calendarSlot.setGroupLessonId(groupLesson.getId());
            calendarSlot.setGroupLessonTopic(groupLesson.getLessonTopic());
            calendarSlot.setTime(groupLesson.getScheduledTime());
            calendarSlot.setDurationMinutes(groupLesson.getDurationMinutes());
            calendarSlot.setGroupLessonStatus(groupLesson.getStatus());
            calendarSlot.setIsBooked(true);
            calendarSlot.setMaxStudents(groupLesson.getMaxStudents());
            calendarSlot.setCurrentStudents(groupLesson.getCurrentStudents());
            
            calendarSlots.add(calendarSlot);
        }
        
        return calendarSlots;
    }
}