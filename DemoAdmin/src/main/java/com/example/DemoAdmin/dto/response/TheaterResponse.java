package com.example.DemoAdmin.dto.response;

import lombok.Data;

@Data
public class TheaterResponse {
    private Integer id;
    private String name;
    private String address;
    private String city;
    private Integer totalScreens;
    private Integer theaterBrandId;
    // Không bao gồm trường screens để tránh vòng lặp
}
