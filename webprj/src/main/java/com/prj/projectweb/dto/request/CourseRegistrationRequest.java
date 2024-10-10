package com.prj.projectweb.dto.request;

import lombok.Data;

@Data
public class CourseRegistrationRequest {
    private Long studentId;
    private Long parentId; // Có thể null nếu học viên tự đăng ký
    private Long courseId;
}
