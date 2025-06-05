package com.example.DemoAdmin.service.booking;

import com.example.DemoAdmin.dto.response.BookingResponse;
import java.util.List;

public interface IBookingService {
    List<BookingResponse> getBookingsByUserId(Integer userId);
}
