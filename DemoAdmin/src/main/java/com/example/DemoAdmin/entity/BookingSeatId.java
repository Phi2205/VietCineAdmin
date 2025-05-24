package com.example.DemoAdmin.entity;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
public class BookingSeatId implements Serializable {
   private Integer booking;
   private Integer seat;

   @Override
   public boolean equals(Object o) {
       if (this == o) return true;
       if (!(o instanceof BookingSeatId)) return false;
       BookingSeatId that = (BookingSeatId) o;
       return Objects.equals(booking, that.booking) &&
               Objects.equals(seat, that.seat);
   }

   @Override
   public int hashCode() {
       return Objects.hash(booking, seat);
   }
}
