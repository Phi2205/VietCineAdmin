package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.PriceAdjustment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IPriceAdjustmentRepository extends JpaRepository<PriceAdjustment, Integer> {
}