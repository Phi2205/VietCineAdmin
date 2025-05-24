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

   @Column(name = "ShowtimeId")
   private Integer showtimeId;

   // Không cần quan hệ phức tạp
}