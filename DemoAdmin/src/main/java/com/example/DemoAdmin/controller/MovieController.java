package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.MovieRequest;
import com.example.DemoAdmin.dto.response.ApiResponse;
import com.example.DemoAdmin.dto.response.MovieResponse;
import com.example.DemoAdmin.service.movie.IMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/admin/movies")
public class MovieController {

    @Autowired
    private IMovieService movieService;

    @PostMapping
    public ResponseEntity<ApiResponse<MovieResponse>> createMovie(@RequestBody MovieRequest request) {
        MovieResponse response = movieService.createMovie(request);
        return ResponseEntity.ok(new ApiResponse<>("Movie created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> updateMovie(@PathVariable Integer id, @RequestBody MovieRequest request) {
        MovieResponse response = movieService.updateMovie(id, request);
        return ResponseEntity.ok(new ApiResponse<>("Movie updated successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<MovieResponse>> getMovieById(@PathVariable Integer id) {
        MovieResponse response = movieService.getMovieById(id);
        return ResponseEntity.ok(new ApiResponse<>("Movie retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MovieResponse>>> getAllMovies() {
        List<MovieResponse> responses = movieService.getAllMovies();
        return ResponseEntity.ok(new ApiResponse<>("Movies retrieved successfully", responses));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMovie(@PathVariable Integer id) {
        movieService.deleteMovie(id);
        return ResponseEntity.ok(new ApiResponse<>("Movie deleted successfully", null));
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to DemoAdmin API!";
    }
}
