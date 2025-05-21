package com.example.DemoAdmin.dto.request;

import lombok.Data;

@Data
public class ScreenRequest {
    private Integer theaterId;
    private String screenNumber;
    private Integer totalSeats;
}
