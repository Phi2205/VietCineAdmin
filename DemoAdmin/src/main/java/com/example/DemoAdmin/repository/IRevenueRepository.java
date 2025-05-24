// IRevenueRepository.java
package com.example.DemoAdmin.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.DemoAdmin.entity.BookingSeat;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IRevenueRepository extends JpaRepository<BookingSeat, Integer> {

    @Query(value = """
        SELECT 
            CONCAT(m.Title, ' - ', t.Name) AS label,
            SUM(sp.Price) AS amount
        FROM BookingSeat bs
        JOIN Booking b ON bs.BookingId = b.BookingId
        JOIN Showtime s ON b.ShowtimeId = s.ShowtimeId
        JOIN Movie m ON s.MovieId = m.MovieId
        JOIN Screen sc ON s.ScreenId = sc.ScreenId
        JOIN Theater t ON sc.TheaterId = t.TheaterId
        JOIN Seat seat ON bs.SeatId = seat.SeatId
        JOIN SeatPrice sp ON sp.SeatTypeId = seat.SeatTypeId AND sp.ScreenId = sc.ScreenId
        WHERE b.BookingDate BETWEEN :startDate AND :endDate
          AND (:theaterId IS NULL OR t.TheaterId = :theaterId)
          AND (:movieId IS NULL OR m.MovieId = :movieId)
        GROUP BY m.Title, t.Name
    """, nativeQuery = true)
    List<Object[]> findRevenueByAllNative(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("theaterId") Integer theaterId,
            @Param("movieId") Integer movieId
    );
}
