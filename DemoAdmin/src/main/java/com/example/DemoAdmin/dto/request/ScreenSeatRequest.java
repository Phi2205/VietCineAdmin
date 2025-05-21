package com.example.DemoAdmin.dto.request;

import com.example.DemoAdmin.entity.Seat;
import lombok.Data;

import java.util.List;
@Data
public class ScreenSeatRequest {
    private Integer rows;
    private Integer cols;
    private List<SeatRequest> listSeats;
}
