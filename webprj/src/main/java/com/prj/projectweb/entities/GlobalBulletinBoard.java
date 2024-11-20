package com.prj.projectweb.entities;

import lombok.*;
import lombok.experimental.FieldDefaults;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level =AccessLevel.PRIVATE)
public class GlobalBulletinBoard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    String name;  // Tên bảng tin

    String content;  // Nội dung

    LocalDate startDate;  // Ngày bắt đầu

    LocalDate endDate;  // Ngày kết thúc

    String department;  // Bộ phận (ví dụ: Chi nhánh 1 - Hà Nội - TP HCM)

    @Enumerated(EnumType.STRING)
    CompletionLevel completionLevel = CompletionLevel.NOT_DEFINED;  // Mức độ hoàn thành (mặc định là chưa có)

    @Enumerated(EnumType.STRING)
    Status status = Status.IN_PROGRESS;  // Tình trạng (mặc định là đang thực hiện)

    public enum CompletionLevel {
        POOR, AVERAGE, GOOD, NOT_DEFINED
    }

    public enum Status {
        COMPLETED, IN_PROGRESS
    }
}
