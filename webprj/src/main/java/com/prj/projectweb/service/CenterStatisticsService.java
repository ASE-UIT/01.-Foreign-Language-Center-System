package com.prj.projectweb.service;

import org.springframework.stereotype.Service;

import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.CenterStatisticsResponse;
import com.prj.projectweb.dto.response.CourseStatisticsResponse;
import com.prj.projectweb.dto.response.GiangVienWithVote;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Course;
import com.prj.projectweb.entities.CourseRegistration;
import com.prj.projectweb.enumType.RegistrationStatus;
import com.prj.projectweb.exception.ResourceNotFoundException;
import com.prj.projectweb.repositories.CenterRepository;
import com.prj.projectweb.repositories.CourseRegistrationRepository;
import com.prj.projectweb.repositories.CourseRepository;
import com.prj.projectweb.repositories.ExpenseRepository;
import com.prj.projectweb.repositories.SalaryPaymentRepository;
import com.prj.projectweb.repositories.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import java.text.DecimalFormat;
import java.util.*;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CenterStatisticsService {
    CenterRepository centerRepository;
    UserRepository userRepository;
    ExpenseRepository expenseRepository;
    CourseRepository courseRepository;
    CourseRegistrationRepository courseRegistrationRepository;
    SalaryPaymentRepository salaryPaymentRepository;

    VoteService voteService;

    public CenterStatisticsResponse getStatistics(Long centerId) {
        // Lấy thông tin chi nhánh
        Center center = centerRepository.findById(centerId)
                .orElseThrow(() -> new ResourceNotFoundException("Center not found"));

        // 1. Tên chi nhánh
        String centerName = center.getName();

        // 2. Tổng số tiền chi
        Double totalExpenses = calculateTotalExpenses(centerId);
        String formattedTotalExpenses = formatCurrency(totalExpenses); 

        // 3. Tổng số tiền thu
        Double totalRevenue = calculateTotalRevenue(centerId);
        String formattedTotalRevenue = formatCurrency(totalRevenue);  

        // 4. Số lượng người dùng
        long totalUsers = userRepository.countByRoleHocVienAndCenterId(centerId);

        // 5. Số lượng người dùng theo từng khóa học
        List<CourseStatisticsResponse> usersPerCourse = getUsersPerCourse(centerId);

        // 6. Danh sách giáo viên kèm số lượt thích và không thích
        List<GiangVienWithVote> teacherStatistics = voteService.getListGiangVien(centerId);

        // Build response
        CenterStatisticsResponse response = CenterStatisticsResponse.builder()
                .centerName(centerName)
                .totalExpenses(formattedTotalExpenses)
                .totalRevenue(formattedTotalRevenue)
                .totalUsers(totalUsers)
                .usersPerCourse(usersPerCourse)
                .teacherStatistics(teacherStatistics)
                .build();

        return response;
    }

    private Double calculateTotalExpenses(Long centerId) {
        // Lấy tổng các khoản chi
        Double expenses = expenseRepository.sumExpensesByCenterId(centerId);

        // Lấy tổng lương đã phát
        Double salariesPaid = salaryPaymentRepository.sumSalariesPaidByCenterId(centerId);

        return (expenses == null ? 0 : expenses) + (salariesPaid == null ? 0 : salariesPaid);
    }

    private Double calculateTotalRevenue(Long centerId) {
        // Tính tổng học phí các khóa học đã thanh toán
        return  calculateTotalTuition(centerId);
    }


    public Double calculateTotalTuition(Long centerId) {
        // Lấy danh sách các học phí của khóa học
        List<String> tuitionFees = courseRegistrationRepository.findTuitionFeesByCenterId(centerId);
    
        log.info(tuitionFees.toString());
    
        return tuitionFees.stream()
                .map(this::convertTuitionFeeToDouble)  
                .filter(Objects::nonNull)  
                .reduce(0.0, Double::sum);  
    }
    
    private Double convertTuitionFeeToDouble(String tuitionFee) {
        if (tuitionFee == null || tuitionFee.isEmpty()) {
            return null; 
        }
    
        try {
           
            String sanitizedFee = tuitionFee.replaceAll("[^0-9]", "");  
            log.info("Sanitized fee: " + sanitizedFee);
    
            return Double.parseDouble(sanitizedFee); 
        } catch (NumberFormatException e) {

            log.error("Invalid tuition fee format: " + tuitionFee, e);
            return null;
        }
    }
    

    public List<CourseStatisticsResponse> getUsersPerCourse(Long centerId) {
        // Lấy tất cả các khóa học của center
        List<Course> courses = courseRepository.findByCenterId(centerId);
        List<CourseStatisticsResponse> courseStatistics = new ArrayList<>();

        // Duyệt qua từng khóa học và tính tổng số học viên đăng ký
        for (Course course : courses) {
            Long userCount = courseRegistrationRepository.countByCourse(course);

            // Tạo CourseStatisticsResponse cho từng khóa học
            CourseStatisticsResponse courseStat = CourseStatisticsResponse.builder()
                    .courseName(course.getCourseName())
                    .description("Dành cho đối tượng: " + course.getObject())  
                    .teacherName(course.getGiangVien() != null ? course.getGiangVien().getName() : "Chưa có giảng viên")
                    .numberOfStudents(userCount != null ? String.valueOf(userCount) : "0")
                    .build();

            courseStatistics.add(courseStat);
        }

        return courseStatistics;
    }


    private String formatCurrency(Double amount) {
        if (amount == null) {
            return "0 VND";  // Nếu amount là null, trả về giá trị mặc định
        }

        DecimalFormat formatter = new DecimalFormat("#,###.##");  
        return formatter.format(amount) + " VND";  
    }
}
