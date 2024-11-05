package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.request.TimeSlotRequest;
import com.prj.projectweb.dto.response.CourseResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.TimeSlot;
import org.mapstruct.*;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "giangVien", ignore = true)
    @Mapping(target = "room", ignore = true)
    Course toCourse(CourseRequest courseRequest);   

    @Mapping(source = "room.roomName", target = "room")
    CourseRequest toCourseRequest(Course course);

    @Mapping(source = "giangVien.name", target = "nameOfGiangVien")
    CourseResponse toCourseResponse(Course course);


    Set<TimeSlotRequest> toTimeSlotRequestSet(Set<TimeSlot> timeSlots); // Đổi thành Set
    Set<TimeSlot> toTimeSlotSet(Set<TimeSlotRequest> timeSlotRequests); // Đổi thành Set

    // Thêm phương thức ánh xạ cho Set<Long> đến Set<TimeSlot>
    default Set<TimeSlot> map(Set<Long> ids) {
        if (ids == null) {
            return null;
        }
        Set<TimeSlot> timeSlots = new HashSet<>();
        for (Long id : ids) {
            TimeSlot timeSlot = new TimeSlot();
            timeSlot.setId(id); // Giả định bạn có phương thức setId trong TimeSlot
            timeSlots.add(timeSlot);
        }
        return timeSlots;
    }

    // Thêm phương thức ánh xạ cho Set<TimeSlot> đến Set<Long>
    default Set<Long> mapToIds(Set<TimeSlot> timeSlots) {
        if (timeSlots == null) {
            return null;
        }
        return timeSlots.stream().map(TimeSlot::getId).collect(Collectors.toSet());
    }

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "giangVien", ignore = true)
    @Mapping(target = "room", ignore = true)
    void updateCourse(@MappingTarget Course course, CourseRequest courseRequest);
}



