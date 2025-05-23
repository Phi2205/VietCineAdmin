package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IVoucherRepository extends JpaRepository<Voucher, Integer> {
    @Query("SELECT v FROM Voucher v WHERE v.theaterBrand.theaterBrandId = :theaterBrandId")
    List<Voucher> findByTheaterBrandId(@Param("theaterBrandId") Integer theaterBrandId);
}