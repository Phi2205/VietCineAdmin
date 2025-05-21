package com.example.DemoAdmin.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "food") // Tùy chọn: đặt tên bảng nếu cần
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FoodId")
    private Integer foodId;

    @Column(name = "FoodName", nullable = false, length = 100)
    private String foodName;

    @Column(name = "Description", length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "TheaterBrandId", nullable = false)
    @JsonBackReference
    private TheaterBrand theaterBrand;

    @Column(name = "Price", nullable = false)
    private Integer price;
}
