package com.example.DemoAdmin.dto.response;

import lombok.Data;

@Data
public class ShowtimeSeatResponse {
    private Integer id;
    private Integer showtimeId;
    private Integer seatId;
    private String status;
}
