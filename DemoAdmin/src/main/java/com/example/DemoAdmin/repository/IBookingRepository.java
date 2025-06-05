package com.example.DemoAdmin.repository;

import com.example.DemoAdmin.dto.response.BookingResponse;
import com.example.DemoAdmin.entity.Booking;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

@Repository
public interface IBookingRepository extends CrudRepository<Booking, Integer> {

    @Query(value = """
        SELECT 
            b.BookingId AS bookingId,
            m.Title AS movieTitle,
            t.Name AS theaterName,
            sc.ScreenNumber AS screenNumber,
            FORMAT(b.BookingDate, 'yyyy-MM-dd HH:mm:ss') AS bookingDate,
            b.Total AS total,
            b.Status AS status,
            STRING_AGG(CONCAT(s.[Row], s.[Column]), ', ') AS seatNames,
            STRING_AGG(CONCAT(f.FoodName, ' x', bf.Quantity, ' (', bf.Total, ')'), ', ') AS foodDetails
        FROM Booking b
        JOIN Showtime sTime ON b.ShowtimeId = sTime.ShowtimeId
        JOIN Movie m ON sTime.MovieId = m.MovieId
        JOIN Screen sc ON sTime.ScreenId = sc.ScreenId
        JOIN Theater t ON sc.TheaterId = t.TheaterId
        LEFT JOIN BookingSeat bs ON b.BookingId = bs.BookingId
        LEFT JOIN Seat s ON bs.SeatId = s.SeatId
        LEFT JOIN BookingFood bf ON b.BookingId = bf.BookingId
        LEFT JOIN Food f ON bf.FoodId = f.FoodId
        WHERE b.UserId = :userId
        GROUP BY b.BookingId, m.Title, t.Name, sc.ScreenNumber, b.BookingDate, b.Total, b.Status
        ORDER BY b.BookingDate DESC
    """, nativeQuery = true)
    List<Object[]> findBookingsByUserId(@Param("userId") Integer userId);
}
