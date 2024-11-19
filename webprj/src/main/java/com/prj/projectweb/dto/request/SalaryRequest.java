package com.prj.projectweb.dto.request;

import java.time.LocalDateTime;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalaryRequest {
    Long userId;           // ID người dùng
    Long centerId;         // ID trung tâm
    Integer year;          // Năm
    Double baseSalary;     // Lương cơ bản
    Double coefficient;    // Hệ số lương
    Double allowance;      // Phụ cấp
}

