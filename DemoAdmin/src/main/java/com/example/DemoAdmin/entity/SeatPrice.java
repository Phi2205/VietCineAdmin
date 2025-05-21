package com.example.DemoAdmin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
@Entity
@Table(name = "SeatPrice")
public class SeatPrice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SeatPriceId")
    private Integer seatPriceId;

    @Column(name = "SeatTypeId", nullable = false)
    private Integer seatTypeId;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ScreenId", nullable = false)
    private Screen screen;

    @Column(name = "Price", nullable = false)
    private Integer price;
}
