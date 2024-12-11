package com.prj.projectweb.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseRegistrationRequest {
    private Long studentId;
    private Long parentId; // Có thể null nếu học viên tự đăng ký
    private Long courseId;
}
