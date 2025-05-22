package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.request.ShowtimeRequest;
import com.example.DemoAdmin.dto.request.TheaterRequest;
import com.example.DemoAdmin.dto.response.TheaterResponse;
import com.example.DemoAdmin.entity.Showtime;
import com.example.DemoAdmin.entity.Theater;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ITheaterMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "address", source = "address")
    @Mapping(target = "city", source = "city")
    @Mapping(target = "totalScreens", source = "totalScreens")
    TheaterResponse toTheaterResponse(Theater theater);
    Theater toTheater(TheaterRequest request);
    List<TheaterResponse> toTheaterResponses(List<Theater> theaterList);
}