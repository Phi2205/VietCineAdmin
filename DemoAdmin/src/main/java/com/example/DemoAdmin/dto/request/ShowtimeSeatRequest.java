package com.example.DemoAdmin.dto.request;

import lombok.Data;

@Data
public class ShowtimeSeatRequest {
    private Integer showtimeId;
    private Integer seatId;
    private Integer status;
}
