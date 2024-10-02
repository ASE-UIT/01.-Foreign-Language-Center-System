package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CourseContentRequest;
import com.prj.projectweb.entities.CourseContent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseContentMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "course", ignore = true)
    CourseContent toCourseContent(CourseContentRequest courseContentRequest);
}
