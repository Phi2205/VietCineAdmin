package com.example.DemoAdmin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RevenueResponse {
    private long totalRevenue;
    private List<RevenueDetailDTO> details;
}