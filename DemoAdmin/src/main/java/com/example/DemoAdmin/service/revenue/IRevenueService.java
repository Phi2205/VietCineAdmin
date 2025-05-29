package com.example.DemoAdmin.service.revenue;

import com.example.DemoAdmin.dto.request.RevenueFilterRequest;
import com.example.DemoAdmin.dto.response.RevenueResponse;

public interface IRevenueService {
    RevenueResponse getRevenueByAll(RevenueFilterRequest request);
}