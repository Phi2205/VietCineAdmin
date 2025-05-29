package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.response.ApiResponse;
import com.example.DemoAdmin.dto.response.CastResponse;
import com.example.DemoAdmin.service.cast.ICastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/casts")
@RequiredArgsConstructor
public class CastController {

    private final ICastService castService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<ApiResponse<CastResponse>> createCast(
            @RequestParam("name") String name,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        try {
            CastResponse response = castService.createCast(name, avatar);
            return ResponseEntity.ok(new ApiResponse<>("Tạo cast thành công", response));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(new ApiResponse<>("Không thể tạo cast: " + e.getMessage(), null));
        }
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public ResponseEntity<?> updateCast(
            @PathVariable Integer id,
            @RequestParam("name") String name,
            @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        try {
            CastResponse response = castService.updateCast(id, name, avatar);
            return ResponseEntity.ok(response);
        } catch (RuntimeException | IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<CastResponse> getCastById(@PathVariable Integer id) {
        CastResponse response = castService.getCastById(id);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<CastResponse>> getAllCasts() {
        List<CastResponse> responses = castService.getAllCasts();
        return ResponseEntity.ok(responses);
    }
}