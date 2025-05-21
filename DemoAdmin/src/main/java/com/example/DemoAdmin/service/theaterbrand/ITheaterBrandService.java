package com.example.DemoAdmin.service.theaterbrand;

import com.example.DemoAdmin.dto.request.TheaterBrandRequest;
import com.example.DemoAdmin.dto.request.TheaterRequest;
import com.example.DemoAdmin.dto.response.TheaterBrandResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ITheaterBrandService {
    TheaterBrandResponse createTheaterBrand(String theaterBrandName, MultipartFile logo) throws IOException;
    TheaterBrandResponse updateTheaterBrand(TheaterBrandRequest request, Integer id);
    void deleteTheaterBrand(Integer id);
    TheaterBrandResponse getTheaterBrandById(Integer id);
    List<TheaterBrandResponse> getAllTheaterBand();
}
