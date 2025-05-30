package com.example.DemoAdmin.service.theaterbrand;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.DemoAdmin.dto.response.TheaterBrandResponse;
import com.example.DemoAdmin.entity.TheaterBrand;
import com.example.DemoAdmin.mapper.ITheaterBrandMapper;
import com.example.DemoAdmin.repository.ITheaterBrandRepository;
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
    private final ITheaterBrandRepository theaterBrandRepository;
    @Autowired
    private final ITheaterBrandMapper theaterBrandMapper;
    @Autowired
    private final Cloudinary cloudinary;


    @Override
    public TheaterBrandResponse createTheaterBrand(String theaterBrandName, MultipartFile logo) throws IOException {
        TheaterBrand theaterBrand = new TheaterBrand();
        theaterBrand.setTheaterBrandName(theaterBrandName);
//        TheaterBrand savedTheaterBrand = theaterBrandReposiroty.save(theaterBrand);
        if (logo != null && !logo.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(logo.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "logo_theater_brand_" + theaterBrandName,
                            "folder", "vietcine",
                            "overwrite", true,
                            "resource_type", "image"
                    ));
            String logoUrl = (String) uploadResult.get("secure_url");
            theaterBrand.setLogo(logoUrl);
        }
        TheaterBrand savedTheaterBrand = theaterBrandRepository.save(theaterBrand);
        return theaterBrandMapper.toTheaterBrandResponse(savedTheaterBrand);
    }

    @Override
    public TheaterBrandResponse updateTheaterBrand(String theaterBrandName, MultipartFile logo, Integer id) throws IOException {
        TheaterBrand theaterBrand = theaterBrandRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Theater Brand not exist"));
        theaterBrand.setTheaterBrandName(theaterBrandName);
        if (logo != null && !logo.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(logo.getBytes(),
                    ObjectUtils.asMap(
                            "public_id", "logo_theater_brand_" + theaterBrandName,
                            "folder", "vietcine",
                            "overwrite", true,
                            "resource_type", "image"
                    ));
            String logoUrl = (String) uploadResult.get("secure_url");
            theaterBrand.setLogo(logoUrl);
        }
        TheaterBrand updateTheaterBrand = theaterBrandRepository.save(theaterBrand);
        return theaterBrandMapper.toTheaterBrandResponse(updateTheaterBrand);
    }




    @Override
    public void deleteTheaterBrand(Integer id) {
        TheaterBrand theaterBrand = theaterBrandRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Theater Brand not exist"));
        theaterBrandRepository.delete(theaterBrand);
    }

    @Override
    public TheaterBrandResponse getTheaterBrandById(Integer id) {
        TheaterBrand theaterBrand = theaterBrandRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Theater Brand not exist"));
        return theaterBrandMapper.toTheaterBrandResponse(theaterBrand);
    }

    @Override
    public List<TheaterBrandResponse> getAllTheaterBand() {
        List<TheaterBrand> theaterBrands = theaterBrandRepository.findAll();

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
