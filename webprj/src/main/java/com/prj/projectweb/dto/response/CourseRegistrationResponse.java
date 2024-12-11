package com.prj.projectweb.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.enumType.RegistrationStatus;

import lombok.Builder;
import lombok.Data;

@Data
@Builder 
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CourseRegistrationResponse {
    private Long registrationId;
    private Long studentId;
    private Long parentId;
    private Long courseId;
    private RegistrationStatus status;
    private String message;
}
