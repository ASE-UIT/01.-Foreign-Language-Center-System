package com.prj.projectweb.service;

import com.prj.projectweb.dto.request.AddRomeInCourseRequest;
import com.prj.projectweb.dto.request.AvailableRoomRequest;
import com.prj.projectweb.dto.request.CourseRequest;
import com.prj.projectweb.dto.request.GiangVienRequest;
import com.prj.projectweb.dto.request.TimeSlotRequest;
import com.prj.projectweb.dto.response.CourseResponse;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.CourseRegistration;
import com.prj.projectweb.entities.GiangVien;
import com.prj.projectweb.entities.Room;
import com.prj.projectweb.entities.TimeSlot;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.CourseMapper;
import com.prj.projectweb.mapper.TimeSlotMapper;
import com.prj.projectweb.repositories.CourseRegistrationRepository;
import com.prj.projectweb.repositories.CourseRepository;
import com.prj.projectweb.repositories.GiangVienRepository;
import com.prj.projectweb.repositories.RoomRepository;
import com.prj.projectweb.repositories.TimeSlotRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
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
    RoomService roomService;
    RoomRepository roomRepository;
    CourseRegistrationRepository courseRegistrationRepository;
    TimeSlotMapper timeSlotMapper;


    @Transactional
    public String addCourse(CourseRequest courseRequest) throws Exception {
        log.info("in add course service");
    
        // Kiểm tra tên khóa học đã tồn tại chưa
        if (courseRepository.existsByCourseName(courseRequest.getCourseName())) {
            throw new AppException(ErrorCode.COURSE_EXISTED);
        }
        // Kiểm tra thời gian bắt đầu và kết thúc có hợp lệ không
        if (LocalDate.parse(courseRequest.getStartTime()).isAfter(LocalDate.parse(courseRequest.getEndTime()))) {
            throw new AppException(ErrorCode.INVALID_REQUEST);
        }
        // Kiểm tra giảng viên có tồn tại không
        if (courseRequest.getGiangVien() != null &&
                !giangVienRepository.existsById(courseRequest.getGiangVien().getId())) {
            throw new AppException(ErrorCode.TEACHER_NOTFOUND);
        }
        
        Course course = courseMapper.toCourse(courseRequest);
        course.setStartTime(LocalDate.parse(courseRequest.getStartTime()));
        course.setEndTime(LocalDate.parse(courseRequest.getEndTime()));
    
        if (courseRequest.getRoom() != null) {
            Room room = roomRepository.findById(courseRequest.getRoom())
                        .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOTFOUND));
            
            course.setRoom(room);
            room.addCourse(course);
        } 
    
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
    
        // Thiết lập mối quan hệ cho Certificate
        if (course.getCertificate() != null) {
            course.getCertificate().setCourse(course);
        }

        // Thiết lập mối quan hệ cho TimeSlot từ danh sách ID
        if (courseRequest.getSchedule() != null) {
            Set<TimeSlot> timeSlots = new HashSet<>();
            for (Long timeSlotId : courseRequest.getSchedule()) {
                TimeSlot timeSlot = timeSlotRepository.findById(timeSlotId)
                        .orElseThrow(() -> new AppException(ErrorCode.TIMESLOT_NOTFOUND));
                timeSlots.add(timeSlot);
            }
            course.setSchedule(timeSlots); // Thiết lập danh sách time slots cho course
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

    @Transactional
    public String editCourse(Long courseId, CourseRequest courseRequest) throws Exception {
        log.info("in edit course service");

        // Kiểm tra xem khóa học có tồn tại không
        Course existingCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOTFOUND));


        try {
            // Cập nhật các trường khác của Course từ CourseRequest
            courseMapper.updateCourse(existingCourse, courseRequest);
            
            if (courseRequest.getRoom() != null) {
                addRoomInCourse(AddRomeInCourseRequest.builder()
                    .courseId(courseId)
                    .roomName(courseRequest.getRoom())
                    .build());
            }

            if (courseRequest.getGiangVien().getId() != null) {
                addGiangVienToCourse(courseId, GiangVienRequest.builder()
                        .id(courseRequest.getGiangVien().getId())
                        .name(courseRequest.getGiangVien().getName())
                        .build());
            }

            // Lưu thay đổi vào database
            courseRepository.save(existingCourse);

            return "Cập nhật khóa học thành công";
        } catch (Exception e) {
            log.error("Error updating course", e);
            // Nếu có lỗi xảy ra trong quá trình lưu trữ, ném một ngoại lệ
            throw new AppException(ErrorCode.COURSE_UPDATE_FAILED);
        }
    }
    
    @Transactional
    public List<CourseResponse> getCoursesByStudentId(Long studentId) throws Exception {
        log.info("in get courses by student id service");

        List<CourseRegistration> registrations = courseRegistrationRepository.findByStudent_UserId(studentId);

        // Lấy danh sách các khóa học từ danh sách đăng ký
        List<Course> courses = registrations.stream()
                .map(CourseRegistration::getCourse)
                .collect(Collectors.toList());

        // Chuyển đổi danh sách khóa học thành danh sách CourseResponse
        return courses.stream()
                .map(courseMapper::toCourseResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public String addRoomInCourse(AddRomeInCourseRequest request) throws Exception {
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new AppException(ErrorCode.COURSE_NOTFOUND));

        // Lấy lịch trình khóa học
        Set<TimeSlotRequest> courseSchedule = course.getSchedule().stream()
                .map(timeSlotMapper::toTimeSlotRequest) // Chuyển đổi từ TimeSlot sang TimeSlotRequest
                .collect(Collectors.toSet());
        LocalDate startDate = course.getStartTime();
        LocalDate endDate = course.getEndTime();

        // Lấy danh sách phòng trống
        List<Room> availableRooms = roomService.getAvailableRooms(AvailableRoomRequest.builder()
                                                            .timeSlots(courseSchedule)
                                                            .startDate(startDate)
                                                            .endDate(endDate)
                                                            .build());

        // Kiểm tra nếu roomName nằm trong danh sách phòng trống
        Room selectedRoom = availableRooms.stream()
                .filter(room -> room.getRoomName().equals(request.getRoomName()))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.ROOM_NOT_AVAILABLE));

        // Thêm phòng vào khoá học
        course.setRoom(selectedRoom);
        courseRepository.save(course);

        return "Add room " + request.getRoomName() + " in course with id = " + request.getCourseId();
    }
    @Transactional
    public boolean deleteCourseById(Long courseId) {
        if (courseRepository.existsById(courseId)) {
            courseRepository.deleteById(courseId);
            return true; // Xóa thành công
        }
        return false; // Không tìm thấy khóa học với ID này
    }
}
