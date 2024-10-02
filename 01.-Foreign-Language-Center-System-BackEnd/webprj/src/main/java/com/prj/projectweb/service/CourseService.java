package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.request.GiangVienRequest;
import com.prj.projectweb.dto.response.CourseResponse;
import com.prj.projectweb.dto.response.GiangVienResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.exception.ResourceNotFoundException;
import com.prj.projectweb.mapper.CourseMapper;
import com.prj.projectweb.repositories.CourseRepository;
import com.prj.projectweb.repositories.GiangVienRepository;
import org.springframework.transaction.annotation.Transactional;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CourseService {

    CourseRepository courseRepository;
    GiangVienRepository giangVienRepository;
    CourseMapper courseMapper;


    @Transactional
    public String addCourse(CourseRequest courseRequest) throws Exception {
        log.info("in add course service");

        // Kiểm tra tên khóa học đã tồn tại chưa
        if (courseRepository.existsByCourseName(courseRequest.getCourseName())) {
            throw  new AppException(ErrorCode.COURSE_EXISTED);
        }


        Course course = courseMapper.toCourse(courseRequest);

        course.setStartTime(LocalDate.parse(courseRequest.getStartTime()));
        course.setEndTime(LocalDate.parse(courseRequest.getEndTime()));

        GiangVien giangVien = giangVienRepository.findById(courseRequest.getGiangVien().getId())
                .orElseThrow(() -> new Exception("GiangVien không tồn tại với id: " + courseRequest.getGiangVien().getId()));

        // Thiết lập mối quan hệ giữa Course và GiangVien
        course.setGiangVien(giangVien);
        giangVien.addCourse(course); // Phương thức tiện ích trong GiangVien


        // Thiết lập mối quan hệ cho CourseContent
        if (course.getCourseContent() != null) {
            course.getCourseContent().forEach(content -> content.setCourse(course));
        }

        // Thiết lập mối quan hệ cho Certificate
        if (course.getCertificate() != null) {
            course.getCertificate().setCourse(course);
        }

        // Lưu course vào database
        courseRepository.save(course);

        return course.getCourseName();
    }

    @Transactional
    public List<String> addListCourses(List<CourseRequest> courseRequests) throws Exception {
        log.info("in add list courses service");

        List<String> courseNames = new ArrayList<>();

        for (CourseRequest courseRequest : courseRequests) {
            courseNames.add(addCourse(courseRequest));
        }

        return courseNames;
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> getCourses() {
        log.info("in get list course service");

        List<Course> courses = courseRepository.findAll();

        List<CourseResponse> courseResponses = courses.stream()
                .map(courseMapper::toCourseResponse)
                .collect(Collectors.toList());

        return courseResponses;
    }

    @Transactional(readOnly = true)
    public CourseRequest getCourseById(Long course_id) throws Exception {
        log.info("in get course by id service");

        return courseMapper.toCourseRequest(courseRepository.findById(course_id)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOTFOUND)));
    }

    public Course getCourseByIdforTeacher(Long courseId) {
        return courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOTFOUND));
    }

    public CourseResponse addGiangVienToCourse(Long courseId, Long giangVienId) {
        Course course = courseRepository.findById(courseId)
            .orElseThrow(() -> new ResourceNotFoundException("Course not found"));
        GiangVien giangVien = giangVienRepository.findById(giangVienId)
            .orElseThrow(() -> new ResourceNotFoundException("GiangVien not found"));

        if (hasDateConflict(course, giangVien)) {
            throw new IllegalStateException("GiangVien has a date conflict with this course");
        }

        course.setGiangVien(giangVien);
        Course savedCourse = courseRepository.save(course);

        return courseMapper.toCourseResponse(savedCourse);
    }

    private boolean hasDateConflict(Course course, GiangVien newGiangVien) {
        // Check if the course already has a GiangVien assigned
        if (course.getGiangVien() != null) {
            // Compare the schedules of the current GiangVien and the new GiangVien
            return course.getGiangVien().hasConflictingSchedule(newGiangVien);
        }
        // If the course doesn't have a GiangVien assigned, there's no conflict
        return false;
    }
}
