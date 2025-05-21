package com.example.DemoAdmin.entity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "SeatType")
public class SeatType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SeatTypeId")
    private Integer seatTypeId;

    @Column(name = "TypeName", length = 50, nullable = false)
    private String typeName;

}
