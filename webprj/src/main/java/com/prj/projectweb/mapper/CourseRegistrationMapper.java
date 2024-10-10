package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CourseRegistrationRequest;
import com.prj.projectweb.dto.response.CourseRegistrationResponse;
import com.prj.projectweb.entities.CourseRegistration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CourseRegistrationMapper {

    // Chuyển từ dto sang Entity
    @Mapping(target = "registrationId", ignore = true)  // registrationId sẽ được tự động sinh ra
    CourseRegistration toCourseRegistration(CourseRegistrationRequest courseRegistrationRequest);

    // Chuyển từ Entity sang Response dto
    CourseRegistrationResponse toCourseRegistrationResponse(CourseRegistration courseRegistration);

    // Phương thức này dùng để cập nhật thông tin vào entity có sẵn
    void updateCourseRegistrationFromRequest(CourseRegistrationRequest courseRegistrationRequest, @MappingTarget CourseRegistration courseRegistration);
}
