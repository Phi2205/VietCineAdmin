package com.example.DemoAdmin.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "VoucherUser")
public class VoucherUser {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VoucherUserId", nullable = false)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "VoucherId", nullable = false)
    private Voucher voucher;

    @ManyToOne
    @JoinColumn(name = "UserId", nullable = false)
    private User user;

    @Column(name = "IsUsed", nullable = false)
    private Boolean isUsed;
}