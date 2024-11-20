package com.prj.projectweb.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.prj.projectweb.dto.request.SalaryPaymentRequest;
import com.prj.projectweb.dto.response.SalaryPaymentResponse;
import com.prj.projectweb.entities.SalaryPayment;


@Mapper(componentModel = "spring")
public interface SalaryPaymentMapper {
    @Mapping(target = "salary.id", ignore = true)  
    @Mapping(target = "isPaid", ignore = true)       
    SalaryPayment toEntity(SalaryPaymentRequest request);

    @Mapping(target = "salaryId", source = "salary.id") 
    SalaryPaymentResponse toResponse(SalaryPayment salaryPayment);
}

