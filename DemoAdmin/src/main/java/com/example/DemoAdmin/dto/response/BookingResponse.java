package com.example.DemoAdmin.dto.response;

import lombok.Data;

@Data
public class BookingResponse {
    private Integer bookingId;
    private String movieTitle;
    private String theaterName;
    private String screenNumber;
    private String bookingDate;
    private Integer total;
    private String status;
    private String seatNames;
    private String foodDetails;
}