package com.example.DemoAdmin.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@NoArgsConstructor // Constructor không tham số (cho MapStruct/Jackson)
@AllArgsConstructor // Constructor đầy đủ (cho VoucherController)
public class VoucherResponse {
    private Integer id;
    private Integer discount;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+07:00")
    private Date validFrom;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @JsonFormat(pattern = "yyyy-MM-dd", timezone = "GMT+07:00")
    private Date validUntil;
    private Integer minBillPrice;
    private String description;
    private Boolean isActive;
    private Integer theaterBrandId;
}