package com.prj.projectweb.entities;
import java.time.LocalDateTime;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.prj.projectweb.enumType.ExpenseType;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@FieldDefaults(level =  AccessLevel.PRIVATE)
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    Center center;


    String expenseName; // Tên khoản chi
    Double amount;      // Số tiền
    LocalDateTime paymentDate; // Ngày chi
    String note;        // Ghi chú

    @Enumerated(EnumType.STRING)
    ExpenseType type;   // LOAI: LƯƠNG, THUÊ MẶT BẰNG, ĐIỆN NƯỚC, KHÁC
}
