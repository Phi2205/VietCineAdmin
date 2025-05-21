package com.example.DemoAdmin.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.Set;

@Data
public class MovieRequest {
    @NotNull
    private String title;

    @NotNull
    private String description;

    @NotNull
    private LocalDate releaseDate;

    @NotNull
    private Integer duration;

    @NotNull
    private Integer directorId;

    private String trailerUrl;
    private String englishTitle;
    private Boolean isAvailable;
    private String posterUrl;
    private Double rating;

    @NotNull
    private Set<Integer> genreIds; // Danh sách ID của các thể loại
}