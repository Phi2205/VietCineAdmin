package com.example.DemoAdmin.service.food;

import com.example.DemoAdmin.dto.request.FoodRequest;
import com.example.DemoAdmin.dto.response.FoodResponse;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IFoodService {
    FoodResponse createFood(String foodName, String description, Integer theaterBrandId, Integer price, MultipartFile image) throws IOException;

    FoodResponse updateFood(String foodName, String description, Integer theaterBrandId, Integer price,MultipartFile image, Integer id) throws IOException;
    void deleteFood(Integer id);
    List<FoodResponse> getAllFood();
    FoodResponse getFoodById(Integer id);
}
