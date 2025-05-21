package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.response.MovieResponse;
import com.example.DemoAdmin.entity.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IMovieMapper {
    @Mapping(target = "directorName", source = "director.name")
    @Mapping(target = "directorId", source = "director.id") // Thêm ánh xạ cho directorId
    @Mapping(target = "genreNames", expression = "java(movie.getGenres().stream().map(genre -> genre.getName()).collect(java.util.stream.Collectors.toSet()))")
    @Mapping(target = "genreIds", expression = "java(movie.getGenres().stream().map(genre -> genre.getId()).collect(java.util.stream.Collectors.toSet()))")
    MovieResponse toMovieResponse(Movie movie);
}