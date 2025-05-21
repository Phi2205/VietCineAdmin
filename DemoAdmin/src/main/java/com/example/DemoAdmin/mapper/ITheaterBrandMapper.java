package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.response.TheaterBrandResponse;
import com.example.DemoAdmin.entity.Theater;
import com.example.DemoAdmin.entity.TheaterBrand;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel =  "spring")
public interface ITheaterBrandMapper {
    @Mapping(target = "id", source = "theaterBrandId")
    @Mapping(target = "theaterBrandName", source = "theaterBrandName")
    @Mapping(target = "logo", source = "logo")
    TheaterBrandResponse toTheaterBrandResponse(TheaterBrand theaterBrand);
}
