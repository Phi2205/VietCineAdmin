package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IGenreRepository extends JpaRepository<Genre, Integer> {
}