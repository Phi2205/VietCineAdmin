package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.ShowtimeSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IShowtimeSeatRepository extends JpaRepository<ShowtimeSeat, Integer> {
    void deleteAllByShowtimeId(Integer showtimeId);
}
