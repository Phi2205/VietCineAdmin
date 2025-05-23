package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.entity.VoucherUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IVoucherUserRepository extends JpaRepository<VoucherUser, Integer> {
    @Query("SELECT CASE WHEN COUNT(vu) > 0 THEN true ELSE false END FROM VoucherUser vu WHERE vu.voucher.id = :voucherId AND vu.isUsed = :isUsed")
    boolean existsByVoucherIdAndIsUsed(@Param("voucherId") Integer voucherId, @Param("isUsed") Boolean isUsed);
}