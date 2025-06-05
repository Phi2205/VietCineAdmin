package com.example.DemoAdmin.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "Booking")
public class Booking {
   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   @Column(name = "BookingId")
   private Integer id;

   @Column(name = "UserId")
   private Integer userId;

   @Column(name = "BookingDate")
   private LocalDateTime bookingDate;

   @Column(name = "TotalPrice")
   private Double totalPrice;

   @Column(name = "Status")
   private String status;

   @Column(name = "ShowtimeId")
   private Integer showtimeId;

   @ManyToOne(fetch = FetchType.EAGER)
   @JoinColumn(name = "ShowtimeId", insertable = false, updatable = false)
   private Showtime showtime;

   @OneToMany
   @JoinColumn(name = "BookingId")
   private List<BookingSeat> bookingSeats;
}