package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.ScreenRequest;
import com.example.DemoAdmin.dto.request.ScreenSeatRequest;
import com.example.DemoAdmin.dto.request.SeatRequest;
import com.example.DemoAdmin.dto.response.ScreenResponse;
import com.example.DemoAdmin.dto.response.SeatResponse;
import com.example.DemoAdmin.entity.Screen;
import com.example.DemoAdmin.entity.Seat;
import com.example.DemoAdmin.mapper.IScreenMapper;
import com.example.DemoAdmin.repository.IScreenRepository;
import com.example.DemoAdmin.service.screen.ScreenService;
import com.example.DemoAdmin.service.seat.SeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/screens")
@RequiredArgsConstructor
public class ScreenController {

    private final IScreenRepository screenRepository;
    private final IScreenMapper screenMapper;
    private final ScreenService screenService;
    private final SeatService seatService;

    @GetMapping
    public ResponseEntity<List<ScreenResponse>> getAllScreens() {
        List<Screen> screens = screenRepository.findAll();
        List<ScreenResponse> screenResponses = screens.stream()
                .map(screenMapper::toScreenResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(screenResponses);
    }

    @GetMapping("/theater/{theaterId}")
    public ResponseEntity<List<ScreenResponse>> getScreensByTheaterId(@PathVariable Integer theaterId) {
        List<Screen> screens = screenRepository.findByTheaterId(theaterId);
        List<ScreenResponse> screenResponses = screens.stream()
                .map(screenMapper::toScreenResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(screenResponses);
    }

    @GetMapping("/{screenId}")
    public ResponseEntity<ScreenResponse> getScreenById(@PathVariable Integer screenId) {
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new RuntimeException("Screen not found with id: " + screenId));
        ScreenResponse screenResponse = screenMapper.toScreenResponse(screen);
        return ResponseEntity.ok(screenResponse);
    }
    @PostMapping
    public ResponseEntity<ScreenResponse> createShowtime(@RequestBody ScreenRequest request) {
        ScreenResponse response = screenService.createScreen(request);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/{id}")
    public ResponseEntity<ScreenResponse> updateTheater(@PathVariable Integer id, @RequestBody ScreenRequest request) {
        ScreenResponse response = screenService.updateScreen(id, request);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteScreen(@PathVariable Integer id) {
        screenService.deleteScreen(id);
        return ResponseEntity.noContent().build();
    }
    @PostMapping("/{screenId}/setupSeats")
    public ResponseEntity<Void> setupSeats(@RequestBody ScreenSeatRequest request, @PathVariable Integer screenId) {
        seatService.updateSeats(request,screenId);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/{screenId}/seats")
    public ResponseEntity<List<SeatResponse>> getAllSeatScreen(@PathVariable Integer screenId) {
        List<SeatResponse> seatScreen = seatService.getAllSeatByScreenId(screenId);
        return ResponseEntity.ok(seatScreen);
    }

}