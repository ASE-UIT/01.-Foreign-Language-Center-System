package com.prj.projectweb.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.prj.projectweb.dto.request.ExpenseRequest;
import com.prj.projectweb.dto.response.ExpenseResponse;
import com.prj.projectweb.entities.Expense;

@Mapper(componentModel = "spring")
public interface ExpenseMapper {
    @Mapping(source = "centerId", target = "center.id")
    Expense toEntity(ExpenseRequest expenseRequest);

    @Mapping(source = "center.id", target = "centerId")
    ExpenseResponse toResponse(Expense expense);
}
