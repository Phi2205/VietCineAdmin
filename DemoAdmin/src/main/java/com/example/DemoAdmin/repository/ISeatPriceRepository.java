package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.SeatPrice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ISeatPriceRepository extends JpaRepository<SeatPrice, Integer> {
    SeatPrice findByScreenIdAndSeatTypeId(Integer screenId, Integer seatTypeId);
}
