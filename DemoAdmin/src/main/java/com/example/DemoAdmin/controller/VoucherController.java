package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.VoucherRequest;
import com.example.DemoAdmin.dto.response.ApiResponse;
import com.example.DemoAdmin.dto.response.VoucherResponse;
import com.example.DemoAdmin.service.voucher.IVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final IVoucherService voucherService;

    @PostMapping
    public ResponseEntity<ApiResponse<VoucherResponse>> createVoucher(@RequestBody VoucherRequest request) {
        try {
            VoucherResponse response = voucherService.createVoucher(request);
            return ResponseEntity.ok(new ApiResponse<>("Voucher created successfully", response));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(new ApiResponse<>("Failed to create voucher: " + e.getMessage(), null));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateVoucher(@PathVariable Integer id, @RequestBody VoucherRequest request) {
        try {
            VoucherResponse response = voucherService.updateVoucher(id, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherResponse> getVoucherById(@PathVariable Integer id) {
        VoucherResponse response = voucherService.getVoucherById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<VoucherResponse>> getAllVouchers() {
        List<VoucherResponse> voucherResponses = voucherService.getAllVouchers();
        return ResponseEntity.ok(voucherResponses);
    }

    @GetMapping("/by-brand/{theaterBrandId}")
    public ResponseEntity<List<VoucherResponse>> getVoucherByBrand(@PathVariable Integer theaterBrandId) {
        List<VoucherResponse> voucherResponses = voucherService.getVoucherByBrand(theaterBrandId);
        return ResponseEntity.ok(voucherResponses);
    }

    @GetMapping("/{id}/is-used")
    public ResponseEntity<Boolean> getVoucherIsUsed(@PathVariable Integer id) {
        boolean isUsed = voucherService.getVoucherIsUsed(id);
        return ResponseEntity.ok(isUsed);
    }
}