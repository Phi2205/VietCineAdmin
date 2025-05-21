package com.example.DemoAdmin.service.showtime;

import com.example.DemoAdmin.dto.request.ShowtimeRequest;
import com.example.DemoAdmin.dto.response.ShowtimeResponse;

import java.util.List;

public interface IShowtimeService {
    ShowtimeResponse createShowtime(ShowtimeRequest request);
    ShowtimeResponse updateShowtime(Integer id, ShowtimeRequest request);
    ShowtimeResponse getShowtimeById(Integer id);
    List<ShowtimeResponse> getAllShowtimes();
    void deleteShowtime(Integer id);
}