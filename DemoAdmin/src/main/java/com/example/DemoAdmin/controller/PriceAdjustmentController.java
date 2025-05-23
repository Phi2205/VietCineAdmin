package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.PriceAdjustmentRequest;
import com.example.DemoAdmin.dto.response.ApiResponse;
import com.example.DemoAdmin.dto.response.PriceAdjustmentResponse;
import com.example.DemoAdmin.service.priceAdjustment.IPriceAdjustmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/price-adjustments")
@RequiredArgsConstructor
public class PriceAdjustmentController {

    private final IPriceAdjustmentService priceAdjustmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<PriceAdjustmentResponse>> createPriceAdjustment(@RequestBody PriceAdjustmentRequest request) {
        try {
            PriceAdjustmentResponse response = priceAdjustmentService.createPriceAdjustment(request);
            return ResponseEntity.ok(new ApiResponse<>("Tạo điều chỉnh giá thành công", response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>("Không thể tạo điều chỉnh giá: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePriceAdjustment(@PathVariable Integer id, @RequestBody PriceAdjustmentRequest request) {
        try {
            PriceAdjustmentResponse response = priceAdjustmentService.updatePriceAdjustment(id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<PriceAdjustmentResponse> getPriceAdjustmentById(@PathVariable Integer id) {
        PriceAdjustmentResponse response = priceAdjustmentService.getPriceAdjustmentById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PriceAdjustmentResponse>> getAllPriceAdjustments() {
        List<PriceAdjustmentResponse> responses = priceAdjustmentService.getAllPriceAdjustments();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/by-seat-type/{seatTypeId}")
    public ResponseEntity<List<PriceAdjustmentResponse>> getPriceAdjustmentsBySeatType(@PathVariable Integer seatTypeId) {
        List<PriceAdjustmentResponse> responses = priceAdjustmentService.getPriceAdjustmentsBySeatType(seatTypeId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}/is-active")
    public ResponseEntity<Boolean> isAdjustmentActive(@PathVariable Integer id) {
        boolean isActive = priceAdjustmentService.isAdjustmentActive(id);
        return ResponseEntity.ok(isActive);
    }
}