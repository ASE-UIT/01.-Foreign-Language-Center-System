package com.prj.projectweb.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.prj.projectweb.dto.request.ExpenseRequest;
import com.prj.projectweb.dto.response.ExpenseResponse;
import com.prj.projectweb.entities.Center;
import com.prj.projectweb.entities.Expense;
import com.prj.projectweb.enumType.ExpenseType;
import com.prj.projectweb.exception.AppException;
import com.prj.projectweb.exception.ErrorCode;
import com.prj.projectweb.mapper.ExpenseMapper;
import com.prj.projectweb.repositories.CenterRepository;
import com.prj.projectweb.repositories.ExpenseRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ExpenseService {
    ExpenseRepository expenseRepository;
    CenterRepository centerRepository;
    ExpenseMapper expenseMapper;

    @Transactional
    public ExpenseResponse createExpense(ExpenseRequest expenseRequest) {
        Center center = centerRepository.findById(expenseRequest.getCenterId())
                .orElseThrow(() -> new AppException(ErrorCode.CENTER_NOTFOUND));

        // Chuyển từ ExpenseRequest sang Expense entity sử dụng ExpenseMapper
        Expense expense = expenseMapper.toEntity(expenseRequest);

        // Gán thông tin center cho Expense entity
        expense.setCenter(center);

        // Lưu khoản chi vào cơ sở dữ liệu
        Expense savedExpense = expenseRepository.save(expense);

        // Chuyển từ Expense entity sang ExpenseResponse và trả về
        return expenseMapper.toResponse(savedExpense);
    }

    // chỉnh sửa
    public ExpenseResponse updateExpense(Long id, ExpenseRequest expenseRequest) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EXPENSE_NOTFOUND));

        Center center = centerRepository.findById(expenseRequest.getCenterId())
                .orElseThrow(() -> new AppException(ErrorCode.CENTER_NOTFOUND));

        expense.setExpenseName(expenseRequest.getExpenseName());
        expense.setAmount(expenseRequest.getAmount());
        expense.setPaymentDate(expenseRequest.getPaymentDate());
        expense.setNote(expenseRequest.getNote());
        expense.setType(ExpenseType.valueOf(expenseRequest.getType())); 

        expense.setCenter(center);

        Expense updatedExpense = expenseRepository.save(expense);
        return expenseMapper.toResponse(updatedExpense);
    }

    // xóa khoản phí
    public void deleteExpense(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EXPENSE_NOTFOUND));
        
        expenseRepository.delete(expense);
    }
    
    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.EXPENSE_NOTFOUND));
        return expenseMapper.toResponse(expense);
    }


    // Lấy tất cả khoản chi của trung tâm
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpensesByCenter(Long centerId) {
        List<Expense> expenses = expenseRepository.findByCenterId(centerId);

        return expenses.stream()
            .map(expenseMapper::toResponse)
            .collect(Collectors.toList());
    }

    // Lấy tất cả khoản chi của trung tâm theo tháng (tháng là tham số từ request)
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByCenterAndMonth(Long centerId, int month, int year) {
        List<Expense> expenses = expenseRepository.findByCenterIdAndPaymentDateMonthAndYear(centerId, month, year);
        return expenses.stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }

    // Lấy tất cả khoản chi của trung tâm theo năm
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getExpensesByCenterAndYear(Long centerId, int year) {
        List<Expense> expenses = expenseRepository.findByCenterIdAndPaymentDateYear(centerId, year);
        return expenses.stream()
                .map(expenseMapper::toResponse)
                .collect(Collectors.toList());
    }
}
