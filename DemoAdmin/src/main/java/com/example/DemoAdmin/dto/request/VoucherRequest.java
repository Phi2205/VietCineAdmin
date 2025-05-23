package com.example.DemoAdmin.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;

@Data
@NoArgsConstructor // Constructor không tham số (cho MapStruct/Jackson)
@AllArgsConstructor // Constructor đầy đủ (cho VoucherController)
public class VoucherRequest {
    private Integer discount;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date validFrom;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date validUntil;
    private Integer minBillPrice;
    private String description;
    private Boolean isActive;
    private Integer theaterBrandId;
}