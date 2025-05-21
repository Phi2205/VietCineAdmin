package com.example.DemoAdmin.dto.response;

import lombok.Data;

import java.time.Instant;

@Data
public class ShowtimeResponse {
    private Integer id; // ID của suất chiếu
    private Integer movieId; // Thêm movieId
    private Integer screenId; // Thêm screenId
    private String movieTitle;
    private String screenNumber;
    private String theaterName;
    private Instant startTime;
    private Instant endTime;
}