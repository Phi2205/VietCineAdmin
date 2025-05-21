package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.CreateUserRequest;
import com.example.DemoAdmin.dto.request.UpdateUserRequest;
import com.example.DemoAdmin.dto.response.UserDTO;
import com.example.DemoAdmin.service.user.IUserService;
import jakarta.validation.Valid;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {
    private final IUserService userService;

    public UserController(IUserService userService) {
        this.userService = userService;
    }

    // User Management APIs
    @PostMapping("/users/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody CreateUserRequest request) {
        try {
            UserDTO userDTO = new UserDTO();
            BeanUtils.copyProperties(request, userDTO);
            userDTO.setRole("USER");
            UserDTO createdUser = userService.register(userDTO);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/users/list")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getAllUsersByRolePaginated("USER", page, size));
    }

    // Admin Management APIs
    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@Valid @RequestBody CreateUserRequest request) {
        try {
            UserDTO userDTO = new UserDTO();
            BeanUtils.copyProperties(request, userDTO);
            userDTO.setRole("ADMIN");
            UserDTO createdUser = userService.register(userDTO);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/admin/list")
    public ResponseEntity<Page<UserDTO>> getAllAdmins(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(userService.getAllUsersByRolePaginated("ADMIN", page, size));
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<?> deleteAdmin(@PathVariable Integer userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Common APIs for both User and Admin
    @GetMapping("/users/{userId}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Integer userId) {
        try {
            UserDTO user = userService.getUserById(userId);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer userId,
            @Valid @RequestBody UpdateUserRequest request) {
        try {
            UserDTO updatedUser = userService.updateUser(userId, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}