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

import com.prj.projectweb.dto.request.CenterCreationRequest;
import com.prj.projectweb.dto.request.ExpenseRequest;
import com.prj.projectweb.dto.response.ApiResponse;
import com.prj.projectweb.dto.response.CenterResponse;
import com.prj.projectweb.dto.response.ExpenseResponse;
import com.prj.projectweb.dto.response.InfoCenterResponse;
import com.prj.projectweb.service.ExpenseService;

import lombok.*;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/expense")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExpenseController {
    ExpenseService expenseService;

    @PostMapping
    public ApiResponse<ExpenseResponse> createExpense(@RequestBody ExpenseRequest request) {
        return ApiResponse.<ExpenseResponse>builder()
                .result(expenseService.createExpense(request))
                .build();
    }

    @GetMapping("/{id}")
    public ApiResponse<ExpenseResponse> getExpenseById(@PathVariable("id") Long id) {
        return ApiResponse.<ExpenseResponse>builder()
                .result(expenseService.getExpenseById(id))
                .build();
    }

    @PutMapping("/{id}")
    public ApiResponse<ExpenseResponse> updateExpense(@PathVariable("id")  Long id, @RequestBody ExpenseRequest request) {
        return ApiResponse.<ExpenseResponse>builder()
                .result(expenseService.updateExpense(id, request))
                .build();
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteExpense(@PathVariable("id")  Long id) {
        expenseService.deleteExpense(id);
        return ApiResponse.<Void>builder()
                .result(null)
                .build();
    }

    @GetMapping("/center/{centerId}")
    public ApiResponse<List<ExpenseResponse>> getAllExpensesByCenter(@PathVariable("centerId")  Long centerId) {
        return ApiResponse.<List<ExpenseResponse>>builder()
                .result(expenseService.getAllExpensesByCenter(centerId))
                .build();
    }

    @GetMapping("/center/{centerId}/month/{month}/{year}")
    public ApiResponse<List<ExpenseResponse>> getExpensesByCenterAndMonth(@PathVariable("centerId")  Long centerId, @PathVariable("month")  int month, @PathVariable("year")  int year) {
        return ApiResponse.<List<ExpenseResponse>>builder()
                .result(expenseService.getExpensesByCenterAndMonth(centerId, month, year))
                .build();
    }

    @GetMapping("/center/{centerId}/year/{year}")
    public ApiResponse<List<ExpenseResponse>> getExpensesByCenterAndYear(@PathVariable("centerId")  Long centerId, @PathVariable("year")  int year) {
        return ApiResponse.<List<ExpenseResponse>>builder()
                .result(expenseService.getExpensesByCenterAndYear(centerId, year))
                .build();
    }
}
