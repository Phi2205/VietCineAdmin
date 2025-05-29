package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.Cast;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ICastRepository extends JpaRepository<Cast, Integer> {
}
