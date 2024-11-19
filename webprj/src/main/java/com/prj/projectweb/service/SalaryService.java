package com.prj.projectweb.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.prj.projectweb.dto.request.SalaryPaymentRequest;
import com.prj.projectweb.dto.request.SalaryRequest;
import com.prj.projectweb.dto.response.SalaryPaymentResponse;
import com.prj.projectweb.dto.response.SalaryResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Salary;
import com.prj.projectweb.entities.SalaryPayment;
import com.prj.projectweb.entities.User;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.SalaryMapper;
import com.prj.projectweb.mapper.SalaryPaymentMapper;
import com.prj.projectweb.repositories.CenterRepository;
import com.prj.projectweb.repositories.SalaryPaymentRepository;
import com.prj.projectweb.repositories.SalaryRepository;
import com.prj.projectweb.repositories.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class SalaryService {
    SalaryRepository salaryRepository;
    UserRepository userRepository;
    CenterRepository centerRepository;
    SalaryPaymentRepository salaryPaymentRepository;
    SalaryMapper salaryMapper;
    SalaryPaymentMapper salaryPaymentMapper;

    public SalaryResponse createSalary(SalaryRequest salaryRequest) {
        // Lấy thông tin người dùng và trung tâm
        User user = userRepository.findById(salaryRequest.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        Center center = centerRepository.findById(salaryRequest.getCenterId())
                .orElseThrow(() -> new AppException(ErrorCode.CENTER_NOTFOUND));

        // Tạo đối tượng Salary từ yêu cầu
        Salary salary = salaryMapper.toEntity(salaryRequest);

        // Lưu thông tin lương vào cơ sở dữ liệu
        Salary savedSalary = salaryRepository.save(salary);

        // Trả về đối tượng Response sau khi đã lưu
        return salaryMapper.toResponse(savedSalary);
    }


    public List<SalaryResponse> getSalariesByUserAndYear(Long userId, Integer year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        List<Salary> salaries = salaryRepository.findByUserAndYear(user, year);
        return salaries.stream()
                .map(salaryMapper::toResponse)
                .collect(Collectors.toList());
    }

    public SalaryResponse updateSalary(Long id, SalaryRequest salaryRequest) {
        Salary existingSalary = salaryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SALARY_NOTFOUND));

        // Cập nhật các trường trong Salary
        existingSalary.setBaseSalary(salaryRequest.getBaseSalary());
        existingSalary.setCoefficient(salaryRequest.getCoefficient());
        existingSalary.setAllowance(salaryRequest.getAllowance());

        // Lưu lại
        Salary updatedSalary = salaryRepository.save(existingSalary);
        return salaryMapper.toResponse(updatedSalary);
    }

    public SalaryResponse getSalaryByUserId(Long userId) {
        User user = userRepository.findById(userId)
        .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        Integer currentYear = LocalDate.now().getYear();
        List<Salary> salaries = salaryRepository.findByUserAndYear(user, currentYear);
        Salary salary = salaries.get(salaries.size()-1);

        return salaryMapper.toResponse(salary);
    }
    public void deleteSalary(Long id) {
        Salary existingSalary = salaryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SALARY_NOTFOUND));
        salaryRepository.delete(existingSalary);
    }

    public SalaryPaymentResponse createSalaryPayment(SalaryPaymentRequest salaryPaymentRequest) {
        // Lấy năm hiện tại
        Integer currentYear = LocalDate.now().getYear();
    
        // Tìm user theo userId
        User user = userRepository.findById(salaryPaymentRequest.getUserId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));
    
        // Tìm lương của user cho năm hiện tại với id lớn nhất
        List<Salary> salaries = salaryRepository.findByUserAndYear(user, currentYear);
        Salary salary = salaries.get(salaries.size()-1);
    
        // Chuyển SalaryPaymentRequest thành SalaryPayment entity
        SalaryPayment salaryPayment = salaryPaymentMapper.toEntity(salaryPaymentRequest);
    
        // Tính tổng lương của người dùng trong tháng
        Double totalSalaryForMonth = calculateTotalSalary(salary);
    
        // Kiểm tra số tiền thanh toán và cập nhật trạng thái isPaid
        log.info("total = " + totalSalaryForMonth);
        if (salaryPaymentRequest.getAmountPaid() < totalSalaryForMonth) {
            salaryPayment.setIsPaid(false);  
        } else {
            salaryPayment.setIsPaid(true);  
        }
    
        // Gán Salary cho thanh toán lương
        salaryPayment.setSalary(salary);
        salaryPayment.setUserId(user.getUserId());
    
        // Lưu 
        SalaryPayment savedPayment = salaryPaymentRepository.save(salaryPayment);
        return salaryPaymentMapper.toResponse(savedPayment);
    }
    


    public List<SalaryPaymentResponse> getSalaryPaymentsByUserAndYear(Long userId, Integer year) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOTFOUND));

        List<Salary> salaries = salaryRepository.findByUserAndYear(user, year);
    
        if (salaries.isEmpty()) {
            throw new AppException(ErrorCode.SALARY_NOTFOUND);
        }
    
        // Lấy danh sách thanh toán lương từ các Salary
        List<SalaryPayment> salaryPayments = salaryPaymentRepository.findBySalaryIn(salaries);
    
        // Chuyển đổi SalaryPayment sang SalaryPaymentResponse
        return salaryPayments.stream()
                .map(salaryPaymentMapper::toResponse)
                .collect(Collectors.toList());
    }

    
    // Hàm tính lương
    private Double calculateTotalSalary(Salary salary) {
        // Giả sử tổng lương được tính theo công thức: (baseSalary + allowance) * coefficient
        return (salary.getBaseSalary() + salary.getAllowance()) * salary.getCoefficient();
    }
    
}
