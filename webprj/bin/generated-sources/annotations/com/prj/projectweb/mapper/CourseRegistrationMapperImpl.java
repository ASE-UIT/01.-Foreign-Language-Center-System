package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CourseRegistrationRequest;
import com.prj.projectweb.dto.response.CourseRegistrationResponse;
import com.prj.projectweb.entities.CourseRegistration;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-20T10:33:33+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241023-1306, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class CourseRegistrationMapperImpl implements CourseRegistrationMapper {

    @Override
    public CourseRegistration toCourseRegistration(CourseRegistrationRequest courseRegistrationRequest) {
        if ( courseRegistrationRequest == null ) {
            return null;
        }

        CourseRegistration.CourseRegistrationBuilder courseRegistration = CourseRegistration.builder();

        return courseRegistration.build();
    }

    @Override
    public CourseRegistrationResponse toCourseRegistrationResponse(CourseRegistration courseRegistration) {
        if ( courseRegistration == null ) {
            return null;
        }

        CourseRegistrationResponse.CourseRegistrationResponseBuilder courseRegistrationResponse = CourseRegistrationResponse.builder();

        courseRegistrationResponse.registrationId( courseRegistration.getRegistrationId() );
        courseRegistrationResponse.status( courseRegistration.getStatus() );

        return courseRegistrationResponse.build();
    }

    @Override
    public void updateCourseRegistrationFromRequest(CourseRegistrationRequest courseRegistrationRequest, CourseRegistration courseRegistration) {
        if ( courseRegistrationRequest == null ) {
            return;
        }
    }
}
