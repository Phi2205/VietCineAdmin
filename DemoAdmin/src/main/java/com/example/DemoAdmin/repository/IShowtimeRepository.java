package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IShowtimeRepository extends JpaRepository<Showtime, Integer> {
}