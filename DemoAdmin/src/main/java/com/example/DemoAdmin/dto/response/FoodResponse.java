package com.example.DemoAdmin.dto.response;

import com.example.DemoAdmin.entity.TheaterBrand;
import lombok.Data;


@Data
public class FoodResponse {
    private Integer foodId;
    private String foodName;
    private String description;
    private TheaterBrandResponse theaterBrand;
    private Integer price;
    private String image;
}
