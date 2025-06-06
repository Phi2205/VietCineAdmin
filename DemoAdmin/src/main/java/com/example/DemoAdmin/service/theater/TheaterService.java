package com.example.DemoAdmin.service.theater;


import com.example.DemoAdmin.dto.request.ShowtimeRequest;
import com.example.DemoAdmin.dto.request.TheaterRequest;
import com.example.DemoAdmin.dto.response.ShowtimeResponse;
import com.example.DemoAdmin.dto.response.TheaterResponse;
import com.example.DemoAdmin.entity.*;
import com.example.DemoAdmin.mapper.IShowtimeMapper;
import com.example.DemoAdmin.mapper.ITheaterMapper;
import com.example.DemoAdmin.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class TheaterService implements ITheaterService{
    @Autowired
    private final ITheaterRepository theaterRepository;
    @Autowired
    private final ITheaterMapper theaterMapper;
    @Autowired
    private final ITheaterBrandRepository theaterBrandRepository;


    // Tạo suất chiếu mới
    public TheaterResponse createTheater(TheaterRequest request) {


        Theater theater = theaterMapper.toTheater(request);
        theater.setAddress(request.getAddress());
        theater.setName(request.getName());
        theater.setCity(request.getCity());
        TheaterBrand theaterBrand = theaterBrandRepository.findById(request.getTheaterBrandId())
                        .orElseThrow(()-> new RuntimeException("Not exist theater brand"));
        theater.setTheaterBrand(theaterBrand);
        theater.setTotalScreens(0);
        Theater savedTheater = theaterRepository.save(theater);


        return theaterMapper.toTheaterResponse(savedTheater);
    }

    @Override
    public TheaterResponse updateTheater(Integer id, TheaterRequest request) {

        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found with id: " + id));

        theater.setName(request.getName());
        theater.setAddress(request.getAddress());
        theater.setCity(request.getCity());
//        theater.setTotalScreens(request.getTotalScreens());

        TheaterBrand theaterBrand = theaterBrandRepository.findById(request.getTheaterBrandId())
                .orElseThrow(()-> new RuntimeException("Not exist theater brand"));
        theater.setTheaterBrand(theaterBrand);
        Theater updatedTheater = theaterRepository.save(theater);


        return theaterMapper.toTheaterResponse(updatedTheater);
    }

    @Override
    public TheaterResponse getTheaterById(Integer id) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Theater not found with id: " + id));
        return theaterMapper.toTheaterResponse(theater);
    }

    @Override
    public List<TheaterResponse> getAllTheaters() {
        return theaterRepository.findAll().stream()
                .map(theaterMapper::toTheaterResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteTheater(Integer id) {
        Theater theater = theaterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Theater not found with id: " + id));
        theaterRepository.delete(theater);
    }

    @Override
    public List<TheaterResponse> getAllTheatersByTheaterBrandId(Integer theaterBrandId) {
        List<Theater> theaterBrands = theaterRepository.findByTheaterBrand_TheaterBrandId(theaterBrandId);
        return theaterMapper.toTheaterResponses(theaterBrands);
    }


}
