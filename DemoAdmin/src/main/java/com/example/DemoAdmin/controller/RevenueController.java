package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.RevenueFilterRequest;
import com.example.DemoAdmin.dto.response.RevenueResponse;
import com.example.DemoAdmin.service.revenue.IRevenueService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/revenue")
public class RevenueController {

    @Autowired
    private IRevenueService revenueService;

    @PostMapping("/by-all")
    public ResponseEntity<RevenueResponse> getRevenueByAll(@RequestBody RevenueFilterRequest request) {
        return ResponseEntity.ok(revenueService.getRevenueByAll(request));
    }
}