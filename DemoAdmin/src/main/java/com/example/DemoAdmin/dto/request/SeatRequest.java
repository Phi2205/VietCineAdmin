package com.example.DemoAdmin.dto.request;

import lombok.Data;

@Data
public class SeatRequest {
    private Integer screenId;
    private String row;
    private Integer column;
    private Integer seatTypeId;
}
