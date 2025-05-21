package com.example.DemoAdmin.controller;

import com.example.DemoAdmin.dto.request.TheaterBrandRequest;
import com.example.DemoAdmin.dto.response.ApiResponse;
import com.example.DemoAdmin.dto.response.TheaterBrandResponse;
import com.example.DemoAdmin.entity.TheaterBrand;
import com.example.DemoAdmin.service.theaterbrand.TheaterBrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api/admin/theaterbrands")
@RequiredArgsConstructor
public class TheaterBrandController {
    private final TheaterBrandService theaterBrandService;
    @PostMapping
    public ResponseEntity<ApiResponse<TheaterBrandResponse>> creatTheaterBrand(@ModelAttribute TheaterBrandRequest request) throws IOException {
        System.out.println(request.getLogo());
        TheaterBrandResponse response = theaterBrandService.createTheaterBrand(request);
        return ResponseEntity.ok(new ApiResponse<>("Theater Brand create successfully", response));
    }
    @GetMapping("/{theaterBrandId}")
    public ResponseEntity<ApiResponse<TheaterBrandResponse>> getTheaterBrandById(@PathVariable Integer theaterBrandId){
        TheaterBrandResponse response = theaterBrandService.getTheaterBrandById(theaterBrandId);
        return ResponseEntity.ok(new ApiResponse<>("Theater Brand retrieved successfully", response));
    }
    @PutMapping("/{theaterBrandId}")
    public ResponseEntity<ApiResponse<TheaterBrandResponse>> updateTheaterBrand(@RequestBody TheaterBrandRequest request ,@PathVariable Integer theaterBrandId){
        TheaterBrandResponse response = theaterBrandService.updateTheaterBrand(request,theaterBrandId);
        return  ResponseEntity.ok(new ApiResponse<>("Theater brand update successfully", response));
    }
    @DeleteMapping("/{theaterBrandId}")
    public ResponseEntity<ApiResponse<TheaterBrandResponse>> deleteTheaterBrand(@PathVariable Integer theaterBrandId){
        theaterBrandService.deleteTheaterBrand(theaterBrandId);
        return ResponseEntity.noContent().build();
    }
    @GetMapping
    public List<TheaterBrandResponse> getAllTheaterBrand(){
        List<TheaterBrandResponse> responses = theaterBrandService.getAllTheaterBand();
        return responses;
    }
}
