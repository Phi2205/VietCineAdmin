package com.example.DemoAdmin.service.theaterbrand;

import com.example.DemoAdmin.dto.request.TheaterBrandRequest;
import com.example.DemoAdmin.dto.request.TheaterRequest;
import com.example.DemoAdmin.dto.response.TheaterBrandResponse;

import java.io.IOException;
import java.util.List;

public interface ITheaterBrandService {
    TheaterBrandResponse createTheaterBrand(TheaterBrandRequest request) throws IOException;
    TheaterBrandResponse updateTheaterBrand(TheaterBrandRequest request, Integer id);
    void deleteTheaterBrand(Integer id);
    TheaterBrandResponse getTheaterBrandById(Integer id);
    List<TheaterBrandResponse> getAllTheaterBand();
}
