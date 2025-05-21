package com.example.DemoAdmin.service.screen;

import com.example.DemoAdmin.dto.request.ScreenRequest;
import com.example.DemoAdmin.dto.response.ScreenResponse;
import com.example.DemoAdmin.dto.response.TheaterResponse;
import com.example.DemoAdmin.entity.Screen;
import com.example.DemoAdmin.entity.Seat;
import com.example.DemoAdmin.entity.Theater;
import com.example.DemoAdmin.mapper.IScreenMapper;
import com.example.DemoAdmin.mapper.ITheaterMapper;
import com.example.DemoAdmin.repository.IScreenRepository;
import com.example.DemoAdmin.repository.ITheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class ScreenService implements IScreenService{
    private final ITheaterRepository theaterRepository;
    private final IScreenRepository screenRepository;
    private final IScreenMapper screenMapper;
    @Autowired
    private final ITheaterMapper theaterMapper;

    @Override
    public ScreenResponse createScreen(ScreenRequest request) {

        boolean exists = screenRepository.existsByTheaterIdAndScreenNumber(request.getTheaterId(), request.getScreenNumber());
        if (exists){
            throw new RuntimeException("exist " + request.getScreenNumber() + " in this theater");
        }
        Screen screen = new Screen();
        Theater theater = theaterRepository.findById(request.getTheaterId())
                        .orElseThrow(()-> new RuntimeException("Theater not exist"));
        theater.setTotalScreens(theater.getTotalScreens()+ 1);
        screen.setTheater(theater);
        screen.setScreenNumber(request.getScreenNumber());
        screen.setTotalSeats(request.getTotalSeats());
        Theater saveTheater = theaterRepository.save(theater);
        Screen savedScreen = screenRepository.save(screen);
        return  screenMapper.toScreenResponse(savedScreen);
    }

    @Override
    public ScreenResponse updateScreen(Integer id, ScreenRequest request) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Screen not exist"));
        Theater theater = theaterRepository.findById(request.getTheaterId())
                .orElseThrow(()-> new RuntimeException("Theater not exist"));
        if (!(screen.getTheater().getId() == request.getTheaterId() && screen.getScreenNumber().equals(request.getScreenNumber()) )){

            boolean exists = screenRepository.existsByTheaterIdAndScreenNumber(request.getTheaterId(), request.getScreenNumber());
            if (exists){
                throw new RuntimeException("exist " + request.getScreenNumber() + " in this theater");
            }
        }



        screen.setTheater(theater);
        screen.setScreenNumber(request.getScreenNumber());
        screen.setTotalSeats(request.getTotalSeats());
        Screen savedScreen = screenRepository.save(screen);
        return screenMapper.toScreenResponse(savedScreen);
    }

    @Override
    public ScreenResponse getScreenById(Integer id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Screen not exist"));
        Theater theater = theaterRepository.findById(screen.getTheater().getId())
                .orElseThrow(()-> new RuntimeException("Theater not exist"));
//        TheaterResponse theaterResponse = theaterMapper.toTheaterResponse(theater);
        screen.setTheater(theater);
        return screenMapper.toScreenResponse(screen);
    }

    @Override
    public List<ScreenResponse> getAllScreens() {
        return screenRepository.findAll().stream()
                .map(screenMapper::toScreenResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteScreen(Integer id) {
        Screen screen = screenRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Screen not exist"));
        screenRepository.delete(screen);
    }

}
