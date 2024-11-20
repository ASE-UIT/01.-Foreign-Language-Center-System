package com.prj.projectweb.entities;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SalaryPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "salary_id")
    Salary salary;  // Tham chiếu đến thông tin lương của user

    Integer month;  // Tháng thanh toán (1 - 12)
    Double amountPaid;  // Số tiền đã thanh toán
    LocalDateTime paymentDate;  // Ngày thanh toán
    Boolean isPaid;  // Trạng thái đã thanh toán (true/false)
    Long userId;
}
