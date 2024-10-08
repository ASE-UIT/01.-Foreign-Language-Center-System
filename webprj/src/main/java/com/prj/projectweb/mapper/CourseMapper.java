package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.request.TimeSlotRequest;
import com.prj.projectweb.dto.response.CourseResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.TimeSlot;
import org.mapstruct.*;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "giangVien", ignore = true)
    Course toCourse(CourseRequest courseRequest);

    CourseRequest toCourseRequest(Course course);

    @Mapping(source = "giangVien.name", target = "nameOfGiangVien")
    CourseResponse toCourseResponse(Course course);


    Set<TimeSlotRequest> toTimeSlotRequestSet(Set<TimeSlot> timeSlots); // Đổi thành Set
    Set<TimeSlot> toTimeSlotSet(Set<TimeSlotRequest> timeSlotRequests); // Đổi thành Set

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "giangVien", ignore = true)
    void updateCourse(@MappingTarget Course course, CourseRequest courseRequest);
}



