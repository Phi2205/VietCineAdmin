package com.example.DemoAdmin.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "[User]")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "UserId")
    private Integer userId;

    @Column(name = "Email", nullable = false, length = 100)
    private String email;

    @Column(name = "PasswordHash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "FullName", length = 100)
    private String fullName;

    @Column(name = "Phone", length = 15)
    private String phone;

    @Column(name = "CreatedAt", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "Address", length = 100)
    private String address;

    @Column(name = "Avatar", length = 200)
    private String avatar;

    @Column(name = "Role", length = 10)
    private String role;

    @Column(name = "ProviderId", length = 200)
    private String providerId;

    @Column(name = "UID", length = 200)
    private String uid;

    @Column(name = "IdToken", columnDefinition = "nvarchar(MAX)")
    private String idToken;
}