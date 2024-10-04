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
        // Thêm phương thức updateCourse
    @Autowired // Thêm annotation này để tự động inject TimeSlotRepository
            TimeSlotRepository timeSlotRepository = null; // Khai báo TimeSlotRepository

    @AfterMapping
    default void updateCourse(@MappingTarget Course existingCourse, CourseRequest courseRequest) {
        existingCourse.setCourseName(courseRequest.getCourseName());
        existingCourse.setObjective(courseRequest.getObjective());
        existingCourse.setDuration(courseRequest.getDuration());
        existingCourse.setTuitionFee(courseRequest.getTuitionFee());
        existingCourse.setLearningMethod(courseRequest.getLearningMethod());
        existingCourse.setStartTime(LocalDate.parse(courseRequest.getStartTime()));
        existingCourse.setEndTime(LocalDate.parse(courseRequest.getEndTime()));

        // Chuyển đổi List<TimeSlotRequest> sang Set<TimeSlot>
        if (courseRequest.getSchedule() != null) {
            Set<TimeSlot> timeSlots = new HashSet<>();
            for (TimeSlotRequest timeSlotRequest : courseRequest.getSchedule()) {
                TimeSlot timeSlot = timeSlotRepository
                        .findByDayAndTimeRange(timeSlotRequest.getDay(), timeSlotRequest.getTimeRange())
                        .orElseThrow(() -> new AppException(ErrorCode.TIMESLOT_NOTFOUND));

                timeSlots.add(timeSlot);
            }
            existingCourse.setSchedule(timeSlots); // Gán Set<TimeSlot> vào Course
        } else {
            existingCourse.setSchedule(new HashSet<>()); // Nếu không có lịch, đặt về rỗng
        }

        existingCourse.setLikes(courseRequest.getLikes());
        existingCourse.setImage(courseRequest.getImage());
        existingCourse.setNumberOfStudents(courseRequest.getNumberOfStudents());
        existingCourse.setObject(courseRequest.getObject());
    }
}
