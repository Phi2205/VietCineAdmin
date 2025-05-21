package com.example.DemoAdmin.service.theater;

import com.example.DemoAdmin.dto.request.TheaterRequest;
import com.example.DemoAdmin.dto.response.TheaterResponse;

import java.util.List;

public interface ITheaterService {
    TheaterResponse createTheater(TheaterRequest request);
    TheaterResponse updateTheater(Integer id, TheaterRequest request);
    TheaterResponse getTheaterById(Integer id);
    List<TheaterResponse> getAllTheaters();
    void deleteTheater(Integer id);
}
