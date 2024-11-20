package com.prj.projectweb.dto.response;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SalaryResponse {
    Long id;
    Long userId;           // ID người dùng
    Long centerId;         // ID trung tâm
    Integer year;          // Năm
    Double baseSalary;     // Lương cơ bản
    Double coefficient;    // Hệ số lương
    Double allowance;      // Phụ cấp
    Double totalSalary;
}
