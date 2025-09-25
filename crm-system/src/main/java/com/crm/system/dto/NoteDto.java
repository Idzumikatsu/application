
package com.crm.system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class NoteDto {
    @NotBlank(message = "Note content cannot be blank")
    private String note;
}
