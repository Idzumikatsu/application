package com.crm.system.dto;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public class CalendarDayDto {
    private LocalDate date;
    private List<CalendarSlotDto> slots;

    // Constructors
    public CalendarDayDto() {}

    public CalendarDayDto(LocalDate date, List<CalendarSlotDto> slots) {
        this.date = date;
        this.slots = slots;
    }

    // Getters and Setters
    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public List<CalendarSlotDto> getSlots() {
        return slots;
    }

    public void setSlots(List<CalendarSlotDto> slots) {
        this.slots = slots;
    }
}