package com.example.DemoAdmin.service.showtimeseat;

import com.example.DemoAdmin.dto.request.ShowtimeSeatRequest;
import com.example.DemoAdmin.dto.response.ShowtimeSeatResponse;
import com.example.DemoAdmin.entity.Seat;
import com.example.DemoAdmin.entity.Showtime;
import com.example.DemoAdmin.entity.ShowtimeSeat;
import com.example.DemoAdmin.repository.ISeatRepository;
import com.example.DemoAdmin.repository.IShowtimeRepository;
import com.example.DemoAdmin.repository.IShowtimeSeatRepository;
import com.example.DemoAdmin.service.showtime.ShowtimeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class ShowtimeSeatService implements IShowtimeSeatService{
    @Autowired
    private final IShowtimeRepository showtimeRepository;
    @Autowired
    private final ISeatRepository seatRepository;
    @Autowired
    private final IShowtimeSeatRepository showtimeSeatRepository;


    @Override
    public void creatTicket(ShowtimeSeatRequest request) {
        Showtime showtime = showtimeRepository.findById(request.getShowtimeId())
                .orElseThrow(()-> new RuntimeException("Showtime not exist"));
        Seat seat = seatRepository.findById(request.getSeatId())
                .orElseThrow(() -> new RuntimeException("Seat not exist"));
        ShowtimeSeat showtimeSeat = new ShowtimeSeat();
        showtimeSeat.setShowtime(showtime);
        showtimeSeat.setSeat(seat);
        showtimeSeat.setStatus("available");
        showtimeSeatRepository.save(showtimeSeat);
    }

    @Override
    @Transactional
    public void deleteTicket(Integer showtimeId) {
        showtimeSeatRepository.deleteAllByShowtimeId(showtimeId);
    }
}
