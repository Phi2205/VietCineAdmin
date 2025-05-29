package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.FoodRequest;
import com.example.DemoAdmin.dto.response.FoodResponse;
import com.example.DemoAdmin.service.food.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Controller
@RequestMapping("/api/admin/foods")
@RequiredArgsConstructor
public class FoodController{
    private final FoodService foodService;
    @PostMapping
    public ResponseEntity<FoodResponse> createFood(    @RequestParam("foodName") String foodName,
                                                       @RequestParam("description") String description,
                                                       @RequestParam("price") Integer price,
                                                       @RequestParam("theaterBrandId") Integer theaterBrandId,
                                                       @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        FoodResponse response = foodService.createFood(foodName, description,theaterBrandId,price ,image);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{foodId}")
    public ResponseEntity<FoodResponse> updateFood(@RequestParam("foodName") String foodName,
                                                   @RequestParam("description") String description,
                                                   @RequestParam("price") Integer price,
                                                   @RequestParam("theaterBrandId") Integer theaterBrandId,
                                                   @RequestParam(value = "image", required = false) MultipartFile image, @PathVariable Integer foodId) throws IOException {
        FoodResponse response = foodService.updateFood(foodName, description, theaterBrandId, price, image, foodId);
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{foodId}")
    public ResponseEntity<FoodResponse> deteleFood(@PathVariable Integer foodId){
        foodService.deleteFood(foodId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/{foodId}")
    public ResponseEntity<FoodResponse> getFoodById(@PathVariable Integer foodId){
        FoodResponse response = foodService.getFoodById(foodId);
        return ResponseEntity.ok(response);
    }
    @GetMapping()
    public ResponseEntity<List<FoodResponse>> getAllFood(){
        List<FoodResponse> responses = foodService.getAllFood();
        return ResponseEntity.ok(responses);
    }
}
