
package com.crm.system.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class TeacherNoteDto {
    private Long id;
    private Long teacherId;
    private Long studentId;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
