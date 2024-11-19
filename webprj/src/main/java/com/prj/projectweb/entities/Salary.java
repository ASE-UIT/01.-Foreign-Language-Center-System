package com.prj.projectweb.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.*;
@Setter
@Getter
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Salary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    User user;

    Integer year;           // Năm
    Double baseSalary;      // Lương cơ bản
    Double coefficient;     // Hệ số lương
    Double allowance;       // Phụ cấp
    LocalDateTime paymentDate; // Ngày thanh toán
    Boolean isPaid;         // Trạng thái đã thanh toán

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    Center center;
}
