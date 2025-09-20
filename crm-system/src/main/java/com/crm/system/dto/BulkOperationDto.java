package com.crm.system.dto;

import java.util.List;

public class BulkOperationDto {
    private List<Long> ids;

    // Constructors
    public BulkOperationDto() {}

    public BulkOperationDto(List<Long> ids) {
        this.ids = ids;
    }

    // Getters and Setters
    public List<Long> getIds() {
        return ids;
    }

    public void setIds(List<Long> ids) {
        this.ids = ids;
    }
}