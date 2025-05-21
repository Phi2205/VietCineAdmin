package com.example.DemoAdmin.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SeatPriceRequest {
    @NotNull
    private Integer seatTypeId;
    @NotNull
    private Integer screenId;
    @NotNull
    private Integer price;
}
