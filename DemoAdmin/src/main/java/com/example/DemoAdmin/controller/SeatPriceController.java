package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.MovieRequest;
import com.example.DemoAdmin.dto.request.SeatPriceRequest;
import com.example.DemoAdmin.dto.request.SeatRequest;
import com.example.DemoAdmin.dto.request.SeatTypesRequest;
import com.example.DemoAdmin.dto.response.ApiResponse;
import com.example.DemoAdmin.dto.response.MovieResponse;
import com.example.DemoAdmin.dto.response.SeatPriceResponse;
import com.example.DemoAdmin.dto.response.SeatTypesResponse;
import com.example.DemoAdmin.service.seatprice.SeatPriceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/seatprices")
@RequiredArgsConstructor
public class SeatPriceController {
    private final SeatPriceService seatPriceService;
    @PostMapping
    public ResponseEntity<ApiResponse<SeatPriceResponse>> createSeatPrice(@RequestBody SeatPriceRequest request) {
        System.out.println("Request");
        System.out.println(request);
        SeatPriceResponse response = seatPriceService.addSeatPrice(request);
        return ResponseEntity.ok(new ApiResponse<>("Seat price created successfully", response));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<SeatPriceResponse>>> getAllSeatPrices(){
        List<SeatPriceResponse> responses = seatPriceService.getAllSeatPrices();
        return ResponseEntity.ok(new ApiResponse<>("Seat price retrieved successfully", responses));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SeatPriceResponse> getSeatPrice(@PathVariable Integer id){
        SeatPriceResponse response = seatPriceService.getSeatPriceById(id);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/{id}")
    public ResponseEntity<SeatPriceResponse> updateSeatPrice(@RequestBody SeatPriceRequest request, @PathVariable Integer id){
        SeatPriceResponse response = seatPriceService.updateSeatPrice(request, id);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeatPrice(@PathVariable Integer id){
        seatPriceService.deleteSeatPrice(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/screen/{screenId}")
    public ResponseEntity<Void> updateSeatPriceOfScreen(@RequestBody SeatTypesRequest request, @PathVariable Integer screenId){
        seatPriceService.updateSeatPriceOfScreen(request, screenId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/screen/{screenId}")
    public SeatTypesResponse getSeatPriceOfScreen(@PathVariable Integer screenId){
        SeatTypesResponse response = seatPriceService.getSeatPriceOfScreen(screenId);
        return response;
    }
}
