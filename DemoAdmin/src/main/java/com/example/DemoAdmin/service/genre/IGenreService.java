package com.example.DemoAdmin.service.genre;

import com.example.DemoAdmin.dto.request.GenreRequest;
import com.example.DemoAdmin.dto.response.GenreResponse;

import java.util.List;

public interface IGenreService {
    GenreResponse createGenre(GenreRequest request);
    GenreResponse updateGenre(Integer id, GenreRequest request);
    GenreResponse getGenreById(Integer id);
    List<GenreResponse> getAllGenres();
    void deleteGenre(Integer id);
}