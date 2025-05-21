package com.example.DemoAdmin.service.seat;

import com.example.DemoAdmin.dto.request.ScreenSeatRequest;
import com.example.DemoAdmin.dto.request.SeatRequest;
import com.example.DemoAdmin.dto.response.SeatResponse;
import com.example.DemoAdmin.entity.Seat;

import java.util.List;

public interface ISeatService {
    void saveSeats(List<SeatRequest> seatAddRequests, Integer screenId);
    void deleteSeats(List<SeatRequest> seatDeleteRequests, Integer screenId);
    void updateSeats(ScreenSeatRequest request, Integer screenId);
    int rowLetterToIndex(String rowLetter);
    List<SeatResponse> getAllSeatByScreenId(Integer screenId);
}
