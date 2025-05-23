package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.response.SeatTypeForPAResponse;
import com.example.DemoAdmin.dto.response.SeatTypeForPAResponse;
import com.example.DemoAdmin.service.seatTypeForPA.ISeatTypeForPAService;
import com.example.DemoAdmin.service.seatTypeForPA.ISeatTypeForPAService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/seat-types")
@RequiredArgsConstructor
public class SeatTypeForPAController {

    private final ISeatTypeForPAService seatTypeForPAService;

    @GetMapping
    public ResponseEntity<List<SeatTypeForPAResponse>> getAllSeatTypes() {
        List<SeatTypeForPAResponse> responses = seatTypeForPAService.getAllSeatTypes();
        return ResponseEntity.ok(responses);
    }
}