package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.CourseRegistrationRequest;
import com.prj.projectweb.dto.response.CourseRegistrationResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.CourseRegistration;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.RegistrationStatus;
import com.prj.projectweb.repositories.CourseRegistrationRepository;
import com.prj.projectweb.repositories.CourseRepository;
import com.prj.projectweb.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

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
            return createResponse(registration.getRegistrationId(), registration.getStudent(), registration.getParent(), registration.getCourse(), registration.getStatus(), "Đăng ký thành công");
        }

        // Trường hợp không tìm thấy học viên hoặc khóa học
        return createResponse(null, null, null, null, RegistrationStatus.FAILURE, "Không tìm thấy học viên hoặc khóa học");
    }

    private boolean checkScheduleConflict(User student, Course course) {
        // Viết logic kiểm tra xem lịch của học viên có kẹt với khóa học không

        return false; // Giả sử không có kẹt lịch
    }

    private CourseRegistrationResponse createResponse(Long registrationId, User student, User parent, Course course, RegistrationStatus status, String message) {
        return CourseRegistrationResponse.builder()
                .registrationId(registrationId)
                .student(student)
                .parent(parent)
                .course(course)
                .status(status)
                .message(message)
                .build();
    }
}
