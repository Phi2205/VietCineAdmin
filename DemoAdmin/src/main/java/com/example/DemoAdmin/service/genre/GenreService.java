package com.example.DemoAdmin.service.genre;

import com.example.DemoAdmin.dto.request.GenreRequest;
import com.example.DemoAdmin.dto.response.GenreResponse;
import com.example.DemoAdmin.entity.Genre;
import com.example.DemoAdmin.repository.IGenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class GenreService implements IGenreService {

    @Autowired
    private IGenreRepository genreRepository;

    @Override
    public GenreResponse createGenre(GenreRequest request) {
        Genre genre = new Genre();
        genre.setName(request.getName());
        genre = genreRepository.save(genre);
        return toGenreResponse(genre);
    }

    @Override
    public GenreResponse updateGenre(Integer id, GenreRequest request) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genre not found"));
        genre.setName(request.getName());
        genre = genreRepository.save(genre);
        return toGenreResponse(genre);
    }

    @Override
    public GenreResponse getGenreById(Integer id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genre not found"));
        return toGenreResponse(genre);
    }

    @Override
    public List<GenreResponse> getAllGenres() {
        return genreRepository.findAll().stream()
                .map(this::toGenreResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteGenre(Integer id) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genre not found"));
        genreRepository.delete(genre);
    }

    private GenreResponse toGenreResponse(Genre genre) {
        GenreResponse response = new GenreResponse();
        response.setId(genre.getId());
        response.setName(genre.getName());
        return response;
    }
}