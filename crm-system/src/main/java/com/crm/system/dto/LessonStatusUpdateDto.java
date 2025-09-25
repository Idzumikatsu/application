
package com.crm.system.dto;

import com.crm.system.model.Lesson;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LessonStatusUpdateDto {
    @NotNull(message = "Status cannot be null")
    private Lesson.LessonStatus status;
    private String reason; // Optional, for cancellation
}
