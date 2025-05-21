package com.example.DemoAdmin.dto.response;

import com.example.DemoAdmin.entity.Screen;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeatPriceResponse {
    private Integer seatPriceId;

    private Integer seatTypeId;
    private ScreenResponse screen;

    private Integer price;
}
