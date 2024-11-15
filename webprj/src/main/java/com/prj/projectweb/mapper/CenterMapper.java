package com.prj.projectweb.mapper;

import org.mapstruct.Mapper;

import com.prj.projectweb.dto.response.CenterResponse;
import com.prj.projectweb.entities.Center;

@Mapper(componentModel = "spring")
public interface CenterMapper {
    CenterResponse toResponse(Center center);
}
