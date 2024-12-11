package com.prj.projectweb.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CourseStatisticsResponse {
    String courseName;
    String description;
    String teacherName;
    String numberOfStudents;
}
