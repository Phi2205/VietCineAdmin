package com.example.DemoAdmin.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.Date;

@Getter
@Setter
@ToString
@Entity
@Table(name = "PriceAdjustment")
public class PriceAdjustment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PriceAdjustmentId")
    private Integer adjustmentId;

    @Column(name = "SeatTypeId", nullable = false)
    private Integer seatTypeId;

    @Column(name = "Description", nullable = true)
    private String description;

    @Column(name = "DayOfWeek", nullable = true)
    private String dayOfWeek;

    @Column(name = "SpecificDate", nullable = true)
    @Temporal(TemporalType.DATE)
    private Date specificDate;

    @Column(name = "PriceIncrease", nullable = false)
    private Integer priceIncrease;

    @Column(name = "IsActive", nullable = false)
    private Boolean isActive;

    @ManyToOne
    @JoinColumn(name = "SeatTypeId", insertable = false, updatable = false)
    private SeatType seatType;
}