package com.prj.projectweb.dto.request;

import java.time.LocalDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CreateBulletinBoardRequest {
    Long centerId;
    String name;
    String content;
    LocalDate startDate;
    LocalDate endDate;
    String department;
}
