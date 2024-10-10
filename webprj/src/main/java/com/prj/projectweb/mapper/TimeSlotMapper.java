package com.prj.projectweb.mapper;

import com.prj.projectweb.dto.request.TimeSlotRequest;
import com.prj.projectweb.entities.TimeSlot;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TimeSlotMapper {

    @Mapping(target = "id", ignore = true)
    TimeSlot toTimeSlot(TimeSlotRequest request);

    TimeSlotRequest toTimeSlotRequest(TimeSlot timeSlot);
}
