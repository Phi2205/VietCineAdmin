package com.example.DemoAdmin.dto.request;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.Nullable;

import java.util.Date;

@Data
public class PriceAdjustmentRequest {
    private Integer seatTypeId;
    @Nullable
    private String description;
    @Nullable
    private String dayOfWeek;
    @Nullable
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date specificDate;
    private Integer priceIncrease;
    private Boolean isActive;
    private Date validFrom;
    private Date until;
}