package com.example.DemoAdmin.service.food;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.DemoAdmin.dto.request.FoodRequest;
import com.example.DemoAdmin.dto.response.FoodResponse;
import com.example.DemoAdmin.entity.Food;
import com.example.DemoAdmin.entity.TheaterBrand;
import com.example.DemoAdmin.mapper.IFoodMapper;
import com.example.DemoAdmin.repository.IFoodRepository;
import com.example.DemoAdmin.repository.ITheaterBrandRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class FoodService implements IFoodService{
    @Autowired
    private final IFoodRepository foodRepository;
    @Autowired
    private final ITheaterBrandRepository theaterBrandRepository;
    @Autowired
    private final Cloudinary cloudinary;
    @Autowired
    private final IFoodMapper foodMapper;

    @Override
    public FoodResponse createFood(FoodRequest request, MultipartFile image) throws IOException {
        Food food = new Food();
        food.setFoodName(request.getFoodName());
        food.setDescription(request.getDescription());
        TheaterBrand theaterBrand = theaterBrandRepository.findById(request.getTheaterBrandId())
                .orElseThrow(()-> new RuntimeException("Theater brand not exist"));
        food.setTheaterBrand(theaterBrand);
        food.setPrice(request.getPrice());
        if (image != null && !image.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(image.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "food_image_" + food.getFoodName(),
                            "folder", "vietcine",
                            "overwrite", true,
                            "resource_type", "image"
                    ));
            String imageUrl = (String) uploadResult.get("secure_url");
            theaterBrand.setLogo(imageUrl);
        }
        Food savedFood = foodRepository.save(food);
        return foodMapper.toFoodResponse(food);
    }

    @Override
    public FoodResponse updateFood(FoodRequest request,MultipartFile image, Integer id) throws IOException {
        Food food = foodRepository.findById(id)
                        .orElseThrow(()-> new RuntimeException("Not exist Food"));
        food.setFoodName(request.getFoodName());
        food.setDescription(request.getDescription());
        TheaterBrand theaterBrand = theaterBrandRepository.findById(request.getTheaterBrandId())
                .orElseThrow(()-> new RuntimeException("Theater brand not exist"));
        food.setTheaterBrand(theaterBrand);
        food.setPrice(request.getPrice());
        if (image != null && !image.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(image.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "food_image_" + food.getFoodName(),
                            "folder", "vietcine",
                            "overwrite", true,
                            "resource_type", "image"
                    ));
            String imageUrl = (String) uploadResult.get("secure_url");
            food.setImage(imageUrl);
        }
        Food updatedFood = foodRepository.save(food);
        return foodMapper.toFoodResponse(updatedFood);
    }

    @Override
    public void deleteFood(Integer id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("not exist food"));
        foodRepository.delete(food);
    }

    @Override
    public List<FoodResponse> getAllFood() {
        List<Food> responses = foodRepository.findAll();
        return foodMapper.toFoodResponseList(responses);
    }

    @Override
    public FoodResponse getFoodById(Integer id) {
        Food food = foodRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("not exist food"));
        return foodMapper.toFoodResponse(food);
    }
}
