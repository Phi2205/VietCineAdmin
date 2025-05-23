package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.SeatType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ISeatTypeForPARepository extends JpaRepository<SeatType, Integer> {
}