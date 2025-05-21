package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.ShowtimeRequest;
import com.example.DemoAdmin.dto.request.ShowtimeSeatRequest;
import com.example.DemoAdmin.dto.response.SeatResponse;
import com.example.DemoAdmin.dto.response.ShowtimeResponse;
import com.example.DemoAdmin.entity.Seat;
import com.example.DemoAdmin.service.seat.SeatService;
import com.example.DemoAdmin.service.showtime.ShowtimeService;
import com.example.DemoAdmin.service.showtimeseat.ShowtimeSeatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/admin/showtimes")
@RequiredArgsConstructor
public class ShowtimeController {

    private final ShowtimeService showtimeService;
    private final SeatService seatService;
    private final ShowtimeSeatService showtimeSeatService;

    // Tạo suất chiếu mới
    @PostMapping
    public ResponseEntity<ShowtimeResponse> createShowtime(@RequestBody ShowtimeRequest request) {
        ShowtimeResponse response = showtimeService.createShowtime(request);
        List<SeatResponse> seatResponses = seatService.getAllSeatByScreenId(request.getScreenId());
        for (int i = 0; i < seatResponses.size(); i++){
            ShowtimeSeatRequest showtimeSeatRequest = new ShowtimeSeatRequest();
            showtimeSeatRequest.setShowtimeId(response.getId());
            showtimeSeatRequest.setSeatId(seatResponses.get(i).getId());
            showtimeSeatService.creatTicket(showtimeSeatRequest);
        }
        return ResponseEntity.ok(response);
    }

    // Lấy danh sách tất cả suất chiếu
    @GetMapping
    public ResponseEntity<List<ShowtimeResponse>> getAllShowtimes() {
        List<ShowtimeResponse> showtimes = showtimeService.getAllShowtimes();
        return ResponseEntity.ok(showtimes);
    }

    // Lấy suất chiếu theo ID
    @GetMapping("/{id}")
    public ResponseEntity<ShowtimeResponse> getShowtimeById(@PathVariable Integer id) {
        ShowtimeResponse response = showtimeService.getShowtimeById(id);
        return ResponseEntity.ok(response);
    }

    // Cập nhật suất chiếu
    @PutMapping("/{id}")
    public ResponseEntity<ShowtimeResponse> updateShowtime(@PathVariable Integer id, @RequestBody ShowtimeRequest request) {
        ShowtimeResponse response = showtimeService.updateShowtime(id, request);
        return ResponseEntity.ok(response);
    }

    // Xóa suất chiếu
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable Integer id) {
        showtimeSeatService.deleteTicket(id);
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }

}