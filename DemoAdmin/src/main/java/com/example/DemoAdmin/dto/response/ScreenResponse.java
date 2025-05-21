package com.example.DemoAdmin.dto.response;

import lombok.Data;

@Data
public class ScreenResponse {
    private Integer id;
    private String screenNumber;
    private Integer totalSeats;
    private TheaterResponse theater;
}

