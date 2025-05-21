package com.example.DemoAdmin.mapper;



import com.example.DemoAdmin.dto.request.SeatPriceRequest;
import com.example.DemoAdmin.dto.response.SeatPriceResponse;
import com.example.DemoAdmin.entity.SeatPrice;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ISeatPriceMapper {

    @Mapping(target = "seatTypeId", source = "seatTypeId")
    @Mapping(target = "screen.id", source = "screenId")
    SeatPrice toSeatPrice(SeatPriceRequest request);

    @Mapping(target = "seatPriceId", source = "seatPriceId")
    @Mapping(target = "seatTypeId", source = "seatTypeId")
    @Mapping(target = "screen.id", source = "screen.id")
    @Mapping(target = "screen.theater.id", source = "screen.theater.id")
    @Mapping(target = "price", source = "price")
    SeatPriceResponse toSeatPriceResponse(SeatPrice seatPrice);
//    default com.example.DemoAdmin.entity.Screen mapScreen(Long screenId, Long theaterId) {
//        if (screenId == null && theaterId == null) return null;
//        com.example.DemoAdmin.entity.Screen screen = new com.example.DemoAdmin.entity.Screen();
//        screen.setId(screen.getId());
//        if (theaterId != null) {
//            com.example.DemoAdmin.entity.Theater theater = new com.example.DemoAdmin.entity.Theater();
//            theater.setId(theater.getId());
//            screen.setTheater(theater);
//        }
//        return screen;
//    }

}

