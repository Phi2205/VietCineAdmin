package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.entity.Director;
import com.example.DemoAdmin.service.director.IDirectorService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/directors")
public class DirectorController {

    private final IDirectorService idirectorService;

    public DirectorController(IDirectorService directorService) {
        this.idirectorService = directorService;
    }

    @GetMapping
    public ResponseEntity<?> getAllDirectors() {
        List<Director> directors = idirectorService.getAllDirectors();
        return ResponseEntity.ok().body(Map.of(
                "data", directors,
                "message", "Success"
        ));
    }
}
