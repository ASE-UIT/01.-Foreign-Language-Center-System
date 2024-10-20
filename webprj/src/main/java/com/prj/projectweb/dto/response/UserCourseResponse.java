package com.prj.projectweb.dto.response;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserCourseResponse {
    private Long id;
    private String name; // User's name
    private String phoneNumber; // User's phone number
    private List<CourseInfo> courses; // List of courses signed up for

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CourseInfo {
        private Long courseId;
        private String courseName; // Name of the course
        private boolean hasPaid; // Payment status
    }
}
