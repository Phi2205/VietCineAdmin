package com.example.DemoAdmin.dto.request;

import lombok.Data;

@Data
public class LoginRequest {
    private String email; // Thay username bằng email
    private String password;
}