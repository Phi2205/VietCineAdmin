package com.example.DemoAdmin.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
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
@Table(name = "Theater")
public class Theater {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TheaterId", nullable = false)
    private Integer id;

    @Column(name = "Name", nullable = false)
    private String name;

    @Column(name = "Address", nullable = false)
    private String address;

    @Column(name = "City", nullable = false)
    private String city;

    @Column(name = "TotalScreens", nullable = false)
    private Integer totalScreens;

//
//    @Column(name = "TheaterBrandId", nullable = false)
//    private TheaterBrand theaterBrand;

    @OneToMany(mappedBy = "theater")
    @JsonManagedReference
    private Set<Screen> screens = new LinkedHashSet<>();
}