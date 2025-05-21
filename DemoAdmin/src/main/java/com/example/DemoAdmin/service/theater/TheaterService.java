package com.example.DemoAdmin.service.theater;


import com.example.DemoAdmin.dto.request.ShowtimeRequest;
import com.example.DemoAdmin.dto.request.TheaterRequest;
import com.example.DemoAdmin.dto.response.ShowtimeResponse;
import com.example.DemoAdmin.dto.response.TheaterResponse;
import com.example.DemoAdmin.entity.Movie;
import com.example.DemoAdmin.entity.Screen;
import com.example.DemoAdmin.entity.Showtime;
import com.example.DemoAdmin.entity.Theater;
import com.example.DemoAdmin.mapper.IShowtimeMapper;
import com.example.DemoAdmin.mapper.ITheaterMapper;
import com.example.DemoAdmin.repository.IMovieRepository;
import com.example.DemoAdmin.repository.IScreenRepository;
import com.example.DemoAdmin.repository.IShowtimeRepository;
import com.example.DemoAdmin.repository.ITheaterRepository;
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



    // Tạo suất chiếu mới
    public TheaterResponse createTheater(TheaterRequest request) {
        // Kiểm tra movieId và screenId có tồn tại không


        // Chuyển từ ShowtimeRequest sang Showtime entity


        Theater theater = theaterMapper.toTheater(request);
        theater.setAddress(request.getAddress());
        theater.setName(request.getName());
        theater.setCity(request.getCity());
//        theater.setTotalScreens(request.getTotalScreens());
        theater.setTotalScreens(0);
        // Lưu vào database
        Theater savedTheater = theaterRepository.save(theater);

        // Chuyển từ Showtime entity sang ShowtimeResponse
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


}
