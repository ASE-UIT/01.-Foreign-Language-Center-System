package com.prj.projectweb.dto.response;

import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.RegistrationStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder // Thêm annotation này để tạo builder
public class CourseRegistrationResponse {
    private Long registrationId;
    private User student;
    private User parent;
    private Course course;
    private RegistrationStatus status;
    private String message;
}
