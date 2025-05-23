package com.example.DemoAdmin.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class FoodRequest {
    private String foodName;
    private String description;
    private Integer theaterBrandId;
    private Integer price;
}
