package com.example.DemoAdmin.service.booking;

import com.example.DemoAdmin.dto.response.BookingResponse;
import com.example.DemoAdmin.repository.IBookingRepository;
import com.example.DemoAdmin.service.booking.IBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService implements IBookingService {

    private final IBookingRepository bookingRepository;

    @Override
    public List<BookingResponse> getBookingsByUserId(Integer userId) {
        List<Object[]> rows = bookingRepository.findBookingsByUserId(userId);
        List<BookingResponse> result = new ArrayList<>();

        for (Object[] row : rows) {
            BookingResponse dto = new BookingResponse();
            dto.setBookingId((Integer) row[0]);
            dto.setMovieTitle((String) row[1]);
            dto.setTheaterName((String) row[2]);
            dto.setScreenNumber((String) row[3]);
            dto.setBookingDate((String) row[4]);
            dto.setTotal((Integer) row[5]);
            dto.setStatus((String) row[6]);
            dto.setSeatNames((String) row[7]);
            dto.setFoodDetails((String) row[8]);

            result.add(dto);
        }

        return result;
    }
}
