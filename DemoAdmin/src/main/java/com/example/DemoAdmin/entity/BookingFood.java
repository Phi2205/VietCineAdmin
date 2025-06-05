package com.example.DemoAdmin.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "BookingFood")
public class BookingFood {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingFoodId")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "BookingId")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "FoodId")
    private Food food;

    @Column(name = "Quantity")
    private int quantity;

    @Column(name = "Total")
    private int total;
}

