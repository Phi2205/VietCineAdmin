package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.response.ApiResponse;
import com.example.DemoAdmin.dto.response.DirectorResponse;
import com.example.DemoAdmin.service.director.IDirectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/directors")
@RequiredArgsConstructor
public class DirectorController {

    private final IDirectorService directorService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<DirectorResponse>> createDirector(
            @RequestParam("name") String name,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        try {
            DirectorResponse response = directorService.createDirector(name, avatar);
            return ResponseEntity.ok(new ApiResponse<>("Tạo director thành công", response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>("Không thể tạo director: " + e.getMessage(), null));
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateDirector(
            @PathVariable Integer id,
            @RequestParam("name") String name,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        try {
            DirectorResponse response = directorService.updateDirector(id, name, avatar);
            return ResponseEntity.ok(response);
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<DirectorResponse> getDirectorById(@PathVariable Integer id) {
        DirectorResponse response = directorService.getDirectorById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<DirectorResponse>> getAllDirectors() {
        List<DirectorResponse> responses = directorService.getAllDirectors();
        return ResponseEntity.ok(responses);
    }
}