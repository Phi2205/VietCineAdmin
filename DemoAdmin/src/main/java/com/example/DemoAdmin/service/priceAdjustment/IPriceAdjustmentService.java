package com.example.DemoAdmin.service.priceAdjustment;

import com.example.DemoAdmin.dto.request.PriceAdjustmentRequest;
import com.example.DemoAdmin.dto.response.PriceAdjustmentResponse;
import java.util.List;

public interface IPriceAdjustmentService {
    PriceAdjustmentResponse createPriceAdjustment(PriceAdjustmentRequest request);
    PriceAdjustmentResponse updatePriceAdjustment(Integer id, PriceAdjustmentRequest request);
    PriceAdjustmentResponse getPriceAdjustmentById(Integer id);
    List<PriceAdjustmentResponse> getAllPriceAdjustments();
    List<PriceAdjustmentResponse> getPriceAdjustmentsBySeatType(Integer seatTypeId);
    boolean isAdjustmentActive(Integer id); // Kiểm tra hiệu lực
}