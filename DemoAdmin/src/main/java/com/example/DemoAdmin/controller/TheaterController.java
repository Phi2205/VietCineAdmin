package com.example.DemoAdmin.controller;


import com.example.DemoAdmin.dto.request.TheaterRequest;
import com.example.DemoAdmin.dto.response.ApiResponse;
import com.example.DemoAdmin.dto.response.ShowtimeResponse;
import com.example.DemoAdmin.dto.response.TheaterResponse;
import com.example.DemoAdmin.entity.Theater;
import com.example.DemoAdmin.mapper.ITheaterMapper;
import com.example.DemoAdmin.repository.ITheaterRepository;

import com.example.DemoAdmin.service.theater.ITheaterService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;


@RestController
@RequestMapping("/api/admin/theaters")
@RequiredArgsConstructor
public class TheaterController {

    private final ITheaterRepository theaterRepository;
    private final ITheaterMapper theaterMapper;

    @GetMapping
    public ResponseEntity<List<TheaterResponse>> getAllTheaters() {
        List<Theater> theaters = theaterRepository.findAll();
        List<TheaterResponse> theaterResponses = theaters.stream()
                .map(theaterMapper::toTheaterResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(theaterResponses);
    }
    @Autowired
    private ITheaterService theaterService;

    @PostMapping
    public ResponseEntity<ApiResponse<TheaterResponse>> createTheater(@RequestBody TheaterRequest request) {
        TheaterResponse response = theaterService.createTheater(request);
        return ResponseEntity.ok(new ApiResponse<>("Theater created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TheaterResponse> updateTheater(@PathVariable Integer id, @RequestBody TheaterRequest request) {
        TheaterResponse response = theaterService.updateTheater(id, request);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTheater(@PathVariable Integer id) {
        theaterService.deleteTheater(id);
        return ResponseEntity.noContent().build();
    }


    // Lấy suất chiếu theo ID
    @GetMapping("/{id}")
    public ResponseEntity<TheaterResponse> getTheaterById(@PathVariable Integer id) {
        TheaterResponse response = theaterService.getTheaterById(id);
        return ResponseEntity.ok(response);
    }
}