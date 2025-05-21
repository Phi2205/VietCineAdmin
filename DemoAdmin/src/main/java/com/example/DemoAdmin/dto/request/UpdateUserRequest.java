package com.example.DemoAdmin.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateUserRequest {
    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    private String phone;
    private String address;
    private String avatar;
}

