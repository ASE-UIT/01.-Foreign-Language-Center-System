package com.prj.projectweb.dto.response;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CenterBulletinBoardResponse {
    Long id;
    String name;
    String content;
    LocalDate startDate;
    LocalDate endDate;
    String department;
    String completionLevel;
    String status;
}
