package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.response.ScreenResponse;
import com.example.DemoAdmin.dto.response.TheaterResponse;
import com.example.DemoAdmin.entity.Screen;
import com.example.DemoAdmin.entity.Theater;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IScreenMapper {
    @Mapping(target = "theater", source = "theater")
    @Mapping(target = "theater.name", source = "theater.name")
    ScreenResponse toScreenResponse(Screen screen);

    @Mapping(target = "id", source = "theater.id")
    @Mapping(target = "name", source = "theater.name")
    @Mapping(target = "address", source = "theater.address")
    @Mapping(target = "city", source = "theater.city")
    @Mapping(target = "totalScreens", source = "theater.totalScreens")
    TheaterResponse toTheaterResponse(Screen screen);

}