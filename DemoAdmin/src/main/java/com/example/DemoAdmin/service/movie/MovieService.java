package com.example.DemoAdmin.service.movie;

import com.example.DemoAdmin.dto.request.MovieRequest;
import com.example.DemoAdmin.dto.response.MovieResponse;
import com.example.DemoAdmin.entity.Director;
import com.example.DemoAdmin.entity.Genre;
import com.example.DemoAdmin.entity.Movie;
import com.example.DemoAdmin.mapper.IMovieMapper;
import com.example.DemoAdmin.repository.IDirectorRepository;
import com.example.DemoAdmin.repository.IGenreRepository;
import com.example.DemoAdmin.repository.IMovieRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@SuppressWarnings("SpringJavaAutowiredFieldsWarningInspection")
public class MovieService implements IMovieService {

    @Autowired
    private IMovieRepository movieRepository;

    @Autowired
    private IGenreRepository genreRepository;

    @Autowired
    private IDirectorRepository directorRepository;

    @Autowired
    private IMovieMapper movieMapper;

    @Override
    public MovieResponse createMovie(MovieRequest request) {
        final Movie movie = new Movie();
        movie.setTitle(request.getTitle());
        movie.setSlug(generateSlug(request.getTitle()));
        movie.setDescription(request.getDescription());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setDuration(request.getDuration());

        final Director director = directorRepository.findById(request.getDirectorId())
                .orElseThrow(() -> new RuntimeException("Director not found"));
        movie.setDirector(director);

        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setEnglishTitle(request.getEnglishTitle());
        movie.setIsAvailable(request.getIsAvailable());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setRating(request.getRating());

        // Lấy danh sách Genre từ genreIds
        final Set<Genre> genres = request.getGenreIds().stream()
                .map(genreId -> {
                    Genre genre = genreRepository.findById(genreId)
                            .orElseThrow(() -> new RuntimeException("Genre not found"));
                    return genre;
                })
                .collect(Collectors.toSet());

        // Cập nhật quan hệ @ManyToMany: set genres cho movie và thêm movie vào danh sách movies của mỗi genre
        movie.setGenres(genres);
        genres.forEach(genre -> genre.getMovies().add(movie));

        // Lưu movie (các genre cũng sẽ được cập nhật nhờ cascade)
        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    @Override
    public MovieResponse updateMovie(Integer id, MovieRequest request) {
        final Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        movie.setTitle(request.getTitle());
        movie.setSlug(generateSlug(request.getTitle()));
        movie.setDescription(request.getDescription());
        movie.setReleaseDate(request.getReleaseDate());
        movie.setDuration(request.getDuration());

        final Director director = directorRepository.findById(request.getDirectorId())
                .orElseThrow(() -> new RuntimeException("Director not found"));
        movie.setDirector(director);

        movie.setTrailerUrl(request.getTrailerUrl());
        movie.setEnglishTitle(request.getEnglishTitle());
        movie.setIsAvailable(request.getIsAvailable());
        movie.setPosterUrl(request.getPosterUrl());
        movie.setRating(request.getRating());

        // Xóa các quan hệ cũ trong genres
        movie.getGenres().forEach(genre -> genre.getMovies().remove(movie));
        movie.getGenres().clear();

        // Cập nhật quan hệ mới
        final Set<Genre> genres = request.getGenreIds().stream()
                .map(genreId -> {
                    Genre genre = genreRepository.findById(genreId)
                            .orElseThrow(() -> new RuntimeException("Genre not found"));
                    return genre;
                })
                .collect(Collectors.toSet());
        movie.setGenres(genres);
        genres.forEach(genre -> genre.getMovies().add(movie));

        // Lưu movie
        return movieMapper.toMovieResponse(movieRepository.save(movie));
    }

    @Override
    public MovieResponse getMovieById(Integer id) {
        final Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        return movieMapper.toMovieResponse(movie);
    }

    @Override
    public List<MovieResponse> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(movieMapper::toMovieResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteMovie(Integer id) {
        final Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));
        // Xóa quan hệ với genres trước khi xóa movie
        movie.getGenres().forEach(genre -> genre.getMovies().remove(movie));
        movie.getGenres().clear();
        movieRepository.delete(movie);
    }
    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "") // bỏ ký tự đặc biệt
                .replaceAll("\\s+", "-")        // khoảng trắng -> dấu -
                .replaceAll("^-|-$", "");       // bỏ dấu - đầu/cuối
    }

}