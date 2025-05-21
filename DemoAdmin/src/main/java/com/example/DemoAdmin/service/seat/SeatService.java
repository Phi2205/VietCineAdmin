package com.example.DemoAdmin.service.seat;

import com.example.DemoAdmin.dto.request.ScreenSeatRequest;
import com.example.DemoAdmin.dto.request.SeatRequest;
import com.example.DemoAdmin.dto.response.SeatResponse;
import com.example.DemoAdmin.entity.Screen;
import com.example.DemoAdmin.entity.Seat;
import com.example.DemoAdmin.mapper.IScreenMapper;
import com.example.DemoAdmin.repository.IScreenRepository;
import com.example.DemoAdmin.repository.ISeatRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SeatService implements ISeatService {
    private final ISeatRepository seatRepository;
    private final IScreenRepository screenRepository;
    private final IScreenMapper screenMapper;
    public List<Seat> getSeatsByScreenId(Integer screenId) {
        return seatRepository.findByScreenId(screenId);
    }
    public int rowLetterToIndex(String rowLetter) {
        return rowLetter.toUpperCase().charAt(0) - 'A'; // Ví dụ: 'B' - 'A' = 1
    }

    @Override
    public List<SeatResponse> getAllSeatByScreenId(Integer screenId) {
        List<Seat> seats = seatRepository.findByScreenId(screenId);
        System.out.println(seats);
        List<SeatResponse> seatResponses = new ArrayList<>(List.of());
        for (Seat seat:seats){
            SeatResponse seatResponse = new SeatResponse();
            seatResponse.setId(seat.getId());
            seatResponse.setScreenId(seat.getScreenId());
            seatResponse.setRow(seat.getRow());
            seatResponse.setColumn(seat.getColumn());
            seatResponse.setSeatTypeId(seat.getSeatTypeId());
            System.out.println(seatResponse);
            seatResponses.add(seatResponse);
        }
        return seatResponses;
//        return seats.stream()
//                .map(seat -> new SeatResponse(
//                        seat.getId(),
//                        seat.getScreenId(),
//                        String.valueOf(seat.getRow()),
//                        seat.getColumn(),
//                        seat.getSeatTypeId()
//                ))
//                .toList();
    }

    @Override
    public void saveSeats(List<SeatRequest> seatAddRequests, Integer screenId) {
        List<Seat> seats = seatAddRequests.stream()
                .map(request -> {
                    Seat seat = new Seat();
                    seat.setScreenId(request.getScreenId());
                    seat.setRow(request.getRow());
                    seat.setColumn(request.getColumn());
                    seat.setSeatTypeId(request.getSeatTypeId());
                    return seat;
                })
                .collect(Collectors.toList());
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new RuntimeException("Not exist Screen"));
        screen.setTotalSeats(screen.getTotalSeats() + seats.size());
        Screen savedScreen = screenRepository.save(screen);
        seatRepository.saveAll(seats);
    }

    @Override
    @Transactional
    public void deleteSeats(List<SeatRequest> seatDeleteRequests, Integer screenId) {
        for (SeatRequest request : seatDeleteRequests) {
            Seat seat = seatRepository.findByScreenIdAndRowAndColumn(
                    screenId,
                    request.getRow(),
                    request.getColumn()
            ).orElseThrow(() -> new RuntimeException("Seat not found"));

            seatRepository.delete(seat);
        }

        // Cập nhật lại tổng số ghế
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(() -> new RuntimeException("Not exist Screen"));
        screen.setTotalSeats(screen.getTotalSeats() - seatDeleteRequests.size());
        screenRepository.save(screen);
    }
    @Override
    @Transactional
    public void updateSeats(ScreenSeatRequest request, Integer screenId){
        List<Seat> seatDeletes = seatRepository.findByScreenId(screenId);
        seatRepository.deleteAll(seatDeletes);
        int count = 0;
        Screen screen = screenRepository.findById(screenId)
                .orElseThrow(()-> new RuntimeException("không có Screen"));
        for (SeatRequest seat:request.getListSeats()){
            Seat seatNew = new Seat();
            seatNew.setScreenId(screenId);
            seatNew.setRow(seat.getRow());
            seatNew.setColumn(seat.getColumn());
            seatNew.setSeatTypeId(seat.getSeatTypeId());
            count++;
            seatRepository.save(seatNew);
        }
        screen.setTotalSeats(count);
        screenRepository.save(screen);
    }


}
