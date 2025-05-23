package com.example.DemoAdmin.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
@Table(name = "Voucher")
public class Voucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "VoucherId", nullable = false)
    private Integer id;

    @Column(name = "Discount", nullable = false)
    private Integer discount;

    @Column(name = "ValidFrom", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date validFrom;

    @Column(name = "ValidUntil", nullable = false)
    @Temporal(TemporalType.DATE)
    private Date validUntil;

    @Column(name = "MinBillPrice", nullable = false)
    private Integer minBillPrice;

    @Column(name = "Description", nullable = false)
    private String description;

    @Column(name = "IsActive", nullable = false)
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "TheaterBrandId", nullable = false)
    private TheaterBrand theaterBrand;

    @OneToMany(mappedBy = "voucher")
    @JsonManagedReference
    private Set<VoucherUser> voucherUsers = new LinkedHashSet<>();
}