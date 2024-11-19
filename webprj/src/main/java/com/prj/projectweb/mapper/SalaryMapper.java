package com.prj.projectweb.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.prj.projectweb.dto.request.SalaryRequest;
import com.prj.projectweb.dto.response.SalaryResponse;
import com.prj.projectweb.entities.Salary;

@Mapper(componentModel = "spring")
public interface SalaryMapper {
    @Mapping(target = "user.userId", source = "userId")  
    @Mapping(target = "center.id", source = "centerId")
    Salary toEntity(SalaryRequest salaryRequest);

    @Mapping(target = "userId", source = "user.userId") 
    @Mapping(target = "centerId", source = "center.id")
    @Mapping(target = "totalSalary", expression = "java(calculateTotalSalary(salary))")
    SalaryResponse toResponse(Salary salary);

    // Hàm tính toán totalSalary
    default Double calculateTotalSalary(Salary salary) {
        if (salary.getBaseSalary() != null && salary.getCoefficient() != null && salary.getAllowance() != null) {
            return (salary.getBaseSalary() + salary.getAllowance()) * salary.getCoefficient();
        }
        return 0.0; // Trả về 0 nếu giá trị không hợp lệ
    }
}
