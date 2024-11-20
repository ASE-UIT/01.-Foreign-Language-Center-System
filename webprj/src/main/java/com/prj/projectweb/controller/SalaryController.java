package com.prj.projectweb.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.prj.projectweb.dto.request.SalaryPaymentRequest;
import com.prj.projectweb.dto.request.SalaryRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.SalaryPaymentResponse;
import com.prj.projectweb.dto.response.SalaryResponse;
import com.prj.projectweb.service.SalaryService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/salary")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class SalaryController {
    SalaryService salaryService;

    @PostMapping
    public ApiResponse<SalaryResponse> createSalary(@RequestBody SalaryRequest salaryRequest) {
        return ApiResponse.<SalaryResponse>builder()
                .result(salaryService.createSalary(salaryRequest))
                .build();
    }
    @GetMapping("/{id}")
    public ApiResponse<SalaryResponse> getSalaryByUserId(@PathVariable("id") Long userId) {
        return ApiResponse.<SalaryResponse>builder()
                .result(salaryService.getSalaryByUserId(userId))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<SalaryResponse> updateSalary(@PathVariable("id") Long id,
                                                    @RequestBody SalaryRequest salaryRequest) {
        return ApiResponse.<SalaryResponse>builder()
                .result(salaryService.updateSalary(id, salaryRequest))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteSalary(@PathVariable Long id) {
        salaryService.deleteSalary(id);
        return ApiResponse.<Void>builder().build();
    }

    // lấy ra thông tin lương trong năm của user
    @GetMapping("/user/{userId}/year/{year}")
    public ApiResponse<List<SalaryResponse>> getSalariesByUserAndYear(@PathVariable("userId") Long userId,
                                                                     @PathVariable("year") Integer year) {
        return ApiResponse.<List<SalaryResponse>>builder()
                .result(salaryService.getSalariesByUserAndYear(userId, year))
                .build();
    }

    // Tạo thanh toán lương cho nhân viên theo tháng
    @PostMapping("/payment/create")
    public ApiResponse<SalaryPaymentResponse> createSalaryPayment(@RequestBody SalaryPaymentRequest request) {
        SalaryPaymentResponse response = salaryService.createSalaryPayment(request);
        return ApiResponse.<SalaryPaymentResponse>builder().result(response).build();
    }

    // Lấy danh sách thanh toán lương của Nhân viên trong năm
    @GetMapping("/payment/user/{userId}/year/{year}")
    public ApiResponse<List<SalaryPaymentResponse>> getSalaryPaymentsBySalaryId(@PathVariable("userId") Long userId, @PathVariable("year") Integer year) {
        List<SalaryPaymentResponse> payments = salaryService.getSalaryPaymentsByUserAndYear(userId, year);
        return ApiResponse.<List<SalaryPaymentResponse>>builder().result(payments).build();
    }

}
