package com.crm.system.integration;

import com.crm.system.CrmSystemApplication;
import com.crm.system.dto.BookSlotDto;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = CrmSystemApplication.class)
@AutoConfigureMockMvc
public class GroupLessonRegistrationControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(roles = {"STUDENT"})
    void testBookSlot() throws Exception {
        // Given
        BookSlotDto bookSlotDto = new BookSlotDto();
        bookSlotDto.setSlotId(1L);
        bookSlotDto.setStudentId(1L);

        // When & Then
        mockMvc.perform(post("/api/bookings")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(bookSlotDto)))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = {"STUDENT"})
    void testGetStudentRegistrations() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/students/{studentId}/registrations", 1L)
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = {"TEACHER"})
    void testGetGroupLessonRegistrations() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/group-lessons/{groupLessonId}/registrations", 1L))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = {"STUDENT"})
    void testGetRegistrationById() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/registrations/{id}", 1L))
                .andExpect(status().isOk());
    }
}