package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.Director;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IDirectorRepository extends JpaRepository<Director, Integer> {
}