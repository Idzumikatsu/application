package com.crm.system.controller;

import com.crm.system.dto.CalendarDayDto;
import com.crm.system.dto.CalendarSlotDto;
import com.crm.system.service.CalendarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api")
public class CalendarController {

    @Autowired
    private CalendarService calendarService;

    @GetMapping("/teachers/{teacherId}/calendar")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<CalendarDayDto>> getTeacherCalendar(
            @PathVariable Long teacherId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        List<CalendarDayDto> calendar = calendarService.getTeacherCalendar(teacherId, startDate, endDate);
        return ResponseEntity.ok(calendar);
    }

    @GetMapping("/students/{studentId}/calendar")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<CalendarDayDto>> getStudentCalendar(
            @PathVariable Long studentId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate) {

        List<CalendarDayDto> calendar = calendarService.getStudentCalendar(studentId, startDate, endDate);
        return ResponseEntity.ok(calendar);
    }

    @GetMapping("/teachers/{teacherId}/calendar/{date}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<CalendarSlotDto>> getTeacherDaySlots(
            @PathVariable Long teacherId,
            @PathVariable String date) {

        LocalDate slotDate = LocalDate.parse(date);
        List<CalendarSlotDto> slots = calendarService.getTeacherDaySlots(teacherId, slotDate);
        return ResponseEntity.ok(slots);
    }
}