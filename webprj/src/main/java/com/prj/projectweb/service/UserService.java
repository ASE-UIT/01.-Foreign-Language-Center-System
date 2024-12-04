package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.ChangePasswordRequest;
import com.prj.projectweb.dto.request.GiangVienDTO;
import com.prj.projectweb.dto.request.UserCreationRequest;
import com.prj.projectweb.dto.response.ChildOfParentResponse;
import com.prj.projectweb.dto.response.CourseRegistrationResponse;
import com.prj.projectweb.dto.request.NotificationRequest;
import com.prj.projectweb.dto.response.NotificationResponse;
import com.prj.projectweb.dto.response.ParentResponse;
import com.prj.projectweb.dto.response.ScheduleResponse;
import com.prj.projectweb.dto.response.UserResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.CourseRegistration;
import com.prj.projectweb.entities.TimeSlot;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.UserMapper;
import com.prj.projectweb.repositories.CenterRepository;
import com.prj.projectweb.repositories.CourseRegistrationRepository;
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
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;


import java.security.SecureRandom;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.Set;
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
    CourseRegistrationRepository registrationRepository;
    GiangVienService giangVienService;
    CenterRepository centerRepository;


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
        switch (request.getFlag()) {
            case 1: roleName = "PhuHuynh"; break;
            case 2: roleName = "HocVien"; break;
            case 3: roleName = "GiaoVien"; break;
            case 4: roleName = "KeToan"; break;
            case 5: roleName = "NhanVienTuyenSinh"; break;
            case 6: roleName = "NhanVienHoTroHocVu"; break;
            case 7: roleName = "BanLanhDao"; break;
            case 8: roleName = "BanDieuHanh"; break;
            case 9: roleName = "BanDieuHanhHeThong"; break;
            case 10: roleName = "ChuCongTy"; break;
            default:
                throw new AppException(ErrorCode.INVALID_ROLE_FLAG);
        }
        if (!roleRepository.existsByRoleName(roleName)) {
            log.info(roleName);
            throw new AppException(ErrorCode.ROLE_NOTFOUND);
        }

        var role = roleRepository.findByRoleName(roleName);
        user.setRole(role);
        
        // Thiết lập mối quan hệ cho center
        if (!"ChuCongTy".equals(roleName) && request.getCenterId() != null) {
            Center center = centerRepository.findById(request.getCenterId())
                    .orElseThrow(() -> new AppException(ErrorCode.CENTER_NOTFOUND));
            user.setCenter(center);
        }

        // Xử lý parent_id của "HocVien"
        if ("HocVien".equals(roleName)) {
            Long parentId = request.getParentId();
            if (parentId == null) {
                throw new AppException(ErrorCode.PARENT_NOTFOUND);
            }
    
            User parent = userRepository.findById(parentId)
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_NOTFOUND));
    
            if (!"PhuHuynh".equalsIgnoreCase(parent.getRole().getRoleName())) {
                throw new AppException(ErrorCode.INVALID_REQUEST);
            }
    
            user.setParentId(parentId);
        }

        // Lưu User vào database
        var savedUser = userRepository.save(user);

        // Nếu là Giảng Viên, tạo bản ghi GiangVien tương ứng
        if ("GiaoVien".equals(roleName)) {
            giangVienService.addGiangVien(GiangVienDTO.builder()
            .userId(savedUser.getUserId())
            .name(savedUser.getFullName())
            .dob(savedUser.getDob())
            .image(savedUser.getImage())
            .build());
        }

        // Khởi tạo phản hồi
        UserResponse response = userMapper.toUserResponse(savedUser);
        response.setPassword(password);

        // Xử lý phản hồi đặc biệt cho "PhuHuynh" và "HocVien"
        if ("PhuHuynh".equals(roleName)) {
            List<User> children = userRepository.findAllByParentId(savedUser.getUserId());
            List<ChildOfParentResponse> childResponses = children.stream()
                    .map(child -> ChildOfParentResponse.builder()
                            .id(child.getUserId())
                            .name(child.getFullName())
                            .build())
                    .collect(Collectors.toList());
            response.setChildren(childResponses);
        } else if ("HocVien".equals(roleName)) {
            User parent = userRepository.findById(user.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_NOTFOUND));

            response.setParent(ParentResponse.builder()
                    .email(parent.getEmail())
                    .userId(parent.getUserId())
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
        User user = userRepository.findByEmail(request.getEmail())
                                   .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

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

        UserResponse response = userMapper.toUserResponse(user);

        if ("HocVien".equalsIgnoreCase(user.getRole().getRoleName())) {
            User parent = userRepository.findById(user.getParentId())
            .orElseThrow(() -> new AppException(ErrorCode.PARENT_NOTFOUND));

            response.setParent(ParentResponse.builder()
                                                .email(parent.getEmail())
                                                .userId(parent.getUserId())
                                                .fullName(parent.getFullName())
                                                .build());
        } else if ("PhuHuynh".equalsIgnoreCase(user.getRole().getRoleName())) {
            List<ChildOfParentResponse> child = null;
            List<User> listUser = userRepository.findAllByParentId(user.getUserId());
            child = listUser.stream()
                    .map(child1 -> ChildOfParentResponse.builder()
                            .id(child1.getUserId())
                            .name(child1.getFullName())
                            .build())
                    .collect(Collectors.toList());

            response.setChildren(child);
        }
                

        return response;
    }

    @Autowired
    private CourseRepository courseRepository; // Inject CourseRepository

    // Phương thức kiểm tra thông báo cho lớp học sắp tới
    @Transactional
    public NotificationResponse checkUpcomingClass(NotificationRequest request) {

        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            LocalDate tomorrow = LocalDate.now().plusDays(1);
            String tomorrowDay = getDayOfWeekString(tomorrow); // Lấy thứ của ngày mai dưới dạng chuỗi
            
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
            DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

            // Lấy danh sách khóa học mà học sinh đã đăng ký
            List<CourseRegistration> courseRegistrations = registrationRepository.findByStudent_UserId(user.getUserId()); 

            // Duyệt qua tất cả các khóa học để tìm lớp học có TimeSlot trùng với ngày mai
            for (CourseRegistration registration : courseRegistrations) {
                Course course = registration.getCourse();

                // Kiểm tra xem khóa học có thời khóa biểu không
                if (course.getSchedule() != null) {
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
    

    @Transactional
    // Lấy lịch sinh viên trong tuần
    public List<ScheduleResponse> getWeeklySchedule(Long userId) {
        // Lấy user theo userId
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Lấy danh sách các khóa học đã đăng ký của user
        List<CourseRegistration> registrations = registrationRepository.findByStudent_UserId(userId);

        // Lấy ngày hiện tại
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(DayOfWeek.MONDAY);

        // Tạo mảng 7 phần tử để lưu lịch học từ thứ 2 đến chủ nhật
        List<ScheduleResponse> schedule = new ArrayList<>(Collections.nCopies(7, null));

        // Định dạng ngày
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Lặp qua tất cả các khóa học đã đăng ký
        for (CourseRegistration registration : registrations) {
            Course course = registration.getCourse();
            Set<TimeSlot> timeSlots = course.getSchedule();
            String roomName = course.getRoom() != null ? course.getRoom().getRoomName() : ""; 
            String giangVien = course.getGiangVien() != null ? course.getGiangVien().getName() : null;

            // Lặp qua các TimeSlot
            for (TimeSlot timeSlot : timeSlots) {
                LocalDate dayOfWeek = getDateOfWeek(startOfWeek, timeSlot.getDay());
                if (dayOfWeek != null) {
                    // Tạo ScheduleResponse cho ca học
                    ScheduleResponse lessonInfo = new ScheduleResponse();
                    lessonInfo.setCa(getCaFromTimeRange(timeSlot.getTimeRange()));
                    lessonInfo.setCourseName(course.getCourseName());
                    lessonInfo.setCourseSchedule(course.getStartTime() + " - " + course.getEndTime());
                    lessonInfo.setRoomName(roomName);
                    lessonInfo.setGiangVien(giangVien);

                    // Thêm thông tin vào mảng theo chỉ số ngày trong tuần
                    int index = dayOfWeek.getDayOfWeek().getValue() - 1;
                    schedule.set(index, lessonInfo);
                }
            }
        }

        return schedule;
    }

    
    @Transactional
    public List<ScheduleResponse> getCourseRegistration(Long userId) {
        List<CourseRegistration> registrations = registrationRepository.findByStudent_UserId(userId);
        List<ScheduleResponse> responses = new ArrayList<>();

        for (CourseRegistration registration : registrations) {
            Course course = registration.getCourse();


            responses.add(ScheduleResponse.builder()
                                        .courseName(course.getCourseName())
                                        .courseSchedule(course.getStartTime() + " - " + course.getEndTime())
                                        .roomName(course.getRoom() != null ? course.getRoom().getRoomName() : null)
                                        .giangVien(course.getGiangVien() != null ? course.getGiangVien().getName() : null)
                                        .build()
            );
        }

        return responses;
    }

    private LocalDate getDateOfWeek(LocalDate startOfWeek, String day) {
        switch (day) {
            case "Mon":
                return startOfWeek;
            case "Tue":
                return startOfWeek.plusDays(1);
            case "Wed":
                return startOfWeek.plusDays(2);
            case "Thu":
                return startOfWeek.plusDays(3);
            case "Fri":
                return startOfWeek.plusDays(4);
            case "Sat":
                return startOfWeek.plusDays(5);
            case "Sun":
                return startOfWeek.plusDays(6);
            default:
                return null;
        }
    }

    private String getCaFromTimeRange(String timeRange) {
        switch (timeRange) {
            case "7h - 9h":
                return "Ca 1";
            case "9h30 - 11h30":
                return "Ca 2";
            case "13h - 15h":
                return "Ca 3"; 
            case "15h30 - 17h30":
                return "Ca 4";
            case "19h - 21h":
                return "Ca 5"; 
            default:
                return null; 
        }
    }

}


