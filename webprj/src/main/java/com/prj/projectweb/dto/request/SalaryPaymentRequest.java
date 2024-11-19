package com.prj.projectweb.dto.request;

import java.time.LocalDateTime;

import lombok.*;
import lombok.experimental.FieldDefaults;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalaryPaymentRequest {
    Long userId;         // ID user
    Integer month;         // Tháng (1-12)
    Double amountPaid;     // Số tiền đã thanh toán
    LocalDateTime paymentDate; // Ngày thanh toán
}

