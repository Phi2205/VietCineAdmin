package com.example.DemoAdmin.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
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

    @NotNull
    @Column(name = "Name", nullable = false)
    private String name;

    @NotNull
    @Column(name = "Address", nullable = false)
    private String address;
    @NotNull
    @Column(name = "City", nullable = false)
    private String city;
    @NotNull
    @Column(name = "TotalScreens", nullable = false)
    private Integer totalScreens;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "TheaterBrandId", nullable = false)
    private TheaterBrand theaterBrand;

//
//    @Column(name = "TheaterBrandId", nullable = false)
//    private TheaterBrand theaterBrand;

    @OneToMany(mappedBy = "theater")
    @JsonManagedReference
    private Set<Screen> screens = new LinkedHashSet<>();
}