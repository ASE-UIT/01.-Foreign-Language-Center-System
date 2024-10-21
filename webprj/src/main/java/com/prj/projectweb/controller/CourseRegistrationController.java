package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.CourseRegistrationRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.UserCourseResponse;
import com.prj.projectweb.dto.response.CourseRegistrationResponse;
import com.prj.projectweb.service.CourseRegistrationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
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

    @GetMapping("/user/unpaid/{userId}")
    public ResponseEntity<ApiResponse<UserCourseResponse>> getUserCourses(@PathVariable("userId") Long userId) {
        UserCourseResponse response = courseRegistrationService.getUserCourses(userId);
        return ResponseEntity.ok(ApiResponse.<UserCourseResponse>builder()
                .message("Course unpaid of user id = " + userId)
                .result(response)
                .build());
    }

    @GetMapping("/userCourses/list")
    public ResponseEntity<ApiResponse<List<UserCourseResponse>>> getListUserCourses() {
        List<UserCourseResponse> responses = courseRegistrationService.getAllUserCourses();
        return ResponseEntity.ok(ApiResponse.<List<UserCourseResponse>>builder()
                .message("List User Unpaid Of All Course")
                .result(responses)
                .build());
    }
    @GetMapping("/course/unpaid/{id}")
    public ResponseEntity<ApiResponse<List<UserCourseResponse>>> getListUserUnpaidOfCourse(@PathVariable("id") Long id) {
        List<UserCourseResponse> responses = courseRegistrationService.getUsersByCourseAndUnpaid(id);
        return ResponseEntity.ok(ApiResponse.<List<UserCourseResponse>>builder()
                .message("List User Unpaid Of Course id = " + id)
                .result(responses)
                .build());
    }
    @PostMapping("/complete-payment")
    public ResponseEntity<ApiResponse<?>> completePayment(@RequestParam Long userId,
                                                          @RequestParam List<Long> courseIds,
                                                          @RequestParam Double amount) {
        CourseRegistrationResponse response = courseRegistrationService.completePayment(userId, courseIds, amount);
        return ResponseEntity.ok(ApiResponse.<CourseRegistrationResponse>builder()
                .message("Payment completed successfully")
                .result(response)
                .build());
    }
}

