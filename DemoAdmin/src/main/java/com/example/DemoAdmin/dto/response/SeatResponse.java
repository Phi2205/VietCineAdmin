package com.example.DemoAdmin.dto.response;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeatResponse {
    private Integer id;
    private Integer screenId;
    private String row;
    private Integer column;
    private Integer seatTypeId;

}