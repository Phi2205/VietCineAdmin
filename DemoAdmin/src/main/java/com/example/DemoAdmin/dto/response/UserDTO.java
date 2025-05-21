package com.example.DemoAdmin.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserDTO {
    private Integer userId;
    private String email;
    private String password; // Dùng khi đăng ký
    private String fullName;
    private String phone;
    private LocalDateTime createdAt;
    private String address;
    private String avatar;
    private String role;
    private String providerId;
    private String uid;
    private String idToken;
}