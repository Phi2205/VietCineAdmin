package com.example.DemoAdmin.service.seatprice;

import com.example.DemoAdmin.dto.request.SeatPriceRequest;
import com.example.DemoAdmin.dto.request.SeatTypesRequest;
import com.example.DemoAdmin.dto.response.SeatPriceResponse;
import com.example.DemoAdmin.dto.response.SeatTypesResponse;

import java.util.List;

public interface ISeatPriceService {
    SeatPriceResponse addSeatPrice(SeatPriceRequest request);
    public List<SeatPriceResponse> getAllSeatPrices();
    public void deleteSeatPrice(Integer id);
    public SeatPriceResponse updateSeatPrice(SeatPriceRequest request, Integer id);
    public SeatPriceResponse getSeatPriceById(Integer id);
    public void updateSeatPriceOfScreen(SeatTypesRequest seatTypesRequest,Integer screenId);
    public SeatTypesResponse getSeatPriceOfScreen(Integer screenId);
}
