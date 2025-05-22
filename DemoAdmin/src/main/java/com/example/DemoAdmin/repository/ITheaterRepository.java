package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.Theater;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ITheaterRepository extends JpaRepository<Theater, Integer> {
    List<Theater> findByTheaterBrand_TheaterBrandId(Integer theaterBrandId);
}
