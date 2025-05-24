package com.example.DemoAdmin.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "BookingSeat")
public class BookingSeat {
   @EmbeddedId
   private BookingSeatId id;

   @Column(name = "Price")
   private Double price;
}

