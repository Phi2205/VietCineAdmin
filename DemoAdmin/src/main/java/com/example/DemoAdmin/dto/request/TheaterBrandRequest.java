package com.example.DemoAdmin.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class TheaterBrandRequest {
    private String theaterBrandName;
    private MultipartFile logo;
}
