package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.response.SeatTypeForPAResponse;
import com.example.DemoAdmin.entity.SeatType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ISeatTypeForPAMapper {

    @Mapping(source = "seatTypeId", target = "id")
    @Mapping(source = "typeName", target = "name")
    SeatTypeForPAResponse toSeatTypeForPAResponse(SeatType seatType);
}