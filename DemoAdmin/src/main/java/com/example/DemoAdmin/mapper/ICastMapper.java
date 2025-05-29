package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.request.CastRequest;
import com.example.DemoAdmin.dto.response.CastResponse;
import com.example.DemoAdmin.entity.Cast;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel =  "spring")
public interface ICastMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "avatar", source = "avatar")
    CastResponse toCastResponse(Cast cast);
}
