package com.example.DemoAdmin.service.seatTypeForPA;

import com.example.DemoAdmin.dto.response.SeatTypeForPAResponse;

import java.util.List;

public interface ISeatTypeForPAService {
    List<SeatTypeForPAResponse> getAllSeatTypes();
}