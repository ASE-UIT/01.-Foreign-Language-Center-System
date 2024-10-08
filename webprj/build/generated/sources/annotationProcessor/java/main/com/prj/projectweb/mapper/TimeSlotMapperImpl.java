package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.TimeSlotRequest;
import com.prj.projectweb.entities.TimeSlot;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2024-10-05T10:47:17+0700",
    comments = "version: 1.6.2, compiler: IncrementalProcessingEnvironment from gradle-language-java-8.10.1.jar, environment: Java 21.0.2 (Oracle Corporation)"
)
@Component
public class TimeSlotMapperImpl implements TimeSlotMapper {

    @Override
    public TimeSlot toTimeSlot(TimeSlotRequest request) {
        if ( request == null ) {
            return null;
        }

        TimeSlot.TimeSlotBuilder timeSlot = TimeSlot.builder();

        timeSlot.day( request.getDay() );
        timeSlot.timeRange( request.getTimeRange() );

        return timeSlot.build();
    }

    @Override
    public TimeSlotRequest toTimeSlotRequest(TimeSlot timeSlot) {
        if ( timeSlot == null ) {
            return null;
        }

        TimeSlotRequest.TimeSlotRequestBuilder timeSlotRequest = TimeSlotRequest.builder();

        timeSlotRequest.day( timeSlot.getDay() );
        timeSlotRequest.timeRange( timeSlot.getTimeRange() );

        return timeSlotRequest.build();
    }
}
