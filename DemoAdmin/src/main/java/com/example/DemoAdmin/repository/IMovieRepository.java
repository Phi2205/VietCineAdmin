package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.Movie;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IMovieRepository extends JpaRepository<Movie, Integer> {
}