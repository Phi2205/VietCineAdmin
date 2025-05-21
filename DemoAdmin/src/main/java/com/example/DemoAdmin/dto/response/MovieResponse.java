package com.example.DemoAdmin.dto.response;

import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class MovieResponse {
    private Integer id;
    private String title;
    private String description;
    private LocalDate releaseDate;
    private Integer duration;
    private String directorName;
    private Integer directorId; // Thêm trường directorId
    private String trailerUrl;
    private String englishTitle;
    private Boolean isAvailable;
    private String posterUrl;
    private Double rating;
    private Set<String> genreNames;
    private Set<Integer> genreIds;
}