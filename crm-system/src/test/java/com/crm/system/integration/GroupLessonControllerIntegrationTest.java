package com.crm.system.integration;

import com.crm.system.CrmSystemApplication;
import com.crm.system.model.GroupLesson;
import com.crm.system.model.User;
import com.crm.system.model.UserRole;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.time.LocalTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(classes = CrmSystemApplication.class)
@AutoConfigureMockMvc
public class GroupLessonControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private User teacher;

    @BeforeEach
    void setUp() {
        // Create a teacher user for testing
        teacher = new User();
        teacher.setId(1L);
        teacher.setEmail("teacher@example.com");
        teacher.setFirstName("Jane");
        teacher.setLastName("Smith");
        teacher.setRole(UserRole.TEACHER);
    }

    @Test
    @WithMockUser(roles = {"TEACHER"})
    void testCreateGroupLesson() throws Exception {
        // Given
        GroupLesson groupLesson = new GroupLesson();
        groupLesson.setTeacher(teacher);
        groupLesson.setLessonTopic("English Grammar Basics");
        groupLesson.setScheduledDate(LocalDate.now().plusDays(1));
        groupLesson.setScheduledTime(LocalTime.of(10, 0));
        groupLesson.setDurationMinutes(60);

        // When & Then
        mockMvc.perform(post("/api/teachers/group-lessons")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(groupLesson)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lessonTopic").value("English Grammar Basics"))
                .andExpect(jsonPath("$.teacherName").value("Jane Smith"));
    }

    @Test
    @WithMockUser(roles = {"TEACHER"})
    void testGetTeacherGroupLessons() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/teachers/{teacherId}/group-lessons", 1L)
                .param("page", "0")
                .param("size", "10"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = {"STUDENT"})
    void testGetAvailableGroupLessons() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/group-lessons/available")
                .param("teacherId", "1"))
                .andExpect(status().isOk());
    }
}