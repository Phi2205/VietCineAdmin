package com.example.DemoAdmin.dto.request;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CastRequest {
    private String name;
    private MultipartFile avatar;
}
