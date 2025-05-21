package com.example.DemoAdmin.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@ToString
@Entity
@Table(name = "Screen")
public class Screen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ScreenId", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "TheaterId", nullable = false)
    @JsonBackReference
    private Theater theater;

    @Column(name = "ScreenNumber", nullable = false)
    private String screenNumber;

    @Column(name = "TotalSeats", nullable = false)
    private Integer totalSeats;

    @OneToMany(mappedBy = "screen")
    private Set<Showtime> showtimes = new LinkedHashSet<>();
}