package com.example.DemoAdmin.dto.response;

import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceAdjustmentResponse {
    private Integer adjustmentId;
    private Integer seatTypeId;
    private String description;
    private String dayOfWeek;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+07:00")
    private Date specificDate;
    private Integer priceIncrease;
    private Boolean isActive;
    private Date validFrom;
    private Date Until;
}