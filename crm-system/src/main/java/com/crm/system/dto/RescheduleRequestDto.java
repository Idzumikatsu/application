
package com.crm.system.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RescheduleRequestDto {
    @NotBlank(message = "Reason cannot be blank")
    private String reason;
}
