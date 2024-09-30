package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.response.CourseResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.CourseContent;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "giangVien", ignore = true)
    Course toCourse(CourseRequest courseRequest);

    CourseRequest toCourseRequest(Course course);

    @Mapping(source = "giangVien.name", target = "nameOfGiangVien")
    CourseResponse toCourseResponse(Course course);
}
