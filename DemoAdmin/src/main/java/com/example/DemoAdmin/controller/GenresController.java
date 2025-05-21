package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.GenreRequest;
import com.example.DemoAdmin.dto.response.ApiResponse;
import com.example.DemoAdmin.dto.response.GenreResponse;
import com.example.DemoAdmin.service.genre.IGenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/admin/genres")
public class GenresController {

    @Autowired
    private IGenreService genreService;

    @PostMapping
    public ResponseEntity<ApiResponse<GenreResponse>> createGenre(@RequestBody GenreRequest request) {
        GenreResponse response = genreService.createGenre(request);
        return ResponseEntity.ok(new ApiResponse<>("Genre created successfully", response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<GenreResponse>> updateGenre(@PathVariable Integer id, @RequestBody GenreRequest request) {
        GenreResponse response = genreService.updateGenre(id, request);
        return ResponseEntity.ok(new ApiResponse<>("Genre updated successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<GenreResponse>> getGenreById(@PathVariable Integer id) {
        GenreResponse response = genreService.getGenreById(id);
        return ResponseEntity.ok(new ApiResponse<>("Genre retrieved successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<GenreResponse>>> getAllGenres() {
        List<GenreResponse> responses = genreService.getAllGenres();
        return ResponseEntity.ok(new ApiResponse<>("Genres retrieved successfully", responses));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGenre(@PathVariable Integer id) {
        genreService.deleteGenre(id);
        return ResponseEntity.ok(new ApiResponse<>("Genre deleted successfully", null));
    }
}