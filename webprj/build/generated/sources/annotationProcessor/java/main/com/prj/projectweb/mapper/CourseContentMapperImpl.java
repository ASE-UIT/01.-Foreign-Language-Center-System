package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.CourseContentRequest;
import com.prj.projectweb.entities.CourseContent;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-02T13:32:14+0700",
    comments = "version: 1.6.2, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.10.1.jar, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class CourseContentMapperImpl implements CourseContentMapper {

    @Override
    public CourseContent toCourseContent(CourseContentRequest courseContentRequest) {
        if ( courseContentRequest == null ) {
            return null;
        }

        CourseContent.CourseContentBuilder courseContent = CourseContent.builder();

        courseContent.session( courseContentRequest.getSession() );
        courseContent.title( courseContentRequest.getTitle() );
        List<String> list = courseContentRequest.getDetails();
        if ( list != null ) {
            courseContent.details( new ArrayList<String>( list ) );
        }

        return courseContent.build();
    }
}
