package com.example.DemoAdmin.dto.request;

import lombok.Data;

import java.util.Map;

@Data
public class SeatTypesRequest {
    private Map<String, SeatTypeDTORequest> seatTypes;
}
