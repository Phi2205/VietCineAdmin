package com.example.DemoAdmin.dto.response;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private UserDTO user;
}