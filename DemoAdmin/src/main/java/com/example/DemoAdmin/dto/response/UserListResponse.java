package com.example.DemoAdmin.dto.response;

import lombok.Data;
import java.util.List;

@Data
public class UserListResponse {
    private List<UserDTO> users;
    private int totalPages;
    private long totalElements;
    private int currentPage;
}

