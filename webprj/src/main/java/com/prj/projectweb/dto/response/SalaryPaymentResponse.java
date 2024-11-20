package com.prj.projectweb.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class SalaryPaymentResponse {
    Long id;               // ID của thanh toán lương
    Long userId;
    Long salaryId;         // ID lương của người dùng
    LocalDateTime paymentDate; // Ngày thanh toán
    Double amountPaid;        // Số tiền đã thanh toán
    Boolean isPaid;           // Trạng thái thanh toán
}

