package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.CourseRegistrationRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.CourseRegistrationResponse;
import com.prj.projectweb.service.CourseRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/registrations")
public class CourseRegistrationController {

    private final CourseRegistrationService courseRegistrationService;

    public CourseRegistrationController(CourseRegistrationService courseRegistrationService) {
        this.courseRegistrationService = courseRegistrationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<?>> registerCourse(@RequestBody CourseRegistrationRequest request) {
        CourseRegistrationResponse response = courseRegistrationService.registerCourse(request);

        if (response != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(
                ApiResponse.<CourseRegistrationResponse>builder()
                    .message("Registation successfully")
                    .code(HttpStatus.CREATED.value())
                    .result(response)
                    .build()
            );
        } else {
           return  ResponseEntity.status(HttpStatus.CONFLICT).body(
                ApiResponse.builder()
                    .message("Registation failed")
                    .code(HttpStatus.CONFLICT.value())
                    .build()
            );
        }
    }
}

