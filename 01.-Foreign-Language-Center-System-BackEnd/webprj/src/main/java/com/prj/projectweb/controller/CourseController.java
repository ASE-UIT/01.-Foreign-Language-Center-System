package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.CourseResponse;
import com.prj.projectweb.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CourseController {
    CourseService courseService;

    @PostMapping("/add")
    ApiResponse<String> addCourse(@RequestBody CourseRequest courseRequest) throws Exception {
       log.info("in api course controller");
        return ApiResponse.<String>builder()
                .message("create course successfully")
                .result(courseService.addCourse(courseRequest))
                .build();

    }

    @PostMapping("/addList")
    ApiResponse<List<String>> addListCourses(@RequestBody List<CourseRequest> courseRequests) throws Exception {
        log.info("in add list courses controller");

        List<String> result = courseService.addListCourses(courseRequests);

        return ApiResponse.<List<String>>builder()
                .message("added successfully " + result.size() + " courses")
                .result(result)
                .build();
    }

    @GetMapping("/getCourses")
    ApiResponse<List<CourseResponse>> getCourses() {
        return ApiResponse.<List<CourseResponse>>builder()
                .result(courseService.getCourses())
                .build();
    }

    @GetMapping("/getCourses/{course_id}")
    ApiResponse<CourseRequest> getCourseById(@PathVariable("course_id") Long course_id) throws Exception {
        return ApiResponse.<CourseRequest>builder()
                .result(courseService.getCourseById(course_id))
                .build();
    }
}
