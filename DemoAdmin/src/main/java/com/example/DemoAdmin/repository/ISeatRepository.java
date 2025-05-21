package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ISeatRepository extends JpaRepository<Seat, Integer> {
    Optional<Seat> findByScreenIdAndRowAndColumn(Integer screenId, String row, Integer column);
    List<Seat> findByScreenId(Integer screenId);
}
