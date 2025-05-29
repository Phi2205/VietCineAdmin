package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.response.FoodResponse;
import com.example.DemoAdmin.dto.response.TheaterBrandResponse;
import com.example.DemoAdmin.entity.Food;
import com.example.DemoAdmin.entity.TheaterBrand;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IFoodMapper {

    @Mapping(target = "foodId", source = "id")
    @Mapping(target = "foodName", source = "foodName")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "theaterBrand", source = "theaterBrand")
    @Mapping(target = "price", source = "price")
    @Mapping(target = "theaterBrand.id", source = "theaterBrand.theaterBrandId")
    FoodResponse toFoodResponse(Food food);
    List<FoodResponse> toFoodResponseList(List<Food> foods);
}
