package com.example.DemoAdmin.service.theaterbrand;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.DemoAdmin.dto.request.TheaterBrandRequest;
import com.example.DemoAdmin.dto.response.TheaterBrandResponse;
import com.example.DemoAdmin.entity.TheaterBrand;
import com.example.DemoAdmin.mapper.ITheaterBrandMapper;
import com.example.DemoAdmin.repository.ITheaterBrandReposiroty;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TheaterBrandService implements ITheaterBrandService {
    @Autowired
    private final ITheaterBrandReposiroty theaterBrandReposiroty;
    @Autowired
    private final ITheaterBrandMapper theaterBrandMapper;
    @Autowired
    private final Cloudinary cloudinary;


    @Override
    public TheaterBrandResponse createTheaterBrand(TheaterBrandRequest request) throws IOException {
        TheaterBrand theaterBrand = new TheaterBrand();
        theaterBrand.setTheaterBrandName(request.getTheaterBrandName());
        TheaterBrand savedTheaterBrand = theaterBrandReposiroty.save(theaterBrand);
        System.out.println(request.getLogo());
        MultipartFile logo = request.getLogo();
        if (logo != null && !logo.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(logo.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "logo_theater_brand" + savedTheaterBrand.getTheaterBrandId(),
                            "folder", "vietcine",
                            "overwrite", true,
                            "resource_type", "image"
                    ));
            String logoUrl = (String) uploadResult.get("secure_url");
            theaterBrand.setLogo(logoUrl);
        }
        System.out.println(theaterBrand);
        // Save the updated user
        theaterBrand = theaterBrandReposiroty.save(theaterBrand);
        return theaterBrandMapper.toTheaterBrandResponse(savedTheaterBrand);
    }

    @Override
    public TheaterBrandResponse updateTheaterBrand(TheaterBrandRequest request, Integer id) {
        TheaterBrand theaterBrand = theaterBrandReposiroty.findById(id)
                .orElseThrow(()-> new RuntimeException("Theater Brand not exist"));
        theaterBrand.setTheaterBrandName(request.getTheaterBrandName());
        TheaterBrand updateTheaterBrand = theaterBrandReposiroty.save(theaterBrand);
        return theaterBrandMapper.toTheaterBrandResponse(updateTheaterBrand);
    }




    @Override
    public void deleteTheaterBrand(Integer id) {
        TheaterBrand theaterBrand = theaterBrandReposiroty.findById(id)
                .orElseThrow(()-> new RuntimeException("Theater Brand not exist"));
        theaterBrandReposiroty.delete(theaterBrand);
    }

    @Override
    public TheaterBrandResponse getTheaterBrandById(Integer id) {
        TheaterBrand theaterBrand = theaterBrandReposiroty.findById(id)
                .orElseThrow(()-> new RuntimeException("Theater Brand not exist"));
        return theaterBrandMapper.toTheaterBrandResponse(theaterBrand);
    }

    @Override
    public List<TheaterBrandResponse> getAllTheaterBand() {
        List<TheaterBrand> theaterBrands = theaterBrandReposiroty.findAll();

        List<TheaterBrandResponse> responses = theaterBrands.stream()
                .map(tb -> {
                    TheaterBrandResponse response = new TheaterBrandResponse();
                    response.setId(tb.getTheaterBrandId());
                    response.setTheaterBrandName(tb.getTheaterBrandName());
                    response.setLogo(tb.getLogo());
                    // map thêm các trường cần thiết
                    return response;
                })
                .collect(Collectors.toList());

        return responses;
    }



}
