package com.example.DemoAdmin.dto.response;

import lombok.Data;

import java.util.Map;

@Data
public class SeatTypesResponse {
    private Map<String, SeatTypeDTOResponse> seatTypes;
}
