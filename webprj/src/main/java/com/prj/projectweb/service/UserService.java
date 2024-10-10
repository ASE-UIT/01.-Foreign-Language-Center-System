package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.ChangePasswordRequest;
import com.prj.projectweb.dto.request.UserCreationRequest;
import com.prj.projectweb.dto.response.ChildOfParentResponse;
import com.prj.projectweb.dto.request.NotificationRequest;
import com.prj.projectweb.dto.response.NotificationResponse;
import com.prj.projectweb.dto.response.ParentResponse;
import com.prj.projectweb.dto.response.UserResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.TimeSlot;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.UserMapper;
import com.prj.projectweb.repositories.CourseRepository; // Thêm repository khóa học
import com.prj.projectweb.repositories.RoleRepository;
import com.prj.projectweb.repositories.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.format.DateTimeFormatter;


import java.security.SecureRandom;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UserService {
    UserRepository userRepository;
    UserMapper userMapper;
    RoleRepository roleRepository;
    PasswordEncoder passwordEncoder;


    private static final SecureRandom random = new SecureRandom();

    public UserResponse createUser(UserCreationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.EMAIL_EXISTED);
        }

        var user = userMapper.toUser(request);
        user.setUsername(user.getEmail());
        String password = randomPassword(8);

        user.setPassword(passwordEncoder.encode(password));

        String roleName = null;
        if (request.getFlag() == 1)
            roleName = "PhuHuynh";
        else if (request.getFlag() == 2)
            roleName = "HocVien";

        if (!roleRepository.existsByRoleName(roleName)) {
            log.info(roleName);
            throw new AppException(ErrorCode.ROLE_NOTFOUND);
        }

        var role = roleRepository.findByRoleName(roleName);
        user.setRole(role);

        // Lưu User vào database
        var savedUser = userRepository.save(user);

        // Khởi tạo phản hồi
        UserResponse response = userMapper.toUserResponse(savedUser);
        response.setPassword(password);

        // Xử lý dựa trên vai trò
        if ("PhuHuynh".equals(roleName)) {
            List<User> children = userRepository.findAllByParentId(savedUser.getUserId());
            List<ChildOfParentResponse> childResponses = children.stream()
                    .map(child -> ChildOfParentResponse.builder()
                            .id(child.getUserId())
                            .name(child.getFullName())
                            .build())
                    .collect(Collectors.toList());

            response.setChildren(childResponses);
        } else if ("HocVien".equalsIgnoreCase(roleName)) {
            Long parentId = request.getParentId();
            if (parentId == null) {
                throw new AppException(ErrorCode.PARENT_NOTFOUND);
            }

            // Tìm PhuHuynh theo parentId
            User parent = userRepository.findById(parentId)
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_NOTFOUND));

            // Kiểm tra role của parent là PhuHuynh
            if (!"PhuHuynh".equalsIgnoreCase(parent.getRole().getRoleName())) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }

            // Thiết lập parentId cho HocVien
            user.setParentId(parentId);

            // Lưu User (HocSinh)
            userRepository.save(user);

            // Thiết lập lại phản hồi cho HocVien

            response.setParent(ParentResponse.builder()
                    .email(parent.getEmail())
                    .userId(parentId)
                    .fullName(parent.getFullName())
                    .build());
        }

        return response;
    }


    public String randomPassword(int length) {
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";


        StringBuilder password = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            int index = random.nextInt(characters.length());
            password.append(characters.charAt(index));
        }
        return password.toString();
    }

    public String changePassword(ChangePasswordRequest request) {
        if (!userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_NOTFOUND);
        }

        User user = userRepository.findByEmail(request.getEmail());

        // boolean authenticated = passwordEncoder.matches(request.getOldPass(), user.getPassword());
        if (!passwordEncoder.matches(request.getOldPass(), user.getPassword())) {
            throw  new AppException(ErrorCode.PASSWORD_WRONG);
        }

        if (!request.getNewPass().equals(request.getReNewPass())) {
            throw new AppException(ErrorCode.NEW_PASSWORD_NOTMATCH);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPass()));
        userRepository.save(user);

        return "Change password successfully";
    }

    public UserResponse getInfoById (Long id) {
        User user  = userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        return userMapper.toUserResponse(user);
    }
    @Autowired
    private CourseRepository courseRepository; // Inject CourseRepository

    // Phương thức kiểm tra thông báo cho lớp học sắp tới
    public NotificationResponse checkUpcomingClass(NotificationRequest request) {

        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            LocalDate tomorrow = LocalDate.now().plusDays(1);
            String tomorrowDay = getDayOfWeekString(tomorrow); // Lấy thứ của ngày mai dưới dạng chuỗi
            
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
    
            List<Course> allCourses = courseRepository.findAll();
    
            // Duyệt qua tất cả các khóa học để tìm lớp học có TimeSlot trùng với ngày mai
            for (Course course : allCourses) {
                for (TimeSlot timeSlot : course.getSchedule()) {
                    if (timeSlot.getDay().equalsIgnoreCase(tomorrowDay)) {
                        
                        NotificationResponse response = new NotificationResponse();
                        response.setNotificationTime(LocalDateTime.now().format(dateTimeFormatter));
    
                        // Set thời gian của lớp học
                        String startTime = timeSlot.getTimeRange(); 
                        response.setClassTime(tomorrow.format(dateFormatter) + " at " + startTime);
                        
                        return response; // Trả về thông báo lớp học
                    }
                }
            }
        }
        return null; // Không có lớp học nào
    }
    
    // Hàm chuyển LocalDate thành chuỗi tương ứng với thứ (Mon, Tue, ...)
    private String getDayOfWeekString(LocalDate date) {
        switch (date.getDayOfWeek()) {
            case MONDAY:
                return "Mon";
            case TUESDAY:
                return "Tue";
            case WEDNESDAY:
                return "Wed";
            case THURSDAY:
                return "Thu";
            case FRIDAY:
                return "Fri";
            case SATURDAY:
                return "Sat";
            case SUNDAY:
                return "Sun";
            default:
                return "";
        }
    }
    

}


