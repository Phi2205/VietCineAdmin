package com.example.DemoAdmin.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "TheaterBrand")
public class TheaterBrand {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JoinColumn(name = "TheaterBrandId",nullable = false)
    private Integer theaterBrandId;

    @Column(name = "TheaterBrandName", nullable = false)
    private String theaterBrandName;

    @Column(name = "Logo", nullable = false)
    private String logo;
}
