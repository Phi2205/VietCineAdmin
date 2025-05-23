package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISeatTypeRepository extends JpaRepository<SeatType, Integer> {
}
