package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.Screen;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IScreenRepository extends JpaRepository<Screen, Integer> {
    List<Screen> findByTheaterId(Integer theaterId);
    boolean existsByTheaterIdAndScreenNumber(Integer theaterId, String screenNumber);
}