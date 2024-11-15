package com.prj.projectweb.controller;

import com.prj.projectweb.dto.request.AddRomeInCourseRequest;
import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.request.GiangVienRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.CourseResponse;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.service.CourseService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/getCourses/{center_id}")
    ApiResponse<List<CourseResponse>> getCoursesByCenterId(@PathVariable("center_id") Long center_id) {
        List<CourseResponse> result = courseService.getCoursesByCenterId(center_id);
        return ApiResponse.<List<CourseResponse>>builder()
                .message("SUCCESS: " + result.size() + " courses in center with id = " + center_id)
                .result(result)
                .build();
    }

    @GetMapping("/getCourse/{course_id}")
    ApiResponse<CourseRequest> getCourseById(@PathVariable("course_id") Long course_id) throws Exception {
        return ApiResponse.<CourseRequest>builder()
                .result(courseService.getCourseById(course_id))
                .build();
    }

    @PutMapping("/addGiangVien/{course_id}")
    ApiResponse<String> addGiangVien(@PathVariable("course_id") Long course_id, @RequestBody GiangVienRequest giangVienRequest) throws Exception {
        return ApiResponse.<String>builder()
                .message("SUCCESS: get course with id = " + course_id)
                .result(courseService.addGiangVienToCourse(course_id, giangVienRequest))
                .build();
    }
    
    @PutMapping("/edit/{course_id}")
    public ApiResponse<String> editCourse(@PathVariable("course_id") Long courseId, @RequestBody CourseRequest courseRequest) {
        log.info("in edit course controller");

        try {
            String message = courseService.editCourse(courseId, courseRequest);
            return ApiResponse.<String>builder()
                    .message(message)
                    .result("Success")
                    .build();
        } catch (AppException e) {
            // Trả về thông báo thất bại nếu xảy ra ngoại lệ
            return ApiResponse.<String>builder()
                    .message(e.getMessage())
                    .result("Fail")
                    .build();
        } catch (Exception e) {
            // Xử lý ngoại lệ chung
            return ApiResponse.<String>builder()
                    .message("Đã xảy ra lỗi: " + e.getMessage())
                    .result("Fail")
                    .build();
        }
    }
    
    @GetMapping("/getCoursesByStudent/{studentId}")
    ApiResponse<List<CourseResponse>> getCoursesByStudentId(@PathVariable("studentId") Long studentId) throws Exception {
        log.info("in get courses by student controller");

        List<CourseResponse> courses = courseService.getCoursesByStudentId(studentId);

        return ApiResponse.<List<CourseResponse>>builder()
                .result(courses)
                .build();
    }

    @PutMapping("/addRoom")
    public ApiResponse<String> addRoomInCourse(@RequestBody AddRomeInCourseRequest request) throws Exception {
        log.info("in add room in course controller");

        String message = courseService.addRoomInCourse(request); 

        return ApiResponse.<String>builder()
                .message(message)
                .result("Success")
                .build();
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<String> deleteCourse(@PathVariable("courseId") Long courseId) {
        boolean isDeleted = courseService.deleteCourseById(courseId);
        if (isDeleted) {
            return ResponseEntity.ok("Khóa học đã được xóa thành công");
        }
        else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tìm thấy khóa học");
        }
    }
}
