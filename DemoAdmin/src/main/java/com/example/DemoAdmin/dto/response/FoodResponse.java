package com.example.DemoAdmin.dto.response;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class FoodResponse {
    private Integer foodId;
    private String foodName;
    private String description;
    private TheaterBrandResponse theaterBrand;
    private Integer price;
    private String image;
}
