package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CourseContentRequest;
import com.prj.projectweb.entities.CourseContent;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-11-19T20:14:50+0700",
    comments = "version: 1.6.2, compiler: Eclipse JDT (IDE) 3.40.0.z20241023-1306, environment: Java 17.0.13 (Eclipse Adoptium)"
)
@Component
public class CourseContentMapperImpl implements CourseContentMapper {

    @Override
    public CourseContent toCourseContent(CourseContentRequest courseContentRequest) {
        if ( courseContentRequest == null ) {
            return null;
        }

        CourseContent.CourseContentBuilder courseContent = CourseContent.builder();

        List<String> list = courseContentRequest.getDetails();
        if ( list != null ) {
            courseContent.details( new ArrayList<String>( list ) );
        }
        courseContent.session( courseContentRequest.getSession() );
        courseContent.title( courseContentRequest.getTitle() );

        return courseContent.build();
    }
}
