package com.example.DemoAdmin.service.showtimeseat;

import com.example.DemoAdmin.dto.request.ShowtimeSeatRequest;
import com.example.DemoAdmin.dto.response.ShowtimeSeatResponse;

import java.util.List;

public interface IShowtimeSeatService {
    void creatTicket(ShowtimeSeatRequest request);
    void deleteTicket(Integer showtimeId);
}
