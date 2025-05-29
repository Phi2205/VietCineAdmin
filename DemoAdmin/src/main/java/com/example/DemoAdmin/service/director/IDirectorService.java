package com.example.DemoAdmin.service.director;

import com.example.DemoAdmin.dto.request.DirectorRequest;
import com.example.DemoAdmin.dto.response.DirectorResponse;
import com.example.DemoAdmin.entity.Director;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IDirectorService {
    DirectorResponse createDirector(String name, MultipartFile avatar) throws IOException;
    DirectorResponse updateDirector(Integer id, String name, MultipartFile avatar) throws IOException;
    DirectorResponse getDirectorById(Integer id);
    List<DirectorResponse> getAllDirectors();
}
