package com.example.DemoAdmin.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "Seat")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SeatId", nullable = false)
    private Integer id;

    @NotNull
    @Column(name = "ScreenId", nullable = false)
    private Integer screenId;

    @NotNull
    @Column(name = "Row", nullable = false)
    private String row;

    @NotNull
    @Column(name = "[Column]", nullable = false)
    private Integer column;

    @NotNull
    @Column(name = "SeatTypeId", nullable = false)
    private Integer seatTypeId;

    // Nếu cần mapping các mối quan hệ (liên kết với Screen, SeatType), bạn có thể thêm:
    /*
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ScreenId", insertable = false, updatable = false)
    private Screen screen;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "SeatTypeId", insertable = false, updatable = false)
    private SeatType seatType;
    */
}
