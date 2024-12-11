package com.prj.projectweb.entities;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "center_id")
    Center center;          // Trung tâm làm việc
}
