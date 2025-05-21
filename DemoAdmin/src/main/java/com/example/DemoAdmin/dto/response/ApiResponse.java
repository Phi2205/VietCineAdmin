package com.example.DemoAdmin.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse<M> {
    private String message;
    private Object data;
    private int total;
    private int page;
    private int size;

    public ApiResponse(String message, Object data) {
        this.message = message;
        this.data = data;
    }
}