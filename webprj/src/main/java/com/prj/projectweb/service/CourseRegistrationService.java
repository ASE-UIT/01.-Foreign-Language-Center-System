package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.CourseRegistrationRequest;
import com.prj.projectweb.dto.response.CourseRegistrationResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.CourseRegistration;
import com.prj.projectweb.entities.User;

import com.prj.projectweb.dto.response.UserCourseResponse;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.exception.PaymentStatus;
import com.prj.projectweb.exception.RegistrationStatus;
import com.prj.projectweb.repositories.CourseRegistrationRepository;
import com.prj.projectweb.repositories.CourseRepository;
import com.prj.projectweb.repositories.UserRepository;
import com.prj.projectweb.utils.UtilsHandleEmail;

import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;

import org.hibernate.engine.internal.Collections;
import org.hibernate.mapping.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class CourseRegistrationService {

    private final CourseRegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
        
    @Autowired
    private UtilsHandleEmail utilsHandleEmail;

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
    
            // Kiểm tra xem học sinh đã đăng ký khóa học này chưa
            boolean isAlreadyRegistered = registrationRepository.existsByStudentAndCourse(student, course);
            if (isAlreadyRegistered) {
                return createResponse(null, null, null, null, RegistrationStatus.FAILURE, "Học viên đã đăng ký khóa học này rồi");
            }
    
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
    
    @Transactional
    public CourseRegistrationResponse completePayment(Long userId, List<Long> courseIds, Double amount) {
        // Tìm tất cả các đăng ký của học viên dựa trên userId và courseIds
        List<CourseRegistration> registrations = registrationRepository.findByStudent_UserId(userId).stream()
                .filter(registration -> courseIds.contains(registration.getCourse().getId()))
                .collect(Collectors.toList());

        if (registrations.isEmpty()) {
            throw new AppException(ErrorCode.REGISTRATION_NOT_FOUND);
        }
        // Duyệt qua danh sách đăng ký và chuyển trạng thái thanh toán
        registrations.forEach(registration -> {
            if (!registration.getHasPaid()) {
                registration.setHasPaid(true);
                registration.setPaymentStatus(PaymentStatus.PAID);
                registrationRepository.save(registration); 
            }
        });
        // Gửi email thông báo sau khi hoàn tất thanh toán
        String courseList = registrations.stream()
                .map(registration -> registration.getCourse().getCourseName())
                .collect(Collectors.joining(", "));
                
        String email = getUserEmailById(userId);
        String subject = "TRUNG TÂM NGOẠI NGỮ - THANH TOÁN KHÓA HỌC";
        String text = String.format("Cảm ơn bạn đã thanh toán thành công số tiền %.2f.\n\nKhóa học của bạn: %s", amount, courseList);

        utilsHandleEmail.sendPayment(email, subject, text);

        return createResponse(null, userId, null, null, RegistrationStatus.SUCCESS, "Đã hoàn tất thanh toán");
    }

    // // test api gửi mail
    // public void sendEmail() {
    //     utilsHandleEmail.sendPayment("pntg2903@gmail.com", "GỬI MAIL THANH TOÁN", "Cảm ơn đã thanh toán");
    // }

    //Phương thức để lấy email của người dùng dựa trên userId
    private String getUserEmailById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));
        return user.getEmail(); 
    }


}
