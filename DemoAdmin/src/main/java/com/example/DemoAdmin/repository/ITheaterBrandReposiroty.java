package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.TheaterBrand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ITheaterBrandReposiroty extends JpaRepository<TheaterBrand, Integer> {
}
