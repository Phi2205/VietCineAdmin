package com.example.DemoAdmin.service.screen;


import com.example.DemoAdmin.dto.request.ScreenRequest;
import com.example.DemoAdmin.dto.response.ScreenResponse;

import java.util.List;

public interface IScreenService {

    ScreenResponse createScreen(ScreenRequest request);
    ScreenResponse updateScreen(Integer id, ScreenRequest request);
    ScreenResponse getScreenById(Integer id);
    List<ScreenResponse> getAllScreens();
    void deleteScreen(Integer id);

}
