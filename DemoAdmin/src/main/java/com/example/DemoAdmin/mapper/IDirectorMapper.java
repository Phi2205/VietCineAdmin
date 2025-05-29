package com.example.DemoAdmin.mapper;

import com.example.DemoAdmin.dto.request.DirectorRequest;
import com.example.DemoAdmin.dto.response.DirectorResponse;
import com.example.DemoAdmin.entity.Director;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel =  "spring")
public interface IDirectorMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "avatar", source = "avatar")
    DirectorResponse toDirectorResponse(Director director);
}
