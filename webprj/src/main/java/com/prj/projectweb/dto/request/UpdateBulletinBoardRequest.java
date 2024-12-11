package com.prj.projectweb.dto.request;

import java.time.LocalDate;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UpdateBulletinBoardRequest {
    String name;
    String content;
    LocalDate startDate;
    LocalDate endDate;
    String department;
    String completionLevel;
    String status;
}
