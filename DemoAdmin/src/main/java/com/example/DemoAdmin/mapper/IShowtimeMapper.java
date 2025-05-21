package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.request.ShowtimeRequest;
import com.example.DemoAdmin.dto.response.ShowtimeResponse;
import com.example.DemoAdmin.entity.Showtime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IShowtimeMapper {
    @Mapping(target = "movie.id", source = "movieId")
    @Mapping(target = "screen.id", source = "screenId")
    Showtime toShowtime(ShowtimeRequest request);

    @Mapping(target = "movieId", source = "movie.id") // Thêm ánh xạ cho movieId
    @Mapping(target = "screenId", source = "screen.id") // Thêm ánh xạ cho screenId
    @Mapping(target = "movieTitle", source = "movie.title")
    @Mapping(target = "screenNumber", source = "screen.screenNumber")
    @Mapping(target = "theaterName", source = "screen.theater.name")
    ShowtimeResponse toShowtimeResponse(Showtime showtime);

}