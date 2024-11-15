package com.prj.projectweb.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

import com.prj.projectweb.entities.TimeSlot;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AvailableRoomRequest {
    Long centerId;
    Set<TimeSlotRequest> timeSlots;
    LocalDate startDate;
    LocalDate endDate;
}