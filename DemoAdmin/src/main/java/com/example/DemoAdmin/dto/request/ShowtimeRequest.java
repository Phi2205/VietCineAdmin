package com.example.DemoAdmin.dto.request;

import lombok.Data;

import java.time.Instant;

@Data
public class ShowtimeRequest {
    private Integer movieId; // ID của phim
    private Integer screenId; // ID của màn hình
    private Instant startTime; // Thời gian bắt đầu
}