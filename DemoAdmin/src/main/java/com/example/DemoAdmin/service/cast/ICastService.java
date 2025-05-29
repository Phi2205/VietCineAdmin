package com.example.DemoAdmin.service.cast;

import com.example.DemoAdmin.dto.request.CastRequest;
import com.example.DemoAdmin.dto.response.CastResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface ICastService {
    CastResponse createCast(String name, MultipartFile avatar) throws IOException;
    CastResponse updateCast(Integer id,String name, MultipartFile avatar) throws IOException;
    CastResponse getCastById(Integer id);
    List<CastResponse> getAllCasts();
}