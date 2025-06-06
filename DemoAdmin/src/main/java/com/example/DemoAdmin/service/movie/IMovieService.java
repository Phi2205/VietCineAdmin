package com.example.DemoAdmin.service.movie;

import com.example.DemoAdmin.dto.request.MovieRequest;
import com.example.DemoAdmin.dto.response.MovieResponse;
import com.example.DemoAdmin.entity.Movie;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IMovieService {
    MovieResponse createMovie(MovieRequest request);
    MovieResponse updateMovie(Integer id, MovieRequest request);
    MovieResponse getMovieById(Integer id);
    List<MovieResponse> getAllMovies();
    void deleteMovie(Integer id);
    Page<MovieResponse> getMovieByPage(Integer page, Integer size);
}