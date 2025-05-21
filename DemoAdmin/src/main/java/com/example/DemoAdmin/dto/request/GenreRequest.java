package com.example.DemoAdmin.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class GenreRequest {
    @NotNull
    private String name;
}