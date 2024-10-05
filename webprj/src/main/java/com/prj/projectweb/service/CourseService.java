package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.request.GiangVienRequest;
import com.prj.projectweb.dto.request.TimeSlotRequest;
import com.prj.projectweb.dto.response.CourseResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.entities.TimeSlot;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.CourseMapper;
import com.prj.projectweb.mapper.TimeSlotMapper;
import com.prj.projectweb.repositories.CourseRepository;
import com.prj.projectweb.repositories.GiangVienRepository;
import com.prj.projectweb.repositories.TimeSlotRepository;
import org.springframework.http.HttpStatus;
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
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CourseService {

    CourseRepository courseRepository;
    GiangVienRepository giangVienRepository;
    CourseMapper courseMapper;
    TimeSlotRepository timeSlotRepository;
    GiangVienService giangVienService;


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

        if (courseRequest.getGiangVien() != null) {
            GiangVien giangVien = giangVienRepository.findById(courseRequest.getGiangVien().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOTFOUND));

            // Thiết lập mối quan hệ giữa Course và GiangVien
            course.setGiangVien(giangVien);
            giangVien.addCourse(course); // Phương thức tiện ích trong GiangVien
        }


        // Thiết lập mối quan hệ cho CourseContent
        if (course.getCourseContent() != null) {
            course.getCourseContent().forEach(content -> content.setCourse(course));
        }

        // Thiết lập mối quan hệ cho TimeSlot
        if (courseRequest.getSchedule() != null) {
            for (TimeSlotRequest timeSlotRequest : courseRequest.getSchedule()) {
                TimeSlot timeSlot = timeSlotRepository
                        .findByDayAndTimeRange(timeSlotRequest.getDay(), timeSlotRequest.getTimeRange())
                        .orElseThrow(() -> new AppException(ErrorCode.TIMESLOT_NOTFOUND));

                if (!course.getSchedule().contains(timeSlot)) {
                    course.addTimeSlot(timeSlot);
                }
            }
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

    @Transactional
    public String addGiangVienToCourse(Long courseId, GiangVienRequest giangVienRequest) throws Exception {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOTFOUND));

        GiangVien giangVien = giangVienRepository.findById(giangVienRequest.getId())
                .orElseThrow(() -> new AppException(ErrorCode.TEACHER_NOTFOUND));

        // Lấy lịch của giảng viên và khóa học
        Set<TimeSlot> giangVienSchedules = giangVienService.getSchedulesOfGiangVien(giangVien.getId());
        Set<TimeSlot> courseSchedules = this.getSchedulesOfCourse(courseId);

        // Kiểm tra xem lịch có trùng không
        if (isScheduleConflict(giangVienSchedules, courseSchedules)) {
            return "Giảng viên bị trùng lịch";
        }

        // Thêm giảng viên vào khóa học
        course.setGiangVien(giangVien);
        giangVien.addCourse(course); // Phương thức tiện ích đã có trong GiangVien

        // Lưu khóa học với giảng viên mới
        courseRepository.save(course);

        return "Đã thêm thành công giảng viên " + giangVienRequest.getName() + " vào khóa hoc id = " + courseId;
    }




    // lay lich cua khoa hoc
    public Set<TimeSlot> getSchedulesOfCourse(Long courseId) throws Exception {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOTFOUND));

        return course.getSchedule();
    }

    public boolean isScheduleConflict(Set<TimeSlot> giangVienSchedules, Set<TimeSlot> courseSchedules) {
        for (TimeSlot gvSlot : giangVienSchedules) {
            for (TimeSlot courseSlot : courseSchedules) {
                if (gvSlot.getDay().equals(courseSlot.getDay()) &&
                        gvSlot.getTimeRange().equals(courseSlot.getTimeRange())) {
                    return true; // Trùng lịch
                }
            }
        }
        return false; // Không trùng lịch
    }


}
