package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.request.PriceAdjustmentRequest;
import com.example.DemoAdmin.dto.response.PriceAdjustmentResponse;
import com.example.DemoAdmin.entity.PriceAdjustment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface IPriceAdjustmentMapper {
    @Mapping(target = "adjustmentId", source = "adjustmentId")
    @Mapping(target = "seatTypeId", source = "seatTypeId")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "dayOfWeek", source = "dayOfWeek")
    @Mapping(target = "specificDate", source = "specificDate")
    @Mapping(target = "priceIncrease", source = "priceIncrease")
    @Mapping(target = "isActive", source = "isActive")
    PriceAdjustmentResponse toPriceAdjustmentResponse(PriceAdjustment priceAdjustment);

    @Mapping(target = "adjustmentId", ignore = true)
    @Mapping(target = "seatType", ignore = true)
    PriceAdjustment toPriceAdjustment(PriceAdjustmentRequest request);
}