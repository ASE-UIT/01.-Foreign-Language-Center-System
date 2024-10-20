package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.CourseRegistrationRequest;
import com.prj.projectweb.dto.response.CourseRegistrationResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.CourseRegistration;
import com.prj.projectweb.entities.User;

import com.prj.projectweb.dto.response.UserCourseResponse;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.exception.RegistrationStatus;
import com.prj.projectweb.repositories.CourseRegistrationRepository;
import com.prj.projectweb.repositories.CourseRepository;
import com.prj.projectweb.repositories.UserRepository;

import org.hibernate.engine.internal.Collections;
import org.hibernate.mapping.Map;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CourseRegistrationService {

    private final CourseRegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;

    public CourseRegistrationService(CourseRegistrationRepository registrationRepository,
                                     UserRepository userRepository,
                                     CourseRepository courseRepository) {
        this.registrationRepository = registrationRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
    }

    public CourseRegistrationResponse registerCourse(CourseRegistrationRequest request) {
        Optional<User> studentOpt = userRepository.findById(request.getStudentId());
        Optional<User> parentOpt = Optional.empty();
        if (request.getParentId() != null) {
            parentOpt = userRepository.findById(request.getParentId());
        }
        Optional<Course> courseOpt = courseRepository.findById(request.getCourseId());

        if (studentOpt.isPresent() && courseOpt.isPresent() && (parentOpt.isEmpty() || parentOpt.isPresent())) {
            User student = studentOpt.get();
            User parent = parentOpt.orElse(null);
            Course course = courseOpt.get();

            // Kiểm tra kẹt lịch
            boolean isConflict = checkScheduleConflict(student, course);

            if (isConflict) {
                // Trả về phản hồi kẹt lịch
                return createResponse(null, null, null, null, RegistrationStatus.KET_LICH, "Kẹt lịch");
            }

            CourseRegistration registration = CourseRegistration.builder()
                    .student(student)
                    .parent(parent)
                    .course(course)
                    .status(RegistrationStatus.SUCCESS) // Trạng thái thành công
                    .build();

            registrationRepository.save(registration);
            return createResponse(registration.getRegistrationId(), student.getUserId(), parent != null ? parent.getUserId() : null, course.getId(), registration.getStatus(), "Đăng ký thành công");
        }

        // Trường hợp không tìm thấy học viên hoặc khóa học
        return createResponse(null, null, null, null, RegistrationStatus.FAILURE, "Không tìm thấy học viên hoặc khóa học");
    }

    private boolean checkScheduleConflict(User student, Course course) {
        // Viết logic kiểm tra xem lịch của học viên có kẹt với khóa học không

        return false; // Giả sử không có kẹt lịch
    }

    private CourseRegistrationResponse createResponse(Long registrationId, Long studentId, Long parentId, Long courseId, RegistrationStatus status, String message) {
        return CourseRegistrationResponse.builder()
                .registrationId(registrationId)
                .studentId(studentId)
                .parentId(parentId)
                .courseId(courseId)
                .status(status)
                .message(message)
                .build();
    }

    public UserCourseResponse getUserCourses(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));
        List<CourseRegistration> registrations = registrationRepository.findByStudent_UserId(userId);

        List<UserCourseResponse.CourseInfo> courseInfos = registrations.stream()
                .map(registration -> new UserCourseResponse.CourseInfo(
                        registration.getCourse().getId(),
                        registration.getCourse().getCourseName(),
                        registration.getHasPaid()
                ))
                .collect(Collectors.toList());

        return UserCourseResponse.builder()
                .id(userId)
                .name(user.getFullName())
                .phoneNumber(user.getPhone())
                .courses(courseInfos)
                .build();
    }

    public List<UserCourseResponse> getAllUserCourses() {
        // Lấy tất cả các đăng ký khóa học của tất cả người dùng
        List<CourseRegistration> registrations = registrationRepository.findAll();
    
        // Khởi tạo danh sách để chứa thông tin tất cả người dùng
        List<UserCourseResponse> userCourseResponses = new ArrayList<>();
    
        // Duyệt qua từng đăng ký khóa học
        for (CourseRegistration registration : registrations) {
            Long userId = registration.getStudent().getUserId();
            
            // Kiểm tra xem người dùng đã có trong danh sách chưa
            if (!userCourseResponses.stream().anyMatch(response -> response.getId().equals(userId))) {
                // Lấy thông tin khóa học cho từng người dùng
                UserCourseResponse userCourseResponse = getUserCourses(userId);
                userCourseResponses.add(userCourseResponse);
            }
        }
    
        // Trả về danh sách các UserCourseResponse
        return userCourseResponses;
    }

    public List<UserCourseResponse> getUsersByCourseAndUnpaid(Long courseId) {
        // Lấy tất cả các đăng ký khóa học của khóa học đã cho, và chỉ lấy những người chưa thanh toán
        List<CourseRegistration> registrations = registrationRepository.findByCourse_IdAndHasPaid(courseId, false);
    
        // Dùng Set để lưu các thông tin user đã đăng ký (không trùng lặp)
        Set<Long> userIds = new HashSet<>();
        List<UserCourseResponse> userCourseResponses = new ArrayList<>();
    
        // Duyệt qua các đăng ký và nhóm thông tin các user chưa thanh toán
        for (CourseRegistration registration : registrations) {
            Long userId = registration.getStudent().getUserId();
            
            // Kiểm tra xem user đã có trong danh sách chưa
            if (!userIds.contains(userId)) {
                // Lấy thông tin khóa học của user này
                UserCourseResponse userCourseResponse = getUserCourses(userId); // Gọi lại hàm getUserCourses để lấy thông tin của user
    
                // Thêm thông tin vào danh sách và đánh dấu user đã được thêm
                userCourseResponses.add(userCourseResponse);
                userIds.add(userId);
            }
        }
    
        return userCourseResponses;
    }
    
    
}
