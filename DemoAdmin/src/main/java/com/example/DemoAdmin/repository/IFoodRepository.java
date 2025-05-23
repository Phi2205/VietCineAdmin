package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IFoodRepository extends JpaRepository<Food,Integer> {
}
